/**
 * SAT Connect — Backfill Script
 * Populates the new Suppliers + DistributionChannels tables from existing data.
 *
 * Run once:  npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/backfill-suppliers-channels.ts
 * Or via:    npx tsx scripts/backfill-suppliers-channels.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ log: ['warn', 'error'] });

// ---------------------------------------------------------------------------
//  Standard OTA channel definitions (name → base commission %)
//  These match the columns in the legacy TourDistribution model.
// ---------------------------------------------------------------------------
// Retrying helper for transient DB errors
async function withRetry<T>(operation: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
    try {
        return await operation();
    } catch (error: any) {
        if (retries > 0 && (error?.code === 'P1017' || error?.code === 'P1001' || error?.message?.includes('closed'))) {
            console.warn(`  ⚠️ Database error (${error.code || 'unknown'}). Retrying in ${delayMs}ms... (${retries} left)`);
            await new Promise(res => setTimeout(res, delayMs));
            return withRetry(operation, retries - 1, delayMs * 2);
        }
        throw error;
    }
}

const OTA_CHANNELS = [
    { name: 'Viator', base_commission_percent: 25.00, distKey: 'viator_id', statusKey: 'viator_status' },
    { name: 'Expedia', base_commission_percent: 25.00, distKey: 'expedia_id', statusKey: 'expedia_status' },
    { name: 'Project Expedition', base_commission_percent: 25.00, distKey: 'project_expedition_id', statusKey: 'project_expedition_status' },
    { name: 'Klook', base_commission_percent: 20.00, distKey: 'klook_id', statusKey: 'klook_status' },
] as const;

async function main() {
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  SAT Connect — Backfill: Suppliers + Channels');
    console.log('═══════════════════════════════════════════════════════\n');

    // ── STEP 1: Seed DistributionChannels ──────────────────────────────────
    console.log('📡 Seeding Distribution Channels...');
    const channelMap = new Map<string, number>(); // name → id

    for (const ota of OTA_CHANNELS) {
        // @ts-ignore - distributionChannel exists
        const channel = await withRetry(() => prisma.distributionChannel.upsert({
            where: { name: ota.name },
            create: {
                name: ota.name,
                base_commission_percent: ota.base_commission_percent,
                is_active: true,
            },
            update: {
                is_active: true,
            },
            select: { id: true, name: true },
        })) as { id: number; name: string };
        channelMap.set(channel.name, channel.id);
        console.log(`  ✅ Channel: "${channel.name}" (id=${channel.id})`);
    }

    // ── STEP 2: Collect unique supplier names from tours ───────────────────
    console.log('\n🏢 Reading unique supplier names from tours...');
    const rawSuppliers = await prisma.tour.findMany({
        select: { supplier: true },
        distinct: ['supplier'],
        orderBy: { supplier: 'asc' },
    });

    const supplierNames = rawSuppliers
        .map((t) => t.supplier?.trim())
        .filter((s): s is string => Boolean(s) && s !== '');

    console.log(`  Found ${supplierNames.length} distinct supplier names.`);

    // ── STEP 3: Upsert Suppliers ───────────────────────────────────────────
    console.log('\n🏢 Upserting Supplier records...');
    const supplierMap = new Map<string, number>(); // name → id

    for (const name of supplierNames) {
        // @ts-ignore - supplier exists
        const supplier = await withRetry(() => prisma.supplier.upsert({
            where: { name },
            create: {
                name,
                profile_status: 'Complete',
                is_active: true,
            },
            update: {
                is_active: true,
            },
            select: { id: true, name: true },
        })) as { id: number; name: string };
        supplierMap.set(supplier.name, supplier.id);
        console.log(`  ✅ Supplier: "${supplier.name}" (id=${supplier.id})`);
    }

    // ── STEP 4: Back-fill supplier_id on Tour rows that are missing it ──────
    console.log('\n🔗 Back-filling tour.supplier_id foreign keys...');
    const toursWithoutSupplierId = await prisma.tour.findMany({
        where: { supplier_id: null } as any,
        select: { id: true, supplier: true },
    });

    let linkedCount = 0;
    for (const tour of toursWithoutSupplierId) {
        const name = tour.supplier?.trim();
        const supplier_id = name ? supplierMap.get(name) : undefined;

        if (supplier_id) {
            await withRetry(() => prisma.tour.update({
                where: { id: tour.id },
                // @ts-ignore - supplier_id exists in schema but type gen might lag
                data: { supplier_id },
            }));
            linkedCount++;
        }
    }
    console.log(`  ✅ Updated supplier_id on ${linkedCount} tours.`);

    // ── STEP 5: Seed TourChannelLinks from existing TourDistribution rows ───
    console.log('\n🔗 Seeding TourChannelLink records from TourDistribution...');
    const distributions = await prisma.tourDistribution.findMany({
        select: {
            tour_id: true,
            viator_id: true,
            viator_status: true,
            expedia_id: true,
            expedia_status: true,
            project_expedition_id: true,
            project_expedition_status: true,
            klook_id: true,
            klook_status: true,
        },
    });

    let linkCount = 0;
    let skippedCount = 0;

    for (const dist of distributions) {
        for (const ota of OTA_CHANNELS) {
            const externalId = dist[ota.distKey as keyof typeof dist] as string | null;
            const status = dist[ota.statusKey as keyof typeof dist] as string | null;
            const channel_id = channelMap.get(ota.name);

            // Only create a link if this tour has an OTA ID for this channel
            if (!externalId || !channel_id) {
                skippedCount++;
                continue;
            }

            // @ts-ignore - tourChannelLink exists
            await withRetry(() => prisma.tourChannelLink.upsert({
                where: {
                    // @ts-ignore - tour_id_channel_id unique constraint exists
                    tour_id_channel_id: {
                        tour_id: dist.tour_id,
                        channel_id,
                    },
                },
                create: {
                    tour_id: dist.tour_id,
                    channel_id,
                    external_id: externalId,
                    status: status || 'Active',
                    show_in_b2b_marketplace: false,
                },
                update: {
                    external_id: externalId,
                    status: status || undefined,
                },
            }));
            linkCount++;
        }
    }

    console.log(`  ✅ Created/updated ${linkCount} TourChannelLink records.`);
    console.log(`  ⏭️  Skipped ${skippedCount} OTA slots with no external ID.`);

    // ── Summary ─────────────────────────────────────────────────────────────
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  Backfill complete! Summary:');
    console.log(`  • ${channelMap.size} distribution channels`);
    console.log(`  • ${supplierMap.size} suppliers`);
    console.log(`  • ${linkedCount} tours linked to suppliers`);
    console.log(`  • ${linkCount} OTA channel links created`);
    console.log('═══════════════════════════════════════════════════════\n');
}

main()
    .catch((e) => {
        console.error('Backfill failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());

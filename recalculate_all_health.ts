
import { PrismaClient } from '@prisma/client';
import { assessProductHealth } from './src/services/healthService';
import { calculateOTADistributionScore, checkGlobalSuitability } from './src/services/distributionService';

const prisma = new PrismaClient();

async function recalculateAll() {
    console.log('Starting health recalculation...');

    // Fetch all tours with relations needed for health assessment
    const tours = await prisma.tour.findMany({
        include: {
            pricing: true,
            logistics: true,
            assets: true,
            distribution: true,
            audit: true
        }
    });

    console.log(`Found ${tours.length} tours.`);

    let updatedCount = 0;

    for (const tour of tours) {
        // 1. Assess Health
        const healthCheck = assessProductHealth(tour as any);

        // 2. Calculate Distribution Score
        const distributionScore = calculateOTADistributionScore(tour as any); // Type cast as existing structure matches expectations

        // 3. Global Suitability
        const isGlobal = checkGlobalSuitability(healthCheck, distributionScore);

        // 4. Update Audit Record
        await prisma.tourAudit.upsert({
            where: { tour_id: tour.id },
            update: {
                product_health_score: healthCheck.status,
                otas_distribution_score: distributionScore,
                is_suitable_for_global_distribution: isGlobal
            },
            create: {
                tour_id: tour.id,
                product_health_score: healthCheck.status,
                otas_distribution_score: distributionScore,
                is_suitable_for_global_distribution: isGlobal
            }
        });

        updatedCount++;
        process.stdout.write(`\rUpdated ${updatedCount}/${tours.length} tours...`);
    }

    console.log('\nRecalculation complete.');
}

recalculateAll()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

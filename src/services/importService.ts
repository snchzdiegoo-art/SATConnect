/**
 * SAT Connect — Phase 1: CSV Import Service
 * Handles supplier upsert, dynamic CSV row mapping, and tour upsert logic.
 */

import { prisma } from '@/lib/prisma';
import type { Prisma, PrismaClient } from '@prisma/client';
import { resolvePricing } from '@/lib/pricing/pricingLogic';

// ---------------------------------------------------------------------------
//  Types
// ---------------------------------------------------------------------------

/** Column mapping: systemFieldKey → CSV column index */
export type ColumnMapping = Record<string, number>;

/** A raw CSV row (array of string values, indexed same as headers) */
export type CsvRow = string[];

/** Structured tour data extracted from a single CSV row */
export interface MappedTourData {
    // Identity
    bokun_id?: number | null;
    product_name: string;
    supplier_name: string;
    location: string;
    bokun_status?: string;
    bokun_marketplace_status?: string;

    // Pricing
    net_rate_adult?: number | null;
    net_rate_child?: number | null;
    net_rate_private?: number | null;
    public_rate?: number | null;
    shared_factor?: number | null;
    private_factor?: number | null;
    shared_min_pax?: number | null;
    private_min_pax?: number | null;
    infant_age_threshold?: number | null;
    extra_fees?: string | null;
    currency?: string;

    // Logistics
    duration?: string | null;
    days_of_operation?: string | null;
    cxl_policy?: string | null;
    meeting_point_info?: string | null;
    pickup_info?: string | null;

    // Assets
    pictures_url?: string | null;
    landing_page_url?: string | null;
    storytelling_url?: string | null;
    notes?: string | null;

    // OTA Distribution (legacy flat columns)
    viator_id?: string | null;
    viator_status?: string | null;
    expedia_id?: string | null;
    expedia_status?: string | null;
    project_expedition_id?: string | null;
    project_expedition_status?: string | null;
    klook_id?: string | null;
    klook_status?: string | null;

    // Custom attributes (any unmapped column the user chose to keep)
    custom_attributes?: Record<string, string>;
}

export interface ImportResult {
    /** Total rows processed */
    total: number;
    /** Rows upserted successfully */
    updated: number;
    /** Rows that failed */
    errors: number;
    /** Error messages */
    error_messages: string[];
    /** Supplier names that were auto-created as "Incomplete Profile" */
    new_suppliers: string[];
}

// ---------------------------------------------------------------------------
//  Supplier Upsert
// ---------------------------------------------------------------------------

/**
 * Find or create a Supplier by name.
 * Auto-created suppliers are marked "Incomplete Profile" — staff can fill in
 * contact_info, badges, etc. later from the Suppliers module.
 *
 * @returns { supplier_id, isNew }
 */
export async function upsertSupplier(
    name: string,
    tx?: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>
): Promise<{ supplier_id: number; isNew: boolean }> {
    const db = tx ?? prisma;
    const trimmedName = name.trim();

    const existing = await (db as PrismaClient).supplier.findUnique({
        where: { name: trimmedName },
        select: { id: true },
    });

    if (existing) {
        return { supplier_id: existing.id, isNew: false };
    }

    const created = await (db as PrismaClient).supplier.create({
        data: {
            name: trimmedName,
            profile_status: 'Incomplete Profile',
            is_active: true,
        },
        select: { id: true },
    });

    return { supplier_id: created.id, isNew: true };
}

// ---------------------------------------------------------------------------
//  Row Mapping
// ---------------------------------------------------------------------------

/**
 * Transform a raw CSV row into a structured MappedTourData object.
 * Unknown columns whose keys start with "custom_" are collected into
 * `custom_attributes` for JSONB storage.
 *
 * @param row     Raw CSV row values
 * @param mapping Column mapping: { systemField: csvColumnIndex }
 */
export function mapRowToTour(row: CsvRow, mapping: ColumnMapping): MappedTourData {
    function col(key: string): string | undefined {
        const idx = mapping[key];
        if (idx === undefined || idx < 0) return undefined;
        return row[idx]?.trim() || undefined;
    }

    function colNum(key: string): number | null {
        const raw = col(key);
        if (!raw) return null;
        // Strip currency symbols, commas, spaces
        const cleaned = raw.replace(/[$,\s,MXN,USD]/g, '').replace(',', '.');
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    }

    function colInt(key: string): number | null {
        const num = colNum(key);
        return num !== null ? Math.round(num) : null;
    }

    // Collect custom_* fields
    const custom_attributes: Record<string, string> = {};
    for (const key of Object.keys(mapping)) {
        if (key.startsWith('custom_')) {
            const value = col(key);
            if (value) {
                const cleanKey = key.replace(/^custom_/, '');
                custom_attributes[cleanKey] = value;
            }
        }
    }

    const product_name = col('product_name');
    const supplier_name = col('supplier');
    const location = col('location');

    if (!product_name) {
        throw new Error('product_name is required but was empty or unmapped');
    }

    return {
        bokun_id: colInt('bokun_id'),
        product_name,
        supplier_name: supplier_name || 'Unknown Supplier',
        location: location || '',
        bokun_status: col('bokun_status'),
        bokun_marketplace_status: col('bokun_marketplace_status'),

        net_rate_adult: colNum('net_rate_adult'),
        net_rate_child: colNum('net_rate_child'),
        net_rate_private: colNum('net_rate_private'),
        public_rate: colNum('public_rate'),
        shared_factor: colNum('shared_factor'),
        private_factor: colNum('private_factor'),
        shared_min_pax: colInt('min_pax_shared'),
        private_min_pax: colInt('min_pax_private'),
        infant_age_threshold: colInt('infant_age_threshold'),
        extra_fees: col('extra_fees'),
        currency: col('currency') || 'MXN',

        duration: col('duration'),
        days_of_operation: col('timeline'),
        cxl_policy: col('cxl_policy'),
        meeting_point_info: col('meeting_point_info'),
        pickup_info: col('pickup_info'),

        pictures_url: col('pictures_url'),
        landing_page_url: col('landing_page_url'),
        storytelling_url: col('storytelling_url'),
        notes: col('notes'),

        viator_id: col('viator_id'),
        viator_status: col('viator_status'),
        expedia_id: col('expedia_id'),
        expedia_status: col('expedia_status'),
        project_expedition_id: col('project_expedition_id') ?? col('gyg_id'),
        project_expedition_status: col('project_expedition_status') ?? col('gyg_status'),
        klook_id: col('klook_id'),
        klook_status: col('klook_status'),

        custom_attributes: Object.keys(custom_attributes).length > 0
            ? custom_attributes
            : undefined,
    };
}

// ---------------------------------------------------------------------------
//  Single Row Upsert
// ---------------------------------------------------------------------------

/**
 * Upsert a single tour row within a Prisma transaction.
 * - Supplier is resolved (find or create) before tour upsert.
 * - Pricing is resolved using bidirectional pricingLogic.
 * - Returns the action taken: "created" | "updated" | "skipped"
 */
export async function importRow(
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    data: MappedTourData,
    supplierCache: Map<string, number>
): Promise<{ action: 'created' | 'updated' | 'skipped'; isNewSupplier: boolean; tourId: number }> {

    // ── 1. Supplier resolution (cached within batch) ──────────────────────
    let supplier_id = supplierCache.get(data.supplier_name);
    let isNewSupplier = false;

    if (supplier_id === undefined) {
        const result = await upsertSupplier(data.supplier_name, tx as unknown as PrismaClient);
        supplier_id = result.supplier_id;
        isNewSupplier = result.isNew;
        supplierCache.set(data.supplier_name, supplier_id);
    }

    // ── 2. Resolve pricing ───────────────────────────────────────────────
    let resolvedPricing: { net: number; public: number; factor: number } | null = null;
    if (data.net_rate_adult) {
        try {
            resolvedPricing = resolvePricing({
                net: data.net_rate_adult,
                public: data.public_rate,
                factor: data.shared_factor,
            });
        } catch {
            // Non-fatal: use raw values without resolution
        }
    }

    // ── 3. Build tour payload ────────────────────────────────────────────
    // Unchecked variant allows setting supplier_id as a plain FK scalar
    const tourPayload: Prisma.TourUncheckedUpdateInput = {
        product_name: data.product_name,
        supplier: data.supplier_name,
        supplier_id,
        location: data.location || '',
        bokun_status: data.bokun_status,
        bokun_marketplace_status: data.bokun_marketplace_status,
        last_update: new Date(),
    };

    // ── 4. Upsert Tour ───────────────────────────────────────────────────
    let action: 'created' | 'updated';
    let tourId: number;

    if (data.bokun_id) {
        // Upsert by bokun_id
        const existing = await tx.tour.findUnique({
            where: { bokun_id: data.bokun_id },
            select: { id: true },
        });

        if (existing) {
            await tx.tour.update({
                where: { bokun_id: data.bokun_id },
                data: tourPayload,
            });
            tourId = existing.id;
            action = 'updated';
        } else {
            const created = await tx.tour.create({
                data: {
                    bokun_id: data.bokun_id,
                    product_name: data.product_name,
                    supplier: data.supplier_name,
                    supplier_id,
                    location: data.location || '',
                    bokun_status: data.bokun_status,
                    bokun_marketplace_status: data.bokun_marketplace_status,
                },
            });
            tourId = created.id;
            action = 'created';
        }
    } else {
        // No bokun_id: upsert by product_name (less reliable, fallback)
        const existing = await tx.tour.findFirst({
            where: { product_name: data.product_name },
            select: { id: true },
        });

        if (existing) {
            await tx.tour.update({ where: { id: existing.id }, data: tourPayload });
            tourId = existing.id;
            action = 'updated';
        } else {
            const created = await tx.tour.create({
                data: {
                    product_name: data.product_name,
                    supplier: data.supplier_name,
                    supplier_id,
                    location: data.location || '',
                },
            });
            tourId = created.id;
            action = 'created';
        }
    }

    // ── 5. Upsert TourPricing ────────────────────────────────────────────
    if (data.net_rate_adult) {
        const pricingData = {
            net_rate_adult: resolvedPricing?.net ?? data.net_rate_adult,
            shared_factor: resolvedPricing?.factor ?? data.shared_factor ?? 1.5,
            public_rate: resolvedPricing?.public ?? data.public_rate,
            net_rate_child: data.net_rate_child,
            net_rate_private: data.net_rate_private,
            private_factor: data.private_factor ?? 1.5,
            shared_min_pax: data.shared_min_pax,
            private_min_pax: data.private_min_pax,
            infant_age_threshold: data.infant_age_threshold,
            extra_fees: data.extra_fees,
            currency: data.currency ?? 'MXN',
        };

        await tx.tourPricing.upsert({
            where: { tour_id: tourId },
            create: { tour_id: tourId, ...pricingData },
            update: pricingData,
        });
    }

    // ── 6. Upsert TourLogistics ──────────────────────────────────────────
    if (data.duration || data.days_of_operation || data.cxl_policy || data.meeting_point_info) {
        const logisticsData = {
            duration: data.duration,
            days_of_operation: data.days_of_operation,
            cxl_policy: data.cxl_policy,
            meeting_point_info: data.meeting_point_info,
            pickup_info: data.pickup_info,
        };

        await tx.tourLogistics.upsert({
            where: { tour_id: tourId },
            create: { tour_id: tourId, ...logisticsData },
            update: logisticsData,
        });
    }

    // ── 7. Upsert TourAssets ─────────────────────────────────────────────
    if (data.pictures_url || data.landing_page_url || data.storytelling_url || data.notes) {
        const assetData = {
            pictures_url: data.pictures_url,
            landing_page_url: data.landing_page_url,
            storytelling_url: data.storytelling_url,
            notes: data.notes,
        };

        await tx.tourAssets.upsert({
            where: { tour_id: tourId },
            create: { tour_id: tourId, ...assetData },
            update: assetData,
        });
    }

    // ── 8. Upsert TourDistribution (legacy flat model) ───────────────────
    const hasDistribution = data.viator_id || data.expedia_id ||
        data.project_expedition_id || data.klook_id;

    if (hasDistribution) {
        const distData = {
            viator_id: data.viator_id,
            viator_status: data.viator_status,
            expedia_id: data.expedia_id,
            expedia_status: data.expedia_status,
            project_expedition_id: data.project_expedition_id,
            project_expedition_status: data.project_expedition_status,
            klook_id: data.klook_id,
            klook_status: data.klook_status,
        };

        await tx.tourDistribution.upsert({
            where: { tour_id: tourId },
            create: { tour_id: tourId, ...distData },
            update: distData,
        });
    }

    // ── 9. Ensure TourAudit row exists ───────────────────────────────────
    await tx.tourAudit.upsert({
        where: { tour_id: tourId },
        create: { tour_id: tourId },
        update: {},
    });

    return { action, isNewSupplier, tourId };
}

// ---------------------------------------------------------------------------
//  Batch Import Runner
// ---------------------------------------------------------------------------

/**
 * Process an array of parsed CSV rows.
 * Streams progress via onProgress callback (for SSE endpoint).
 * Each row is upserted in its own transaction to avoid one failure
 * rolling back an entire batch.
 */
export async function runBatchImport(
    rows: CsvRow[],
    mapping: ColumnMapping,
    onProgress?: (current: number, total: number, log: string) => void
): Promise<ImportResult> {
    const result: ImportResult = {
        total: rows.length,
        updated: 0,
        errors: 0,
        error_messages: [],
        new_suppliers: [],
    };

    // Shared supplier cache across the batch — avoids duplicate DB lookups
    const supplierCache = new Map<string, number>();

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        try {
            const data = mapRowToTour(row, mapping);

            const { action, isNewSupplier } = await prisma.$transaction(async (tx) => {
                return importRow(tx, data, supplierCache);
            });

            result.updated++;

            if (isNewSupplier) {
                result.new_suppliers.push(data.supplier_name);
            }

            onProgress?.(
                i + 1,
                rows.length,
                `[${action.toUpperCase()}] ${data.product_name}${isNewSupplier ? ` — ⚡ New supplier: "${data.supplier_name}"` : ''}`
            );

        } catch (err) {
            result.errors++;
            const message = err instanceof Error ? err.message : String(err);
            const preview = row.slice(0, 3).join(' | ');
            result.error_messages.push(`Row ${i + 1} (${preview}): ${message}`);
            onProgress?.(i + 1, rows.length, `[ERROR] Row ${i + 1}: ${message}`);
        }
    }

    return result;
}

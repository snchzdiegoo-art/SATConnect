import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import { assessProductHealth } from '@/services/healthService';
import { calculateOTADistributionScore, checkGlobalSuitability } from '@/services/distributionService';
import { calculateTourPricing } from '@/services/pricingService';
import { upsertSupplier } from '@/services/importService';

const prisma = new PrismaClient();

// Configuration of available system fields
// This maps CSV column headers to internal field names
const SYSTEM_FIELDS = {
    // Core Tour Fields
    bokun_id: 'Bókun ID / SKU',
    product_name: 'Product Name',
    supplier: 'Supplier',
    location: 'LOCATION',
    bokun_marketplace: 'Bokun MarketPlace',
    bokun_status: 'BOKUN STATUS',
    is_active: 'Active',
    is_audited: 'Audited',
    last_update: 'Last Update',

    // Pricing Fields
    net_rate_adult: 'Net Rate (Adult)',
    net_rate_child: 'Net Rate (Child)',
    net_rate_private: 'Net Rate (Private)',
    shared_factor: 'Shared Factor',
    private_factor: 'Private Factor',
    min_pax_shared: 'Min Pax (Shared)',
    min_pax_private: 'Min Pax (Private)',
    infant_age_threshold: 'Infant Age Threshold',
    extra_fees: 'Extra Fees',

    // Logistics Fields
    duration: 'Duration',
    days_of_operation: 'Days of Operation',
    cxl_policy: 'Cancelation Policy',
    meeting_point_info: 'Meeting point / Pick up',

    // Assets Fields
    pictures_url: 'Pictures URL',
    landing_page_url: 'Landing Page URL',
    storytelling_url: 'Storytelling URL',
    notes: 'Notes',

    // Distribution Fields
    viator_id: 'VIATOR ID',
    viator_status: 'Viator Status',
    viator_commission: '% Comision Viator',
    expedia_id: 'EXPEDIA ID',
    expedia_status: 'Expedia Status',
    gyg_id: 'Proj. Exp ID',
    gyg_status: 'Proj. Exp Status',
    klook_id: 'KLOOK ID',
    klook_status: 'Klook Status'
};

const encoder = new TextEncoder();

export async function POST(request: NextRequest) {
    try {
        // Fetch active custom fields to checking mapping
        const customFieldDefs = await prisma.customFieldDefinition.findMany({
            where: { is_active: true }
        });

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const mappingJson = formData.get('mapping') as string;
        const headerRowIndexStr = formData.get('headerRowIndex') as string;

        if (!file || !mappingJson) {
            return NextResponse.json({ success: false, error: 'File and mapping are required' }, { status: 400 });
        }

        const mapping = JSON.parse(mappingJson);
        const headerRowIndex = parseInt(headerRowIndexStr || '0');

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = file.name.toLowerCase();

        // Create a streaming response
        const stream = new ReadableStream({
            async start(controller) {
                const sendUpdate = (data: any) => {
                    controller.enqueue(encoder.encode(JSON.stringify(data) + '\n'));
                };

                try {
                    let records: string[][];

                    // Check file type and parse accordingly
                    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
                        // Parse XLSX file
                        const workbook = XLSX.read(buffer, { type: 'buffer' });
                        const sheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[sheetName];

                        // Convert to array of arrays with raw:false to preserve decimal formatting
                        const allRecords = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '', raw: false });

                        // Skip header row and empty lines
                        records = allRecords.slice(headerRowIndex + 1).filter((row: any) =>
                            row.some((cell: any) => cell?.toString().trim())
                        ) as string[][];
                    } else {
                        // Parse CSV file
                        const content = buffer.toString('utf-8');
                        records = parse(content, {
                            columns: false,
                            from_line: headerRowIndex + 2,
                            skip_empty_lines: true,
                            relax_quotes: true,
                            relax_column_count: true
                        });
                    }

                    sendUpdate({ type: 'start', total: records.length });

                    let updatedCount = 0;
                    let errorCount = 0;

                    for (let i = 0; i < records.length; i++) {
                        const row = records[i];

                        try {
                            const getVal = (fieldKey: string) => {
                                const colIndex = mapping[fieldKey];
                                if (colIndex === undefined || colIndex === null || colIndex === -1) return null;
                                return row[colIndex]?.trim();
                            };

                            const bokunIdStr = getVal('bokun_id');
                            if (!bokunIdStr) {
                                // Only log if we expect data here. The parser skips empty lines, so this might be a mapped column issue.
                                sendUpdate({ type: 'log', message: `Row ${i + 1}: Skipped - 'bokun_id' column is empty. (Raw row length: ${Object.keys(row).length})` });
                                continue;
                            }

                            // Remove non-numeric chars but keep invalid ones for logging check
                            const cleanId = bokunIdStr.replace(/[^0-9]/g, '');
                            const bokunId = parseInt(cleanId);

                            if (isNaN(bokunId) || cleanId === '') {
                                sendUpdate({ type: 'log', message: `Row ${i + 1}: Skipped - Invalid Bokun ID '${bokunIdStr}' -> Parsed: ${cleanId}` });
                                continue;
                            }

                            // Helpers
                            const parseCurrency = (val: string | null) => {
                                if (!val) return null;
                                // Handle both comma and period as decimal separators (European vs US format)
                                const clean = val.replace(/[^0-9.,]/g, '').replace(',', '.');
                                return clean ? parseFloat(clean) : null;
                            };
                            const parseDecimal = (val: string | null) => {
                                // For decimal values like factors (1,25 or 1.25)
                                // Handle European format (comma) and US format (period)
                                if (!val) return null;
                                const clean = val.trim().replace(/[^0-9.,]/g, '').replace(',', '.');
                                return clean ? parseFloat(clean) : null;
                            };
                            const parseIntSafe = (val: string | null) => {
                                if (!val) return null;
                                const clean = val.replace(/[^0-9]/g, '');
                                return clean ? parseInt(clean) : null;
                            };
                            const parseBoolean = (val: string | null) => {
                                if (!val) return null;
                                const upper = val.toUpperCase().trim();
                                return upper === 'TRUE' || upper === '1' || upper === 'YES';
                            };
                            const parseDate = (val: string | null): Date | undefined => {
                                if (!val) return undefined;
                                try {
                                    const parsed = new Date(val);
                                    return isNaN(parsed.getTime()) ? undefined : parsed;
                                } catch {
                                    return undefined;
                                }
                            };

                            const supplierName = getVal('supplier') || 'Unknown';
                            const { supplier_id } = await upsertSupplier(supplierName);

                            const tourData = {
                                bokun_id: bokunId,
                                product_name: getVal('product_name') || `Tour ${bokunId}`,
                                supplier: supplierName,
                                supplier_id,
                                location: getVal('location') || 'Unknown',
                                bokun_marketplace_status: getVal('bokun_marketplace'),
                                bokun_status: getVal('bokun_status'),
                                is_active: parseBoolean(getVal('is_active')) ?? true,
                                is_audited: parseBoolean(getVal('is_audited')) ?? false,
                                last_update: parseDate(getVal('last_update'))
                            };

                            const pricingData = {
                                net_rate_adult: parseCurrency(getVal('net_rate_adult')) || 0,
                                net_rate_child: parseCurrency(getVal('net_rate_child')),
                                net_rate_private: parseCurrency(getVal('net_rate_private')),
                                shared_factor: parseDecimal(getVal('shared_factor')) || 1.5,
                                private_factor: parseDecimal(getVal('private_factor')) || 1.5,
                                shared_min_pax: parseIntSafe(getVal('min_pax_shared')),
                                private_min_pax: parseIntSafe(getVal('min_pax_private')),
                                infant_age_threshold: parseIntSafe(getVal('infant_age_threshold')),
                                extra_fees: getVal('extra_fees')
                            };

                            const logisticsData = {
                                duration: getVal('duration'),
                                days_of_operation: getVal('days_of_operation'),
                                cxl_policy: getVal('cxl_policy'),
                                meeting_point_info: getVal('meeting_point_info')
                            };

                            const assetsData = {
                                pictures_url: getVal('pictures_url'),
                                landing_page_url: getVal('landing_page_url'),
                                storytelling_url: getVal('storytelling_url'),
                                notes: getVal('notes'),
                            };

                            const distributionData = {
                                viator_id: getVal('viator_id'),
                                viator_status: getVal('viator_status'),
                                viator_commission_percent: parseDecimal(getVal('viator_commission')),
                                expedia_id: getVal('expedia_id'),
                                expedia_status: getVal('expedia_status'),
                                project_expedition_id: getVal('gyg_id'),
                                project_expedition_status: getVal('gyg_status'),
                                klook_id: getVal('klook_id'),
                                klook_status: getVal('klook_status')
                            };

                            // Upsert Tour & Relations
                            // We capture the result to get the ID for custom fields
                            const upsertedTour = await prisma.tour.upsert({
                                where: { bokun_id: bokunId },
                                create: {
                                    ...tourData,
                                    pricing: { create: pricingData },
                                    logistics: { create: logisticsData },
                                    assets: { create: assetsData },
                                    distribution: { create: distributionData },
                                    audit: { create: { product_health_score: "INCOMPLETE" } }
                                },
                                update: {
                                    ...tourData,
                                    pricing: { upsert: { create: pricingData, update: pricingData } },
                                    logistics: { upsert: { create: logisticsData, update: logisticsData } },
                                    assets: { upsert: { create: assetsData, update: assetsData } },
                                    distribution: { upsert: { create: distributionData, update: distributionData } }
                                }
                            });

                            // Fetch complete tour for health assessment
                            const completeTour = await prisma.tour.findUnique({
                                where: { id: upsertedTour.id },
                                include: {
                                    pricing: true,
                                    logistics: true,
                                    assets: true,
                                    distribution: true,
                                    audit: true,
                                },
                            });

                            if (completeTour) {
                                // 10. Assess product health
                                const healthCheck = assessProductHealth(completeTour);

                                // 11. Calculate OTA score
                                const otaScore = completeTour.distribution
                                    ? calculateOTADistributionScore(completeTour.distribution)
                                    : 0;

                                // 12. Check global suitability
                                const isSuitable = checkGlobalSuitability(
                                    healthCheck.status,
                                    completeTour.pricing
                                        ? {
                                            suggested_pvp_adult: calculateTourPricing({
                                                net_rate_adult: completeTour.pricing.net_rate_adult,
                                                shared_factor: completeTour.pricing.shared_factor,
                                                net_rate_child: completeTour.pricing.net_rate_child,
                                                net_rate_private: completeTour.pricing.net_rate_private,
                                                private_factor: completeTour.pricing.private_factor,
                                                private_min_pax: completeTour.pricing.private_min_pax,
                                                private_min_pax_net_rate: completeTour.pricing.private_min_pax_net_rate,
                                            }).suggestedPvpAdult,
                                            net_rate_adult: completeTour.pricing.net_rate_adult,
                                        }
                                        : undefined,
                                    completeTour.logistics?.cxl_policy
                                );

                                // 13. Update audit with calculated values
                                await prisma.tourAudit.upsert({
                                    where: { tour_id: completeTour.id },
                                    create: {
                                        tour_id: completeTour.id,
                                        product_health_score: healthCheck.status,
                                        otas_distribution_score: otaScore,
                                        is_suitable_for_global_distribution: isSuitable,
                                    },
                                    update: {
                                        product_health_score: healthCheck.status,
                                        otas_distribution_score: otaScore,
                                        is_suitable_for_global_distribution: isSuitable,
                                    }
                                });
                            }

                            // Process Custom Fields
                            for (const def of customFieldDefs) {
                                const mapKey = `custom_${def.key}`; // Key used in CsvMapperModal
                                const val = getVal(mapKey);

                                if (val !== null && val !== undefined) {
                                    await prisma.tourCustomFieldValue.upsert({
                                        where: {
                                            tour_id_definition_id: {
                                                tour_id: upsertedTour.id,
                                                definition_id: def.id
                                            }
                                        },
                                        create: {
                                            tour_id: upsertedTour.id,
                                            definition_id: def.id,
                                            value: val
                                        },
                                        update: {
                                            value: val
                                        }
                                    });
                                }
                            }

                            updatedCount++;
                            sendUpdate({ type: 'progress', current: i + 1, total: records.length });

                        } catch (e: any) {
                            console.error(`Row ${i} Error:`, e);
                            sendUpdate({ type: 'log', message: `Row ${i + 1} Error: ${e.message}` });
                            errorCount++;
                        }
                    }

                    sendUpdate({ type: 'complete', updated: updatedCount, errors: errorCount });

                } catch (err: any) {
                    sendUpdate({ type: 'error', message: err.message });
                } finally {
                    controller.close();
                }
            }
        });

        return new Response(stream, {
            headers: { 'Content-Type': 'application/x-ndjson' }
        });

    } catch (error: any) {
        console.error('Import API Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

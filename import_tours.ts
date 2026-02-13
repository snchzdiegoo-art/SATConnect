
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';
import { assessProductHealth } from './src/services/healthService';
import { calculateOTADistributionScore, checkGlobalSuitability } from './src/services/distributionService';
import { calculateTourPricing } from './src/services/pricingService';

const prisma = new PrismaClient();

// ==========================================
// 🔧 CONFIGURATION: CSV COLUMN MAPPING
// ==========================================
// Adjust these indices to match your CSV columns (0-based)
const COLUMN_MAP = {
    // IDENTITY
    BOKUN_ID: 0,            // Col A - ID / SKU
    PRODUCT_NAME: 1,        // Col B - Activity Name
    SUPPLIER: 2,            // Col C - Supplier
    LOCATION: 3,            // Col D - Location

    // STATUS
    MARKETPLACE_BOKUN_STATUS: 4, // Col E
    BOKUN_STATUS: 5,        // Col F
    IS_ACTIVE: 6,           // Col G
    IS_AUDITED: 7,          // Col H

    // PRICING (SHARED)
    NET_RATE_ADULT: 8,      // Col I
    SHARED_FACTOR: 9,       // Col J
    // Col K is Calculated PVP (skip)
    NET_RATE_CHILD: 11,     // Col L
    // Col M is Calculated Child PVP (skip)
    INFANT_THRESHOLD: 13,   // Col N
    SHARED_MIN_PAX: 14,     // Col O

    // PRICING (PRIVATE)
    PRIVATE_MIN_PAX: 15,    // Col P
    NET_RATE_PRIVATE: 16,   // Col Q
    PRIVATE_FACTOR: 17,     // Col R
    // Col S is Suggested PVP Private (skip)
    // Col T is Per Pax Cost (skip)

    // ASSETS & LOGISTICS
    PICTURES_URL: 20,       // Col U
    DURATION: 21,           // Col V
    DAYS_OPERATION: 22,     // Col W
    CXL_POLICY: 23,         // Col X
    LANDING_URL: 24,        // Col Y
    STORYTELLING_URL: 25,   // Col Z
    MEETING_POINT: 26,      // Col AA
    EXTRA_FEES: 27,         // Col AB

    // DISTRIBUTION - PROJECT EXPEDITION
    PROJ_EXP_ID: 28,        // Col AC
    PROJ_EXP_STATUS: 29,    // Col AD

    // DISTRIBUTION - EXPEDIA
    EXPEDIA_ID: 30,         // Col AE
    EXPEDIA_STATUS: 31,     // Col AF

    // DISTRIBUTION - VIATOR
    VIATOR_ID: 32,          // Col AG
    VIATOR_STATUS: 33,      // Col AH (Note: This might be commission in some sheets, check carefully)
    // Adding inferred commission column if exists or re-using 33 if detected as number

    // DISTRIBUTION - KLOOK
    KLOOK_ID: 34,           // Col AI
    KLOOK_STATUS: 35,       // Col AJ

    // NOTES
    NOTES: 37               // Col AL or similar
};

// File to import
const CSV_FILENAME = 'OTAs TOUR & Activities AUDIT - AUDITORIA_MAESTRA_OTAS (1).csv';

async function importTours() {
    try {
        const filePath = path.join(process.cwd(), 'DOCUMENTOS BASE', CSV_FILENAME);

        console.log(`📂 Reading from: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at ${filePath}`);
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const records = parse(fileContent, {
            columns: false, // Access by index
            skip_empty_lines: true,
            from_line: 2 // Skip header
        });

        console.log(`📊 Found ${records.length} records to process.`);

        let successCount = 0;
        let errorCount = 0;

        for (const row of records) {
            try {
                // Helpers for safe data extraction using the Map
                const getStr = (index: number) => row[index]?.toString().trim() || null;
                const getInt = (index: number) => {
                    // Remove non-numeric characters EXCEPT dot and minus
                    const val = row[index]?.toString().replace(/[^0-9.-]/g, '');
                    if (!val) return null;
                    // Parse as float first to handle "1.00", then round to integer
                    const num = parseFloat(val);
                    return isNaN(num) ? null : Math.round(num);
                };
                const getDec = (index: number) => {
                    const val = row[index]?.toString().replace(/[^0-9.]/g, '');
                    return val ? parseFloat(val) : null;
                };
                const getBool = (index: number) => {
                    const val = row[index]?.toString().toLowerCase();
                    return val === 'yes' || val === 'true' || val === 'si' || val === 'active';
                };

                // 1. Basic Info
                const bokunId = getInt(COLUMN_MAP.BOKUN_ID);
                const productName = getStr(COLUMN_MAP.PRODUCT_NAME);

                if (!productName) {
                    // console.warn(`⚠️ Skipping row with generic name or missing info.`);
                    continue;
                }

                // 2. Prepare Data Objects
                const tourData = {
                    bokun_id: bokunId,
                    product_name: productName,
                    supplier: getStr(COLUMN_MAP.SUPPLIER) || 'Unknown Supplier',
                    location: getStr(COLUMN_MAP.LOCATION) || 'Unknown Location',
                    bokun_marketplace_status: getStr(COLUMN_MAP.MARKETPLACE_BOKUN_STATUS),
                    bokun_status: getStr(COLUMN_MAP.BOKUN_STATUS),
                    is_active: true, // Default to true or use getBool(COLUMN_MAP.IS_ACTIVE)
                    is_audited: getBool(COLUMN_MAP.IS_AUDITED)
                };

                // Pricing
                const pricingData = {
                    net_rate_adult: getDec(COLUMN_MAP.NET_RATE_ADULT) || 0,
                    shared_factor: getDec(COLUMN_MAP.SHARED_FACTOR) || 1.5,
                    net_rate_child: getDec(COLUMN_MAP.NET_RATE_CHILD),
                    infant_age_threshold: getInt(COLUMN_MAP.INFANT_THRESHOLD),
                    shared_min_pax: getInt(COLUMN_MAP.SHARED_MIN_PAX),
                    net_rate_private: getDec(COLUMN_MAP.NET_RATE_PRIVATE),
                    private_factor: getDec(COLUMN_MAP.PRIVATE_FACTOR) || 1.5,
                    private_min_pax: getInt(COLUMN_MAP.PRIVATE_MIN_PAX),
                    extra_fees: getStr(COLUMN_MAP.EXTRA_FEES)
                };

                // Logistics
                const logisticsData = {
                    duration: getStr(COLUMN_MAP.DURATION),
                    days_of_operation: getStr(COLUMN_MAP.DAYS_OPERATION),
                    cxl_policy: getStr(COLUMN_MAP.CXL_POLICY),
                    meeting_point_info: getStr(COLUMN_MAP.MEETING_POINT)
                };

                // Assets
                const assetsData = {
                    pictures_url: getStr(COLUMN_MAP.PICTURES_URL),
                    landing_page_url: getStr(COLUMN_MAP.LANDING_URL),
                    storytelling_url: getStr(COLUMN_MAP.STORYTELLING_URL),
                    notes: getStr(COLUMN_MAP.NOTES)
                };

                // Distribution
                // Heuristic: Check if VIATOR_STATUS looks like a number (commission)
                const viatorStatusRaw = getStr(COLUMN_MAP.VIATOR_STATUS);
                let viatorStatus = viatorStatusRaw;
                let viatorCommission = null;

                if (viatorStatusRaw && /^\d+(\.\d+)?%?$/.test(viatorStatusRaw)) {
                    // It looks like a commission value (e.g. "170" -> 17.0? or "20")
                    // Move it to commission and deduce status
                    const cleanVal = parseFloat(viatorStatusRaw.replace('%', ''));

                    // If value is > 100, it might be 170 meaning 17.0%? Or just invalid?
                    // Assuming standard commission is < 50%, if > 100, might be basis points? 
                    // Let's assume input "170" meant 17% but formatted oddly, OR it's a bug.
                    // But for safety, maps to commission.
                    viatorCommission = cleanVal;

                    // Default status if we have commission
                    viatorStatus = 'Active';
                }

                const distributionData = {
                    project_expedition_id: getStr(COLUMN_MAP.PROJ_EXP_ID), // Changed to string as IDs can be alphanumeric
                    project_expedition_status: getStr(COLUMN_MAP.PROJ_EXP_STATUS),
                    expedia_id: getStr(COLUMN_MAP.EXPEDIA_ID),
                    expedia_status: getStr(COLUMN_MAP.EXPEDIA_STATUS),
                    viator_id: getStr(COLUMN_MAP.VIATOR_ID),
                    viator_status: viatorStatus,
                    viator_commission_percent: viatorCommission, // Null for now unless we add mapping
                    klook_id: getStr(COLUMN_MAP.KLOOK_ID),
                    klook_status: getStr(COLUMN_MAP.KLOOK_STATUS)
                };

                // UPSERT TOUR
                let upsertedTour;
                if (bokunId) {
                    upsertedTour = await prisma.tour.upsert({
                        where: { bokun_id: bokunId },
                        create: {
                            ...tourData,
                            pricing: { create: pricingData },
                            logistics: { create: logisticsData },
                            assets: { create: assetsData },
                            distribution: { create: distributionData },
                            audit: { create: { product_health_score: "INCOMPLETE" } } // Init as incomplete, update immediately
                        },
                        update: {
                            ...tourData,
                            pricing: { upsert: { create: pricingData, update: pricingData } },
                            logistics: { upsert: { create: logisticsData, update: logisticsData } },
                            assets: { upsert: { create: assetsData, update: assetsData } },
                            distribution: { upsert: { create: distributionData, update: distributionData } }
                        }
                    });
                } else {
                    // Fallback
                    upsertedTour = await prisma.tour.create({
                        data: {
                            ...tourData,
                            pricing: { create: pricingData },
                            logistics: { create: logisticsData },
                            assets: { create: assetsData },
                            distribution: { create: distributionData },
                            audit: { create: { product_health_score: "INCOMPLETE" } }
                        }
                    });
                }

                // POST-IMPORT HEALTH CHECK
                // Fetch full object to run services
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
                    const healthCheck = assessProductHealth(completeTour as any);

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

                process.stdout.write('.'); // Progress dot
                successCount++;

            } catch (err) {
                // console.error(`\n❌ Error processing row ${row[0]}:`, err);
                errorCount++;
            }
        }

        console.log(`\n\n✅ Import Complete!`);
        console.log(`   Success: ${successCount}`);
        console.log(`   Errors:  ${errorCount}`);

    } catch (error) {
        console.error('Fatal Import Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

importTours();

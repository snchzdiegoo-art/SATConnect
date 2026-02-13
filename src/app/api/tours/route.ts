/**
 * SAT Connect - Tours API Routes
 * GET /api/tours - List all tours (paginated, filterable)
 * POST /api/tours - Create new tour with automatic health assessment
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { assessProductHealth } from '@/services/healthService';
import { calculateTourPricing } from '@/services/pricingService';
import { calculateOTADistributionScore, checkGlobalSuitability } from '@/services/distributionService';
import * as fs from 'fs';

// GET /api/tours - List tours with pagination and filters
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        // Filters
        const supplier = searchParams.get('supplier');
        const providers = searchParams.get('providers'); // comma-separated
        const location = searchParams.get('location');
        const locations = searchParams.get('locations'); // comma-separated
        const healthStatus = searchParams.get('health_status');
        const health = searchParams.get('health'); // comma-separated
        const isActive = searchParams.get('is_active');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy') || 'last_update';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        // Build where clause
        const where: Prisma.TourWhereInput = {};

        console.log('API Request:', {
            params: Object.fromEntries(searchParams.entries()),
            locations,
            sortBy,
            sortOrder
        });

        try {
            const logData = `\n[${new Date().toISOString()}] Params: ${JSON.stringify(Object.fromEntries(searchParams.entries()))}\n`;
            fs.appendFileSync('filter_debug.log', logData);
        } catch (e) { /* ignore */ }

        // Provider filter - handle both single supplier and multi-select providers
        if (providers) {
            // Split pipe-separated providers and decode URL encoding (+ becomes space)
            const providerList = providers.split('|')
                .map(p => decodeURIComponent(p.trim().replace(/\+/g, ' ')))
                .filter(Boolean);
            if (providerList.length > 0) {
                where.supplier = { in: providerList };
            }
        } else if (supplier) {
            where.supplier = decodeURIComponent(supplier.replace(/\+/g, ' '));
        }

        // Location filter - handle both single location and multi-select locations
        if (locations) {
            console.log('Raw locations param:', locations);
            // Split pipe-separated locations and decode URL encoding (+ becomes space)
            const locationList = locations.split('|')
                .map(l => decodeURIComponent(l.trim().replace(/\+/g, ' ')))
                .filter(Boolean);

            try {
                fs.appendFileSync('filter_debug.log', `[${new Date().toISOString()}] Parsed Locations: ${JSON.stringify(locationList)}\n`);
            } catch (e) { /* ignore */ }

            console.log('Parsed locationList:', locationList);

            if (locationList.length > 0) {
                where.location = { in: locationList };
            }
        } else if (location) {
            where.location = decodeURIComponent(location.replace(/\+/g, ' '));
        }

        console.log('Final Prisma WHERE:', JSON.stringify(where, null, 2));

        try {
            fs.appendFileSync('filter_debug.log', `[${new Date().toISOString()}] WHERE: ${JSON.stringify(where)}\n`);
        } catch (e) { /* ignore */ }

        if (isActive !== null) where.is_active = isActive === 'true';
        if (search) {
            where.product_name = {
                contains: search,
                mode: 'insensitive',
            };
        }
        if (healthStatus) {
            where.audit = {
                product_health_score: healthStatus.toUpperCase(),
            };
        } else if (health) {
            const healthList = health.split('|').filter(Boolean);
            if (healthList.length > 0) {
                where.audit = {
                    product_health_score: { in: healthList.map(h => h.toUpperCase()) },
                };
            }
        }

        // Build orderBy
        const orderBy: Prisma.TourOrderByWithRelationInput = {};
        if (sortBy === 'name') {
            orderBy.product_name = sortOrder as 'asc' | 'desc';
        } else if (sortBy === 'provider') {
            orderBy.supplier = sortOrder as 'asc' | 'desc';
        } else if (sortBy === 'netRate') {
            orderBy.pricing = { net_rate_adult: sortOrder as 'asc' | 'desc' };
        } else if (sortBy === 'createdAt') {
            orderBy.createdAt = sortOrder as 'asc' | 'desc';
        } else {
            orderBy.last_update = sortOrder as 'asc' | 'desc';
        }

        // Execute query with relations
        const [tours, totalCount] = await Promise.all([
            prisma.tour.findMany({
                where,
                skip,
                take: limit,
                include: {
                    pricing: true,
                    logistics: true,
                    assets: true,
                    distribution: true,
                    audit: true,
                },
                orderBy,
            }),
            prisma.tour.count({ where }),
        ]);

        // Calculate virtual fields for each tour
        const toursWithCalculations = tours.map((tour) => {
            let calculations = null;

            if (tour.pricing) {
                calculations = calculateTourPricing({
                    net_rate_adult: tour.pricing.net_rate_adult,
                    shared_factor: tour.pricing.shared_factor,
                    net_rate_child: tour.pricing.net_rate_child,
                    net_rate_private: tour.pricing.net_rate_private,
                    private_factor: tour.pricing.private_factor,
                    private_min_pax: tour.pricing.private_min_pax,
                    private_min_pax_net_rate: tour.pricing.private_min_pax_net_rate,
                });
            }

            return {
                ...tour,
                calculations,
            };
        });

        return NextResponse.json({
            success: true,
            data: toursWithCalculations,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching tours:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tours' },
            { status: 500 }
        );
    }
}

// POST /api/tours - Create new tour
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate required fields
        if (!body.product_name || !body.supplier || !body.location) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields: product_name, supplier, location' },
                { status: 400 }
            );
        }

        if (!body.pricing || !body.pricing.net_rate_adult) {
            return NextResponse.json(
                { success: false, error: 'Pricing information with net_rate_adult is required' },
                { status: 400 }
            );
        }

        // Create tour with all related entities in a transaction
        const tour = await prisma.$transaction(async (tx) => {
            // 1. Create Tour
            const newTour = await tx.tour.create({
                data: {
                    bokun_id: body.bokun_id,
                    product_name: body.product_name,
                    supplier: body.supplier,
                    location: body.location,
                    bokun_marketplace_status: body.bokun_marketplace_status,
                    bokun_status: body.bokun_status,
                    is_active: body.is_active ?? true,
                    is_audited: body.is_audited ?? false,
                },
            });

            // 2. Create TourPricing
            await tx.tourPricing.create({
                data: {
                    tour_id: newTour.id,
                    net_rate_adult: body.pricing.net_rate_adult,
                    shared_factor: body.pricing.shared_factor ?? 1.5,
                    net_rate_child: body.pricing.net_rate_child,
                    infant_age_threshold: body.pricing.infant_age_threshold,
                    shared_min_pax: body.pricing.shared_min_pax,
                    net_rate_private: body.pricing.net_rate_private,
                    private_factor: body.pricing.private_factor ?? 1.5,
                    private_min_pax: body.pricing.private_min_pax,
                    private_min_pax_net_rate: body.pricing.private_min_pax_net_rate,
                    extra_fees: body.pricing.extra_fees,
                },
            });

            // 3. Create TourLogistics
            await tx.tourLogistics.create({
                data: {
                    tour_id: newTour.id,
                    duration: body.logistics?.duration,
                    days_of_operation: body.logistics?.days_of_operation,
                    cxl_policy: body.logistics?.cxl_policy,
                    meeting_point_info: body.logistics?.meeting_point_info,
                    pickup_info: body.logistics?.pickup_info,
                },
            });

            // 4. Create TourAssets
            await tx.tourAssets.create({
                data: {
                    tour_id: newTour.id,
                    pictures_url: body.assets?.pictures_url,
                    landing_page_url: body.assets?.landing_page_url,
                    storytelling_url: body.assets?.storytelling_url,
                    notes: body.assets?.notes,
                    capture_status: body.assets?.capture_status ?? false,
                },
            });

            // 5. Create TourDistribution
            await tx.tourDistribution.create({
                data: {
                    tour_id: newTour.id,
                    website_markup: body.distribution?.website_markup,
                    marketplace_bokun_markup: body.distribution?.marketplace_bokun_markup,
                    marketplace_b2b_markup: body.distribution?.marketplace_b2b_markup,
                    project_expedition_id: body.distribution?.project_expedition_id,
                    project_expedition_status: body.distribution?.project_expedition_status,
                    expedia_id: body.distribution?.expedia_id,
                    expedia_status: body.distribution?.expedia_status,
                    viator_id: body.distribution?.viator_id,
                    viator_commission_percent: body.distribution?.viator_commission_percent,
                    viator_status: body.distribution?.viator_status,
                    klook_id: body.distribution?.klook_id,
                    klook_status: body.distribution?.klook_status,
                    tur_com_status: body.distribution?.tur_com_status,
                    tourist_com_status: body.distribution?.tourist_com_status,
                    headout_status: body.distribution?.headout_status,
                    tourradar_status: body.distribution?.tourradar_status,
                },
            });

            // 6. Create Variants
            if (body.variants && Array.isArray(body.variants)) {
                await tx.tourVariant.createMany({
                    data: body.variants.map((variant: any) => ({
                        tour_id: newTour.id,
                        name: variant.name,
                        description: variant.description,
                        net_rate_adult: Number(variant.net_rate_adult),
                        net_rate_child: variant.net_rate_child ? Number(variant.net_rate_child) : null,
                        duration: variant.duration,
                        is_active: variant.is_active ?? true,
                    })),
                });
            }

            // 7. Create Custom Field Values
            if (body.custom_fields && Array.isArray(body.custom_fields)) {
                await tx.tourCustomFieldValue.createMany({
                    data: body.custom_fields.map((field: any) => ({
                        tour_id: newTour.id,
                        definition_id: Number(field.definition_id),
                        value: String(field.value),
                    })),
                });
            }

            // 8. Create TourAudit (will be calculated next)
            await tx.tourAudit.create({
                data: {
                    tour_id: newTour.id,
                },
            });

            return newTour;
        });

        // 9. Fetch complete tour with relations for health assessment
        const completeTour = await prisma.tour.findUnique({
            where: { id: tour.id },
            include: {
                pricing: true,
                logistics: true,
                assets: true,
                distribution: true,
                audit: true,
            },
        });

        if (!completeTour) {
            throw new Error('Failed to fetch created tour');
        }

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
        await prisma.tourAudit.update({
            where: { tour_id: completeTour.id },
            data: {
                product_health_score: healthCheck.status,
                otas_distribution_score: otaScore,
                is_suitable_for_global_distribution: isSuitable,
            },
        });

        // 14. Fetch final tour with updated audit
        const finalTour = await prisma.tour.findUnique({
            where: { id: tour.id },
            include: {
                pricing: true,
                logistics: true,
                assets: true,
                distribution: true,
                audit: true,
            },
        });

        return NextResponse.json({
            success: true,
            data: finalTour,
            health: healthCheck,
            message: 'Tour created successfully and health assessment completed',
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating tour:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create tour' },
            { status: 500 }
        );
    }
}
// DELETE /api/tours - Clear all tours or specific tours
export async function DELETE(request: NextRequest) {
    try {
        let ids: number[] | undefined;

        try {
            const body = await request.json();
            if (body.ids && Array.isArray(body.ids)) {
                ids = body.ids;
            }
        } catch (e) {
            // No body or invalid JSON, proceed with delete all (or handle as needed)
        }

        let deleteResult;
        if (ids && ids.length > 0) {
            deleteResult = await prisma.tour.deleteMany({
                where: {
                    id: { in: ids }
                }
            });
        } else {
            deleteResult = await prisma.tour.deleteMany({});
        }

        return NextResponse.json({
            success: true,
            message: `Deleted ${deleteResult.count} tours`,
            count: deleteResult.count
        });
    } catch (error) {
        console.error('Error clearing tours:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to clear tours' },
            { status: 500 }
        );
    }
}

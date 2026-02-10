/**
 * SAT Connect - Individual Tour API Routes
 * GET /api/tours/[id] - Get tour details
 * PUT /api/tours/[id] - Update tour (recalculates health)
 * DELETE /api/tours/[id] - Delete tour
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { assessProductHealth } from '@/services/healthService';
import { calculateTourPricing } from '@/services/pricingService';
import { calculateOTADistributionScore, checkGlobalSuitability } from '@/services/distributionService';

// GET /api/tours/[id] - Get single tour with all relations
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const tourId = parseInt(id);

        if (isNaN(tourId)) {
            return NextResponse.json(
                { success: false, error: 'Invalid tour ID' },
                { status: 400 }
            );
        }

        const tour = await prisma.tour.findUnique({
            where: { id: tourId },
            include: {
                pricing: true,
                logistics: true,
                assets: true,
                distribution: true,
                audit: true,
                change_logs: {
                    where: { field_name: 'notes' },
                    orderBy: { created_at: 'desc' },
                    take: 3,
                },
                variants: {
                    where: { is_active: true }
                },
                custom_fields: {
                    include: {
                        definition: true
                    }
                }
            },
        });

        if (!tour) {
            return NextResponse.json(
                { success: false, error: 'Tour not found' },
                { status: 404 }
            );
        }

        // Calculate pricing fields
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

        return NextResponse.json({
            success: true,
            data: {
                ...tour,
                calculations,
            },
        });
    } catch (error) {
        console.error('Error fetching tour:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch tour' },
            { status: 500 }
        );
    }
}

// PUT /api/tours/[id] - Update tour
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const tourId = parseInt(id);
        const body = await request.json();

        if (isNaN(tourId)) {
            return NextResponse.json(
                { success: false, error: 'Invalid tour ID' },
                { status: 400 }
            );
        }

        // Update tour in transaction
        await prisma.$transaction(async (tx) => {
            // Update Tour core fields
            if (body.product_name || body.supplier || body.location || body.is_active !== undefined || body.is_audited !== undefined) {
                await tx.tour.update({
                    where: { id: tourId },
                    data: {
                        product_name: body.product_name,
                        supplier: body.supplier,
                        location: body.location,
                        bokun_id: body.bokun_id,
                        bokun_marketplace_status: body.bokun_marketplace_status,
                        bokun_status: body.bokun_status,
                        is_active: body.is_active,
                        is_audited: body.is_audited,
                    },
                });
            }

            // Update Pricing
            if (body.pricing) {
                await tx.tourPricing.update({
                    where: { tour_id: tourId },
                    data: {
                        net_rate_adult: body.pricing.net_rate_adult,
                        shared_factor: body.pricing.shared_factor,
                        net_rate_child: body.pricing.net_rate_child,
                        infant_age_threshold: body.pricing.infant_age_threshold,
                        shared_min_pax: body.pricing.shared_min_pax,
                        net_rate_private: body.pricing.net_rate_private,
                        private_factor: body.pricing.private_factor,
                        private_min_pax: body.pricing.private_min_pax,
                        private_min_pax_net_rate: body.pricing.private_min_pax_net_rate,
                        extra_fees: body.pricing.extra_fees,
                    },
                });
            }

            // Update Logistics
            if (body.logistics) {
                await tx.tourLogistics.update({
                    where: { tour_id: tourId },
                    data: {
                        duration: body.logistics.duration,
                        days_of_operation: body.logistics.days_of_operation,
                        cxl_policy: body.logistics.cxl_policy,
                        meeting_point_info: body.logistics.meeting_point_info,
                        pickup_info: body.logistics.pickup_info,
                    },
                });
            }

            // Update Assets
            if (body.assets) {
                await tx.tourAssets.update({
                    where: { tour_id: tourId },
                    data: {
                        pictures_url: body.assets.pictures_url,
                        landing_page_url: body.assets.landing_page_url,
                        storytelling_url: body.assets.storytelling_url,
                        notes: body.assets.notes,
                        capture_status: body.assets.capture_status,
                    },
                });
            }

            // Update Distribution
            if (body.distribution) {
                await tx.tourDistribution.update({
                    where: { tour_id: tourId },
                    data: {
                        website_markup: body.distribution.website_markup,
                        marketplace_bokun_markup: body.distribution.marketplace_bokun_markup,
                        marketplace_b2b_markup: body.distribution.marketplace_b2b_markup,

                        project_expedition_id: body.distribution.project_expedition_id,
                        project_expedition_status: body.distribution.project_expedition_status,
                        project_expedition_commission: body.distribution.project_expedition_commission,

                        expedia_id: body.distribution.expedia_id,
                        expedia_status: body.distribution.expedia_status,
                        expedia_commission: body.distribution.expedia_commission,

                        viator_id: body.distribution.viator_id,
                        viator_commission_percent: body.distribution.viator_commission_percent,
                        viator_status: body.distribution.viator_status,

                        klook_id: body.distribution.klook_id,
                        klook_status: body.distribution.klook_status,
                        klook_commission: body.distribution.klook_commission,

                        tur_com_status: body.distribution.tur_com_status,
                        tur_com_commission: body.distribution.tur_com_commission,

                        tourist_com_status: body.distribution.tourist_com_status,
                        tourist_com_commission: body.distribution.tourist_com_commission,

                        headout_status: body.distribution.headout_status,
                        headout_commission: body.distribution.headout_commission,

                        tourradar_status: body.distribution.tourradar_status,
                        tourradar_commission: body.distribution.tourradar_commission,
                    },
                });
            }

            // Update Variants
            if (body.variants && Array.isArray(body.variants)) {
                // 1. Get existing variant IDs
                const existingVariants = await tx.tourVariant.findMany({
                    where: { tour_id: tourId },
                    select: { id: true }
                });
                const existingIds = existingVariants.map(v => v.id);

                // 2. Identify variants to delete (existing but not in body)
                const bodyVariantIds = body.variants
                    .map((v: any) => v.id)
                    .filter((id: any) => id && typeof id === 'number');

                const idsToDelete = existingIds.filter(id => !bodyVariantIds.includes(id));

                if (idsToDelete.length > 0) {
                    await tx.tourVariant.deleteMany({
                        where: { id: { in: idsToDelete } }
                    });
                }

                // 3. Upsert variants
                for (const variant of body.variants) {
                    if (variant.id && typeof variant.id === 'number') {
                        // Update
                        await tx.tourVariant.update({
                            where: { id: variant.id },
                            data: {
                                name: variant.name,
                                description: variant.description,
                                net_rate_adult: Number(variant.net_rate_adult),
                                net_rate_child: variant.net_rate_child ? Number(variant.net_rate_child) : null,
                                duration: variant.duration,
                                is_active: variant.is_active,
                            }
                        });
                    } else {
                        // Create
                        await tx.tourVariant.create({
                            data: {
                                tour_id: tourId,
                                name: variant.name,
                                description: variant.description,
                                net_rate_adult: Number(variant.net_rate_adult),
                                net_rate_child: variant.net_rate_child ? Number(variant.net_rate_child) : null,
                                duration: variant.duration,
                                is_active: variant.is_active ?? true,
                            }
                        });
                    }
                }
            }

            // Update Custom Fields
            if (body.custom_fields && Array.isArray(body.custom_fields)) {
                // Upsert custom fields based on definition_id
                for (const field of body.custom_fields) {
                    await tx.tourCustomFieldValue.upsert({
                        where: {
                            tour_id_definition_id: {
                                tour_id: tourId,
                                definition_id: Number(field.definition_id)
                            }
                        },
                        update: {
                            value: String(field.value)
                        },
                        create: {
                            tour_id: tourId,
                            definition_id: Number(field.definition_id),
                            value: String(field.value)
                        }
                    });
                }
            }
        });

        // Recalculate health assessment
        const updatedTour = await prisma.tour.findUnique({
            where: { id: tourId },
            include: {
                pricing: true,
                logistics: true,
                assets: true,
                distribution: true,
                audit: true,
            },
        });

        if (updatedTour) {
            const healthCheck = assessProductHealth(updatedTour);
            const otaScore = updatedTour.distribution
                ? calculateOTADistributionScore(updatedTour.distribution)
                : 0;

            const isSuitable = checkGlobalSuitability(
                healthCheck.status,
                updatedTour.pricing
                    ? {
                        suggested_pvp_adult: calculateTourPricing({
                            net_rate_adult: updatedTour.pricing.net_rate_adult,
                            shared_factor: updatedTour.pricing.shared_factor,
                            net_rate_child: updatedTour.pricing.net_rate_child,
                            net_rate_private: updatedTour.pricing.net_rate_private,
                            private_factor: updatedTour.pricing.private_factor,
                            private_min_pax: updatedTour.pricing.private_min_pax,
                            private_min_pax_net_rate: updatedTour.pricing.private_min_pax_net_rate,
                        }).suggestedPvpAdult,
                        net_rate_adult: updatedTour.pricing.net_rate_adult,
                    }
                    : undefined,
                updatedTour.logistics?.cxl_policy
            );

            await prisma.tourAudit.update({
                where: { tour_id: tourId },
                data: {
                    product_health_score: healthCheck.status,
                    otas_distribution_score: otaScore,
                    is_suitable_for_global_distribution: isSuitable,
                },
            });
        }

        // Fetch final updated tour
        const finalTour = await prisma.tour.findUnique({
            where: { id: tourId },
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
            message: 'Tour updated successfully and health recalculated',
        });
    } catch (error) {
        console.error('Error updating tour:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update tour' },
            { status: 500 }
        );
    }
}

// DELETE /api/tours/[id] - Delete tour
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const tourId = parseInt(id);

        if (isNaN(tourId)) {
            return NextResponse.json(
                { success: false, error: 'Invalid tour ID' },
                { status: 400 }
            );
        }

        // Delete tour (cascade will delete all related entities)
        await prisma.tour.delete({
            where: { id: tourId },
        });

        return NextResponse.json({
            success: true,
            message: 'Tour deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting tour:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete tour' },
            { status: 500 }
        );
    }
}

/**
 * SAT Connect - Individual Tour API Routes
 * GET /api/tours/[id] - Get tour details
 * PUT /api/tours/[id] - Update tour (recalculates health)
 * DELETE /api/tours/[id] - Delete tour
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { assessProductHealth } from '@/services/healthService';
import { calculateTourPricing } from '@/services/pricingService';
import { calculateOTADistributionScore, checkGlobalSuitability } from '@/services/distributionService';

const prisma = new PrismaClient();

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
                        expedia_id: body.distribution.expedia_id,
                        expedia_status: body.distribution.expedia_status,
                        viator_id: body.distribution.viator_id,
                        viator_commission_percent: body.distribution.viator_commission_percent,
                        viator_status: body.distribution.viator_status,
                        klook_id: body.distribution.klook_id,
                        klook_status: body.distribution.klook_status,
                        tur_com_status: body.distribution.tur_com_status,
                        tourist_com_status: body.distribution.tourist_com_status,
                        headout_status: body.distribution.headout_status,
                        tourradar_status: body.distribution.tourradar_status,
                    },
                });
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

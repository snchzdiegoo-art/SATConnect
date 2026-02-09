/**
 * SAT Connect - Tour Audit API Route
 * POST /api/tours/audit - Re-audit all or selected tours
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { assessProductHealth } from '@/services/healthService';
import { calculateOTADistributionScore, checkGlobalSuitability } from '@/services/distributionService';
import { calculateTourPricing } from '@/services/pricingService';

const prisma = new PrismaClient();

// POST /api/tours/audit - Batch audit operation
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { tourIds } = body; // Optional: specific tour IDs to audit

        // Build where clause
        const where = tourIds && tourIds.length > 0
            ? { id: { in: tourIds.map((id: string) => parseInt(id)) } }
            : {};

        // Fetch all tours to audit
        const tours = await prisma.tour.findMany({
            where,
            include: {
                pricing: true,
                logistics: true,
                assets: true,
                distribution: true,
                audit: true,
            },
        });

        const results = {
            total: tours.length,
            updated: 0,
            healthy: 0,
            incomplete: 0,
            auditRequired: 0,
            errors: [] as string[],
        };

        // Process each tour
        for (const tour of tours) {
            try {
                // Assess health
                const healthCheck = assessProductHealth(tour);

                // Calculate OTA score
                const otaScore = tour.distribution
                    ? calculateOTADistributionScore(tour.distribution)
                    : 0;

                // Check global suitability
                const isSuitable = checkGlobalSuitability(
                    healthCheck.status,
                    tour.pricing
                        ? {
                            suggested_pvp_adult: calculateTourPricing({
                                net_rate_adult: tour.pricing.net_rate_adult,
                                shared_factor: tour.pricing.shared_factor,
                                net_rate_child: tour.pricing.net_rate_child,
                                net_rate_private: tour.pricing.net_rate_private,
                                private_factor: tour.pricing.private_factor,
                                private_min_pax: tour.pricing.private_min_pax,
                                private_min_pax_net_rate: tour.pricing.private_min_pax_net_rate,
                            }).suggestedPvpAdult,
                            net_rate_adult: tour.pricing.net_rate_adult,
                        }
                        : undefined,
                    tour.logistics?.cxl_policy
                );

                // Update audit record
                await prisma.tourAudit.update({
                    where: { tour_id: tour.id },
                    data: {
                        product_health_score: healthCheck.status,
                        otas_distribution_score: otaScore,
                        is_suitable_for_global_distribution: isSuitable,
                    },
                });

                results.updated++;

                // Count by status
                if (healthCheck.status === 'HEALTHY') results.healthy++;
                else if (healthCheck.status === 'INCOMPLETE') results.incomplete++;
                else if (healthCheck.status === 'AUDIT_REQUIRED') results.auditRequired++;

            } catch (error) {
                console.error(`Error auditing tour ${tour.id}:`, error);
                results.errors.push(`Tour ${tour.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully audited ${results.updated} of ${results.total} tours`,
            results,
        });

    } catch (error) {
        console.error('Error in batch audit:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to perform batch audit' },
            { status: 500 }
        );
    }
}

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface GatekeeperResult {
    can_distribute: boolean;
    reasons: string[];
    health_score: number;
}

/**
 * THE GATEKEEPER
 * Core THRIVE Engine logic to validate if a product is ready for distribution.
 * 
 * Rules:
 * 1. Health Score must be >= 80
 * 2. Risk Policy must be 'VALID'
 * 3. Profit Shield must be active (PVP >= Net Cost + Margin)
 */
export async function validateProduct(tourId: number): Promise<GatekeeperResult> {
    const tour = await prisma.tour.findUnique({
        where: { id: tourId },
        include: {
            audit: true,
            pricing: true,
            logistics: true,
            assets: true
        }
    });

    if (!tour) {
        throw new Error(`Tour ${tourId} not found`);
    }

    const reasons: string[] = [];
    let is_healthy = true;

    // 1. Health Score Check
    // In a real implementation, this would be a dynamic calculation. 
    // For now, we rely on the stored quality_score or calculate a simple one.
    const audit = tour.audit;
    const health_score = audit?.quality_score || calculateRuntimeHealthScore(tour);

    if (health_score < 80) {
        is_healthy = false;
        reasons.push(`Health Score is too low (${health_score}/100). Minimum 80 required.`);
    }

    // 2. Risk Policy Check
    if (audit?.risk_policy_status !== 'VALID') {
        is_healthy = false;
        reasons.push(`Risk Policy is ${audit?.risk_policy_status || 'MISSING'}. Must be 'VALID'.`);
    }

    // 3. Profit Shield Check
    // Ensures we are not selling below cost + margin
    if (audit?.profit_shield_status === false) {
        is_healthy = false;
        reasons.push('Profit Shield Violated: Public Price is too close to Net Cost.');
    }

    // 4. Critical Data Check (Fallback)
    if (!tour.product_name || tour.product_name.length < 10) {
        is_healthy = false;
        reasons.push('Product Name is too short or missing.');
    }

    return {
        can_distribute: is_healthy,
        reasons,
        health_score
    };
}

function calculateRuntimeHealthScore(tour: any): number {
    let score = 0;
    const weights = {
        name: 10,
        images: 30,
        pricing: 20,
        description: 20,
        logistics: 20
    };

    if (tour.product_name?.length > 10) score += weights.name;
    if (tour.assets?.pictures_url || (tour.assets?.pictures && tour.assets.pictures.length > 0)) score += weights.images;
    if (tour.pricing?.net_rate_adult) score += weights.pricing;
    if (tour.assets?.storytelling_content || tour.assets?.landing_page_url) score += weights.description;
    if (tour.logistics?.duration && tour.logistics?.cxl_policy) score += weights.logistics;

    return score;
}

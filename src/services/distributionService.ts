/**
 * SAT Connect - T.H.R.I.V.E. Engine Distribution Service
 * Global Distribution Suitability & OTA Scoring Module
 */

import { Decimal } from '@prisma/client/runtime/library';
import { HealthStatus } from './healthService';

export interface OTAChannel {
    name: string;
    id?: string | number | null;
    status?: string | null;
    commissionPercent?: Decimal | null;
    isActive: boolean;
}

export interface DistributionCheck {
    isSuitable: boolean;
    otaScore: number;
    activeChannels: string[];
    issues: string[];
}

/**
 * Check if tour is suitable for global distribution
 * 
 * Distribution Criteria:
 * - Product health must be HEALTHY
 * - No negative price parity (Internal PVP > OTA Price)
 * - Clear cancellation policies
 * 
 * @param healthStatus - Product health status
 * @param pricing - Pricing information for parity check
 * @param cxlPolicy - Cancellation policy
 * @returns True if suitable for global distribution
 */
export function checkGlobalSuitability(
    healthStatus: HealthStatus,
    pricing?: {
        suggested_pvp_adult: Decimal;
        net_rate_adult: Decimal;
    },
    cxlPolicy?: string | null
): boolean {
    // Gate 1: Must be HEALTHY
    if (healthStatus !== 'HEALTHY') {
        return false;
    }

    // Gate 2: Must have clear CXL policy
    if (!cxlPolicy || cxlPolicy.trim() === '') {
        return false;
    }

    // Gate 3: Price parity check (prevent selling at loss)
    if (pricing) {
        // Internal PVP should be greater than Net Rate
        if (pricing.suggested_pvp_adult.lessThanOrEqualTo(pricing.net_rate_adult)) {
            return false; // Negative parity detected
        }
    }

    return true;
}

/**
 * Calculate OTA Distribution Score (0-100)
 * 
 * Scoring System:
 * - Viator Active: +20 points
 * - Expedia Active: +20 points
 * - Project Expedition Active: +20 points
 * - Klook Active: +20 points
 * - Marketplace B2B Active: +20 points
 * 
 * @param distribution - Tour distribution data
 * @returns Score from 0 to 100
 */
export function calculateOTADistributionScore(distribution: {
    viator_status?: string | null;
    expedia_status?: string | null;
    project_expedition_status?: string | null;
    klook_status?: string | null;
    marketplace_b2b_markup?: Decimal | null;
    tur_com_status?: string | null;
    tourist_com_status?: string | null;
    headout_status?: string | null;
    tourradar_status?: string | null;
}): number {
    let score = 0;

    // Active status keywords
    const activeStatuses = ['active', 'published', 'live', 'enabled'];

    // Helper function to check if status is active
    const isActive = (status?: string | null): boolean => {
        if (!status) return false;
        return activeStatuses.some((active) =>
            status.toLowerCase().includes(active)
        );
    };

    // Primary Channels (20 points each)
    if (isActive(distribution.viator_status)) score += 20;
    if (isActive(distribution.expedia_status)) score += 20;
    if (isActive(distribution.project_expedition_status)) score += 20;
    if (isActive(distribution.klook_status)) score += 20;

    // Marketplace B2B (20 points if markup is set)
    if (distribution.marketplace_b2b_markup && distribution.marketplace_b2b_markup.greaterThan(0)) {
        score += 20;
    }

    return Math.min(100, score);
}

/**
 * Get all active OTA channels for a tour
 * 
 * @param distribution - Tour distribution data
 * @returns List of active channel names
 */
export function getActiveOTAChannels(distribution: {
    viator_status?: string | null;
    expedia_status?: string | null;
    project_expedition_status?: string | null;
    klook_status?: string | null;
    tur_com_status?: string | null;
    tourist_com_status?: string | null;
    headout_status?: string | null;
    tourradar_status?: string | null;
    marketplace_b2b_markup?: Decimal | null;
}): string[] {
    const activeChannels: string[] = [];
    const activeStatuses = ['active', 'published', 'live', 'enabled'];

    const isActive = (status?: string | null): boolean => {
        if (!status) return false;
        return activeStatuses.some((active) =>
            status.toLowerCase().includes(active)
        );
    };

    if (isActive(distribution.viator_status)) activeChannels.push('Viator');
    if (isActive(distribution.expedia_status)) activeChannels.push('Expedia');
    if (isActive(distribution.project_expedition_status)) activeChannels.push('Project Expedition');
    if (isActive(distribution.klook_status)) activeChannels.push('Klook');
    if (isActive(distribution.tur_com_status)) activeChannels.push('Tur.com');
    if (isActive(distribution.tourist_com_status)) activeChannels.push('Tourist.com');
    if (isActive(distribution.headout_status)) activeChannels.push('Headout');
    if (isActive(distribution.tourradar_status)) activeChannels.push('TourRadar');

    if (distribution.marketplace_b2b_markup && distribution.marketplace_b2b_markup.greaterThan(0)) {
        activeChannels.push('Marketplace B2B');
    }

    return activeChannels;
}

/**
 * Comprehensive distribution assessment
 * 
 * @param healthStatus - Product health status
 * @param distribution - Distribution data
 * @param pricing - Pricing data
 * @param cxlPolicy - Cancellation policy
 * @returns Complete distribution check result
 */
export function assessDistribution(
    healthStatus: HealthStatus,
    distribution: {
        viator_status?: string | null;
        expedia_status?: string | null;
        project_expedition_status?: string | null;
        klook_status?: string | null;
        marketplace_b2b_markup?: Decimal | null;
        tur_com_status?: string | null;
        tourist_com_status?: string | null;
        headout_status?: string | null;
        tourradar_status?: string | null;
    },
    pricing?: {
        suggested_pvp_adult: Decimal;
        net_rate_adult: Decimal;
    },
    cxlPolicy?: string | null
): DistributionCheck {
    const issues: string[] = [];

    // Calculate OTA score
    const otaScore = calculateOTADistributionScore(distribution);
    const activeChannels = getActiveOTAChannels(distribution);

    // Check global suitability
    const isSuitable = checkGlobalSuitability(healthStatus, pricing, cxlPolicy);

    // Identify issues
    if (healthStatus !== 'HEALTHY') {
        issues.push('Product health must be HEALTHY for global distribution');
    }

    if (!cxlPolicy || cxlPolicy.trim() === '') {
        issues.push('Cancellation policy is required for distribution');
    }

    if (pricing && pricing.suggested_pvp_adult.lessThanOrEqualTo(pricing.net_rate_adult)) {
        issues.push('Negative price parity detected (PVP <= Net Rate)');
    }

    if (otaScore === 0) {
        issues.push('No active OTA channels detected');
    }

    return {
        isSuitable,
        otaScore,
        activeChannels,
        issues,
    };
}

/**
 * Get OTA score rating label
 * 
 * @param score - OTA distribution score (0-100)
 * @returns Rating label
 */
export function getOTAScoreRating(score: number): {
    label: string;
    variant: 'default' | 'success' | 'warning' | 'destructive';
} {
    if (score >= 80) {
        return { label: 'Excellent Distribution', variant: 'success' };
    } else if (score >= 60) {
        return { label: 'Good Distribution', variant: 'default' };
    } else if (score >= 40) {
        return { label: 'Moderate Distribution', variant: 'warning' };
    } else if (score > 0) {
        return { label: 'Limited Distribution', variant: 'warning' };
    } else {
        return { label: 'No Distribution', variant: 'destructive' };
    }
}

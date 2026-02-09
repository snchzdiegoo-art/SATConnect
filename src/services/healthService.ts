/**
 * SAT Connect - T.H.R.I.V.E. Engine Health Service
 * Product Health Score Assessment Module
 */

import { Decimal } from '@prisma/client/runtime/library';

export type HealthStatus = 'HEALTHY' | 'INCOMPLETE' | 'AUDIT_REQUIRED';

export interface TourHealthCheck {
    status: HealthStatus;
    issues: string[];
    score: number; // 0-100
}

export interface TourWithRelations {
    id: number;
    is_audited: boolean;
    pricing?: {
        net_rate_adult: Decimal;
        net_rate_child?: Decimal | null;
        shared_factor: Decimal;
    } | null;
    logistics?: {
        duration?: string | null;
        days_of_operation?: string | null;
        cxl_policy?: string | null;
        meeting_point_info?: string | null;
    } | null;
    assets?: {
        pictures_url?: string | null;
        storytelling_url?: string | null;
        landing_page_url?: string | null;
    } | null;
}

/**
 * Assess product health based on T.H.R.I.V.E. criteria
 * 
 * Health Criteria:
 * - INCOMPLETE: Missing critical pricing, content, or operational data
 * - AUDIT_REQUIRED: Marked as not audited
 * - HEALTHY: All critical fields populated and validated
 * 
 * @param tour - Tour with all related entities
 * @returns Health status and detailed issues
 */
export function assessProductHealth(tour: TourWithRelations): TourHealthCheck {
    const issues: string[] = [];
    let score = 100;

    // Check 1: Audit Status
    if (!tour.is_audited) {
        return {
            status: 'AUDIT_REQUIRED',
            issues: ['Product has not been audited by SAT team'],
            score: 0,
        };
    }

    // Check 2: Pricing Critical Fields
    if (!tour.pricing) {
        issues.push('Pricing information is missing');
        score -= 30;
    } else {
        // Net Rate Adult is mandatory
        if (!tour.pricing.net_rate_adult || tour.pricing.net_rate_adult.lessThanOrEqualTo(0)) {
            issues.push('Net Rate Adult is missing or invalid (must be > 0)');
            score -= 20;
        }

        // Shared Factor validation
        if (!tour.pricing.shared_factor || tour.pricing.shared_factor.lessThan(1.0)) {
            issues.push('Shared Factor is missing or invalid (must be >= 1.0)');
            score -= 10;
        }
    }

    // Check 3: Content Critical Fields
    if (!tour.assets) {
        issues.push('Asset information is missing');
        score -= 30;
    } else {
        // Pictures URL is mandatory
        if (!tour.assets.pictures_url || tour.assets.pictures_url.trim() === '') {
            issues.push('Pictures URL is missing');
            score -= 15;
        }

        // Storytelling URL is mandatory
        if (!tour.assets.storytelling_url || tour.assets.storytelling_url.trim() === '') {
            issues.push('Storytelling URL is missing');
            score -= 15;
        }
    }

    // Check 4: Operational Critical Fields
    if (!tour.logistics) {
        issues.push('Logistics information is missing');
        score -= 20;
    } else {
        // Duration is mandatory
        if (!tour.logistics.duration || tour.logistics.duration.trim() === '') {
            issues.push('Duration is missing');
            score -= 5;
        }

        // CXL Policy is mandatory
        if (!tour.logistics.cxl_policy || tour.logistics.cxl_policy.trim() === '') {
            issues.push('Cancellation Policy is missing');
            score -= 10;
        }

        // Meeting Point is highly recommended
        if (!tour.logistics.meeting_point_info || tour.logistics.meeting_point_info.trim() === '') {
            issues.push('Meeting Point information is missing (recommended)');
            score -= 5;
        }
    }

    // Determine final status
    const status: HealthStatus = issues.length === 0 ? 'HEALTHY' : 'INCOMPLETE';

    return {
        status,
        issues,
        score: Math.max(0, score),
    };
}

/**
 * Check if tour meets minimum requirements for activation
 * 
 * @param tour - Tour to validate
 * @returns True if tour can be activated
 */
export function canActivateTour(tour: TourWithRelations): boolean {
    const health = assessProductHealth(tour);

    // Minimum score of 70 required for activation
    return health.status === 'HEALTHY' || health.score >= 70;
}

/**
 * Get human-readable health status message
 * 
 * @param status - Health status
 * @returns User-friendly message
 */
export function getHealthStatusMessage(status: HealthStatus): string {
    const messages: Record<HealthStatus, string> = {
        HEALTHY: '⭐ Product is ready for global distribution',
        INCOMPLETE: '❌ Product has incomplete information and requires updates',
        AUDIT_REQUIRED: '⚠️ Product requires audit by SAT team before activation',
    };

    return messages[status];
}

/**
 * Get health status badge variant for UI
 * 
 * @param status - Health status
 * @returns Badge variant
 */
export function getHealthStatusBadge(status: HealthStatus): {
    variant: 'default' | 'success' | 'warning' | 'destructive';
    label: string;
} {
    const badges: Record<HealthStatus, { variant: 'default' | 'success' | 'warning' | 'destructive'; label: string }> = {
        HEALTHY: { variant: 'success', label: 'Healthy ⭐' },
        INCOMPLETE: { variant: 'destructive', label: 'Incomplete ❌' },
        AUDIT_REQUIRED: { variant: 'warning', label: 'Audit Required ⚠️' },
    };

    return badges[status];
}

/**
 * Validate specific field requirements
 * 
 * @param fieldName - Name of the field
 * @param value - Field value
 * @returns Validation result with message
 */
export function validateField(
    fieldName: string,
    value: unknown
): { isValid: boolean; message?: string } {
    // String fields: check not empty
    if (typeof value === 'string') {
        if (value.trim() === '') {
            return { isValid: false, message: `${fieldName} cannot be empty` };
        }
        return { isValid: true };
    }

    // Decimal fields: check > 0
    if (value instanceof Decimal) {
        if (value.lessThanOrEqualTo(0)) {
            return { isValid: false, message: `${fieldName} must be greater than 0` };
        }
        return { isValid: true };
    }

    // Null/undefined check
    if (value === null || value === undefined) {
        return { isValid: false, message: `${fieldName} is required` };
    }

    return { isValid: true };
}

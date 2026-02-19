/**
 * SAT Connect — Phase 2: Bidirectional Pricing Logic
 * Pure TypeScript functions. No Prisma dependency.
 * Used by API routes, import service, and UI calculations.
 */

// ---------------------------------------------------------------------------
//  Types
// ---------------------------------------------------------------------------

export interface PricingInputFull {
    /** Net rate from the supplier (cost basis) */
    net: number;
    /** Public selling price (PVP / public_rate) */
    public: number;
}

export interface PricingInputNetOnly {
    /** Net rate from the supplier */
    net: number;
    /**
     * Pricing factor to apply.
     * Defaults to 1.5 if omitted.
     * Typical range: 1.5 – 1.99
     */
    factor?: number;
}

export interface PricingInputPublicOnly {
    /** Known public price */
    public: number;
    /** Known factor (required when back-calculating net) */
    factor: number;
}

export interface PricingResult {
    net: number;
    public: number;
    factor: number;
    /** Margin percentage: (public - net) / public * 100 */
    margin_percent: number;
}

// ---------------------------------------------------------------------------
//  Constants
// ---------------------------------------------------------------------------

export const DEFAULT_FACTOR = 1.5;
export const FACTOR_MIN = 0.5;
export const FACTOR_MAX = 10.0;

// ---------------------------------------------------------------------------
//  Core Functions (Pure — no side effects)
// ---------------------------------------------------------------------------

/**
 * CASE A — Full Data: Both Net + Public are known.
 * Derives the Factor from them and returns a complete PricingResult.
 *
 * Use when: CSV row or form has both net_rate AND public_rate columns.
 *
 * @example
 *   deriveFromBothRates({ net: 1000, public: 1650 })
 *   // → { net: 1000, public: 1650, factor: 1.65, margin_percent: 39.39 }
 */
export function deriveFromBothRates(input: PricingInputFull): PricingResult {
    const { net, public: pub } = input;

    if (net <= 0) throw new RangeError('Net rate must be greater than 0');
    if (pub <= 0) throw new RangeError('Public rate must be greater than 0');

    const factor = roundFactor(pub / net);
    validateFactor(factor);

    return buildResult(net, pub, factor);
}

/**
 * CASE B — Net Only: Compute public price using a factor.
 * If no factor is provided, the default (1.5) is used.
 *
 * Use when: CSV row only has net_rate; public price needs to be suggested.
 *
 * @example
 *   computePublicFromNet({ net: 1000 })
 *   // → { net: 1000, public: 1500, factor: 1.5, margin_percent: 33.33 }
 *
 *   computePublicFromNet({ net: 1000, factor: 1.8 })
 *   // → { net: 1000, public: 1800, factor: 1.8, margin_percent: 44.44 }
 */
export function computePublicFromNet(input: PricingInputNetOnly): PricingResult {
    const { net, factor: rawFactor } = input;
    const factor = rawFactor ?? DEFAULT_FACTOR;

    if (net <= 0) throw new RangeError('Net rate must be greater than 0');
    validateFactor(factor);

    const pub = roundCurrency(net * factor);
    return buildResult(net, pub, factor);
}

/**
 * CASE C — Back-Calculate Net: Derive net from known public + factor.
 * Useful for verifying or reverse-engineering a net rate.
 *
 * @example
 *   computeNetFromPublic({ public: 1500, factor: 1.5 })
 *   // → { net: 1000, public: 1500, factor: 1.5, margin_percent: 33.33 }
 */
export function computeNetFromPublic(input: PricingInputPublicOnly): PricingResult {
    const { public: pub, factor } = input;

    if (pub <= 0) throw new RangeError('Public rate must be greater than 0');
    validateFactor(factor);

    const net = roundCurrency(pub / factor);
    return buildResult(net, pub, factor);
}

/**
 * Smart resolver: decides which case to apply based on the inputs provided.
 * - Both net + public → Case A
 * - Net only          → Case B (uses factor or default)
 * - Public + factor   → Case C
 *
 * This is the recommended entry point for import pipelines and API handlers.
 */
export function resolvePricing(input: {
    net?: number | null;
    public?: number | null;
    factor?: number | null;
}): PricingResult {
    const hasNet = input.net != null && input.net > 0;
    const hasPub = input.public != null && input.public > 0;
    const hasFactor = input.factor != null && input.factor > 0;

    if (hasNet && hasPub) {
        // Case A: Full data — derive factor
        return deriveFromBothRates({ net: input.net!, public: input.public! });
    }

    if (hasNet) {
        // Case B: Net only — compute public
        return computePublicFromNet({
            net: input.net!,
            factor: hasFactor ? input.factor! : DEFAULT_FACTOR,
        });
    }

    if (hasPub && hasFactor) {
        // Case C: Back-calculate net
        return computeNetFromPublic({ public: input.public!, factor: input.factor! });
    }

    throw new Error(
        'Insufficient pricing data. Provide at least: net, OR net + factor, OR public + factor.'
    );
}

/**
 * Calculate net revenue after an OTA commission.
 *
 * @param pvp              Public Selling Price
 * @param commissionPercent Commission % (0-100)
 * @returns Net revenue after commission deduction
 *
 * @example calcNetRevenue(1650, 25) → 1237.5
 */
export function calcNetRevenue(pvp: number, commissionPercent: number): number {
    if (commissionPercent < 0 || commissionPercent > 100) {
        throw new RangeError('Commission percent must be between 0 and 100');
    }
    return roundCurrency(pvp * (1 - commissionPercent / 100));
}

/**
 * Calculate effective commission for a channel.
 * Applies Founder Program logic: Viator = 0% for first 6 months.
 */
export function getEffectiveCommission(
    channelName: string,
    baseCommission: number,
    options?: {
        supplierPlan?: 'FOUNDER' | 'STANDARD';
        accountAgeMonths?: number;
        overrideCommission?: number | null;
    }
): number {
    // If there's a per-tour override, use it
    if (options?.overrideCommission != null) {
        return options.overrideCommission;
    }

    // Founder Program: 0% commission on Viator for first 6 months
    if (
        options?.supplierPlan === 'FOUNDER' &&
        channelName.toLowerCase() === 'viator' &&
        options.accountAgeMonths !== undefined &&
        options.accountAgeMonths < 6
    ) {
        return 0;
    }

    return baseCommission;
}

// ---------------------------------------------------------------------------
//  Seasonal Rate Helpers
// ---------------------------------------------------------------------------

export interface SeasonalRate {
    from: string; // ISO date string YYYY-MM-DD
    to: string;
    net_rate_adult: number;
    net_rate_child?: number | null;
    factor?: number;
}

/**
 * Find the applicable seasonal rate for a given date.
 * Falls back to base pricing if no season matches.
 */
export function findSeasonalRate(
    date: Date,
    seasons: SeasonalRate[]
): SeasonalRate | null {
    const ts = date.getTime();
    for (const season of seasons) {
        const from = new Date(season.from).getTime();
        const to = new Date(season.to).getTime();
        if (ts >= from && ts <= to) {
            return season;
        }
    }
    return null;
}

// ---------------------------------------------------------------------------
//  Utilities (internal)
// ---------------------------------------------------------------------------

function validateFactor(factor: number): void {
    if (factor < FACTOR_MIN || factor > FACTOR_MAX) {
        throw new RangeError(
            `Pricing factor ${factor} is out of range [${FACTOR_MIN}, ${FACTOR_MAX}]`
        );
    }
}

function buildResult(net: number, pub: number, factor: number): PricingResult {
    const margin_percent = roundPercent(((pub - net) / pub) * 100);
    return {
        net: roundCurrency(net),
        public: roundCurrency(pub),
        factor: roundFactor(factor),
        margin_percent,
    };
}

function roundCurrency(value: number): number {
    return Math.round(value * 100) / 100;
}

function roundFactor(value: number): number {
    return Math.round(value * 100000) / 100000;
}

function roundPercent(value: number): number {
    return Math.round(value * 100) / 100;
}

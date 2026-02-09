/**
 * SAT Connect - T.H.R.I.V.E. Engine Pricing Service
 * Revenue Optimization Module
 */

import { Decimal } from '@prisma/client/runtime/library';

export interface PricingCalculation {
    suggestedPvpAdult: Decimal;
    suggestedPvpChild: Decimal | null;
    suggestedPvpPrivate: Decimal | null;
    perPaxCost: Decimal | null;
}

export interface CurrencyConversion {
    baseCurrency: 'USD' | 'MXN';
    targetCurrency: 'USD' | 'MXN';
    exchangeRate: number;
}

/**
 * Calculate Suggested Public Price (PVP) using T.H.R.I.V.E. formula
 * Formula: PVP = Net Rate × Factor
 * 
 * @param netRate - Net rate from supplier
 * @param factor - Pricing factor (default: 1.5, range: 1.5-1.99)
 * @returns Calculated suggested PVP
 */
export function calculateSuggestedPVP(
    netRate: Decimal | number,
    factor?: Decimal | number
): Decimal {
    const rate = new Decimal(netRate);
    const pricingFactor = factor ? new Decimal(factor) : new Decimal(1.5);

    // Validación: factor debe estar entre 1.0 y 2.0
    if (pricingFactor.lessThan(1.0) || pricingFactor.greaterThan(2.0)) {
        throw new Error('Pricing factor must be between 1.0 and 2.0');
    }

    return rate.mul(pricingFactor);
}

/**
 * Calculate Per Pax Cost for private tours
 * Formula: Per Pax = Private Net Rate / Min Pax
 * 
 * @param privateNetRate - Private minimum pax net rate
 * @param minPax - Minimum number of passengers
 * @returns Cost per passenger
 */
export function calculatePerPaxCost(
    privateNetRate: Decimal | number,
    minPax: number
): Decimal {
    if (minPax <= 0) {
        throw new Error('Minimum pax must be greater than 0');
    }

    const rate = new Decimal(privateNetRate);
    return rate.div(minPax);
}

/**
 * Calculate all pricing fields for a tour
 * 
 * @param pricing - Tour pricing data
 * @returns Complete pricing calculations
 */
export function calculateTourPricing(pricing: {
    net_rate_adult: Decimal;
    shared_factor: Decimal;
    net_rate_child?: Decimal | null;
    net_rate_private?: Decimal | null;
    private_factor: Decimal;
    private_min_pax?: number | null;
    private_min_pax_net_rate?: Decimal | null;
}): PricingCalculation {
    // Shared Adult PVP
    const suggestedPvpAdult = calculateSuggestedPVP(
        pricing.net_rate_adult,
        pricing.shared_factor
    );

    // Shared Child PVP (if applicable)
    const suggestedPvpChild = pricing.net_rate_child
        ? calculateSuggestedPVP(pricing.net_rate_child, pricing.shared_factor)
        : null;

    // Private PVP (if applicable)
    const suggestedPvpPrivate = pricing.private_min_pax_net_rate
        ? calculateSuggestedPVP(
            pricing.private_min_pax_net_rate,
            pricing.private_factor
        )
        : null;

    // Per Pax Cost (if applicable)
    const perPaxCost =
        pricing.private_min_pax_net_rate && pricing.private_min_pax
            ? calculatePerPaxCost(
                pricing.private_min_pax_net_rate,
                pricing.private_min_pax
            )
            : null;

    return {
        suggestedPvpAdult,
        suggestedPvpChild,
        suggestedPvpPrivate,
        perPaxCost,
    };
}

/**
 * Convert currency using configurable exchange rate
 * For T.H.R.I.V.E., typical conversion is MXN to USD
 * 
 * @param amount - Amount to convert
 * @param conversion - Currency conversion parameters
 * @returns Converted amount
 */
export function convertCurrency(
    amount: Decimal | number,
    conversion: CurrencyConversion
): Decimal {
    const value = new Decimal(amount);

    // Si las monedas son iguales, no hay conversión
    if (conversion.baseCurrency === conversion.targetCurrency) {
        return value;
    }

    // MXN -> USD: divide por exchange rate
    if (conversion.baseCurrency === 'MXN' && conversion.targetCurrency === 'USD') {
        return value.div(conversion.exchangeRate);
    }

    // USD -> MXN: multiplica por exchange rate
    if (conversion.baseCurrency === 'USD' && conversion.targetCurrency === 'MXN') {
        return value.mul(conversion.exchangeRate);
    }

    return value;
}

/**
 * Calculate commission for a channel considering Founder program
 * Founder Program: 0% commission on Viator for first 6 months
 * 
 * @param channel - OTA channel name
 * @param baseCommission - Standard commission percentage
 * @param supplierPlan - Supplier subscription plan
 * @param accountAgeMonths - Age of supplier account in months
 * @returns Effective commission percentage
 */
export function calculateChannelCommission(
    channel: string,
    baseCommission: Decimal | number,
    supplierPlan?: 'FOUNDER' | 'STANDARD',
    accountAgeMonths?: number
): Decimal {
    const commission = new Decimal(baseCommission);

    // Founder Program: Viator 0% commission for 6 months
    if (
        supplierPlan === 'FOUNDER' &&
        channel.toLowerCase() === 'viator' &&
        accountAgeMonths !== undefined &&
        accountAgeMonths < 6
    ) {
        return new Decimal(0);
    }

    return commission;
}

/**
 * Calculate net revenue after OTA commission
 * 
 * @param pvp - Public selling price
 * @param commissionPercent - Commission percentage (0-100)
 * @returns Net revenue
 */
export function calculateNetRevenue(
    pvp: Decimal | number,
    commissionPercent: Decimal | number
): Decimal {
    const price = new Decimal(pvp);
    const commission = new Decimal(commissionPercent);

    // Net Revenue = PVP × (1 - Commission%)
    const commissionMultiplier = new Decimal(1).minus(commission.div(100));
    return price.mul(commissionMultiplier);
}

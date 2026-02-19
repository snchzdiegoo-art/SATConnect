import { PrismaClient } from '@prisma/client';

export interface PricingResult {
    suggested_pvp: number;
    net_rate: number;
    margin_amount: number;
    margin_percent: number;
    mode: 'TOP_DOWN' | 'BOTTOM_UP';
}

/**
 * PRICING ENGINE (Revenue Optimization)
 * Handles bidirectional price calculations.
 */
export class PricingEngine {

    /**
     * BOTTOM-UP: Calculate PVP from Net Cost + Desired Margin Factor
     * Formula: PVP = Net * Factor
     * Default Factor = 1.5 (50% markup on cost, which corresponds to 33% margin on price)
     */
    static proposePvp(netRate: number, factor: number = 1.5): PricingResult {
        const suggested_pvp = netRate * factor;
        const margin_amount = suggested_pvp - netRate;
        const margin_percent = (margin_amount / suggested_pvp) * 100;

        return {
            suggested_pvp: Number(suggested_pvp.toFixed(2)),
            net_rate: Number(netRate.toFixed(2)),
            margin_amount: Number(margin_amount.toFixed(2)),
            margin_percent: Number(margin_percent.toFixed(2)),
            mode: 'BOTTOM_UP'
        };
    }

    /**
     * TOP-DOWN: Calculate Margins from Fixed PVP and Known Net Cost
     * Useful when the market dictates the price (e.g., matching competitors).
     */
    static calculateReverseMargin(pvp: number, netRate: number): PricingResult {
        const margin_amount = pvp - netRate;
        const margin_percent = (margin_amount / pvp) * 100;

        return {
            suggested_pvp: Number(pvp.toFixed(2)),
            net_rate: Number(netRate.toFixed(2)),
            margin_amount: Number(margin_amount.toFixed(2)),
            margin_percent: Number(margin_percent.toFixed(2)),
            mode: 'TOP_DOWN'
        };
    }

    /**
     * PROFIT SHIELD CHECK
     * Returns true if the calculated margin meets the minimum threshold (e.g., 20%).
     */
    static checkProfitShield(pricing: PricingResult, minMarginPercent: number = 20): boolean {
        return pricing.margin_percent >= minMarginPercent;
    }
}

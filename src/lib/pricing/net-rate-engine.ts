/**
 * SAT Connect - Net Rate & Margin Engine
 * Responsible for calculating pricing modules for Travel Agents.
 */

export interface PricingInput {
    netRate: number;
    agencyMarkupPercent: number; // e.g., 10 for 10%
    platformFeePercent?: number;  // e.g., 2 for 2%
}

export interface PricingOutput {
    providerNet: number;       // The original cost from the supplier
    agencyMarkupAmount: number; // The amount the agency adds
    agentSellPrice: number;    // The price the agent sells to the end customer
    estimatedCommission: number; // The profit for the agency
    currency: string;
}

/**
 * Calculates the final sell price and commission for an agency.
 * Formula: Agent Sell = Provider Net * (1 + (Markup / 100))
 */
export function calculateAgencyPricing(input: PricingInput): PricingOutput {
    const { netRate, agencyMarkupPercent, platformFeePercent = 0 } = input;

    const markupMultiplier = 1 + (agencyMarkupPercent / 100);
    const agentSellPrice = netRate * markupMultiplier;
    const agencyMarkupAmount = agentSellPrice - netRate;

    // In a real scenario, we might deduct platform fees from the commission
    const estimatedCommission = agencyMarkupAmount - (agentSellPrice * (platformFeePercent / 100));

    return {
        providerNet: netRate,
        agencyMarkupAmount,
        agentSellPrice: Math.round(agentSellPrice * 100) / 100,
        estimatedCommission: Math.round(estimatedCommission * 100) / 100,
        currency: "MXN", // Defaulting to MXN for this phase
    };
}

/**
 * Helper to determine the "Suggested PVP" vs "Agency PVP"
 */
export function compareMargins(netRate: number, suggestedFactor: number, agencyMarkup: number) {
    const suggestedPVP = netRate * suggestedFactor;
    const agencyPVP = netRate * (1 + (agencyMarkup / 100));

    return {
        suggestedPVP,
        agencyPVP,
        diff: agencyPVP - suggestedPVP,
        isOverPVP: agencyPVP > suggestedPVP
    };
}

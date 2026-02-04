/**
 * T.H.R.I.V.E. Engine - Core Logic v1.0
 * Ported from Google Apps Script v4.3
 * 
 * Logic to audit availability, health, and revenue protection.
 */

export interface TourInput {
    id?: string;
    name: string;
    description?: string;
    provider: string; // e.g., "Mundo Maya"

    // Economics
    netRate: number;      // Costo Neto
    publicPrice: number;  // Precio de Venta (PVP)

    // Specs
    images: string[];
    duration?: string;
    cancellationPolicy?: string;
}

export interface TourDiagnostics {
    healthScore: "HEALTHY" | "INCOMPLETE" | "CRITICAL";
    economics: {
        margin: number;       // (PVP - Net) / PVP
        multiplier: number;   // PVP / Net
        status: "B2B_READY" | "B2C_ONLY" | "LOSS_WARNING";
        profitPerSale: number;
    };
    missingFields: string[];
}

/**
 * Mantiene la lógica original:
 * - CRITICAL: Si falta Net Rate o Nombre.
 * - INCOMPLETE: Si faltan imágenes o descripción.
 * - HEALTHY: Todo ok.
 */
export function auditTour(tour: TourInput): TourDiagnostics {
    const missing: string[] = [];

    // Critical Checks
    if (!tour.netRate || tour.netRate <= 0) missing.push("netRate");
    if (!tour.name) missing.push("name");

    const isCritical = missing.length > 0;

    // Secondary Checks
    if (!tour.images || tour.images.length === 0) missing.push("images");
    if (!tour.description) missing.push("description");

    // Calculate Economics
    const economics = analyzeEconomics(tour.netRate, tour.publicPrice);

    let score: "HEALTHY" | "INCOMPLETE" | "CRITICAL" = "HEALTHY";
    if (isCritical) {
        score = "CRITICAL";
    } else if (missing.length > 0) {
        score = "INCOMPLETE";
    }

    return {
        healthScore: score,
        economics,
        missingFields: missing
    };
}

/**
 * Replicates Logic:
 * If Factor (Multiplier) < 1.5 -> B2C ONLY
 */
function analyzeEconomics(net: number, price: number) {
    // Avoid division by zero
    if (!net || net <= 0) {
        return { margin: 0, multiplier: 0, status: "LOSS_WARNING", profitPerSale: 0 } as const;
    }

    const multiplier = price / net;
    const profit = price - net;
    const margin = profit / price; // Gross Margin %

    let status: "B2B_READY" | "B2C_ONLY" | "LOSS_WARNING" = "B2B_READY";

    if (profit <= 0) {
        status = "LOSS_WARNING";
    } else if (multiplier < 1.5) {
        // THRIVE Rule: Protect Utility. If factor < 1.5, not enough room for B2B commissions.
        status = "B2C_ONLY";
    }

    return {
        margin: parseFloat(margin.toFixed(2)),
        multiplier: parseFloat(multiplier.toFixed(2)),
        status,
        profitPerSale: parseFloat(profit.toFixed(2))
    };
}

/**
 * Replicates Logic:
 * Assign internal ID (<100) if no Bokun ID provided.
 * In a real DB, this would query the max ID. Here we mock functionality.
 */
export function generateInternalId(existingIds: string[]): string {
    const internalIds = existingIds
        .map(id => parseInt(id))
        .filter(n => !isNaN(n) && n > 0 && n < 100);

    const maxId = internalIds.length > 0 ? Math.max(...internalIds) : 6; // Start at 7 per script
    return (maxId + 1).toString();
}

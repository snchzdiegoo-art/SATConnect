/**
 * T.H.R.I.V.E. Engine - Core Logic v2.0
 * Refined based on User's Excel Formulas (LET Logic)
 */

export interface TourInput {
    id: string;
    name: string;
    provider: string; // e.g., "Mundo Maya"

    // Economics - SHARED (Adult)
    netRate: number | null;         // Col I - Shared Adult Net
    publicPrice: number | null;     // Col K - Suggested PVP

    // Economics - CHILD
    netChild?: number | null;       // Col L - Net Child
    publicChild?: number | null;    // Col M - Suggested Child Public

    // Economics - PRIVATE
    netPrivate?: number | null;     // Col Q - Net Private
    publicPrivate?: number | null;  // Col S - Suggested Private Public Rate

    // Operational Limits
    minPaxShared?: number | null;   // Col O - Shared Minimum PAX
    minPaxPrivate?: number | null;  // Col P - Private Minimum PAX
    infantAge?: string | null;      // Col N - Infant Age

    // Pricing Factors
    factorShared?: number | null;   // Col J - Factor (1.5 - 1.99)
    factorPrivate?: number | null;  // Col R - Factor Private

    // Tech Specs
    images: string[];               // Col U - Pictures
    duration?: string | null;       // Col V - Duration
    opsDays?: string | null;        // Col W - Days of Operation
    cxlPolicy?: string | null;      // Col X - CXL Policy
    meetingPoint?: string | null;   // Col AA - Meeting point / Pick up

    // Marketing
    landingPageUrl?: string | null; // Col Y - Landing Page
    storytelling?: string | null;   // Col Z - Storytelling Link

    // Extras & Metadata
    extraFees?: string | null;      // Col AB - Extra Fees
    lastUpdate?: string | null;     // Col T - Last Update
    auditNotes?: string | null;     // Col AL - Audit Notes

    // Categorization & Filtering
    location?: string | null;       // Col D - Location
    region?: string | null;
    activityType?: string | null;
    tourType?: string | null;
    tags?: string[];

    // Distribution (AUDIT_MASTER_LOG Checks)
    channels?: {
        expedia: "Active" | "Inactive";
        viator: "Active" | "Inactive";
        gyg: "Active" | "Inactive";
        civitatis: "Active" | "Inactive";
    };

    // Global Dist Strategy (AUDIT_MASTER_LOG Col 9)
    globalStrategy?: "B2B_READY" | "B2C_ONLY" | "PENDING_AUDIT";
}

export interface TourDiagnostics {
    health: {
        score: "HEALTHY" | "INCOMPLETE" | "CRITICAL"; // G12 Logic
        details: string; // The text output like "🚨 INCOMPLETE: Net Rate..."
    };
    distribution: {
        score: string; // "🌐 Healthy (4/4 Active)"
        activeCount: number;
    };
    economics: {
        margin: number;
        multiplier: number;
        status: "B2B_READY" | "B2C_ONLY" | "LOSS_WARNING";
    };
}

/**
 * REPLICATES EXCEL FORMULA G12 (Product Health)
 */
export function auditProductHealth(tour: TourInput): TourDiagnostics['health'] {
    // 1. Critical List
    const critList: string[] = [];
    if (!tour.netRate) critList.push("Net Rate");
    if (!tour.infantAge) critList.push("Infant Age");
    if (!tour.images || tour.images.length === 0) critList.push("Pictures");
    if (!tour.duration) critList.push("Duration");
    if (!tour.opsDays) critList.push("Operation Days");
    if (!tour.cxlPolicy) critList.push("CXL Policy");
    if (!tour.meetingPoint) critList.push("Meeting Pt");

    // 2. Warning List
    const warnList: string[] = [];
    if (!tour.landingPageUrl) warnList.push("Landing Page");
    if (!tour.storytelling) warnList.push("Storytelling");

    // Logic
    if (tour.id === "") return { score: "CRITICAL", details: "❌ ENTER ID" };

    if (critList.length > 0) {
        let msg = `🚨 INCOMPLETE: ${critList.join(", ")}`;
        if (warnList.length > 0) msg += ` | ⚠️ Also Missing: ${warnList.join(", ")}`;
        return { score: "INCOMPLETE", details: msg }; // Excel says INCOMPLETE if criticals missing? Checking prompt... yes "🚨 INCOMPLETE"
    }

    // If no criticals, check warnings
    let msg = "✅ PRODUCT HEALTHY";
    if (warnList.length > 0) {
        msg += ` | ⚠️ Missing: ${warnList.join(", ")}`;
    }

    return { score: "HEALTHY", details: msg };
}

/**
 * REPLICATES EXCEL FORMULA H42 (OTA Distribution)
 */
export function auditDistribution(tour: TourInput) {
    const c = tour.channels || { expedia: "Inactive", viator: "Inactive", gyg: "Inactive", civitatis: "Inactive" };

    let count = 0;
    if (c.expedia === "Active") count++;
    if (c.viator === "Active") count++;
    if (c.gyg === "Active") count++;
    if (c.civitatis === "Active") count++;

    let msg = "";
    if (count === 4) msg = "🌐 Healthy (4/4 Active)";
    else if (count === 3) msg = "✅ Good (3/4 Active)";
    else if (count === 2) msg = "⚠️ Fair (2/4 Active)";
    else if (count === 1) msg = "❌ Poor (1/4 Active)";
    else msg = "🚨 Critical (0/4 Active)";

    return { score: msg, activeCount: count };
}

/**
 * REPLICATES REVENUE LOGIC (Multiplier < 1.5)
 */
export function analyzeEconomics(net: number | null, price: number | null) {
    if (!net || !price) return { margin: 0, multiplier: 0, status: "LOSS_WARNING" } as const;

    const multiplier = price / net;
    const profit = price - net;
    const margin = profit / price;

    let status: "B2B_READY" | "B2C_ONLY" | "LOSS_WARNING" = "B2B_READY";
    if (profit <= 0) status = "LOSS_WARNING";
    else if (multiplier < 1.5) status = "B2C_ONLY";

    return {
        margin: parseFloat(margin.toFixed(2)),
        multiplier: parseFloat(multiplier.toFixed(2)),
        status
    };
}

/**
 * MAIN WRAPPER
 */
export function auditTour(tour: TourInput): TourDiagnostics {
    return {
        health: auditProductHealth(tour),
        distribution: auditDistribution(tour),
        economics: analyzeEconomics(tour.netRate, tour.publicPrice)
    };
}

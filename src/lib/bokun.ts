import crypto from "node:crypto";

/**
 * Bókun API & Webhook Utility
 * Handles HMAC signatures and authentication headers.
 */

export interface BokunConfig {
    accessKey: string;
    secretKey: string;
    bookingChannelId?: string;
}

/**
 * Generates the X-Bokun-Signature header for API V2
 * Format: date + accessKey + method + path
 * Signed with secretKey using HMAC-SHA1 and Base64 encoded.
 */
export function generateBokunSignature(
    method: string,
    path: string,
    date: string,
    config: BokunConfig
): string {
    const data = date + config.accessKey + method.toUpperCase() + path;
    const hmac = crypto.createHmac("sha1", config.secretKey);
    hmac.update(data);
    return hmac.digest("base64");
}

/**
 * Validates a Bókun Webhook signature (HMAC-SHA256)
 * Note: Bókun webhooks use SHA256, while the API uses SHA1.
 */
export function validateWebhookSignature(
    payload: string,
    signature: string,
    secretKey: string
): boolean {
    const hmac = crypto.createHmac("sha256", secretKey);
    hmac.update(payload);
    const expectedSignature = hmac.digest("base64");
    return expectedSignature === signature;
}

/**
 * Rate Limiting Handler
 * Utility to extract Retry-After from response headers if 429 is received.
 */
export function getRetryAfterSeconds(headers: Headers): number {
    const retryAfter = headers.get("Retry-After");
    if (!retryAfter) return 0;

    // Retry-After can be seconds or a full HTTP-date
    const seconds = parseInt(retryAfter, 10);
    if (!isNaN(seconds)) return seconds;

    const date = new Date(retryAfter);
    const now = new Date();
    return Math.max(0, Math.ceil((date.getTime() - now.getTime()) / 1000));
}

/**
 * Mock Catalog Sync Logic (Conceptual)
 */
export async function syncBokunCatalog(config: BokunConfig) {
    const date = new Date().toUTCString();
    const path = "/restapi/v2.0/experience";
    const method = "GET";

    const signature = generateBokunSignature(method, path, date, config);

    const headers = new Headers({
        "X-Bokun-AccessKey": config.accessKey,
        "X-Bokun-Date": date,
        "X-Bokun-Signature": signature,
        "Accept": "application/json",
    });

    // In real implementation, this would fetch from https://api.bokun.is
    // For now, we return a mock response for the Command Center.
    return {
        timestamp: new Date().toISOString(),
        status: "authenticated",
        path,
        headers: Object.fromEntries(headers.entries()),
    };
}

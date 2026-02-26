import { NextRequest, NextResponse } from "next/server";
import { validateWebhookSignature } from "@/lib/bokun";

/**
 * Bókun Webhook Receiver
 * Endpoint: /api/webhooks/bokun
 * 
 * Handles incoming booking signals (CONFIRMED, UPDATED, CANCELLED).
 * Uses HMAC-SHA256 validation.
 */
export async function POST(req: NextRequest) {
    try {
        const payload = await req.text();
        const signature = req.headers.get("X-Bokun-Signature-256"); // Bókun uses this for webhooks
        const secretKey = process.env.BOKUN_SECRET_KEY;

        if (!secretKey) {
            console.error("[Bókun Webhook] Missing BOKUN_SECRET_KEY");
            return NextResponse.json({ error: "Configuration Error" }, { status: 500 });
        }

        if (!signature || !validateWebhookSignature(payload, signature, secretKey)) {
            console.warn("[Bókun Webhook] Invalid Signature detected");
            return NextResponse.json({ error: "Invalid Signature" }, { status: 401 });
        }

        const data = JSON.parse(payload);
        console.log(`[Bókun Webhook] Received event: ${data.type}`, data);

        // Triad Orchestration Rule: Cero lógica de negocio persistente aquí.
        // Delegar inmediatamente la orquestación a n8n.
        const N8N_WEBHOOK_URL = 'https://satconnect.app.n8n.cloud/webhook/c7c20045-ddbb-47ed-81ff-4429d46a2af1';

        console.log(`[Bókun Webhook] Forwarding payload to n8n Automation Engine...`);

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source: 'bokun-api',
                event: data.type,
                data: data,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            console.error('[Bókun Webhook] Failed to transfer payload to n8n', response.statusText);
            // Even if n8n fails, we acknowledge Bókun to prevent endless retries
            // but we log it as an error.
        } else {
            console.log("[Bókun Webhook] Reservation successfully forwarded to n8n.");
        }

        return NextResponse.json({
            status: "received",
            timestamp: new Date().toISOString()
        }, { status: 200 });

    } catch (error) {
        console.error("[Bókun Webhook] Error processing payload:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

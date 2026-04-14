import { NextResponse } from "next/server";

/**
 * POST /api/webhooks/demo-request
 *
 * Triad Protocol — Next.js validates → proxies to n8n (fire & forget)
 * n8n handles: confirmation email, calendar invite, CRM entry (HubSpot)
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Validate minimum required fields
        if (!body?.data?.email || !body?.data?.name) {
            return NextResponse.json(
                { error: "Missing required fields: name and email" },
                { status: 400 }
            );
        }

        const payload = {
            source: "satconnect-landing",
            type: "demo_request",
            prospect: "sat-mexico",
            data: body.data,
            timestamp: new Date().toISOString(),
        };

        // Fire-and-forget → n8n handles the rest
        const n8nUrl =
            process.env.N8N_DEMO_WEBHOOK_URL ||
            "https://satconnect.app.n8n.cloud/webhook/demo-request";

        fetch(n8nUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }).catch(() => {
            // Silently fail — n8n unavailability should not affect the user response
        });

        return NextResponse.json(
            { success: true, message: "Demo request received" },
            { status: 200 }
        );
    } catch (error) {
        console.error("[demo-request webhook]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        // 🚀 THE TRIAD LOGIC: Delegation to n8n Orchestrator
        // Next.js delegates all state tracking, telemetry gathering, and external intelligence dismissals to n8n
        const n8nWebhookUrl = process.env.N8N_INTELLIGENCE_WEBHOOK_URL || "https://satconnect.app.n8n.cloud/webhook/intelligence-hub";

        console.log(`[Proxy] Reenviando evento de inteligencia (${payload.action}) a n8n: ${n8nWebhookUrl}`);

        const n8nResponse = await fetch(n8nWebhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // We pass the entire payload verbatim
            body: JSON.stringify(payload),
        });

        if (!n8nResponse.ok) {
            console.warn("[Triad] n8n retornó error o no está activo, pero respondemos 200 al Frontend para mantener Optimistic UI.");
        }

        return NextResponse.json({ success: true, message: "Evento de inteligencia inyectado en la cadena n8n" }, { status: 200 });

    } catch (error) {
        console.error("[Webhooks/Intelligence] Error:", error);
        return NextResponse.json({ error: "Error procesando el payload de telemetría." }, { status: 500 });
    }
}

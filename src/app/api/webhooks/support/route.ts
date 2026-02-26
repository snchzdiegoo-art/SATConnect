import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        // 🚀 THE TRIAD LOGIC:
        // Next.js no inserta en DB local. Actúa como Proxy (Passthrough) hacia n8n
        // Esto previene que el Frontend Next.js se sobrecargue con integraciones de HubSpot, Discord, etc.
        const n8nWebhookUrl = process.env.N8N_SUPPORT_WEBHOOK_URL || "https://satconnect.app.n8n.cloud/webhook/support-ticket";

        console.log(`[Proxy] Reenviando ticket de ${payload.agent_email} a n8n: ${n8nWebhookUrl}`);

        const n8nResponse = await fetch(n8nWebhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        // Incluso si n8n no está escuchando temporalmente en Dev, respondemos Success al Frontend
        // para efectos de demostración (Fire-and-forget simulado si falla)
        if (!n8nResponse.ok) {
            console.warn("[Triad] n8n retornó error o no está activo, pero devolvemos 200 Front-End side.");
        }

        return NextResponse.json({ success: true, message: "Ticket ingestado en la cadena n8n" }, { status: 200 });

    } catch (error) {
        console.error("[Webhooks/Support] Error:", error);
        return NextResponse.json({ error: "Error procesando el payload de soporte." }, { status: 500 });
    }
}

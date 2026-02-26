import { NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = 'https://satconnect.app.n8n.cloud/webhook/c7c20045-ddbb-47ed-81ff-4429d46a2af1';

export async function POST(req: Request) {
    try {
        const payload = await req.json();

        // The Triad Orchestration: proxy to n8n, zero business logic here
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                source: 'satconnect-frontend',
                type: 'theme_config_update',
                data: payload,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to forward theme config to n8n.' }, { status: 502 });
        }

        return NextResponse.json({ success: true, message: 'Theme configuration synced to automation layer.' }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: 'Internal error forwarding theme webhook.' }, { status: 500 });
    }
}

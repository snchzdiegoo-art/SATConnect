import { NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = 'https://satconnect.app.n8n.cloud/webhook/c7c20045-ddbb-47ed-81ff-4429d46a2af1';

export async function POST(req: Request) {
    try {
        // 1. Extraer el payload del Webhook de Clerk o del formulario de registro
        const payload = await req.json();

        console.log('Interceptando registro en Next.js. Reenviando a n8n...');

        // 2. The Triad Orchestration Rule: Cero lógica de negocio aquí.
        // Delegar a n8n inmediatamente.
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                source: 'satconnect-frontend',
                type: 'user_registration',
                data: payload,
                timestamp: new Date().toISOString(),
            }),
        });

        if (!response.ok) {
            console.error('Error forwarding to n8n:', response.statusText);
            return NextResponse.json(
                { error: 'Failed to process registration workflow via n8n.' },
                { status: 502 }
            );
        }

        // 3. Respuesta exitosa al cliente / servicio emisor
        return NextResponse.json(
            { success: true, message: 'Registration data securely forwarded to the automation layer.' },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Webhook processing error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error while forwarding webhook.' },
            { status: 500 }
        );
    }
}

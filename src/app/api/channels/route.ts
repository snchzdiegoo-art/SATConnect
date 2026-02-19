/**
 * SAT Connect — Distribution Channels API
 * GET  /api/channels — List all channels
 * POST /api/channels — Create a new channel
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest) {
    try {
        const channels = await prisma.distributionChannel.findMany({
            include: {
                _count: { select: { channel_links: true } },
            },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({ success: true, data: channels });
    } catch (error) {
        console.error('[GET /api/channels]', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch channels' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.name?.trim()) {
            return NextResponse.json(
                { success: false, error: 'Channel name is required' },
                { status: 400 }
            );
        }

        const channel = await prisma.distributionChannel.create({
            data: {
                name: body.name.trim(),
                base_commission_percent: body.base_commission_percent ?? 0,
                is_active: body.is_active ?? true,
            },
        });

        return NextResponse.json({ success: true, data: channel }, { status: 201 });
    } catch (error: unknown) {
        if (
            error instanceof Error &&
            'code' in error &&
            (error as { code: string }).code === 'P2002'
        ) {
            return NextResponse.json(
                { success: false, error: 'A channel with that name already exists' },
                { status: 409 }
            );
        }
        console.error('[POST /api/channels]', error);
        return NextResponse.json({ success: false, error: 'Failed to create channel' }, { status: 500 });
    }
}

/**
 * SAT Connect — Distribution Channels [id] API
 * PUT    /api/channels/[id] — Update channel (commission change cascades to all tour revenue calcs)
 * DELETE /api/channels/[id] — Deactivate channel
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const channel = await prisma.distributionChannel.update({
            where: { id: parseInt(id) },
            data: {
                ...(body.name !== undefined ? { name: body.name.trim() } : {}),
                ...(body.base_commission_percent !== undefined
                    ? { base_commission_percent: body.base_commission_percent }
                    : {}),
                ...(body.is_active !== undefined ? { is_active: body.is_active } : {}),
            },
        });

        return NextResponse.json({ success: true, data: channel });
    } catch (error) {
        console.error('[PUT /api/channels/[id]]', error);
        return NextResponse.json({ success: false, error: 'Failed to update channel' }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const channel = await prisma.distributionChannel.update({
            where: { id: parseInt(id) },
            data: { is_active: false },
        });

        return NextResponse.json({
            success: true,
            message: `Channel "${channel.name}" deactivated`,
        });
    } catch (error) {
        console.error('[DELETE /api/channels/[id]]', error);
        return NextResponse.json({ success: false, error: 'Failed to deactivate channel' }, { status: 500 });
    }
}

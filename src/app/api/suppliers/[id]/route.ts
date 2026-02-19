/**
 * SAT Connect — Suppliers [id] API
 * GET    /api/suppliers/[id] — Get single supplier with tours
 * PUT    /api/suppliers/[id] — Update supplier
 * DELETE /api/suppliers/[id] — Deactivate (soft delete)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supplier = await prisma.supplier.findUnique({
            where: { id: parseInt(id) },
            include: {
                tours: {
                    select: {
                        id: true,
                        product_name: true,
                        is_active: true,
                        audit: { select: { product_health_score: true } },
                    },
                    orderBy: { product_name: 'asc' },
                },
            },
        });

        if (!supplier) {
            return NextResponse.json({ success: false, error: 'Supplier not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: supplier });
    } catch (error) {
        console.error('[GET /api/suppliers/[id]]', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch supplier' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const supplier = await prisma.supplier.update({
            where: { id: parseInt(id) },
            data: {
                ...(body.name !== undefined ? { name: body.name.trim() } : {}),
                ...(body.contact_info !== undefined ? { contact_info: body.contact_info } : {}),
                ...(body.badges !== undefined ? { badges: body.badges } : {}),
                ...(body.is_active !== undefined ? { is_active: body.is_active } : {}),
                ...(body.profile_status !== undefined ? { profile_status: body.profile_status } : {}),
            },
        });

        return NextResponse.json({ success: true, data: supplier });
    } catch (error) {
        console.error('[PUT /api/suppliers/[id]]', error);
        return NextResponse.json({ success: false, error: 'Failed to update supplier' }, { status: 500 });
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Soft delete: deactivate instead of destroying
        const supplier = await prisma.supplier.update({
            where: { id: parseInt(id) },
            data: { is_active: false },
        });

        return NextResponse.json({
            success: true,
            message: `Supplier "${supplier.name}" deactivated`,
        });
    } catch (error) {
        console.error('[DELETE /api/suppliers/[id]]', error);
        return NextResponse.json({ success: false, error: 'Failed to deactivate supplier' }, { status: 500 });
    }
}

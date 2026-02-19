/**
 * SAT Connect — Suppliers API
 * GET  /api/suppliers — List all suppliers
 * POST /api/suppliers — Create a new supplier
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const activeOnly = searchParams.get('active') === 'true';

        const suppliers = await prisma.supplier.findMany({
            where: {
                ...(activeOnly ? { is_active: true } : {}),
                ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
            },
            include: {
                _count: { select: { tours: true } },
            },
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({ success: true, data: suppliers });
    } catch (error) {
        console.error('[GET /api/suppliers]', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch suppliers' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.name?.trim()) {
            return NextResponse.json(
                { success: false, error: 'Supplier name is required' },
                { status: 400 }
            );
        }

        const supplier = await prisma.supplier.create({
            data: {
                name: body.name.trim(),
                contact_info: body.contact_info ?? null,
                badges: body.badges ?? [],
                is_active: body.is_active ?? true,
                profile_status: 'Complete',
            },
        });

        return NextResponse.json({ success: true, data: supplier }, { status: 201 });
    } catch (error: unknown) {
        if (
            error instanceof Error &&
            'code' in error &&
            (error as { code: string }).code === 'P2002'
        ) {
            return NextResponse.json(
                { success: false, error: 'A supplier with that name already exists' },
                { status: 409 }
            );
        }
        console.error('[POST /api/suppliers]', error);
        return NextResponse.json({ success: false, error: 'Failed to create supplier' }, { status: 500 });
    }
}

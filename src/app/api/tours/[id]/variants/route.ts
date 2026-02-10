import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/tours/[id]/variants
// List all variants for a tour
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const tourId = parseInt(params.id);
        if (isNaN(tourId)) {
            return NextResponse.json({ success: false, error: 'Invalid Tour ID' }, { status: 400 });
        }

        const variants = await prisma.tourVariant.findMany({
            where: { tour_id: tourId, is_active: true },
            orderBy: { net_rate_adult: 'asc' }
        });
        return NextResponse.json({ success: true, data: variants });
    } catch (error) {
        console.error('Failed to fetch variants:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch variants' }, { status: 500 });
    }
}

// POST /api/tours/[id]/variants
// Create a new variant for a tour
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const tourId = parseInt(params.id);
        if (isNaN(tourId)) {
            return NextResponse.json({ success: false, error: 'Invalid Tour ID' }, { status: 400 });
        }

        const body = await request.json();
        const { name, net_rate_adult, net_rate_child, description, duration } = body;

        if (!name || !net_rate_adult) {
            return NextResponse.json({ success: false, error: 'Name and Adult Net Rate are required' }, { status: 400 });
        }

        const newVariant = await prisma.tourVariant.create({
            data: {
                tour_id: tourId,
                name,
                net_rate_adult: parseFloat(net_rate_adult),
                net_rate_child: net_rate_child ? parseFloat(net_rate_child) : null,
                description,
                duration,
                is_active: true
            }
        });

        return NextResponse.json({ success: true, data: newVariant }, { status: 201 });
    } catch (error) {
        console.error('Failed to create variant:', error);
        return NextResponse.json({ success: false, error: 'Failed to create variant' }, { status: 500 });
    }
}

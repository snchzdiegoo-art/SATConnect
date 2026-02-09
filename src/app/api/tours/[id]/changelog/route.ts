/**
 * SAT Connect - Change Log API
 * GET: Retrieve complete change history for a tour
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const tourId = parseInt(id);
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Get total count
        const total = await prisma.tourChangeLog.count({
            where: { tour_id: tourId },
        });

        // Get change logs with pagination
        const changes = await prisma.tourChangeLog.findMany({
            where: { tour_id: tourId },
            orderBy: { created_at: 'desc' },
            take: limit,
            skip: offset,
        });

        return NextResponse.json({
            success: true,
            changes: changes.map(change => ({
                id: change.id,
                changeType: change.change_type,
                fieldName: change.field_name,
                oldValue: change.old_value,
                newValue: change.new_value,
                userId: change.user_id,
                userName: change.user_name,
                userEmail: change.user_email,
                createdAt: change.created_at.toISOString(),
            })),
            total,
        });
    } catch (error) {
        console.error('Error fetching change log:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch change history' },
            { status: 500 }
        );
    }
}

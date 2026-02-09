/**
 * SAT Connect - Notes API
 * POST/PUT: Update tour notes with automatic change logging
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const tourId = parseInt(id);
        const body = await request.json();
        const { notes, userId, userName, userEmail } = body;

        if (!userId) {
            return NextResponse.json(
                { success: false, error: 'User ID required' },
                { status: 400 }
            );
        }

        // Get current notes
        const tour = await prisma.tour.findUnique({
            where: { id: tourId },
            include: { assets: true },
        });

        if (!tour) {
            return NextResponse.json(
                { success: false, error: 'Tour not found' },
                { status: 404 }
            );
        }

        const oldNotes = tour.assets?.notes || null;
        const changeType = oldNotes ? 'notes_edited' : 'notes_added';

        // Update or create assets with new notes
        await prisma.tourAssets.upsert({
            where: { tour_id: tourId },
            update: { notes },
            create: {
                tour_id: tourId,
                notes,
            },
        });

        // Log the change
        const changeLog = await prisma.tourChangeLog.create({
            data: {
                tour_id: tourId,
                change_type: changeType,
                field_name: 'notes',
                old_value: oldNotes,
                new_value: notes,
                user_id: userId,
                user_name: userName || null,
                user_email: userEmail || null,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Notes updated successfully',
            changeLogId: changeLog.id,
        });
    } catch (error) {
        console.error('Error updating notes:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update notes' },
            { status: 500 }
        );
    }
}

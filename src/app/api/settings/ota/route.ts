
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/settings/ota - List all OTA settings
export async function GET(request: NextRequest) {
    try {
        const settings = await prisma.globalOTASettings.findMany({
            orderBy: { channel_name: 'asc' }
        });
        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        console.error('Error fetching OTA settings:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch OTA settings' },
            { status: 500 }
        );
    }
}

// POST /api/settings/ota - Create or Update OTA setting
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.channel_key || !body.channel_name) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const setting = await prisma.globalOTASettings.upsert({
            where: { channel_key: body.channel_key },
            update: {
                channel_name: body.channel_name,
                default_commission: body.default_commission,
                is_active: body.is_active
            },
            create: {
                channel_key: body.channel_key,
                channel_name: body.channel_name,
                default_commission: body.default_commission || 0,
                is_active: body.is_active ?? true
            }
        });

        return NextResponse.json({ success: true, data: setting });

    } catch (error) {
        console.error('Error saving OTA setting:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save OTA setting' },
            { status: 500 }
        );
    }
}

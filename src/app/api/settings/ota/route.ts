

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { handleAPIError, validationError } from '@/lib/api-errors';
import { getOTASettings, invalidateOTACache } from '@/lib/cache/ota-settings';

// GET /api/settings/ota - List all OTA settings (with caching)
export async function GET(request: NextRequest) {
    try {
        const settings = await getOTASettings();
        return NextResponse.json({ success: true, data: settings });
    } catch (error) {
        return handleAPIError(error, 'GET /api/settings/ota');
    }
}

// POST /api/settings/ota - Create or Update OTA setting
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!body.channel_key || !body.channel_name) {
            return validationError('Missing required fields: channel_key and channel_name');
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

        // Invalidate cache after updating settings
        invalidateOTACache();

        return NextResponse.json({ success: true, data: setting });

    } catch (error) {
        return handleAPIError(error, 'POST /api/settings/ota');
    }
}

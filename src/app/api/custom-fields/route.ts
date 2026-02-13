import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleAPIError, validationError, HTTP_STATUS } from '@/lib/api-errors';

// GET /api/custom-fields
// List all active custom field definitions
export async function GET() {
    try {
        const fields = await prisma.customFieldDefinition.findMany({
            where: { is_active: true },
            orderBy: { id: 'asc' }
        });
        return NextResponse.json({ success: true, data: fields });
    } catch (error) {
        return handleAPIError(error, 'GET /api/custom-fields');
    }
}

// POST /api/custom-fields
// Create a new custom field definition
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { label, type, options } = body;

        // Basic validation
        if (!label || !type) {
            return validationError('Label and Type are required');
        }

        // Generate a key from the label (e.g., "Tour Difficulty" -> "tour_difficulty")
        // Use provided key if available, otherwise generate from label
        const key = body.key
            ? body.key.toLowerCase().replace(/[^a-z0-9_]/g, '_')
            : label.toLowerCase().replace(/[^a-z0-9]/g, '_');

        // Check for duplicate key
        const existing = await prisma.customFieldDefinition.findUnique({ where: { key } });
        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Field with this name already exists', code: 'DUPLICATE_KEY' },
                { status: HTTP_STATUS.CONFLICT }
            );
        }

        const newField = await prisma.customFieldDefinition.create({
            data: {
                key,
                label,
                type,
                options: options ? JSON.stringify(options) : null,
                is_active: true
            }
        });

        return NextResponse.json({ success: true, data: newField }, { status: 201 });
    } catch (error) {
        return handleAPIError(error, 'POST /api/custom-fields');
    }
}

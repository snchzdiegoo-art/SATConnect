import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
        console.error('Failed to fetch custom fields:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch fields' }, { status: 500 });
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
            return NextResponse.json({ success: false, error: 'Label and Type are required' }, { status: 400 });
        }

        // Generate a key from the label (e.g., "Tour Difficulty" -> "tour_difficulty")
        // Use provided key if available, otherwise generate from label
        const key = body.key
            ? body.key.toLowerCase().replace(/[^a-z0-9_]/g, '_')
            : label.toLowerCase().replace(/[^a-z0-9]/g, '_');

        // Check for duplicate key
        const existing = await prisma.customFieldDefinition.findUnique({ where: { key } });
        if (existing) {
            return NextResponse.json({ success: false, error: 'Field with this name already exists' }, { status: 409 });
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
        console.error('Failed to create custom field:', error);
        return NextResponse.json({ success: false, error: 'Failed to create field' }, { status: 500 });
    }
}

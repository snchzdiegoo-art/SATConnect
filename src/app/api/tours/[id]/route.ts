import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// PUT /api/tours/[id] - Update tour
export async function PUT(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params
        const body = await req.json()
        const { channels, ...tourData } = body

        console.log(`Updating tour ${id} with data:`, tourData)

        const tour = await prisma.tour.update({
            where: { id },
            data: {
                ...tourData,
                channelLogs: {
                    deleteMany: {},
                    create: Object.entries(channels || {}).map(([channel, status]) => ({
                        channel,
                        status: status as string
                    }))
                }
            },
            include: { channelLogs: true }
        })

        const formatted = {
            ...tour,
            channels: Object.fromEntries(
                tour.channelLogs.map((log: { channel: string; status: string }) => [log.channel, log.status])
            )
        }

        return NextResponse.json(formatted)
    } catch (error) {
        console.error('PUT /api/tours/[id] error:', error)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (error as any).message || 'Unknown error'
        return NextResponse.json(
            { error: 'Failed to update tour', details: errorMessage },
            { status: 500 }
        )
    }
}

// DELETE /api/tours/[id] - Delete tour
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params

        await prisma.tour.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('DELETE /api/tours/[id] error:', error)
        return NextResponse.json(
            { error: 'Failed to delete tour' },
            { status: 500 }
        )
    }
}

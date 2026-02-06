import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// PUT /api/tours/[id] - Update tour
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params
        const body = await req.json()
        const { channels, ...tourData } = body

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
        return NextResponse.json(
            { error: 'Failed to update tour' },
            { status: 500 }
        )
    }
}

// DELETE /api/tours/[id] - Delete tour
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

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

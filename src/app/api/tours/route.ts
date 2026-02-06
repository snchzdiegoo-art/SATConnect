import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/tours - Fetch all tours
export async function GET() {
    try {
        const tours = await prisma.tour.findMany({
            include: {
                channelLogs: true,
                _count: {
                    select: { bookings: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        // Transform to match TourInput interface
        const formatted = tours.map((tour: typeof tours[0]) => ({
            id: tour.id,
            name: tour.name,
            provider: tour.provider,
            netRate: tour.netRate,
            publicPrice: tour.publicPrice,
            images: tour.images,
            duration: tour.duration,
            opsDays: tour.opsDays,
            cxlPolicy: tour.cxlPolicy,
            meetingPoint: tour.meetingPoint,
            landingPageUrl: tour.landingPageUrl,
            storytelling: tour.storytelling,
            // Filter fields
            location: tour.location,
            region: tour.region,
            activityType: tour.activityType,
            tourType: tour.tourType,
            tags: tour.tags,
            channels: Object.fromEntries(
                tour.channelLogs.map((log: { channel: string; status: string }) => [log.channel, log.status])
            ) as Record<string, "Active" | "Inactive">
        }))

        return NextResponse.json(formatted)
    } catch (error) {
        console.error('GET /api/tours error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch tours' },
            { status: 500 }
        )
    }
}

// POST /api/tours - Create new tour
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { channels, ...tourData } = body

        // Validate only ID is required
        if (!tourData.id) {
            return NextResponse.json(
                { error: 'Missing required field: id' },
                { status: 400 }
            )
        }

        // Apply defaults for missing required database fields
        const tourWithDefaults = {
            name: tourData.name || `Tour ${tourData.id}`,
            provider: tourData.provider || "Por Definir",
            netRate: tourData.netRate ?? 0,
            ...tourData
        }

        const tour = await prisma.tour.create({
            data: {
                ...tourWithDefaults,
                channelLogs: {
                    create: Object.entries(channels || {}).map(([channel, status]) => ({
                        channel,
                        status: status as string
                    }))
                }
            },
            include: { channelLogs: true }
        })

        // Transform response
        const formatted = {
            ...tour,
            channels: Object.fromEntries(
                tour.channelLogs.map((log: { channel: string; status: string }) => [log.channel, log.status])
            )
        }

        return NextResponse.json(formatted, { status: 201 })
    } catch (error) {
        console.error('POST /api/tours error:', error)
        return NextResponse.json(
            { error: 'Failed to create tour' },
            { status: 500 }
        )
    }
}

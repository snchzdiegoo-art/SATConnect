import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const tours = await prisma.tour.findMany({
            include: { channelLogs: true },
            orderBy: { createdAt: 'desc' }
        })

        // CSV Headers
        const headers = [
            'ID',
            'Name',
            'Provider',
            'Net Rate',
            'Public Price',
            'Duration',
            'Ops Days',
            'CXL Policy',
            'Meeting Point',
            'Landing Page',
            'Storytelling',
            'Images',
            'Channels'
        ]

        // CSV Rows
        const rows = tours.map((t: typeof tours[0]) => [
            t.id,
            `"${t.name.replace(/"/g, '""')}"`, // Escape quotes
            `"${t.provider.replace(/"/g, '""')}"`,
            t.netRate,
            t.publicPrice || '',
            t.duration || '',
            t.opsDays || '',
            t.cxlPolicy || '',
            t.meetingPoint || '',
            t.landingPageUrl || '',
            t.storytelling ? `"${t.storytelling.replace(/"/g, '""')}"` : '',
            t.images.join(';'),
            t.channelLogs.map((c: { channel: string; status: string }) => `${c.channel}:${c.status}`).join(';')
        ])

        // Generate CSV
        const csv = [
            headers.join(','),
            ...rows.map((row: (string | number)[]) => row.join(','))
        ].join('\n')

        const filename = `inventory_${new Date().toISOString().split('T')[0]}.csv`

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        })
    } catch (error) {
        console.error('GET /api/export/csv error:', error)
        return NextResponse.json(
            { error: 'Failed to export CSV' },
            { status: 500 }
        )
    }
}

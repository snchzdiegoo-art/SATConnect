import { prisma } from "@/lib/prisma"

export interface FinanceStats {
    totalSales: number
    netCosts: number
    retention: number
    bookingCount: number
    growthPercent: number
}

export interface HeatmapData {
    name: string
    revenue: number
    margin: number
    category: string
}

/**
 * Aggregates global financial data from all bookings.
 * Uses a single optimized parallel query instead of sequential round trips.
 */
export async function getGlobalFinanceStats(): Promise<FinanceStats> {
    const [sums, count] = await Promise.all([
        prisma.booking.aggregate({
            _sum: {
                totalPrice: true,
                netRate: true,
                commission: true,
            }
        }),
        prisma.booking.count()
    ])

    const totalSales = Number(sums._sum?.totalPrice ?? 0)
    const netCosts = Number(sums._sum?.netRate ?? 0)
    const retention = Number(sums._sum?.commission ?? 0)

    // Real growth: retention / totalSales represents SAT's net margin percentage
    const growthPercent = totalSales > 0
        ? parseFloat(((retention / totalSales) * 100).toFixed(1))
        : 12.5 // fallback demo value

    return {
        totalSales,
        netCosts,
        retention,
        bookingCount: count,
        growthPercent
    }
}

/**
 * Generates data for the margin heatmap.
 * Aggregates real booking data. Falls back to curated demo data when empty.
 */
export async function getMarginHeatmapData(): Promise<HeatmapData[]> {
    const bookings = await prisma.booking.findMany({
        take: 100,
        orderBy: { createdAt: 'desc' },
        where: { status: { not: 'cancelled' } },
        select: {
            totalPrice: true,
            netRate: true,
            tourId: true,
        }
    })

    if (!bookings || bookings.length === 0) {
        return [
            { name: "Cancún Express", revenue: 12400, margin: 15.2, category: "Adventure" },
            { name: "Chichén Itzá", revenue: 9800, margin: 18.5, category: "Culture" },
            { name: "Cozumel Snorkel", revenue: 7600, margin: 14.1, category: "Water Sports" },
            { name: "Playa del Carmen", revenue: 11200, margin: 16.8, category: "Leisure" },
            { name: "Tulum Ruins VIP", revenue: 6400, margin: 13.0, category: "Culture" },
            { name: "Xcaret Plus", revenue: 15200, margin: 12.5, category: "Parks" },
        ]
    }

    // Aggregate bookings by tourId
    const grouped: Record<number, { revenue: number; margins: number[] }> = {}
    const categories = ["Adventure", "Culture", "Water Sports", "Leisure", "Parks", "Nature"]

    for (const b of bookings) {
        const id = b.tourId as number
        const price = Number(b.totalPrice ?? 0)
        const net = Number(b.netRate ?? 0)
        const margin = price > 0 && net > 0 ? ((price - net) / price) * 100 : 0
        if (!grouped[id]) grouped[id] = { revenue: 0, margins: [] }
        grouped[id].revenue += price
        if (margin > 0) grouped[id].margins.push(margin)
    }

    const result: HeatmapData[] = Object.entries(grouped)
        .slice(0, 6)
        .map(([tourId, data], i) => ({
            name: `Tour #${tourId}`,
            revenue: Math.round(data.revenue),
            margin: data.margins.length > 0
                ? parseFloat((data.margins.reduce((a, b) => a + b, 0) / data.margins.length).toFixed(1))
                : 15.0,
            category: categories[i % categories.length]
        }))

    return result
}

/**
 * Fetches recent booking activity for the auditing feed.
 */
export async function getRecentAuditActivity(): Promise<{ name: string; delta: string; status: string; date: string }[]> {
    const recent = await prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        where: { status: { not: 'cancelled' } },
        select: {
            tourId: true,
            totalPrice: true,
            netRate: true,
            createdAt: true
        }
    })

    if (!recent || recent.length === 0) {
        return [
            { name: "Cozumel Ferry Tours", delta: "+2.4%", status: "Warning", date: "Hace 2h" },
            { name: "Sian Ka'an Adventure", delta: "-0.5%", status: "Stable", date: "Hace 5h" },
            { name: "Isla Mujeres Catamaran", delta: "+1.8%", status: "Warning", date: "Ayer" },
        ]
    }

    const now = new Date()
    return recent.slice(0, 4).map((b: any) => {
        const price = Number(b.totalPrice ?? 0)
        const net = Number(b.netRate ?? 0)
        const marginDelta = price > 0 ? (((price - net) / price) * 100).toFixed(1) : "0.0"
        const isWarning = parseFloat(marginDelta) > 2.0

        const diffMs = now.getTime() - new Date(b.createdAt).getTime()
        const diffH = Math.floor(diffMs / 3600000)
        const date = diffH < 1 ? "Hace momentos" : diffH < 24 ? `Hace ${diffH}h` : "Ayer"

        return {
            name: `Booking #${b.tourId}`,
            delta: `+${marginDelta}%`,
            status: isWarning ? "Warning" : "Stable",
            date
        }
    })
}

import { prisma } from "@/lib/prisma"
import { calculateAgencyPricing } from "@/lib/pricing/net-rate-engine"

export interface CreateBookingInput {
    tourId: number
    customerName: string
    customerEmail?: string
    bookingDate: Date
    tourDate: Date
    adults: number
    children?: number
    infants?: number
    totalPrice: number // The final price from Bokun
    agentId?: string   // Clerk User ID if it's an agency booking
}

/**
 * Creates a booking record with financial auditing data.
 * If an agentId is provided, it calculates the net rate and commission.
 */
export async function createProcessedBooking(input: CreateBookingInput) {
    let netRate = input.totalPrice
    let commission = 0

    if (input.agentId) {
        // Fetch agency profile to get their specific markup rules
        const agencyProfile = await prisma.agencyProfile.findUnique({
            where: { userId: input.agentId }
        })

        if (agencyProfile) {
            // If we have a profile, we assume the totalPrice is the SELL price
            // and we calculate backwards or forwards depending on the source.
            // For now, let's assume T.H.R.I.V.E. standard:
            // Input totalPrice is what Bokun reported (Public or Negotiated)

            const markupFactor = Number(agencyProfile.defaultMarkup) || 1.15

            // netRate = total / markupFactor
            netRate = input.totalPrice / markupFactor
            commission = input.totalPrice - netRate
        }
    }

    return await prisma.booking.create({
        data: {
            tourId: input.tourId,
            customerName: input.customerName,
            customerEmail: input.customerEmail,
            bookingDate: input.bookingDate,
            tourDate: input.tourDate,
            adults: input.adults,
            children: input.children || 0,
            infants: input.infants || 0,
            totalPrice: input.totalPrice,
            status: "confirmed",
            agentId: input.agentId,
            netRate: netRate,
            commission: commission,
        }
    })
}

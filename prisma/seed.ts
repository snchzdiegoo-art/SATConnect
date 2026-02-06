import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Create demo tour
    const tour = await prisma.tour.upsert({
        where: { id: '1113066' },
        update: {},
        create: {
            id: '1113066',
            name: 'Holbox Dream Tour (Ejemplo)',
            provider: 'Mundo Maya',
            netRate: 1500,
            publicPrice: 3500,
            images: ['https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'],
            duration: '12 Hours',
            opsDays: 'Daily',
            cxlPolicy: '24 Hours',
            meetingPoint: 'Hotel Lobby',
            landingPageUrl: 'https://sat.travel/holbox',
            storytelling: 'Experience the magic of Holbox island, where crystal-clear waters meet pristine beaches. This full-day adventure includes swimming with whale sharks (seasonal), exploring the mangroves, and enjoying fresh seafood on the beach.',
            channelLogs: {
                create: [
                    { channel: 'expedia', status: 'Active' },
                    { channel: 'viator', status: 'Active' },
                    { channel: 'gyg', status: 'Active' },
                    { channel: 'civitatis', status: 'Active' }
                ]
            }
        },
        include: { channelLogs: true }
    })

    console.log('✅ Created tour:', tour.name)

    // Create demo booking
    const booking = await prisma.booking.create({
        data: {
            tourId: tour.id,
            customerName: 'Diego Sánchez',
            customerEmail: 'diego@example.com',
            bookingDate: new Date(),
            tourDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            adults: 2,
            children: 1,
            totalPrice: 3500,
            status: 'confirmed'
        }
    })

    console.log('✅ Created booking:', booking.id)
    console.log('🎉 Seed complete!')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Seed failed:', e)
        await prisma.$disconnect()
        process.exit(1)
    })

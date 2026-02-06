import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearTours() {
    try {
        console.log('🗑️  Deleting all bookings...')
        const deletedBookings = await prisma.booking.deleteMany()
        console.log(`✅ Deleted ${deletedBookings.count} bookings`)

        console.log('🗑️  Deleting all channel logs...')
        const deletedLogs = await prisma.channelLog.deleteMany()
        console.log(`✅ Deleted ${deletedLogs.count} channel logs`)

        console.log('🗑️  Deleting all tours...')
        const deletedTours = await prisma.tour.deleteMany()
        console.log(`✅ Deleted ${deletedTours.count} tours`)

        console.log('🎉 Database cleared successfully!')
    } catch (error) {
        console.error('❌ Error clearing database:', error)
    } finally {
        await prisma.$disconnect()
    }
}

clearTours()

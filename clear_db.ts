import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function clearDatabase() {
    try {
        console.log('🗑️ Clearing database...')
        // Delete all tours - cascade will handle related tables
        const deleted = await prisma.tour.deleteMany({})
        console.log(`✅ Deleted ${deleted.count} tours and related data.`)
    } catch (error) {
        console.error('❌ Error clearing database:', error)
    } finally {
        await prisma.$disconnect()
    }
}

clearDatabase()

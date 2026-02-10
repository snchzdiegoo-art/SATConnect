
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing all Tour data...');

    // Due to cascade delete, deleting Tours should delete related Pricing, Logistics, etc.
    // But let's check schema if explicit deletes are needed. 
    // Assuming standard relation setup.

    try {
        const deleted = await prisma.tour.deleteMany({});
        console.log(`Deleted ${deleted.count} tours.`);
    } catch (e) {
        console.error('Error deleting tours:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();

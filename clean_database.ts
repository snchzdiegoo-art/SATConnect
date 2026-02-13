
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
    console.log('🧹 Starting database cleanup...');

    try {
        // Delete in order to avoid foreign key constraints (though Cascade should handle it, explicit is safer for feedback)

        console.log('   Deleting Tour Audits...');
        await prisma.tourAudit.deleteMany();

        console.log('   Deleting Tour Distribution...');
        await prisma.tourDistribution.deleteMany();

        console.log('   Deleting Tour Assets...');
        await prisma.tourAssets.deleteMany();

        console.log('   Deleting Tour Logistics...');
        await prisma.tourLogistics.deleteMany();

        console.log('   Deleting Tour Pricing...');
        await prisma.tourPricing.deleteMany();

        console.log('   Deleting Tour Variants...');
        await prisma.tourVariant.deleteMany();

        console.log('   Deleting Tour Custom Field Values...');
        await prisma.tourCustomFieldValue.deleteMany();

        console.log('   Deleting Tours...');
        const match = await prisma.tour.deleteMany();

        console.log(`\n✅ Database cleaned successfully!`);
        console.log(`   Removed ${match.count} tours.`);

    } catch (error) {
        console.error('❌ Error cleaning database:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

cleanDatabase()
    .catch((e) => {
        console.error('Fatal cleanup error:', e);
        process.exit(1);
    });

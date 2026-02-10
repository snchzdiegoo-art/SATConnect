import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkFactorValues() {
    console.log('Fetching all tours with pricing data...\n');

    const tours = await prisma.tour.findMany({
        include: {
            pricing: true
        },
        take: 10
    });

    console.log(`Found ${tours.length} tours\n`);

    for (const tour of tours) {
        console.log(`Tour ID: ${tour.id}, Bokun ID: ${tour.bokun_id}`);
        console.log(`Product: ${tour.product_name}`);

        if (tour.pricing) {
            console.log(`  Shared Factor: ${tour.pricing.shared_factor}`);
            console.log(`  Private Factor: ${tour.pricing.private_factor}`);
            console.log(`  Net Rate Adult: ${tour.pricing.net_rate_adult}`);
        } else {
            console.log('  No pricing data');
        }
        console.log('---');
    }

    await prisma.$disconnect();
}

checkFactorValues().catch((e) => {
    console.error('Error:', e);
    process.exit(1);
});

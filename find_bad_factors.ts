import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findBadFactors() {
    console.log('Searching for tours with factors outside 0.5-10.0 range...\n');

    const allPricing = await prisma.tourPricing.findMany({
        include: {
            tour: {
                select: {
                    id: true,
                    bokun_id: true,
                    product_name: true
                }
            }
        }
    });

    console.log(`Checking ${allPricing.length} pricing records...\n`);

    const badFactors = allPricing.filter(p => {
        const sharedFactor = parseFloat(p.shared_factor.toString());
        const privateFactor = parseFloat(p.private_factor.toString());
        return sharedFactor < 0.5 || sharedFactor > 10.0 || privateFactor < 0.5 || privateFactor > 10.0;
    });

    console.log(`Found ${badFactors.length} tours with invalid factors:\n`);

    for (const p of badFactors) {
        console.log(`Tour ID: ${p.tour.id}, Bokun ID: ${p.tour.bokun_id}`);
        console.log(`Product: ${p.tour.product_name}`);
        console.log(`  Shared Factor: ${p.shared_factor} (${typeof p.shared_factor})`);
        console.log(`  Private Factor: ${p.private_factor} (${typeof p.private_factor})`);
        console.log('---');
    }

    await prisma.$disconnect();
}

findBadFactors().catch((e) => {
    console.error('Error:', e);
    process.exit(1);
});


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function countIncomplete() {
    const count = await prisma.tourAudit.count({
        where: {
            product_health_score: 'Incomplete'
        }
    });

    console.log(`Tours with 'Incomplete' health score: ${count}`);

    if (count > 0) {
        const sample = await prisma.tourAudit.findFirst({
            where: { product_health_score: 'Incomplete' },
            include: { tour: true }
        });
        console.log('Sample incomplete tour:', sample?.tour.product_name);
    }
}

countIncomplete()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Prisma Client Keys:', Object.keys(prisma));
    console.log('Is valid instance?', prisma instanceof PrismaClient);

    // Check specific models
    // @ts-ignore
    console.log('distributionChannel exists?', !!prisma.distributionChannel);
    // @ts-ignore
    console.log('supplier exists?', !!prisma.supplier);
    // @ts-ignore
    console.log('tour exists?', !!prisma.tour);
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });

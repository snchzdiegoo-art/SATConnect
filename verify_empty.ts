
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const count = await prisma.tour.count();
    console.log('Tour Count:', count);
    if (count === 0) console.log('✅ Database is empty.');
    else console.log('Warning: Database is NOT empty.');
}
main().catch(console.error).finally(() => prisma.$disconnect());

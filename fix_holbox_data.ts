
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixHolboxData() {
    try {
        const bokunId = 1113066;
        console.log(`Searching for tour with Bokun ID: ${bokunId}...`);

        const tour = await prisma.tour.findFirst({
            where: { bokun_id: bokunId },
            include: { logistics: true }
        });

        if (!tour) {
            console.error('Tour not found!');
            return;
        }

        console.log(`Found tour: ${tour.product_name} (ID: ${tour.id})`);
        console.log(`Current Operation Days: ${tour.logistics?.days_of_operation ?? 'N/A'}`);

        // Update Logistics
        if (tour.logistics) {
            await prisma.tourLogistics.update({
                where: { id: tour.logistics.id },
                data: {
                    days_of_operation: "Thursdays and Saturdays"
                }
            });
            console.log('Updated existing logistics.');
        } else {
            await prisma.tourLogistics.create({
                data: {
                    tour_id: tour.id,
                    days_of_operation: "Thursdays and Saturdays"
                }
            });
            console.log('Created new logistics record.');
        }

        // Verify
        const updatedTour = await prisma.tour.findUnique({
            where: { id: tour.id },
            include: { logistics: true }
        });

        console.log(`New Operation Days: ${updatedTour?.logistics?.days_of_operation}`);

    } catch (error) {
        console.error('Error updating tour:', error);
    } finally {
        await prisma.$disconnect();
    }
}

fixHolboxData();

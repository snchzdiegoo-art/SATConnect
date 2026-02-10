
import { PrismaClient } from '@prisma/client';
import { auditProductHealth, TourInput } from './src/lib/thrive-engine';

const prisma = new PrismaClient();

async function debug() {
    // Holbox tour ID from screenshot is 82 (Internal) or Bokun ID 1113066
    const tour = await prisma.tour.findFirst({
        where: { bokun_id: 1113066 }, // Using Bokun ID from screenshot
        include: {
            pricing: true,
            logistics: true,
            assets: true,
            distribution: true,
            variants: true,
            custom_fields: true
        }
    });

    if (!tour) {
        console.log('Tour not found!');
        return;
    }

    console.log('Found Tour:', tour.product_name);

    // Map to TourInput (copied logic from page.tsx)
    const tourInput: TourInput = {
        id: tour.id.toString(),
        name: tour.product_name,
        provider: tour.supplier,
        netRate: tour.pricing?.net_rate_adult ? Number(tour.pricing.net_rate_adult) : null,
        publicPrice: null, // Not in DB directly, checking logic

        netChild: tour.pricing?.net_rate_child ? Number(tour.pricing.net_rate_child) : undefined,

        netPrivate: tour.pricing?.net_rate_private ? Number(tour.pricing.net_rate_private) : undefined,

        minPaxShared: tour.pricing?.shared_min_pax,
        minPaxPrivate: tour.pricing?.private_min_pax,
        infantAge: tour.pricing?.infant_age_threshold?.toString(),

        factorShared: tour.pricing?.shared_factor ? Number(tour.pricing.shared_factor) : undefined,
        factorPrivate: tour.pricing?.private_factor ? Number(tour.pricing.private_factor) : undefined,

        images: tour.assets?.pictures_url ? [tour.assets.pictures_url] : [],
        duration: tour.logistics?.duration,
        opsDays: tour.logistics?.days_of_operation,
        cxlPolicy: tour.logistics?.cxl_policy,
        meetingPoint: tour.logistics?.meeting_point_info || tour.logistics?.pickup_info,

        landingPageUrl: tour.assets?.landing_page_url,
        storytelling: tour.assets?.storytelling_url,

        extraFees: tour.pricing?.extra_fees,
        lastUpdate: tour.last_update?.toISOString(),
        auditNotes: tour.assets?.notes,

        location: tour.location,
    };

    console.log('Tour Input for Audit:', JSON.stringify(tourInput, null, 2));

    const health = auditProductHealth(tourInput);
    console.log('Health Audit Result:', health);
}

debug();

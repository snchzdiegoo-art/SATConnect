/**
 * SAT Connect - T.H.R.I.V.E. Database Seed Script
 * Populates database with example tours showcasing different health statuses
 */

import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting T.H.R.I.V.E. database seed...\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.tourAudit.deleteMany();
    await prisma.tourDistribution.deleteMany();
    await prisma.tourAssets.deleteMany();
    await prisma.tourLogistics.deleteMany();
    await prisma.tourPricing.deleteMany();
    await prisma.tour.deleteMany();
    console.log('✅ Database cleared\n');

    // ===================================================================
    // Tour 1: Chichen Itza All-Inclusive (HEALTHY - Complete)
    // ===================================================================
    console.log('Creating Tour 1: Chichen Itza All-Inclusive (HEALTHY)...');
    const tour1 = await prisma.tour.create({
        data: {
            bokun_id: 1001,
            product_name: 'Chichen Itza All-Inclusive Adventure',
            supplier: 'Cancun Explorer Tours',
            location: 'Cancun, Quintana Roo',
            bokun_marketplace_status: 'Published',
            bokun_status: 'Active',
            is_active: true,
            is_audited: true,
            pricing: {
                create: {
                    net_rate_adult: new Decimal(65.00),
                    shared_factor: new Decimal(1.75),
                    net_rate_child: new Decimal(45.00),
                    infant_age_threshold: 5,
                    shared_min_pax: 2,
                    net_rate_private: new Decimal(400.00),
                    private_factor: new Decimal(1.60),
                    private_min_pax: 6,
                    private_min_pax_net_rate: new Decimal(400.00),
                    extra_fees: 'Includes lunch, entrance fees, and professional guide',
                },
            },
            logistics: {
                create: {
                    duration: 'Full Day (12 hours)',
                    days_of_operation: 'Daily',
                    cxl_policy: 'Free cancellation up to 24 hours before departure',
                    meeting_point_info: 'Hotel pickup available from all Cancun hotels',
                    pickup_info: 'Pickup starts at 7:00 AM. Exact time will be confirmed 24h before.',
                },
            },
            assets: {
                create: {
                    pictures_url: 'https://example.com/tours/chichen-itza/gallery',
                    landing_page_url: 'https://satconnect.mx/tours/chichen-itza-all-inclusive',
                    storytelling_url: 'https://example.com/stories/chichen-itza-wonder',
                    notes: 'Premier tour with excellent reviews. High conversion rate.',
                    capture_status: true,
                },
            },
            distribution: {
                create: {
                    website_markup: new Decimal(15.00),
                    marketplace_bokun_markup: new Decimal(10.00),
                    marketplace_b2b_markup: new Decimal(20.00),
                    viator_id: 'V12345',
                    viator_status: 'Active',
                    viator_commission_percent: new Decimal(25.00),
                    expedia_id: "987654",
                    expedia_status: 'Published',
                    project_expedition_id: "501",
                    project_expedition_status: 'Live',
                    klook_id: "77889",
                    klook_status: 'Active',
                },
            },
            audit: {
                create: {
                    product_health_score: 'HEALTHY',
                    otas_distribution_score: 80,
                    is_suitable_for_global_distribution: true,
                },
            },
        },
    });
    console.log(`✅ Created tour ${tour1.id}: ${tour1.product_name}\n`);

    // ===================================================================
    // Tour 2: Tulum Ruins Express (INCOMPLETE - Missing Storytelling)
    // ===================================================================
    console.log('Creating Tour 2: Tulum Ruins Express (INCOMPLETE)...');
    const tour2 = await prisma.tour.create({
        data: {
            bokun_id: 1002,
            product_name: 'Tulum Ruins Express Tour',
            supplier: 'Riviera Maya Adventures',
            location: 'Tulum, Quintana Roo',
            bokun_marketplace_status: 'Draft',
            bokun_status: 'Pending Review',
            is_active: true,
            is_audited: true,
            pricing: {
                create: {
                    net_rate_adult: new Decimal(55.00),
                    shared_factor: new Decimal(1.50),
                    net_rate_child: new Decimal(35.00),
                    infant_age_threshold: 4,
                    shared_min_pax: 2,
                    net_rate_private: new Decimal(300.00),
                    private_factor: new Decimal(1.50),
                    private_min_pax: 4,
                    private_min_pax_net_rate: new Decimal(300.00),
                },
            },
            logistics: {
                create: {
                    duration: 'Half Day (5 hours)',
                    days_of_operation: 'Monday, Wednesday, Friday, Sunday',
                    cxl_policy: '48 hour cancellation policy',
                    meeting_point_info: 'Meeting point at Tulum bus station',
                },
            },
            assets: {
                create: {
                    pictures_url: 'https://example.com/tours/tulum/gallery',
                    landing_page_url: null, // Missing!
                    storytelling_url: null, // Missing!
                    notes: 'New tour - content pending',
                    capture_status: false,
                },
            },
            distribution: {
                create: {
                    viator_status: 'Pending',
                    expedia_status: 'Not Listed',
                },
            },
            audit: {
                create: {
                    product_health_score: 'INCOMPLETE',
                    otas_distribution_score: 0,
                    is_suitable_for_global_distribution: false,
                },
            },
        },
    });
    console.log(`✅ Created tour ${tour2.id}: ${tour2.product_name}\n`);

    // ===================================================================
    // Tour 3: Holbox Day Trip (HEALTHY - Custom Factor 1.99)
    // ===================================================================
    console.log('Creating Tour 3: Holbox Day Trip (HEALTHY)...');
    const tour3 = await prisma.tour.create({
        data: {
            bokun_id: 1003,
            product_name: 'Holbox Island Paradise Day Trip',
            supplier: 'Yucatan Dreams',
            location: 'Holbox Island, Quintana Roo',
            bokun_marketplace_status: 'Published',
            bokun_status: 'Active',
            is_active: true,
            is_audited: true,
            pricing: {
                create: {
                    net_rate_adult: new Decimal(75.00),
                    shared_factor: new Decimal(1.99), // Custom high factor!
                    net_rate_child: new Decimal(55.00),
                    infant_age_threshold: 3,
                    shared_min_pax: 4,
                    net_rate_private: new Decimal(550.00),
                    private_factor: new Decimal(1.80),
                    private_min_pax: 8,
                    private_min_pax_net_rate: new Decimal(550.00),
                    extra_fees: 'Ferry tickets, snacks, and beverages included',
                },
            },
            logistics: {
                create: {
                    duration: 'Full Day (14 hours)',
                    days_of_operation: 'Tuesday, Thursday, Saturday',
                    cxl_policy: 'Free cancellation up to 48 hours in advance',
                    meeting_point_info: 'Pickup from Cancun and Playa del Carmen hotels',
                    pickup_info: 'Early morning departure at 6:00 AM',
                },
            },
            assets: {
                create: {
                    pictures_url: 'https://example.com/tours/holbox/gallery',
                    landing_page_url: 'https://satconnect.mx/tours/holbox-paradise',
                    storytelling_url: 'https://example.com/stories/holbox-magic',
                    notes: 'Premium island experience with whale shark season availability',
                    capture_status: true,
                },
            },
            distribution: {
                create: {
                    website_markup: new Decimal(18.00),
                    marketplace_b2b_markup: new Decimal(25.00),
                    viator_id: 'V67890',
                    viator_status: 'Active',
                    viator_commission_percent: new Decimal(20.00),
                    klook_id: 99887,
                    klook_status: 'Published',
                },
            },
            audit: {
                create: {
                    product_health_score: 'HEALTHY',
                    otas_distribution_score: 60,
                    is_suitable_for_global_distribution: true,
                },
            },
        },
    });
    console.log(`✅ Created tour ${tour3.id}: ${tour3.product_name}\n`);

    // ===================================================================
    // Tour 4: Cenote Adventure (AUDIT_REQUIRED - Not Audited Yet)
    // ===================================================================
    console.log('Creating Tour 4: Cenote Adventure (AUDIT_REQUIRED)...');
    const tour4 = await prisma.tour.create({
        data: {
            bokun_id: null,
            product_name: 'Cenote Swimming Adventure',
            supplier: 'Underground Wonders',
            location: 'Valladolid, Yucatan',
            is_active: false,
            is_audited: false, // Not audited!
            pricing: {
                create: {
                    net_rate_adult: new Decimal(40.00),
                    shared_factor: new Decimal(1.60),
                    net_rate_child: new Decimal(25.00),
                    infant_age_threshold: 6,
                    shared_min_pax: 2,
                },
            },
            logistics: {
                create: {
                    duration: 'Half Day (4 hours)',
                    days_of_operation: 'Daily',
                    cxl_policy: 'Standard 24h cancellation',
                },
            },
            assets: {
                create: {
                    pictures_url: 'https://example.com/tours/cenote/gallery',
                    notes: 'Pending SAT audit - new supplier',
                },
            },
            distribution: {
                create: {},
            },
            audit: {
                create: {
                    product_health_score: 'AUDIT_REQUIRED',
                    otas_distribution_score: 0,
                    is_suitable_for_global_distribution: false,
                },
            },
        },
    });
    console.log(`✅ Created tour ${tour4.id}: ${tour4.product_name}\n`);

    // ===================================================================
    // Summary
    // ===================================================================
    const totalTours = await prisma.tour.count();
    const healthyCount = await prisma.tourAudit.count({
        where: { product_health_score: 'HEALTHY' },
    });
    const incompleteCount = await prisma.tourAudit.count({
        where: { product_health_score: 'INCOMPLETE' },
    });
    const auditRequiredCount = await prisma.tourAudit.count({
        where: { product_health_score: 'AUDIT_REQUIRED' },
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Seed Completed Successfully!\n');
    console.log(`📊 Summary:`);
    console.log(`   Total Tours: ${totalTours}`);
    console.log(`   ⭐ Healthy: ${healthyCount}`);
    console.log(`   ❌ Incomplete: ${incompleteCount}`);
    console.log(`   ⚠️  Audit Required: ${auditRequiredCount}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
    .catch((error) => {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

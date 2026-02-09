-- CreateTable
CREATE TABLE "tours" (
    "id" SERIAL NOT NULL,
    "bokun_id" INTEGER,
    "product_name" TEXT NOT NULL,
    "supplier" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "bokun_marketplace_status" TEXT,
    "bokun_status" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_audited" BOOLEAN NOT NULL DEFAULT false,
    "last_update" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_pricing" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "net_rate_adult" DECIMAL(10,2) NOT NULL,
    "shared_factor" DECIMAL(4,2) NOT NULL DEFAULT 1.5,
    "net_rate_child" DECIMAL(10,2),
    "infant_age_threshold" INTEGER,
    "shared_min_pax" INTEGER,
    "net_rate_private" DECIMAL(10,2),
    "private_factor" DECIMAL(4,2) NOT NULL DEFAULT 1.5,
    "private_min_pax" INTEGER,
    "private_min_pax_net_rate" DECIMAL(10,2),
    "extra_fees" TEXT,

    CONSTRAINT "tour_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_logistics" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "duration" TEXT,
    "days_of_operation" TEXT,
    "cxl_policy" TEXT,
    "meeting_point_info" TEXT,
    "pickup_info" TEXT,

    CONSTRAINT "tour_logistics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_assets" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "pictures_url" TEXT,
    "landing_page_url" TEXT,
    "storytelling_url" TEXT,
    "notes" TEXT,
    "capture_status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tour_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_distribution" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "website_markup" DECIMAL(5,2),
    "marketplace_bokun_markup" DECIMAL(5,2),
    "marketplace_b2b_markup" DECIMAL(5,2),
    "project_expedition_id" INTEGER,
    "project_expedition_status" TEXT,
    "expedia_id" INTEGER,
    "expedia_status" TEXT,
    "viator_id" TEXT,
    "viator_commission_percent" DECIMAL(5,2),
    "viator_status" TEXT,
    "klook_id" INTEGER,
    "klook_status" TEXT,
    "tur_com_status" TEXT,
    "tourist_com_status" TEXT,
    "headout_status" TEXT,
    "tourradar_status" TEXT,

    CONSTRAINT "tour_distribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_audit" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "product_health_score" TEXT NOT NULL DEFAULT 'INCOMPLETE',
    "otas_distribution_score" INTEGER NOT NULL DEFAULT 0,
    "is_suitable_for_global_distribution" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tour_audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_logs" (
    "id" TEXT NOT NULL,
    "tourId" INTEGER NOT NULL,
    "channel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "channel_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "tourId" INTEGER NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "tourDate" TIMESTAMP(3) NOT NULL,
    "adults" INTEGER NOT NULL DEFAULT 1,
    "children" INTEGER NOT NULL DEFAULT 0,
    "infants" INTEGER NOT NULL DEFAULT 0,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'confirmed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tours_bokun_id_key" ON "tours"("bokun_id");

-- CreateIndex
CREATE INDEX "tours_supplier_idx" ON "tours"("supplier");

-- CreateIndex
CREATE INDEX "tours_location_idx" ON "tours"("location");

-- CreateIndex
CREATE INDEX "tours_is_active_idx" ON "tours"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "tour_pricing_tour_id_key" ON "tour_pricing"("tour_id");

-- CreateIndex
CREATE UNIQUE INDEX "tour_logistics_tour_id_key" ON "tour_logistics"("tour_id");

-- CreateIndex
CREATE UNIQUE INDEX "tour_assets_tour_id_key" ON "tour_assets"("tour_id");

-- CreateIndex
CREATE UNIQUE INDEX "tour_distribution_tour_id_key" ON "tour_distribution"("tour_id");

-- CreateIndex
CREATE UNIQUE INDEX "tour_audit_tour_id_key" ON "tour_audit"("tour_id");

-- CreateIndex
CREATE INDEX "channel_logs_channel_status_idx" ON "channel_logs"("channel", "status");

-- CreateIndex
CREATE UNIQUE INDEX "channel_logs_tourId_channel_key" ON "channel_logs"("tourId", "channel");

-- CreateIndex
CREATE INDEX "bookings_tourId_idx" ON "bookings"("tourId");

-- CreateIndex
CREATE INDEX "bookings_bookingDate_idx" ON "bookings"("bookingDate");

-- CreateIndex
CREATE INDEX "bookings_status_idx" ON "bookings"("status");

-- AddForeignKey
ALTER TABLE "tour_pricing" ADD CONSTRAINT "tour_pricing_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_logistics" ADD CONSTRAINT "tour_logistics_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_assets" ADD CONSTRAINT "tour_assets_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_distribution" ADD CONSTRAINT "tour_distribution_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_audit" ADD CONSTRAINT "tour_audit_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

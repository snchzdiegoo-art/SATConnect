/*
  Warnings:

  - You are about to alter the column `shared_factor` on the `tour_pricing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,5)`.
  - You are about to alter the column `private_factor` on the `tour_pricing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(10,5)`.

*/
-- AlterTable
ALTER TABLE "tour_assets" ADD COLUMN     "pictures" TEXT[],
ADD COLUMN     "storytelling_content" TEXT;

-- AlterTable
ALTER TABLE "tour_logistics" ADD COLUMN     "blackout_dates" TIMESTAMP(3)[],
ADD COLUMN     "meeting_points" JSONB,
ADD COLUMN     "operation_hours" TEXT;

-- AlterTable
ALTER TABLE "tour_pricing" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'MXN',
ADD COLUMN     "operational_costs" DECIMAL(10,2),
ADD COLUMN     "public_rate" DECIMAL(10,2),
ADD COLUMN     "seasonal_rates" JSONB,
ALTER COLUMN "shared_factor" SET DATA TYPE DECIMAL(10,5),
ALTER COLUMN "private_factor" SET DATA TYPE DECIMAL(10,5);

-- AlterTable
ALTER TABLE "tours" ADD COLUMN     "location_city" TEXT,
ADD COLUMN     "location_state" TEXT,
ADD COLUMN     "supplier_id" INTEGER;

-- CreateTable
CREATE TABLE "suppliers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "contact_info" JSONB,
    "badges" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "profile_status" TEXT NOT NULL DEFAULT 'Complete',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distribution_channels" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "base_commission_percent" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distribution_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_channel_links" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "channel_id" INTEGER NOT NULL,
    "external_id" TEXT,
    "channel_commission_override" DECIMAL(5,2),
    "show_in_b2b_marketplace" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT,

    CONSTRAINT "tour_channel_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_name_key" ON "suppliers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "distribution_channels_name_key" ON "distribution_channels"("name");

-- CreateIndex
CREATE INDEX "tour_channel_links_tour_id_idx" ON "tour_channel_links"("tour_id");

-- CreateIndex
CREATE INDEX "tour_channel_links_channel_id_idx" ON "tour_channel_links"("channel_id");

-- CreateIndex
CREATE UNIQUE INDEX "tour_channel_links_tour_id_channel_id_key" ON "tour_channel_links"("tour_id", "channel_id");

-- CreateIndex
CREATE INDEX "tours_supplier_id_idx" ON "tours"("supplier_id");

-- CreateIndex
CREATE INDEX "tours_location_state_idx" ON "tours"("location_state");

-- CreateIndex
CREATE INDEX "tours_location_city_idx" ON "tours"("location_city");

-- AddForeignKey
ALTER TABLE "tours" ADD CONSTRAINT "tours_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_channel_links" ADD CONSTRAINT "tour_channel_links_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_channel_links" ADD CONSTRAINT "tour_channel_links_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "distribution_channels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

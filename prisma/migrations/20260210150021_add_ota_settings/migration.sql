-- AlterTable
ALTER TABLE "tour_distribution" ADD COLUMN     "expedia_commission" DECIMAL(5,2),
ADD COLUMN     "headout_commission" DECIMAL(5,2),
ADD COLUMN     "klook_commission" DECIMAL(5,2),
ADD COLUMN     "project_expedition_commission" DECIMAL(5,2),
ADD COLUMN     "tourist_com_commission" DECIMAL(5,2),
ADD COLUMN     "tourradar_commission" DECIMAL(5,2),
ADD COLUMN     "tur_com_commission" DECIMAL(5,2);

-- CreateTable
CREATE TABLE "global_ota_settings" (
    "id" SERIAL NOT NULL,
    "channel_key" TEXT NOT NULL,
    "channel_name" TEXT NOT NULL,
    "default_commission" DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "global_ota_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "global_ota_settings_channel_key_key" ON "global_ota_settings"("channel_key");

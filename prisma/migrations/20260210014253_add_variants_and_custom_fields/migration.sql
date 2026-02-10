-- AlterTable
ALTER TABLE "tour_distribution" ALTER COLUMN "project_expedition_id" SET DATA TYPE TEXT,
ALTER COLUMN "expedia_id" SET DATA TYPE TEXT,
ALTER COLUMN "klook_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "tour_pricing" ALTER COLUMN "shared_factor" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "private_factor" SET DATA TYPE DECIMAL(10,2);

-- CreateTable
CREATE TABLE "tour_variants" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "net_rate_adult" DECIMAL(10,2) NOT NULL,
    "net_rate_child" DECIMAL(10,2),
    "duration" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tour_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_field_definitions" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "options" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "custom_field_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tour_custom_field_values" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "definition_id" INTEGER NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "tour_custom_field_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "custom_field_definitions_key_key" ON "custom_field_definitions"("key");

-- CreateIndex
CREATE UNIQUE INDEX "tour_custom_field_values_tour_id_definition_id_key" ON "tour_custom_field_values"("tour_id", "definition_id");

-- AddForeignKey
ALTER TABLE "tour_variants" ADD CONSTRAINT "tour_variants_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_custom_field_values" ADD CONSTRAINT "tour_custom_field_values_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_custom_field_values" ADD CONSTRAINT "tour_custom_field_values_definition_id_fkey" FOREIGN KEY ("definition_id") REFERENCES "custom_field_definitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

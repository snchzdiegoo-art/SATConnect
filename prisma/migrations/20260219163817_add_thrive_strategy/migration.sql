-- CreateEnum
CREATE TYPE "SupplierTier" AS ENUM ('STANDARD', 'PRO', 'ELITE');

-- CreateEnum
CREATE TYPE "PricingMode" AS ENUM ('TOP_DOWN', 'BOTTOM_UP');

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "founded_at" TIMESTAMP(3),
ADD COLUMN     "tier" "SupplierTier" NOT NULL DEFAULT 'STANDARD';

-- AlterTable
ALTER TABLE "tour_audit" ADD COLUMN     "profit_shield_status" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quality_score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "risk_policy_status" TEXT NOT NULL DEFAULT 'MISSING';

-- AlterTable
ALTER TABLE "tour_pricing" ADD COLUMN     "manual_margin_factor" DECIMAL(10,5) NOT NULL DEFAULT 1.5,
ADD COLUMN     "pricing_mode" "PricingMode" NOT NULL DEFAULT 'BOTTOM_UP';

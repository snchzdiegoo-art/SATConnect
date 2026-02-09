-- CreateTable
CREATE TABLE "tour_change_logs" (
    "id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "change_type" TEXT NOT NULL,
    "field_name" TEXT,
    "old_value" TEXT,
    "new_value" TEXT,
    "user_id" TEXT NOT NULL,
    "user_name" TEXT,
    "user_email" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tour_change_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tour_change_logs_tour_id_idx" ON "tour_change_logs"("tour_id");

-- CreateIndex
CREATE INDEX "tour_change_logs_user_id_idx" ON "tour_change_logs"("user_id");

-- CreateIndex
CREATE INDEX "tour_change_logs_created_at_idx" ON "tour_change_logs"("created_at");

-- AddForeignKey
ALTER TABLE "tour_change_logs" ADD CONSTRAINT "tour_change_logs_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("id") ON DELETE CASCADE ON UPDATE CASCADE;

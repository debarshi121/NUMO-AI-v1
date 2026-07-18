-- AlterTable
ALTER TABLE "VehicleReport" ADD COLUMN     "reportData" JSONB,
ADD COLUMN     "reportGenerated" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "VehicleReport" ADD CONSTRAINT "VehicleReport_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

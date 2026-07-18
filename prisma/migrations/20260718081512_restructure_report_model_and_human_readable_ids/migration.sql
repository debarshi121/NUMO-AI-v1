-- DropForeignKey
ALTER TABLE "VehicleReport" DROP CONSTRAINT "VehicleReport_orderId_fkey";

-- DropForeignKey
ALTER TABLE "VehicleReport" DROP CONSTRAINT "VehicleReport_userId_fkey";

-- DropTable
DROP TABLE "VehicleReport";

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productType" "ProductType" NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT,
    "buyingPreferenceMonth" INTEGER,
    "vehicleRegNumber" TEXT,
    "vehicleColor" TEXT,
    "purchaseDate" TIMESTAMP(3),
    "reportData" JSONB,
    "reportGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Report_userId_idx" ON "Report"("userId");

-- CreateIndex
CREATE INDEX "Report_productType_idx" ON "Report"("productType");

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- CreateTable
CREATE TABLE "VehicleReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "buyingPreferenceMonth" INTEGER NOT NULL,
    "orderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VehicleReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VehicleReport_userId_idx" ON "VehicleReport"("userId");

-- AddForeignKey
ALTER TABLE "VehicleReport" ADD CONSTRAINT "VehicleReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

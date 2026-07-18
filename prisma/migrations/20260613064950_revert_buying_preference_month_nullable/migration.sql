/*
  Warnings:

  - Made the column `buyingPreferenceMonth` on table `VehicleReport` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "VehicleReport" ALTER COLUMN "buyingPreferenceMonth" SET NOT NULL,
ALTER COLUMN "buyingPreferenceMonth" SET DEFAULT 0;

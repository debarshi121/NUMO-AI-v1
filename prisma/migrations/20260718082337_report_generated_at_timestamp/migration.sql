-- AlterTable
ALTER TABLE "Report" DROP COLUMN "reportGenerated",
ADD COLUMN     "reportGeneratedAt" TIMESTAMPTZ(3);


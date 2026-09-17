-- AlterTable
ALTER TABLE "CheckIn" ADD COLUMN     "programWeekId" TEXT;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "activatedAt" TIMESTAMP(3),
ADD COLUMN     "deactivatedAt" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_programWeekId_fkey" FOREIGN KEY ("programWeekId") REFERENCES "ProgramWeek"("id") ON DELETE SET NULL ON UPDATE CASCADE;

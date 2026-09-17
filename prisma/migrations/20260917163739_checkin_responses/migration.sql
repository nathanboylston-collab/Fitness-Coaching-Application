/*
  Warnings:

  - You are about to drop the column `adherencePct` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the column `bodyWeight` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the column `energyLevel` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the column `sleepQuality` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the column `sorenessNotes` on the `CheckIn` table. All the data in the column will be lost.
  - You are about to drop the column `stressLevel` on the `CheckIn` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CheckInResponseType" AS ENUM ('RATING_1_10', 'NUMBER', 'BOOLEAN', 'TEXT');

-- AlterTable
ALTER TABLE "CheckIn" DROP COLUMN "adherencePct",
DROP COLUMN "bodyWeight",
DROP COLUMN "energyLevel",
DROP COLUMN "notes",
DROP COLUMN "sleepQuality",
DROP COLUMN "sorenessNotes",
DROP COLUMN "stressLevel";

-- CreateTable
CREATE TABLE "CheckInResponse" (
    "id" TEXT NOT NULL,
    "checkInId" TEXT NOT NULL,
    "questionKey" TEXT NOT NULL,
    "questionLabel" TEXT NOT NULL,
    "type" "CheckInResponseType" NOT NULL,
    "order" INTEGER NOT NULL,
    "numericValue" DOUBLE PRECISION,
    "textValue" TEXT,
    "boolValue" BOOLEAN,

    CONSTRAINT "CheckInResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CheckInResponse_checkInId_idx" ON "CheckInResponse"("checkInId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckInResponse_checkInId_questionKey_key" ON "CheckInResponse"("checkInId", "questionKey");

-- AddForeignKey
ALTER TABLE "CheckInResponse" ADD CONSTRAINT "CheckInResponse_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "CheckIn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

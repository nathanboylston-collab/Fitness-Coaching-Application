-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('INVITED', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "CheckInStatus" AS ENUM ('PENDING', 'COMPLETED', 'OVERDUE');

-- CreateTable
CREATE TABLE "Coach" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT,
    "coachId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "ClientStatus" NOT NULL DEFAULT 'INVITED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientProfile" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "goals" TEXT,
    "experienceLevel" "ExperienceLevel",
    "schedule" TEXT,
    "equipment" TEXT[],
    "preferences" TEXT,
    "limitations" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoachNote" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientInvite" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClientInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramWeek" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "ProgramWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "programWeekId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExercisePrescription" (
    "id" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "exerciseName" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" TEXT NOT NULL,
    "load" TEXT,
    "notes" TEXT,

    CONSTRAINT "ExercisePrescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckIn" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "weekOf" TIMESTAMP(3) NOT NULL,
    "status" "CheckInStatus" NOT NULL DEFAULT 'PENDING',
    "bodyWeight" DOUBLE PRECISION,
    "sleepQuality" INTEGER,
    "stressLevel" INTEGER,
    "energyLevel" INTEGER,
    "sorenessNotes" TEXT,
    "adherencePct" INTEGER,
    "notes" TEXT,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckIn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckInSummary" (
    "id" TEXT NOT NULL,
    "checkInId" TEXT NOT NULL,
    "summaryText" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CheckInSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coach_authUserId_key" ON "Coach"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_email_key" ON "Coach"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Client_authUserId_key" ON "Client"("authUserId");

-- CreateIndex
CREATE INDEX "Client_coachId_idx" ON "Client"("coachId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientProfile_clientId_key" ON "ClientProfile"("clientId");

-- CreateIndex
CREATE INDEX "CoachNote_clientId_idx" ON "CoachNote"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientInvite_clientId_key" ON "ClientInvite"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "ClientInvite_token_key" ON "ClientInvite"("token");

-- CreateIndex
CREATE INDEX "Program_clientId_idx" ON "Program"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramWeek_programId_weekNumber_key" ON "ProgramWeek"("programId", "weekNumber");

-- CreateIndex
CREATE INDEX "Workout_programWeekId_idx" ON "Workout"("programWeekId");

-- CreateIndex
CREATE INDEX "ExercisePrescription_workoutId_idx" ON "ExercisePrescription"("workoutId");

-- CreateIndex
CREATE INDEX "CheckIn_clientId_idx" ON "CheckIn"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckInSummary_checkInId_key" ON "CheckInSummary"("checkInId");

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientProfile" ADD CONSTRAINT "ClientProfile_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoachNote" ADD CONSTRAINT "CoachNote_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientInvite" ADD CONSTRAINT "ClientInvite_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramWeek" ADD CONSTRAINT "ProgramWeek_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_programWeekId_fkey" FOREIGN KEY ("programWeekId") REFERENCES "ProgramWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExercisePrescription" ADD CONSTRAINT "ExercisePrescription_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckIn" ADD CONSTRAINT "CheckIn_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckInSummary" ADD CONSTRAINT "CheckInSummary_checkInId_fkey" FOREIGN KEY ("checkInId") REFERENCES "CheckIn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

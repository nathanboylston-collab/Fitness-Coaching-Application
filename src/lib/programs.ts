import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getOwnedProgram(coachId: string, programId: string) {
  const program = await prisma.program.findFirst({
    where: { id: programId, client: { coachId } },
  });

  if (!program) {
    notFound();
  }

  return program;
}

export async function getOwnedWeek(coachId: string, weekId: string) {
  const week = await prisma.programWeek.findFirst({
    where: { id: weekId, program: { client: { coachId } } },
  });

  if (!week) {
    notFound();
  }

  return week;
}

export async function getOwnedWorkout(coachId: string, workoutId: string) {
  const workout = await prisma.workout.findFirst({
    where: { id: workoutId, programWeek: { program: { client: { coachId } } } },
  });

  if (!workout) {
    notFound();
  }

  return workout;
}

export async function getOwnedExercise(coachId: string, exerciseId: string) {
  const exercise = await prisma.exercisePrescription.findFirst({
    where: {
      id: exerciseId,
      workout: { programWeek: { program: { client: { coachId } } } },
    },
  });

  if (!exercise) {
    notFound();
  }

  return exercise;
}

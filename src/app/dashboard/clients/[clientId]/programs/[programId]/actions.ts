"use server";

import { revalidatePath } from "next/cache";
import { getCurrentCoach } from "@/lib/auth";
import {
  getOwnedExercise,
  getOwnedProgram,
  getOwnedWeek,
  getOwnedWorkout,
} from "@/lib/programs";
import { prisma } from "@/lib/prisma";

function revalidateProgram(clientId: string, programId: string) {
  revalidatePath(`/dashboard/clients/${clientId}/programs/${programId}`);
}

export async function addWeek(clientId: string, programId: string) {
  const coach = await getCurrentCoach();
  const program = await getOwnedProgram(coach.id, programId);

  const lastWeek = await prisma.programWeek.findFirst({
    where: { programId: program.id },
    orderBy: { weekNumber: "desc" },
  });

  await prisma.programWeek.create({
    data: { programId: program.id, weekNumber: (lastWeek?.weekNumber ?? 0) + 1 },
  });

  revalidateProgram(clientId, programId);
}

export async function deleteWeek(
  clientId: string,
  programId: string,
  weekId: string,
) {
  const coach = await getCurrentCoach();
  await getOwnedWeek(coach.id, weekId);

  await prisma.programWeek.delete({ where: { id: weekId } });

  revalidateProgram(clientId, programId);
}

export async function addWorkout(
  clientId: string,
  programId: string,
  weekId: string,
  formData: FormData,
) {
  const coach = await getCurrentCoach();
  await getOwnedWeek(coach.id, weekId);

  const dayOfWeek = Number(formData.get("dayOfWeek") ?? 1);
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.workout.create({
    data: { programWeekId: weekId, dayOfWeek, name },
  });

  revalidateProgram(clientId, programId);
}

export async function updateWorkout(
  clientId: string,
  programId: string,
  workoutId: string,
  formData: FormData,
) {
  const coach = await getCurrentCoach();
  await getOwnedWorkout(coach.id, workoutId);

  const dayOfWeek = Number(formData.get("dayOfWeek") ?? 1);
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;

  await prisma.workout.update({
    where: { id: workoutId },
    data: { dayOfWeek, name },
  });

  revalidateProgram(clientId, programId);
}

export async function deleteWorkout(
  clientId: string,
  programId: string,
  workoutId: string,
) {
  const coach = await getCurrentCoach();
  await getOwnedWorkout(coach.id, workoutId);

  await prisma.workout.delete({ where: { id: workoutId } });

  revalidateProgram(clientId, programId);
}

export async function addExercise(
  clientId: string,
  programId: string,
  workoutId: string,
  formData: FormData,
) {
  const coach = await getCurrentCoach();
  await getOwnedWorkout(coach.id, workoutId);

  const exerciseName = String(formData.get("exerciseName") ?? "").trim();
  const sets = Number(formData.get("sets") ?? 0);
  const reps = String(formData.get("reps") ?? "").trim();
  const load = String(formData.get("load") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  if (!exerciseName || !reps) return;

  const lastExercise = await prisma.exercisePrescription.findFirst({
    where: { workoutId },
    orderBy: { order: "desc" },
  });

  await prisma.exercisePrescription.create({
    data: {
      workoutId,
      order: (lastExercise?.order ?? 0) + 1,
      exerciseName,
      sets,
      reps,
      load,
      notes,
    },
  });

  revalidateProgram(clientId, programId);
}

export async function updateExercise(
  clientId: string,
  programId: string,
  exerciseId: string,
  formData: FormData,
) {
  const coach = await getCurrentCoach();
  await getOwnedExercise(coach.id, exerciseId);

  const exerciseName = String(formData.get("exerciseName") ?? "").trim();
  const sets = Number(formData.get("sets") ?? 0);
  const reps = String(formData.get("reps") ?? "").trim();
  const load = String(formData.get("load") ?? "").trim() || null;
  const notes = String(formData.get("notes") ?? "").trim() || null;
  if (!exerciseName || !reps) return;

  await prisma.exercisePrescription.update({
    where: { id: exerciseId },
    data: { exerciseName, sets, reps, load, notes },
  });

  revalidateProgram(clientId, programId);
}

export async function deleteExercise(
  clientId: string,
  programId: string,
  exerciseId: string,
) {
  const coach = await getCurrentCoach();
  await getOwnedExercise(coach.id, exerciseId);

  await prisma.exercisePrescription.delete({ where: { id: exerciseId } });

  revalidateProgram(clientId, programId);
}

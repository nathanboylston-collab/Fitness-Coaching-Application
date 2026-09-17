"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentCoach, getOwnedClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInviteToken, inviteExpiryDate } from "@/lib/invite-token";
import type { ExperienceLevel } from "@/generated/prisma/client";

export async function updateProfile(clientId: string, formData: FormData) {
  const coach = await getCurrentCoach();
  await getOwnedClient(coach.id, clientId);

  const goals = String(formData.get("goals") ?? "").trim() || null;
  const experienceLevel =
    (String(formData.get("experienceLevel") ?? "").trim() as ExperienceLevel) ||
    null;
  const schedule = String(formData.get("schedule") ?? "").trim() || null;
  const equipment = String(formData.get("equipment") ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const preferences = String(formData.get("preferences") ?? "").trim() || null;
  const limitations = String(formData.get("limitations") ?? "").trim() || null;

  await prisma.clientProfile.upsert({
    where: { clientId },
    create: {
      clientId,
      goals,
      experienceLevel,
      schedule,
      equipment,
      preferences,
      limitations,
    },
    update: { goals, experienceLevel, schedule, equipment, preferences, limitations },
  });

  revalidatePath(`/dashboard/clients/${clientId}`);
}

export async function addNote(clientId: string, formData: FormData) {
  const coach = await getCurrentCoach();
  await getOwnedClient(coach.id, clientId);

  const body = String(formData.get("body") ?? "").trim();
  if (!body) return;

  await prisma.coachNote.create({ data: { clientId, body } });

  revalidatePath(`/dashboard/clients/${clientId}`);
}

export async function toggleArchived(clientId: string) {
  const coach = await getCurrentCoach();
  const client = await getOwnedClient(coach.id, clientId);

  await prisma.client.update({
    where: { id: clientId },
    data: { status: client.status === "ARCHIVED" ? "ACTIVE" : "ARCHIVED" },
  });

  revalidatePath(`/dashboard/clients/${clientId}`);
}

export async function regenerateInvite(clientId: string) {
  const coach = await getCurrentCoach();
  await getOwnedClient(coach.id, clientId);

  await prisma.clientInvite.update({
    where: { clientId },
    data: {
      token: generateInviteToken(),
      expiresAt: inviteExpiryDate(),
      acceptedAt: null,
    },
  });

  revalidatePath(`/dashboard/clients/${clientId}`);
}

export async function sendCheckIn(clientId: string) {
  const coach = await getCurrentCoach();
  await getOwnedClient(coach.id, clientId);

  const existingPending = await prisma.checkIn.findFirst({
    where: { clientId, status: "PENDING" },
  });

  if (existingPending) {
    redirect(
      `/dashboard/clients/${clientId}?error=${encodeURIComponent(
        "This client already has a pending check-in.",
      )}`,
    );
  }

  await prisma.checkIn.create({
    data: { clientId, weekOf: new Date() },
  });

  revalidatePath(`/dashboard/clients/${clientId}`);
}

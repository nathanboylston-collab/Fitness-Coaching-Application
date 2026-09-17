"use server";

import { redirect } from "next/navigation";
import { getCurrentCoach, getOwnedClient } from "@/lib/auth";
import { getOwnedProgram } from "@/lib/programs";
import { prisma } from "@/lib/prisma";

export async function createProgram(clientId: string, formData: FormData) {
  const coach = await getCurrentCoach();
  const client = await getOwnedClient(coach.id, clientId);

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect(
      `/dashboard/clients/${client.id}/programs?error=${encodeURIComponent("Name is required.")}`,
    );
  }

  const existingCount = await prisma.program.count({
    where: { clientId: client.id },
  });

  const program = await prisma.program.create({
    data: {
      clientId: client.id,
      name,
      isActive: existingCount === 0,
      activatedAt: existingCount === 0 ? new Date() : null,
    },
  });

  redirect(`/dashboard/clients/${client.id}/programs/${program.id}`);
}

export async function setActiveProgram(programId: string) {
  const coach = await getCurrentCoach();
  const program = await getOwnedProgram(coach.id, programId);

  await prisma.$transaction([
    prisma.program.updateMany({
      where: { clientId: program.clientId, isActive: true },
      data: { isActive: false, deactivatedAt: new Date() },
    }),
    prisma.program.update({
      where: { id: program.id },
      data: { isActive: true, activatedAt: new Date(), deactivatedAt: null },
    }),
  ]);

  redirect(`/dashboard/clients/${program.clientId}/programs`);
}

export async function deleteProgram(programId: string) {
  const coach = await getCurrentCoach();
  const program = await getOwnedProgram(coach.id, programId);

  await prisma.program.delete({ where: { id: program.id } });

  redirect(`/dashboard/clients/${program.clientId}/programs`);
}

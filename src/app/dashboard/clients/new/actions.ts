"use server";

import { redirect } from "next/navigation";
import { getCurrentCoach } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInviteToken, inviteExpiryDate } from "@/lib/invite-token";

export async function addClient(formData: FormData) {
  const coach = await getCurrentCoach();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();

  if (!name || !email) {
    redirect(
      `/dashboard/clients/new?error=${encodeURIComponent("Name and email are required.")}`,
    );
  }

  const client = await prisma.client.create({
    data: {
      coachId: coach.id,
      name,
      email,
      invite: {
        create: {
          token: generateInviteToken(),
          expiresAt: inviteExpiryDate(),
        },
      },
    },
  });

  redirect(`/dashboard/clients/${client.id}`);
}

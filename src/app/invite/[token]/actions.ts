"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function acceptInvite(token: string, formData: FormData) {
  const password = String(formData.get("password") ?? "");

  const invite = await prisma.clientInvite.findUnique({
    where: { token },
    include: { client: true },
  });

  if (!invite) {
    redirect(`/invite/${token}?error=${encodeURIComponent("This invite link is invalid.")}`);
  }

  if (invite.acceptedAt) {
    redirect(
      `/invite/${token}?error=${encodeURIComponent("This invite has already been used.")}`,
    );
  }

  if (invite.expiresAt < new Date()) {
    redirect(
      `/invite/${token}?error=${encodeURIComponent("This invite has expired. Ask your coach to resend it.")}`,
    );
  }

  if (!password || password.length < 8) {
    redirect(
      `/invite/${token}?error=${encodeURIComponent("Password must be at least 8 characters.")}`,
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: invite.client.email,
    password,
  });

  if (error || !data.user) {
    redirect(
      `/invite/${token}?error=${encodeURIComponent(error?.message ?? "Could not create account.")}`,
    );
  }

  await prisma.$transaction([
    prisma.client.update({
      where: { id: invite.clientId },
      data: { authUserId: data.user.id, status: "ACTIVE" },
    }),
    prisma.clientInvite.update({
      where: { token },
      data: { acceptedAt: new Date() },
    }),
  ]);

  if (!data.session) {
    redirect(
      `/login?error=${encodeURIComponent("Account created — confirm your email, then log in.")}`,
    );
  }

  redirect("/client");
}

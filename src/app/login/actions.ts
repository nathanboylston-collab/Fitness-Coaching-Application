"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    redirect(`/login?error=${encodeURIComponent(error?.message ?? "Could not log in.")}`);
  }

  const coach = await prisma.coach.findUnique({ where: { authUserId: data.user.id } });
  if (coach) {
    redirect("/dashboard");
  }

  const client = await prisma.client.findUnique({ where: { authUserId: data.user.id } });
  if (client) {
    redirect("/client");
  }

  redirect(`/login?error=${encodeURIComponent("No account found for this login.")}`);
}

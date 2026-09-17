"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function signup(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    redirect(`/signup?error=${encodeURIComponent("All fields are required.")}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    redirect(
      `/signup?error=${encodeURIComponent(error?.message ?? "Could not create account.")}`,
    );
  }

  try {
    await prisma.coach.create({
      data: { authUserId: data.user.id, name, email },
    });
  } catch {
    redirect(
      `/signup?error=${encodeURIComponent("An account with that email already exists.")}`,
    );
  }

  if (!data.session) {
    redirect("/signup/check-email");
  }

  redirect("/dashboard");
}

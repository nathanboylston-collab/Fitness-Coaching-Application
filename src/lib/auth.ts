import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentCoach() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const coach = await prisma.coach.findUnique({
    where: { authUserId: user.id },
  });

  if (!coach) {
    redirect("/login");
  }

  return coach;
}

export async function getOwnedClient(coachId: string, clientId: string) {
  const client = await prisma.client.findFirst({
    where: { id: clientId, coachId },
  });

  if (!client) {
    notFound();
  }

  return client;
}

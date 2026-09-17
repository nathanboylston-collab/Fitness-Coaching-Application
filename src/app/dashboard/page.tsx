import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { logout } from "@/lib/auth-actions";

export default async function DashboardPage() {
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

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-4 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Welcome, {coach.name}</h1>
        <form action={logout}>
          <button type="submit" className="text-sm underline">
            Log out
          </button>
        </form>
      </div>
      <p className="text-gray-600">
        No clients yet — client management is coming in the next phase.
      </p>
    </main>
  );
}

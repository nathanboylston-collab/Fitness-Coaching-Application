import { redirect } from "next/navigation";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { logout } from "@/lib/auth-actions";

export default async function ClientHomePage() {
  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const client = await prisma.client.findUnique({
    where: { authUserId: user.id },
    include: { coach: true },
  });

  if (!client) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">You&apos;re connected with {client.coach.name}</h1>
      <p className="text-sm text-gray-600">
        Check-ins and programming will show up here soon.
      </p>
      <form action={logout}>
        <button type="submit" className="text-sm underline">
          Log out
        </button>
      </form>
    </main>
  );
}

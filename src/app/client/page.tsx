import Link from "next/link";
import { getCurrentClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logout } from "@/lib/auth-actions";

export default async function ClientHomePage() {
  const client = await getCurrentClient();

  const [coach, pendingCheckIns] = await Promise.all([
    prisma.coach.findUnique({ where: { id: client.coachId } }),
    prisma.checkIn.findMany({
      where: { clientId: client.id, status: "PENDING" },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-6 px-6 text-center">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          You&apos;re connected with {coach?.name}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Programming will show up here soon.
        </p>
      </div>

      {pendingCheckIns.length > 0 && (
        <div className="flex w-full flex-col gap-2 rounded-md border border-neutral-200 bg-neutral-50 p-4 text-left">
          <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Check-in due
          </h2>
          {pendingCheckIns.map((checkIn) => (
            <Link
              key={checkIn.id}
              href={`/client/checkins/${checkIn.id}`}
              className="text-sm font-medium text-neutral-900 underline"
            >
              Complete your check-in
            </Link>
          ))}
        </div>
      )}

      <form action={logout}>
        <button
          type="submit"
          className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          Log out
        </button>
      </form>
    </main>
  );
}

import Link from "next/link";
import { getCurrentCoach } from "@/lib/auth";
import { logout } from "@/lib/auth-actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const coach = await getCurrentCoach();

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="text-sm font-semibold tracking-tight text-neutral-900"
          >
            Coach OS
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">{coach.name}</span>
            <form action={logout}>
              <button
                type="submit"
                className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
              >
                Log out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  );
}

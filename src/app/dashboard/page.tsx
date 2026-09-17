import Link from "next/link";
import { getCurrentCoach } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logout } from "@/lib/auth-actions";

const STATUS_LABEL: Record<string, string> = {
  INVITED: "Invited",
  ACTIVE: "Active",
  ARCHIVED: "Archived",
};

export default async function DashboardPage() {
  const coach = await getCurrentCoach();

  const clients = await prisma.client.findMany({
    where: { coachId: coach.id },
    orderBy: { name: "asc" },
  });

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

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Clients</h2>
        <Link
          href="/dashboard/clients/new"
          className="rounded bg-black px-3 py-2 text-sm text-white"
        >
          Add client
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="text-gray-600">
          No clients yet — add your first client to get started.
        </p>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Email</th>
              <th className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="border-b last:border-0">
                <td className="py-2">
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="underline"
                  >
                    {client.name}
                  </Link>
                </td>
                <td className="py-2 text-gray-600">{client.email}</td>
                <td className="py-2 text-gray-600">
                  {STATUS_LABEL[client.status] ?? client.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

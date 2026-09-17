import Link from "next/link";
import { getCurrentCoach } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUS_STYLE: Record<string, string> = {
  INVITED: "bg-neutral-100 text-neutral-600",
  ACTIVE: "bg-emerald-50 text-emerald-700",
  ARCHIVED: "bg-neutral-100 text-neutral-400",
};

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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Clients
        </h1>
        <Link
          href="/dashboard/clients/new"
          className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Add client
        </Link>
      </div>

      {clients.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No clients yet — add your first client to get started.
        </p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-200 text-xs font-medium uppercase tracking-wide text-neutral-500">
              <th className="pb-3 pr-4 font-medium">Name</th>
              <th className="pb-3 pr-4 font-medium">Email</th>
              <th className="pb-3 pr-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-neutral-100 last:border-0"
              >
                <td className="py-3 pr-4 text-sm">
                  <Link
                    href={`/dashboard/clients/${client.id}`}
                    className="font-medium text-neutral-900 transition-colors hover:text-neutral-600"
                  >
                    {client.name}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-sm text-neutral-600">
                  {client.email}
                </td>
                <td className="py-3 pr-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[client.status] ?? "bg-neutral-100 text-neutral-600"}`}
                  >
                    {STATUS_LABEL[client.status] ?? client.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

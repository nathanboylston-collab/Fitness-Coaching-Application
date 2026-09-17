import Link from "next/link";
import { getCurrentCoach, getOwnedClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { primaryButtonStyle, inputStyle } from "@/lib/ui";
import { createProgram, deleteProgram, setActiveProgram } from "./actions";

export default async function ProgramsPage({
  params,
  searchParams,
}: {
  params: Promise<{ clientId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { clientId } = await params;
  const { error } = await searchParams;
  const coach = await getCurrentCoach();
  const client = await getOwnedClient(coach.id, clientId);

  const programs = await prisma.program.findMany({
    where: { clientId: client.id },
    orderBy: { createdAt: "desc" },
  });

  const boundCreateProgram = createProgram.bind(null, client.id);

  return (
    <div className="flex flex-col gap-8">
      <Link
        href={`/dashboard/clients/${client.id}`}
        className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        ← {client.name}
      </Link>

      <div>
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Programs
        </h1>
        <p className="mt-1 text-sm text-neutral-500">{client.name}</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="flex flex-col gap-4">
        {programs.length === 0 ? (
          <p className="text-sm text-neutral-500">No programs yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {programs.map((program) => (
              <li
                key={program.id}
                className="flex items-center justify-between border-t border-neutral-100 pt-3 first:border-0 first:pt-0"
              >
                <div className="flex flex-col gap-1">
                  <Link
                    href={`/dashboard/clients/${client.id}/programs/${program.id}`}
                    className="text-sm font-medium text-neutral-900 transition-colors hover:text-neutral-600"
                  >
                    {program.name}
                  </Link>
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      program.isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {program.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {!program.isActive && (
                    <form action={setActiveProgram.bind(null, program.id)}>
                      <button
                        type="submit"
                        className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                      >
                        Set active
                      </button>
                    </form>
                  )}
                  <form action={deleteProgram.bind(null, program.id)}>
                    <button
                      type="submit"
                      className="text-sm font-medium text-red-600 transition-colors hover:text-red-800"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-4 border-t border-neutral-200 pt-8">
        <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          New program
        </h2>
        <form action={boundCreateProgram} className="flex items-end gap-3">
          <label className="flex flex-1 flex-col gap-1.5">
            <span className="text-sm font-medium text-neutral-700">Name</span>
            <input
              name="name"
              type="text"
              required
              placeholder="e.g. Strength Block 1"
              className={inputStyle}
            />
          </label>
          <button type="submit" className={primaryButtonStyle}>
            Create
          </button>
        </form>
      </section>
    </div>
  );
}

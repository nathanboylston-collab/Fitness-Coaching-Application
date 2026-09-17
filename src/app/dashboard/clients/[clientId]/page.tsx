import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getCurrentCoach } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  addNote,
  regenerateInvite,
  toggleArchived,
  updateProfile,
} from "./actions";

const EXPERIENCE_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const coach = await getCurrentCoach();

  const client = await prisma.client.findFirst({
    where: { id: clientId, coachId: coach.id },
    include: {
      profile: true,
      invite: true,
      notes: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!client) {
    notFound();
  }

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host?.startsWith("localhost") ? "http" : "https";
  const inviteLink =
    client.invite && !client.invite.acceptedAt
      ? `${protocol}://${host}/invite/${client.invite.token}`
      : null;
  const inviteExpired = client.invite ? client.invite.expiresAt < new Date() : false;

  const boundUpdateProfile = updateProfile.bind(null, client.id);
  const boundAddNote = addNote.bind(null, client.id);
  const boundToggleArchived = toggleArchived.bind(null, client.id);
  const boundRegenerateInvite = regenerateInvite.bind(null, client.id);

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-8 px-4 py-12">
      <div>
        <Link href="/dashboard" className="text-sm underline">
          Back to dashboard
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{client.name}</h1>
          <p className="text-sm text-gray-600">{client.email}</p>
        </div>
        <form action={boundToggleArchived}>
          <button type="submit" className="rounded border px-3 py-2 text-sm">
            {client.status === "ARCHIVED" ? "Reactivate" : "Archive"}
          </button>
        </form>
      </div>

      {inviteLink && (
        <section className="flex flex-col gap-2 rounded border p-4">
          <h2 className="text-sm font-medium">
            {inviteExpired ? "Invite link (expired)" : "Invite link"}
          </h2>
          <p className="break-all text-sm text-gray-600">{inviteLink}</p>
          <form action={boundRegenerateInvite}>
            <button type="submit" className="text-sm underline">
              Regenerate link
            </button>
          </form>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Client profile</h2>
        <form action={boundUpdateProfile} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Goals
            <textarea
              name="goals"
              defaultValue={client.profile?.goals ?? ""}
              className="rounded border px-3 py-2"
              rows={2}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Experience level
            <select
              name="experienceLevel"
              defaultValue={client.profile?.experienceLevel ?? ""}
              className="rounded border px-3 py-2"
            >
              <option value="">Not set</option>
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Schedule / availability
            <textarea
              name="schedule"
              defaultValue={client.profile?.schedule ?? ""}
              className="rounded border px-3 py-2"
              rows={2}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Equipment (comma-separated)
            <input
              name="equipment"
              type="text"
              defaultValue={client.profile?.equipment.join(", ") ?? ""}
              className="rounded border px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Preferences
            <textarea
              name="preferences"
              defaultValue={client.profile?.preferences ?? ""}
              className="rounded border px-3 py-2"
              rows={2}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Limitations / considerations
            <textarea
              name="limitations"
              defaultValue={client.profile?.limitations ?? ""}
              className="rounded border px-3 py-2"
              rows={2}
            />
          </label>
          <button
            type="submit"
            className="self-start rounded bg-black px-3 py-2 text-sm text-white"
          >
            Save profile
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-medium">Coach notes</h2>
        <form action={boundAddNote} className="flex flex-col gap-2">
          <textarea
            name="body"
            placeholder="Add a note..."
            className="rounded border px-3 py-2 text-sm"
            rows={2}
          />
          <button
            type="submit"
            className="self-start rounded border px-3 py-2 text-sm"
          >
            Add note
          </button>
        </form>
        <ul className="flex flex-col gap-3">
          {client.notes.map((note) => (
            <li key={note.id} className="rounded border p-3 text-sm">
              <p>{note.body}</p>
              <p className="mt-1 text-xs text-gray-500">
                {note.createdAt.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

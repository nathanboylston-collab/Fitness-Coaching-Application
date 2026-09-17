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

const inputStyle =
  "rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900";
const labelStyle = "text-sm font-medium text-neutral-700";
const secondaryButtonStyle =
  "inline-flex items-center justify-center rounded-md border border-neutral-300 px-3.5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50";
const primaryButtonStyle =
  "inline-flex items-center justify-center self-start rounded-md bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700";

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
    <div className="flex flex-col gap-10">
      <Link
        href="/dashboard"
        className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        ← Clients
      </Link>

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
            {client.name}
          </h1>
          <p className="text-sm text-neutral-500">{client.email}</p>
          <span
            className={`mt-1 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[client.status] ?? "bg-neutral-100 text-neutral-600"}`}
          >
            {STATUS_LABEL[client.status] ?? client.status}
          </span>
        </div>
        <form action={boundToggleArchived}>
          <button type="submit" className={secondaryButtonStyle}>
            {client.status === "ARCHIVED" ? "Reactivate" : "Archive"}
          </button>
        </form>
      </div>

      {inviteLink && (
        <section className="flex flex-col gap-3 rounded-md border border-neutral-200 bg-neutral-50 p-4">
          <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {inviteExpired ? "Invite link (expired)" : "Invite link"}
          </h2>
          <p className="break-all text-sm text-neutral-700">{inviteLink}</p>
          <form action={boundRegenerateInvite}>
            <button
              type="submit"
              className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
            >
              Regenerate link
            </button>
          </form>
        </section>
      )}

      <section className="flex flex-col gap-5 border-t border-neutral-200 pt-8">
        <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Client profile
        </h2>
        <form action={boundUpdateProfile} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className={labelStyle}>Goals</span>
            <textarea
              name="goals"
              defaultValue={client.profile?.goals ?? ""}
              className={inputStyle}
              rows={2}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelStyle}>Experience level</span>
            <select
              name="experienceLevel"
              defaultValue={client.profile?.experienceLevel ?? ""}
              className={inputStyle}
            >
              <option value="">Not set</option>
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level.charAt(0) + level.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelStyle}>Schedule / availability</span>
            <textarea
              name="schedule"
              defaultValue={client.profile?.schedule ?? ""}
              className={inputStyle}
              rows={2}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelStyle}>Equipment (comma-separated)</span>
            <input
              name="equipment"
              type="text"
              defaultValue={client.profile?.equipment.join(", ") ?? ""}
              className={inputStyle}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelStyle}>Preferences</span>
            <textarea
              name="preferences"
              defaultValue={client.profile?.preferences ?? ""}
              className={inputStyle}
              rows={2}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelStyle}>Limitations / considerations</span>
            <textarea
              name="limitations"
              defaultValue={client.profile?.limitations ?? ""}
              className={inputStyle}
              rows={2}
            />
          </label>
          <button type="submit" className={`mt-2 ${primaryButtonStyle}`}>
            Save profile
          </button>
        </form>
      </section>

      <section className="flex flex-col gap-5 border-t border-neutral-200 pt-8">
        <h2 className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Coach notes
        </h2>
        <form action={boundAddNote} className="flex flex-col gap-3">
          <textarea
            name="body"
            placeholder="Add a note..."
            className={inputStyle}
            rows={2}
          />
          <button type="submit" className={secondaryButtonStyle + " self-start"}>
            Add note
          </button>
        </form>
        {client.notes.length > 0 && (
          <ul className="flex flex-col gap-4">
            {client.notes.map((note) => (
              <li
                key={note.id}
                className="border-t border-neutral-100 pt-4 text-sm first:border-0 first:pt-0"
              >
                <p className="text-neutral-800">{note.body}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  {note.createdAt.toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { acceptInvite } from "./actions";

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { token } = await params;
  const { error } = await searchParams;

  const invite = await prisma.clientInvite.findUnique({
    where: { token },
    include: { client: true },
  });

  if (!invite) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-3 px-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Invite not found
        </h1>
        <p className="text-sm text-neutral-500">
          This invite link isn&apos;t valid. Ask your coach for a new one.
        </p>
      </main>
    );
  }

  if (invite.acceptedAt) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-3 px-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Invite already used
        </h1>
        <p className="text-sm text-neutral-500">
          This invite has already been accepted. Try logging in instead.
        </p>
      </main>
    );
  }

  if (invite.expiresAt < new Date()) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-3 px-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Invite expired
        </h1>
        <p className="text-sm text-neutral-500">
          This invite link has expired. Ask your coach to send a new one.
        </p>
      </main>
    );
  }

  const boundAcceptInvite = acceptInvite.bind(null, token);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Welcome, {invite.client.name}
        </h1>
        <p className="text-sm text-neutral-500">
          Set a password to finish creating your account.
        </p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <form action={boundAcceptInvite} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-neutral-700">
            Password
          </span>
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </label>
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Create account
        </button>
      </form>
    </main>
  );
}

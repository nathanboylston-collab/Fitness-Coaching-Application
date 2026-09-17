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
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Invite not found</h1>
        <p className="text-sm text-gray-600">
          This invite link isn&apos;t valid. Ask your coach for a new one.
        </p>
      </main>
    );
  }

  if (invite.acceptedAt) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Invite already used</h1>
        <p className="text-sm text-gray-600">
          This invite has already been accepted. Try logging in instead.
        </p>
      </main>
    );
  }

  if (invite.expiresAt < new Date()) {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Invite expired</h1>
        <p className="text-sm text-gray-600">
          This invite link has expired. Ask your coach to send a new one.
        </p>
      </main>
    );
  }

  const boundAcceptInvite = acceptInvite.bind(null, token);

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <div>
        <h1 className="text-2xl font-semibold">Welcome, {invite.client.name}</h1>
        <p className="text-sm text-gray-600">
          Set a password to finish creating your account.
        </p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <form action={boundAcceptInvite} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="rounded border px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded bg-black px-3 py-2 text-white"
        >
          Create account
        </button>
      </form>
    </main>
  );
}

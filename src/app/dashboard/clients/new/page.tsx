import Link from "next/link";
import { addClient } from "./actions";

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-4">
      <h1 className="text-2xl font-semibold">Add a client</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <form action={addClient} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input name="name" type="text" required className="rounded border px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            className="rounded border px-3 py-2"
          />
        </label>
        <button
          type="submit"
          className="rounded bg-black px-3 py-2 text-white"
        >
          Add client
        </button>
      </form>
      <Link href="/dashboard" className="text-sm underline">
        Back to dashboard
      </Link>
    </main>
  );
}

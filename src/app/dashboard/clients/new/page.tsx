import Link from "next/link";
import { addClient } from "./actions";

export default async function NewClientPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex max-w-md flex-col gap-6">
      <Link
        href="/dashboard"
        className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        ← Clients
      </Link>

      <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
        Add a client
      </h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <form action={addClient} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-neutral-700">Name</span>
          <input
            name="name"
            type="text"
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-neutral-700">Email</span>
          <input
            name="email"
            type="email"
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </label>
        <button
          type="submit"
          className="mt-2 inline-flex items-center justify-center self-start rounded-md bg-neutral-900 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
        >
          Add client
        </button>
      </form>
    </div>
  );
}

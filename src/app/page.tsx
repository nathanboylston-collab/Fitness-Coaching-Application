import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl font-semibold">Coach OS</h1>
      <p className="text-gray-600">
        Spend less time managing clients and more time coaching them.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded bg-black px-4 py-2 text-white"
        >
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded border px-4 py-2"
        >
          Sign up
        </Link>
      </div>
    </main>
  );
}

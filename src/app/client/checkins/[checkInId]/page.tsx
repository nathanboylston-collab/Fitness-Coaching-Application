import { notFound } from "next/navigation";
import { getCurrentClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckInForm } from "./CheckInForm";

export default async function ClientCheckInPage({
  params,
}: {
  params: Promise<{ checkInId: string }>;
}) {
  const { checkInId } = await params;
  const client = await getCurrentClient();

  const checkIn = await prisma.checkIn.findFirst({
    where: { id: checkInId, clientId: client.id },
  });

  if (!checkIn) {
    notFound();
  }

  if (checkIn.status === "COMPLETED") {
    return (
      <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Check-in submitted
        </h1>
        <p className="text-sm text-neutral-500">
          Thanks — you submitted this check-in
          {checkIn.submittedAt ? ` on ${checkIn.submittedAt.toLocaleString()}` : ""}.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-6 py-12">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Weekly check-in
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Week of {checkIn.weekOf.toLocaleDateString()}
        </p>
      </div>
      <CheckInForm checkInId={checkIn.id} />
    </main>
  );
}

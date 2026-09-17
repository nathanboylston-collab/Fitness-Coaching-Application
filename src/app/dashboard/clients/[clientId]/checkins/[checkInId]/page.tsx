import Link from "next/link";
import { getCurrentCoach } from "@/lib/auth";
import { getOwnedCheckIn } from "@/lib/checkins";
import { CHECKIN_QUESTIONS } from "@/lib/checkin-questions";

function formatResponseValue(
  response: { type: string; numericValue: number | null; textValue: string | null; boolValue: boolean | null } | undefined,
) {
  if (!response) return null;
  switch (response.type) {
    case "BOOLEAN":
      return response.boolValue ? "Yes" : "No";
    case "RATING_1_10":
      return `${response.numericValue} / 10`;
    case "NUMBER":
      return String(response.numericValue);
    default:
      return response.textValue;
  }
}

export default async function CoachCheckInViewPage({
  params,
}: {
  params: Promise<{ clientId: string; checkInId: string }>;
}) {
  const { clientId, checkInId } = await params;
  const coach = await getCurrentCoach();
  const checkIn = await getOwnedCheckIn(coach.id, checkInId);

  const responseByKey = new Map(checkIn.responses.map((r) => [r.questionKey, r]));

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <Link
        href={`/dashboard/clients/${clientId}`}
        className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        ← {checkIn.client.name}
      </Link>

      <div>
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          Check-in: Week of {checkIn.weekOf.toLocaleDateString()}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          {checkIn.status === "COMPLETED" && checkIn.submittedAt
            ? `Submitted ${checkIn.submittedAt.toLocaleString()}`
            : "Not yet submitted"}
        </p>
      </div>

      {checkIn.status !== "COMPLETED" ? (
        <p className="text-sm text-neutral-500">
          This check-in hasn&apos;t been completed yet.
        </p>
      ) : (
        <dl className="flex flex-col gap-5">
          {CHECKIN_QUESTIONS.map((question) => {
            const response = responseByKey.get(question.key);
            const value = formatResponseValue(response);
            return (
              <div
                key={question.key}
                className="border-t border-neutral-100 pt-4 first:border-0 first:pt-0"
              >
                <dt className="text-sm text-neutral-500">{question.label}</dt>
                <dd className="mt-1 text-sm text-neutral-900">
                  {value ? (
                    value
                  ) : (
                    <span className="text-neutral-400">Not answered</span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      )}
    </div>
  );
}

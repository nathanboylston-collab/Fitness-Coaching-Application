"use server";

import { notFound, redirect } from "next/navigation";
import { getCurrentClient } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CHECKIN_QUESTIONS } from "@/lib/checkin-questions";
import type { CheckInResponseType } from "@/generated/prisma/client";

export type CheckInFormState = {
  error?: string;
  values: Record<string, string>;
  attempt: number;
};

export async function submitCheckIn(
  checkInId: string,
  prevState: CheckInFormState,
  formData: FormData,
): Promise<CheckInFormState> {
  const client = await getCurrentClient();

  const checkIn = await prisma.checkIn.findFirst({
    where: { id: checkInId, clientId: client.id },
  });

  if (!checkIn) {
    notFound();
  }

  if (checkIn.status === "COMPLETED") {
    redirect(`/client/checkins/${checkInId}`);
  }

  const rawValues: Record<string, string> = {};
  for (const q of CHECKIN_QUESTIONS) {
    rawValues[q.key] = String(formData.get(q.key) ?? "").trim();
  }
  const bump = { values: rawValues, attempt: prevState.attempt + 1 };

  for (const q of CHECKIN_QUESTIONS) {
    if (q.required && !rawValues[q.key]) {
      return { ...bump, error: `Please answer: ${q.label}` };
    }
  }

  if (rawValues.hasSymptoms === "true" && !rawValues.symptomsDetails) {
    return {
      ...bump,
      error:
        "Please describe what you experienced and which exercises or activities were affected.",
    };
  }

  for (const q of CHECKIN_QUESTIONS) {
    if (!rawValues[q.key]) continue;
    const n = Number(rawValues[q.key]);
    if (q.type === "RATING_1_10" && (Number.isNaN(n) || n < 1 || n > 10)) {
      return { ...bump, error: `${q.label} must be a number between 1 and 10.` };
    }
    if (q.type === "NUMBER" && (Number.isNaN(n) || n < 0)) {
      return { ...bump, error: `${q.label} must be a valid number.` };
    }
  }

  const responsesData = CHECKIN_QUESTIONS.flatMap((q) => {
    const raw = rawValues[q.key];
    if (!raw) return [];
    return [
      {
        checkInId,
        questionKey: q.key,
        questionLabel: q.label,
        type: q.type as CheckInResponseType,
        order: q.order,
        numericValue:
          q.type === "RATING_1_10" || q.type === "NUMBER" ? Number(raw) : null,
        textValue: q.type === "TEXT" ? raw : null,
        boolValue: q.type === "BOOLEAN" ? raw === "true" : null,
      },
    ];
  });

  await prisma.$transaction(async (tx) => {
    const fresh = await tx.checkIn.findUnique({ where: { id: checkInId } });
    if (!fresh || fresh.status === "COMPLETED") return;

    await tx.checkInResponse.createMany({ data: responsesData });
    await tx.checkIn.update({
      where: { id: checkInId },
      data: { status: "COMPLETED", submittedAt: new Date() },
    });
  });

  redirect(`/client/checkins/${checkInId}`);
}

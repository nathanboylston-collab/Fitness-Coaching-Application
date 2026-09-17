"use client";

import { useActionState } from "react";
import { CHECKIN_QUESTIONS } from "@/lib/checkin-questions";
import { inputStyle, labelStyle, primaryButtonStyle } from "@/lib/ui";
import { submitCheckIn, type CheckInFormState } from "./actions";

const initialState: CheckInFormState = { values: {}, attempt: 0 };

export function CheckInForm({ checkInId }: { checkInId: string }) {
  const boundAction = submitCheckIn.bind(null, checkInId);
  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      key={state.attempt}
      className="flex flex-col gap-5"
    >
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      {CHECKIN_QUESTIONS.map((question) => (
        <label key={question.key} className="flex flex-col gap-1.5">
          <span className={labelStyle}>
            {question.label}
            {question.required && <span className="text-red-500"> *</span>}
          </span>

          {question.type === "TEXT" && (
            <textarea
              name={question.key}
              defaultValue={state.values[question.key] ?? ""}
              className={inputStyle}
              rows={2}
            />
          )}

          {question.type === "NUMBER" && (
            <input
              type="number"
              step="any"
              min={0}
              name={question.key}
              defaultValue={state.values[question.key] ?? ""}
              className={inputStyle}
            />
          )}

          {question.type === "RATING_1_10" && (
            <input
              type="number"
              min={1}
              max={10}
              name={question.key}
              defaultValue={state.values[question.key] ?? ""}
              className={inputStyle}
            />
          )}

          {question.type === "BOOLEAN" && (
            <select
              name={question.key}
              defaultValue={state.values[question.key] ?? ""}
              className={inputStyle}
            >
              <option value="">Select...</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          )}
        </label>
      ))}

      <button type="submit" disabled={isPending} className={primaryButtonStyle}>
        {isPending ? "Submitting..." : "Submit check-in"}
      </button>
    </form>
  );
}

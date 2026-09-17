import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentCoach } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { inputStyle, secondaryButtonStyle, primaryButtonStyle } from "@/lib/ui";
import {
  addExercise,
  addWeek,
  addWorkout,
  deleteExercise,
  deleteWeek,
  deleteWorkout,
  updateExercise,
  updateWorkout,
} from "./actions";

const DAYS = [1, 2, 3, 4, 5, 6, 7];

export default async function ProgramEditorPage({
  params,
}: {
  params: Promise<{ clientId: string; programId: string }>;
}) {
  const { clientId, programId } = await params;
  const coach = await getCurrentCoach();

  const program = await prisma.program.findFirst({
    where: { id: programId, client: { coachId: coach.id } },
    include: {
      client: { select: { name: true } },
      weeks: {
        orderBy: { weekNumber: "asc" },
        include: {
          workouts: {
            orderBy: { dayOfWeek: "asc" },
            include: { exercises: { orderBy: { order: "asc" } } },
          },
        },
      },
    },
  });

  if (!program) {
    notFound();
  }

  const boundAddWeek = addWeek.bind(null, clientId, programId);

  return (
    <div className="flex flex-col gap-8">
      <Link
        href={`/dashboard/clients/${clientId}/programs`}
        className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
      >
        ← Programs
      </Link>

      <div>
        <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
          {program.name}
        </h1>
        <p className="mt-1 text-sm text-neutral-500">{program.client.name}</p>
      </div>

      <div className="flex flex-col gap-3">
        {program.weeks.map((week) => {
          const boundAddWorkout = addWorkout.bind(
            null,
            clientId,
            programId,
            week.id,
          );
          const boundDeleteWeek = deleteWeek.bind(
            null,
            clientId,
            programId,
            week.id,
          );

          return (
            <details
              key={week.id}
              className="border-t border-neutral-200 pt-4"
              open
            >
              <summary className="flex cursor-pointer list-none items-center justify-between">
                <span className="text-sm font-medium text-neutral-900">
                  Week {week.weekNumber}
                </span>
                <form action={boundDeleteWeek}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-red-600 transition-colors hover:text-red-800"
                  >
                    Delete week
                  </button>
                </form>
              </summary>

              <div className="mt-4 flex flex-col gap-6 pl-4">
                {week.workouts.map((workout) => {
                  const boundUpdateWorkout = updateWorkout.bind(
                    null,
                    clientId,
                    programId,
                    workout.id,
                  );
                  const boundDeleteWorkout = deleteWorkout.bind(
                    null,
                    clientId,
                    programId,
                    workout.id,
                  );
                  const boundAddExercise = addExercise.bind(
                    null,
                    clientId,
                    programId,
                    workout.id,
                  );

                  return (
                    <div key={workout.id} className="flex flex-col gap-3">
                      <form
                        action={boundUpdateWorkout}
                        className="flex flex-wrap items-end gap-2"
                      >
                        <label className="flex flex-col gap-1">
                          <span className="text-xs text-neutral-500">Day</span>
                          <select
                            name="dayOfWeek"
                            defaultValue={workout.dayOfWeek}
                            className={`${inputStyle} w-24`}
                          >
                            {DAYS.map((d) => (
                              <option key={d} value={d}>
                                Day {d}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="flex flex-1 flex-col gap-1">
                          <span className="text-xs text-neutral-500">
                            Workout name
                          </span>
                          <input
                            name="name"
                            defaultValue={workout.name}
                            className={inputStyle}
                          />
                        </label>
                        <button type="submit" className={secondaryButtonStyle}>
                          Save
                        </button>
                        <button
                          type="submit"
                          formAction={boundDeleteWorkout}
                          className="text-sm font-medium text-red-600 transition-colors hover:text-red-800"
                        >
                          Delete
                        </button>
                      </form>

                      <div className="flex flex-col gap-2 pl-4">
                        {workout.exercises.map((exercise) => {
                          const boundUpdateExercise = updateExercise.bind(
                            null,
                            clientId,
                            programId,
                            exercise.id,
                          );
                          const boundDeleteExercise = deleteExercise.bind(
                            null,
                            clientId,
                            programId,
                            exercise.id,
                          );

                          return (
                            <form
                              key={exercise.id}
                              action={boundUpdateExercise}
                              className="flex flex-wrap items-center gap-2"
                            >
                              <input
                                name="exerciseName"
                                defaultValue={exercise.exerciseName}
                                placeholder="Exercise"
                                className={`${inputStyle} w-40`}
                              />
                              <input
                                name="sets"
                                type="number"
                                min={1}
                                defaultValue={exercise.sets}
                                placeholder="Sets"
                                className={`${inputStyle} w-16`}
                              />
                              <input
                                name="reps"
                                defaultValue={exercise.reps}
                                placeholder="Reps"
                                className={`${inputStyle} w-20`}
                              />
                              <input
                                name="load"
                                defaultValue={exercise.load ?? ""}
                                placeholder="Load"
                                className={`${inputStyle} w-24`}
                              />
                              <input
                                name="notes"
                                defaultValue={exercise.notes ?? ""}
                                placeholder="Notes"
                                className={`${inputStyle} min-w-32 flex-1`}
                              />
                              <button
                                type="submit"
                                className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                              >
                                Save
                              </button>
                              <button
                                type="submit"
                                formAction={boundDeleteExercise}
                                className="text-sm font-medium text-red-600 transition-colors hover:text-red-800"
                              >
                                Delete
                              </button>
                            </form>
                          );
                        })}

                        <form
                          action={boundAddExercise}
                          className="flex flex-wrap items-center gap-2"
                        >
                          <input
                            name="exerciseName"
                            placeholder="Exercise"
                            required
                            className={`${inputStyle} w-40`}
                          />
                          <input
                            name="sets"
                            type="number"
                            min={1}
                            placeholder="Sets"
                            required
                            className={`${inputStyle} w-16`}
                          />
                          <input
                            name="reps"
                            placeholder="Reps"
                            required
                            className={`${inputStyle} w-20`}
                          />
                          <input
                            name="load"
                            placeholder="Load"
                            className={`${inputStyle} w-24`}
                          />
                          <input
                            name="notes"
                            placeholder="Notes"
                            className={`${inputStyle} min-w-32 flex-1`}
                          />
                          <button
                            type="submit"
                            className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                          >
                            Add exercise
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })}

                <form
                  action={boundAddWorkout}
                  className="flex flex-wrap items-end gap-2"
                >
                  <label className="flex flex-col gap-1">
                    <span className="text-xs text-neutral-500">Day</span>
                    <select
                      name="dayOfWeek"
                      defaultValue={1}
                      className={`${inputStyle} w-24`}
                    >
                      {DAYS.map((d) => (
                        <option key={d} value={d}>
                          Day {d}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-1 flex-col gap-1">
                    <span className="text-xs text-neutral-500">
                      Workout name
                    </span>
                    <input
                      name="name"
                      placeholder="e.g. Upper Body"
                      required
                      className={inputStyle}
                    />
                  </label>
                  <button type="submit" className={secondaryButtonStyle}>
                    Add workout
                  </button>
                </form>
              </div>
            </details>
          );
        })}
      </div>

      <form action={boundAddWeek}>
        <button type="submit" className={primaryButtonStyle}>
          Add week
        </button>
      </form>
    </div>
  );
}

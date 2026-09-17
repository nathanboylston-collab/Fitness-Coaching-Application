export type CheckInQuestionType = "RATING_1_10" | "NUMBER" | "BOOLEAN" | "TEXT";

export type CheckInQuestion = {
  key: string;
  label: string;
  type: CheckInQuestionType;
  required: boolean;
  order: number;
};

// Hardcoded for now — the shape (CheckInResponse rows keyed by questionKey)
// is what allows this to become a coach-editable question bank later without
// changing how responses are stored.
export const CHECKIN_QUESTIONS: CheckInQuestion[] = [
  {
    key: "workoutsCompleted",
    label: "How many planned workouts did you complete?",
    type: "NUMBER",
    required: true,
    order: 1,
  },
  {
    key: "performanceRating",
    label: "How would you rate your training performance this week?",
    type: "RATING_1_10",
    required: true,
    order: 2,
  },
  {
    key: "energyRating",
    label: "How would you rate your energy?",
    type: "RATING_1_10",
    required: true,
    order: 3,
  },
  {
    key: "sleepHours",
    label: "Average hours of sleep",
    type: "NUMBER",
    required: true,
    order: 4,
  },
  {
    key: "recoveryRating",
    label: "How would you rate your recovery?",
    type: "RATING_1_10",
    required: true,
    order: 5,
  },
  {
    key: "stressRating",
    label: "How would you rate your stress?",
    type: "RATING_1_10",
    required: true,
    order: 6,
  },
  {
    key: "nutritionAdherenceRating",
    label: "How well did you adhere to your nutrition plan?",
    type: "RATING_1_10",
    required: true,
    order: 7,
  },
  {
    key: "hasSymptoms",
    label:
      "Did you experience any pain, discomfort, or unusual symptoms that affected your training this week?",
    type: "BOOLEAN",
    required: true,
    order: 8,
  },
  {
    key: "symptomsDetails",
    label:
      "Please describe what you experienced and which exercises or activities were affected.",
    type: "TEXT",
    required: false, // conditionally required when hasSymptoms is true — validated in the action
    order: 9,
  },
  {
    key: "wentWell",
    label: "What went well this week?",
    type: "TEXT",
    required: false,
    order: 10,
  },
  {
    key: "difficult",
    label: "What was difficult this week?",
    type: "TEXT",
    required: false,
    order: 11,
  },
  {
    key: "additionalNotes",
    label: "Anything else your coach should know?",
    type: "TEXT",
    required: false,
    order: 12,
  },
];

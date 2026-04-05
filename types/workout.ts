export type WorkoutSet = {
  id: string;
  weight: string;
  reps: string;
};

export type WorkoutType = "cardio" | "strength";

export type WorkoutHistoryEntry = {
  id: string;
  exerciseName: string;
  type: WorkoutType;
  muscle?: string;
  sets: WorkoutSet[];
  durationSeconds: number;
  date: string; // ISO string
};

export type WorkoutExercise = {
  exerciseName: string;
  type: WorkoutType;
  muscle?: string;
  sets: WorkoutSet[];
  durationSeconds: number;
};

export type WorkoutSession = {
  id: string;
  date: string;
  exercises: WorkoutExercise[];
};

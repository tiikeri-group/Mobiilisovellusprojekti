export type WorkoutSet = {
  weight: number;
  reps: number;
};

export type WorkoutType = 'cardio' | 'strength';

export type WorkoutHistoryEntry = {
  id: string;
  exerciseName: string;
  type: WorkoutType;
  muscle?: string;
  sets: WorkoutSet[];
  durationSeconds: number;
  date: string; // ISO string
};

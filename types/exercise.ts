export type { MuscleGroup } from "./muscle";

export interface Exercise {
  id: string;
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string | null;
  level: string;
  instructions: string[];
}
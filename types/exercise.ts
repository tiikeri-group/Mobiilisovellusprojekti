export type { MuscleGroup } from "./muscle";

export interface Exercise {
  name: string;
  type: "cardio" | "strength";
  muscle: string;
  instructions: string;
}

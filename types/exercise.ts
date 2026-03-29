export type { MuscleGroup } from './muscle';

export interface Exercise {
    name: string;
    type: 'cardio' | 'strenght'
    muscle: string;
    instructions: string;
}
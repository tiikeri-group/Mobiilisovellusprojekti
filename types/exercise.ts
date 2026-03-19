export interface Exercise {
    name: string;
    type: 'cardio' | 'strenght'
    muscle: string;
    instructions: string;
}

export interface WorkoutSet{
    id: string;
    weight: number;
    reps: number;
}
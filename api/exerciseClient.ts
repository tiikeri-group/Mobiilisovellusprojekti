import exercisesData from '../exercises.json';
import { Exercise } from '../types/exercise';

const exercises: Exercise[] = exercisesData as Exercise[];

export async function fetchFromApi(query: string): Promise<Exercise[]> {
  const { default: exercisesData } = await import('../exercises.json');
  const params = new URLSearchParams(query.replace('?', ''));
  const type = params.get('type');
  const muscle = params.get('muscle');

  return (exercisesData as Exercise[]).filter((ex) => {
    const matchesType = type ? ex.category === type : true;
    const matchesMuscle = muscle
      ? ex.primaryMuscles.includes(muscle) || ex.secondaryMuscles.includes(muscle)
      : true;
    return matchesType && matchesMuscle;
  });
}
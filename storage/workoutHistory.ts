import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WorkoutHistoryEntry } from '../types/workout';
export type { WorkoutHistoryEntry } from '../types/workout';

const HISTORY_KEY = 'workout_history';

export const saveWorkout = async (entry: WorkoutHistoryEntry) => {
  const existing = await getWorkouts();
  const updated = [entry, ...existing];
  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
};

export const getWorkouts = async (): Promise<WorkoutHistoryEntry[]> => {
  const data = await AsyncStorage.getItem(HISTORY_KEY);
  return data ? JSON.parse(data) : [];
};

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { WorkoutHistoryEntry } from '../types/workout';

type Props = {
  workout: WorkoutHistoryEntry;
  onPress: () => void;
};

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
};

const WorkoutCard = ({ workout, onPress }: Props) => (
  <Pressable style={styles.card} onPress={onPress}>
    <View style={styles.row}>
      <Text style={styles.name}>{workout.exerciseName}</Text>
      <Text style={styles.date}>{formatDate(workout.date)}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.meta}>{workout.type === 'strength' ? `${workout.sets.length} sets` : 'Cardio'}</Text>
      <Text style={styles.meta}>{formatDuration(workout.durationSeconds)}</Text>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  date: { fontSize: 14, color: '#888' },
  meta: { fontSize: 14, color: '#555' },
});

export default WorkoutCard;

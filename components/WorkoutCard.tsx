import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutSession } from '../types/workout';

type Props = {
  workout: WorkoutSession;
  onPress: () => void;
  onDelete: () => void;
};


const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
};

const WorkoutCard = ({ workout, onPress, onDelete }: Props) => {
  const exercises = workout.exercises ?? [];
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const exerciseNames = exercises.map((ex) => ex.exerciseName).join(', ') || 'No exercises';

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Text style={styles.name} numberOfLines={1}>{exerciseNames}</Text>
        <View style={styles.right}>
          <Text style={styles.date}>{formatDate(workout.date)}</Text>
          <Pressable onPress={onDelete} hitSlop={8}>
            <Ionicons name="trash-outline" size={18} color="#FF453A" />
          </Pressable>
        </View>
      </View>
      <View style={styles.row}>
        <Text style={styles.meta}>{exercises.length} exercises · {totalSets} sets</Text>
      </View>
    </Pressable>
  );
};

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
  right: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});

export default WorkoutCard;

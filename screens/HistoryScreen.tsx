import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutHistoryEntry } from '../types/workout';
import WorkoutCard from '../components/WorkoutCard';

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [workouts, setWorkouts] = useState<WorkoutHistoryEntry[]>([]);

  useEffect(() => {
    const mock: WorkoutHistoryEntry[] = [
      { id: '1', exerciseName: 'Bench Press', type: 'strength', muscle: 'chest', sets: [{ weight: 80, reps: 8 }, { weight: 80, reps: 7 }], durationSeconds: 2700, date: '2026-03-25T10:00:00Z' },
      { id: '2', exerciseName: 'Running', type: 'cardio', sets: [], durationSeconds: 3600, date: '2026-03-24T08:30:00Z' },
      { id: '3', exerciseName: 'Squat', type: 'strength', muscle: 'quadriceps', sets: [{ weight: 100, reps: 5 }, { weight: 100, reps: 5 }, { weight: 100, reps: 4 }], durationSeconds: 3300, date: '2026-03-22T17:00:00Z' },
      { id: '4', exerciseName: 'Pull Ups', type: 'strength', muscle: 'lats', sets: [{ weight: 0, reps: 10 }, { weight: 0, reps: 8 }], durationSeconds: 1800, date: '2026-03-20T09:00:00Z' },
      { id: '5', exerciseName: 'Cycling', type: 'cardio', sets: [], durationSeconds: 4500, date: '2026-03-18T07:00:00Z' },
    ];
    setWorkouts(mock);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </Pressable>
        <Text style={styles.headerTitle}>History</Text>
        <View style={styles.graphs}>
          <View style={styles.graphPlaceholder} />
          <View style={styles.graphPlaceholder} />
          <View style={styles.graphPlaceholder} />
        </View>
      </View>

      {/* Workout list */}
      {workouts.length === 0 ? (
        <Text style={styles.empty}>No workout history yet.</Text>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkoutCard
              workout={item}
              onPress={() => (navigation as any).navigate('WorkoutDetail', { workout: item })}
            />
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  backButton: { marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  graphs: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  graphPlaceholder: { flex: 1, height: 80, backgroundColor: '#f0f0f0', borderRadius: 12 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#aaa' },
});

export default HistoryScreen;

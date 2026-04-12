import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { WorkoutSession } from '../types/workout';
import { formatDate, formatDuration } from '../utils/formatWorkout';

type WorkoutDetailParams = { workout: WorkoutSession };
type Route = RouteProp<{ WorkoutDetail: WorkoutDetailParams }, 'WorkoutDetail'>;

const WorkoutDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const { workout } = useRoute<Route>().params;

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <Text style={styles.title}>{formatDate(workout.date)}</Text>
      {workout.durationSeconds > 0 && (
        <Text style={styles.meta}>Duration: {formatDuration(workout.durationSeconds)}</Text>
      )}

      <FlatList
        data={workout.exercises}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item: exercise, index }) => {
          const sets = exercise.sets ?? [];
          const isCardio = exercise.type === 'cardio';
          return (
            <View style={styles.exerciseBlock}>
              <View style={styles.exerciseHeader}>
                <Text style={styles.sectionTitle}>{index + 1}. {exercise.exerciseName}</Text>
                <View style={[styles.typeBadge, isCardio ? styles.cardioBadge : styles.strengthBadge]}>
                  <Text style={styles.typeBadgeText}>{isCardio ? 'Cardio' : 'Strength'}</Text>
                </View>
              </View>
              {!isCardio && exercise.muscle ? (
                <Text style={styles.meta}>Muscle: {exercise.muscle}</Text>
              ) : null}

              {!isCardio && sets.length > 0 && (
                <>
                  <View style={styles.headerRow}>
                    <Text style={styles.headerCell}>Set</Text>
                    <Text style={styles.headerCell}>Weight (kg)</Text>
                    <Text style={styles.headerCell}>Reps</Text>
                  </View>
                  {sets.map((set, i) => (
                    <View key={set.id ?? i} style={styles.row}>
                      <Text style={styles.cell}>{i + 1}</Text>
                      <Text style={styles.cell}>{set.weight}</Text>
                      <Text style={styles.cell}>{set.reps}</Text>
                    </View>
                  ))}
                </>
              )}

              {isCardio && sets.length > 0 && (
                <>
                  <View style={styles.headerRow}>
                    <Text style={styles.headerCell}>Round</Text>
                    <Text style={styles.headerCell}>Duration</Text>
                  </View>
                  {sets.map((set, i) => (
                    <View key={set.id ?? i} style={styles.row}>
                      <Text style={styles.cell}>{i + 1}</Text>
                      <Text style={styles.cell}>{set.weight || '—'}</Text>
                    </View>
                  ))}
                </>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  meta: { fontSize: 14, color: '#888', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  exerciseBlock: { marginBottom: 24, borderBottomWidth: 1, borderColor: '#f0f0f0', paddingBottom: 12 },
  exerciseHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  cardioBadge: { backgroundColor: '#FFF0E0' },
  strengthBadge: { backgroundColor: '#E8F5E9' },
  typeBadgeText: { fontSize: 12, fontWeight: '700' },
  headerRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 6, marginBottom: 4 },
  headerCell: { flex: 1, fontWeight: '600', textAlign: 'center', color: '#555' },
  row: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  cell: { flex: 1, textAlign: 'center' },
});

export default WorkoutDetailScreen;

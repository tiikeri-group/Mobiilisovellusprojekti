import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { WorkoutHistoryEntry } from '../storage/workoutHistory';

type WorkoutDetailParams = { workout: WorkoutHistoryEntry };
type Route = RouteProp<{ WorkoutDetail: WorkoutDetailParams }, 'WorkoutDetail'>;

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

const WorkoutDetailScreen = () => {
  const { workout } = useRoute<Route>().params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{workout.exerciseName}</Text>
      <Text style={styles.meta}>{formatDate(workout.date)} · {formatDuration(workout.durationSeconds)}</Text>
      {workout.muscle ? <Text style={styles.meta}>Muscle: {workout.muscle}</Text> : null}

      {workout.type === 'strength' && workout.sets.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Sets</Text>
          <View style={styles.headerRow}>
            <Text style={styles.headerCell}>Set</Text>
            <Text style={styles.headerCell}>Weight (kg)</Text>
            <Text style={styles.headerCell}>Reps</Text>
          </View>
          <FlatList
            data={workout.sets}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.row}>
                <Text style={styles.cell}>{index + 1}</Text>
                <Text style={styles.cell}>{item.weight}</Text>
                <Text style={styles.cell}>{item.reps}</Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  meta: { fontSize: 14, color: '#888', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  headerRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 6, marginBottom: 4 },
  headerCell: { flex: 1, fontWeight: '600', textAlign: 'center', color: '#555' },
  row: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  cell: { flex: 1, textAlign: 'center' },
});

export default WorkoutDetailScreen;

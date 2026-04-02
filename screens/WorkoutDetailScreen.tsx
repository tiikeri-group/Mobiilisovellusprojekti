import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { WorkoutSession } from '../types/workout';

type WorkoutDetailParams = { workout: WorkoutSession };
type Route = RouteProp<{ WorkoutDetail: WorkoutDetailParams }, 'WorkoutDetail'>;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
};

const WorkoutDetailScreen = () => {
  const { workout } = useRoute<Route>().params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{formatDate(workout.date)}</Text>

      <FlatList
        data={workout.exercises}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item: exercise, index }) => (
          <View style={styles.exerciseBlock}>
            <Text style={styles.sectionTitle}>{index + 1}. {exercise.exerciseName}</Text>
            {exercise.muscle ? <Text style={styles.meta}>Muscle: {exercise.muscle}</Text> : null}

            {exercise.type === 'strength' && exercise.sets.length > 0 && (
              <>
                <View style={styles.headerRow}>
                  <Text style={styles.headerCell}>Set</Text>
                  <Text style={styles.headerCell}>Weight (kg)</Text>
                  <Text style={styles.headerCell}>Reps</Text>
                </View>
                {exercise.sets.map((set, i) => (
                  <View key={set.id} style={styles.row}>
                    <Text style={styles.cell}>{i + 1}</Text>
                    <Text style={styles.cell}>{set.weight}</Text>
                    <Text style={styles.cell}>{set.reps}</Text>
                  </View>
                ))}
              </>
            )}
          </View>
        )}
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
  headerRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 6, marginBottom: 4 },
  headerCell: { flex: 1, fontWeight: '600', textAlign: 'center', color: '#555' },
  row: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  cell: { flex: 1, textAlign: 'center' },
});

export default WorkoutDetailScreen;

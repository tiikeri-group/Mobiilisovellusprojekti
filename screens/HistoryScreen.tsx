  import React, { useEffect, useState } from "react";
  import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
  import { useNavigation } from "@react-navigation/native";
  import { Ionicons } from "@expo/vector-icons";
  import { WorkoutHistoryEntry } from "../types/workout";
  import WorkoutCard from "../components/WorkoutCard";

  const HistoryScreen = () => {
    const navigation = useNavigation();
    const [workouts, setWorkouts] = useState<WorkoutHistoryEntry[]>([]);

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
                onPress={() => (navigation as any).navigate("WorkoutDetail", { workout: item })}
              />
            )}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        )}
      </View>
    );
  };
import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { WorkoutSession } from '../types/workout';
import WorkoutCard from '../components/WorkoutCard';
import { collection, getDocs, orderBy, query, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    const fetchWorkouts = async () => {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      try {
        const q = query(
          collection(db, 'users', uid, 'workouts'),
          orderBy('date', 'desc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as WorkoutSession[];

        setWorkouts(data);
      } catch (error) {
        console.error('Failed to fetch workouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []));

  const handleDelete = (id: string) => {
    Alert.alert('Delete Workout', 'Are you sure you want to delete this workout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const uid = auth.currentUser?.uid;
          if (!uid) return;
          await deleteDoc(doc(db, 'users', uid, 'workouts', id));
          setWorkouts((prev) => prev.filter((w) => w.id !== id));
        }
      }
    ]);
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;

  return (
    <View style={styles.container}>
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
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}
    </View>
  );
};

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    header: {
      paddingTop: 50,
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderColor: "#f0f0f0",
    },
    backButton: { marginBottom: 8 },
    headerTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
    graphs: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
    graphPlaceholder: { flex: 1, height: 80, backgroundColor: "#f0f0f0", borderRadius: 12 },
    empty: { textAlign: "center", marginTop: 40, fontSize: 16, color: "#aaa" },
  });

  export default HistoryScreen;
export default HistoryScreen;

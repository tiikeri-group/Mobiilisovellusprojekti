import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { WorkoutSession } from "../types/workout";
import WorkoutCard from "../components/WorkoutCard";
import { collection, getDocs, orderBy, query, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);

  // This hook runs every time you navigate to the History tab
  useFocusEffect(
    useCallback(() => {
      const fetchWorkouts = async () => {
        const uid = auth.currentUser?.uid;
        if (!uid) {
          setLoading(false);
          return;
        }

        try {
          const q = query(collection(db, "users", uid, "workouts"), orderBy("date", "desc"));
          const snapshot = await getDocs(q);
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as WorkoutSession[];

          setWorkouts(data);
        } catch (error) {
          console.error("Failed to fetch workouts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchWorkouts();
    }, []),
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout from your Tiger history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const uid = auth.currentUser?.uid;
            if (!uid) return;
            try {
              await deleteDoc(doc(db, "users", uid, "workouts", id));
              setWorkouts((prev) => prev.filter((w) => w.id !== id));
            } catch (e) {
              Alert.alert("Error", "Could not delete workout.");
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        {/* Tiger Orange Spinner */}
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#121212" />
        </Pressable>
        <Text style={styles.headerTitle}>Workout History</Text>

        {/* Graphs section */}
        <View style={styles.graphs}>
          <View style={styles.graphPlaceholder} />
          <View style={styles.graphPlaceholder} />
          <View style={styles.graphPlaceholder} />
        </View>
      </View>

      {workouts.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>No Tiger Group workouts yet.</Text>
        </View>
      ) : (
        <FlatList
          data={workouts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <WorkoutCard
              workout={item}
              onPress={() => (navigation as any).navigate("WorkoutDetail", { workout: item })}
              onDelete={() => handleDelete(item.id)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 16 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  backButton: { marginBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: "bold", marginBottom: 16, color: "#121212" },
  graphs: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  graphPlaceholder: { flex: 1, height: 80, backgroundColor: "#f0f0f0", borderRadius: 12 },
  empty: { textAlign: "center", fontSize: 16, color: "#8E8E93" },
});

export default HistoryScreen;

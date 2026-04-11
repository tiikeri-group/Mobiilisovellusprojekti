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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { WorkoutSession } from "../types/workout";
import WorkoutCard from "../components/WorkoutCard";
import { collection, getDocs, orderBy, query, doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

const HistoryScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const selectionMode = selectedIds.size > 0;

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(workouts.map((w) => w.id)));
  const clearSelection = () => setSelectedIds(new Set());

  const handleDeleteSelected = () => {
    Alert.alert('Delete Workouts', `Delete ${selectedIds.size} workout(s)?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const uid = auth.currentUser?.uid;
          if (!uid) return;
          await Promise.all([...selectedIds].map((id) => deleteDoc(doc(db, 'users', uid, 'workouts', id))));
          setWorkouts((prev) => prev.filter((w) => !selectedIds.has(w.id)));
          clearSelection();
        },
      },
    ]);
  };

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
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        {selectionMode ? (
          <>
            <View style={styles.selectionBar}>
              <Text style={styles.selectionCount}>{selectedIds.size} selected</Text>
              <View style={styles.selectionActions}>
                <Pressable onPress={selectAll} style={styles.selectionButton}>
                  <Text style={styles.selectionButtonText}>Select All</Text>
                </Pressable>
                <Pressable onPress={handleDeleteSelected} style={styles.selectionButton}>
                  <Ionicons name="trash-outline" size={22} color="#FF453A" />
                </Pressable>
                <Pressable onPress={clearSelection} style={styles.selectionButton}>
                  <Ionicons name="close" size={24} color="#121212" />
                </Pressable>
              </View>
            </View>
          </>
        ) : (
          <>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color="#121212" />
            </Pressable>
            <Text style={styles.headerTitle}>Workout History</Text>
            <View style={styles.graphs}>
              <View style={styles.graphPlaceholder} />
              <View style={styles.graphPlaceholder} />
              <View style={styles.graphPlaceholder} />
            </View>
          </>
        )}
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
              selected={selectedIds.has(item.id)}
              onPress={() =>
                selectionMode
                  ? toggleSelection(item.id)
                  : (navigation as any).navigate("WorkoutDetail", { workout: item })
              }
              onLongPress={() => toggleSelection(item.id)}
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
    paddingTop: 0,
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
  selectionBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  selectionCount: { fontSize: 18, fontWeight: "bold", color: "#121212" },
  selectionActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  selectionButton: { padding: 8 },
  selectionButtonText: { fontSize: 15, fontWeight: "600", color: "#FF6B00" },
});

export default HistoryScreen;

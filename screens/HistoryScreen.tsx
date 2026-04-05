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

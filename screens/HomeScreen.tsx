import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationProp, useNavigation, useFocusEffect } from "@react-navigation/native";
import { AppUser } from "../types/auth";
import { WorkoutSession } from "../types/workout";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import WorkoutCard from "../components/WorkoutCard";

type Props = {
  user: AppUser;
};

const HomeScreen = ({ user }: Props) => {
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigation = useNavigation<NavigationProp<any>>();

  useFocusEffect(
    useCallback(() => {
      const fetchWorkouts = async () => {
        try {
          const q = query(collection(db, "users", user.id, "workouts"), orderBy("date", "desc"));

          const querySnapshot = await getDocs(q);
          const data: WorkoutSession[] = [];
          querySnapshot.forEach((doc) => {
            data.push({ id: doc.id, ...(doc.data() as any) });
          });

          setWorkouts(data);
        } catch (error) {
          console.error("Error fetching workouts:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchWorkouts();
    }, [user.id]),
  );

  const calculateWorkoutTime = (workoutList: WorkoutSession[]) => {
    const totalSeconds = workoutList.reduce((total, session) => {
      const sessionSeconds =
        session.exercises?.reduce((sum, ex) => sum + (ex.durationSeconds || 0), 0) || 0;
      return total + sessionSeconds;
    }, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const totalTime = calculateWorkoutTime(workouts);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.heroSection}>
          <Pressable style={styles.bigButton} onPress={() => navigation.navigate("Workout")}>
            <Text style={styles.buttonSubText}>READY?</Text>
            <Text style={styles.buttonMainText}>START</Text>
          </Pressable>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Training</Text>
              <Text style={styles.statValue}>{workouts.length ? totalTime : "-"}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Sessions</Text>
              <Text style={styles.statValue}>{workouts.length || "-"}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Recent Activity</Text>
        </View>

        <View style={styles.line} />

        <View style={styles.listSection}>
          {workouts.length === 0 ? (
            <Text style={styles.emptyText}>No Tiger Group records yet. Time to hunt! 🐅</Text>
          ) : (
            workouts
              .slice(0, 3)
              .map((item) => (
                <WorkoutCard
                  key={item.id}
                  workout={item}
                  onPress={() => navigation.navigate("WorkoutDetail", { workout: item })}
                  onDelete={() => {}}
                />
              ))
          )}
        </View>

        <Pressable style={styles.historyButton} onPress={() => navigation.navigate("History")}>
          <Text style={styles.historyButtonText}>View Full History</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  heroSection: {
    paddingVertical: 40,
    alignItems: "center",
  },
  bigButton: {
    height: 180,
    width: 180,
    borderRadius: 90,
    backgroundColor: "#121212",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#FF6B00",
    elevation: 12,
    shadowColor: "#FF6B00",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonMainText: {
    color: "#FF6B00",
    fontWeight: "bold",
    fontSize: 32,
  },
  buttonSubText: {
    color: "#888",
    fontSize: 14,
    letterSpacing: 3,
    marginBottom: 4,
  },
  infoSection: {
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: "row",
    marginBottom: 25,
    gap: 15,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  statLabel: {
    color: "#8E8E93",
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: "700",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#121212",
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#121212",
  },
  listSection: {
    paddingHorizontal: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    marginVertical: 20,
    fontStyle: "italic",
  },
  historyButton: {
    margin: 20,
    padding: 18,
    backgroundColor: "#121212",
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  historyButtonText: {
    color: "#FF6B00",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
  },
  line: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 15,
    marginHorizontal: 20,
  },
});

export default HomeScreen;

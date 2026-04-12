import React, { useState, useEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { fetchFromApi } from "../api/exerciseClient";
import { Exercise } from "../types/exercise";
import { MUSCLE_GROUPS, MuscleGroup } from "../constants/muscles";
import { WorkoutType, WorkoutHistoryEntry } from "../types/workout";
import { formatDuration } from "../utils/formatWorkout";
import ActiveWorkoutCard from "../components/ExerciseCard";

import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function WorkoutScreen() {
  const insets = useSafeAreaInsets();
  const [exercises, setExercise] = useState<Exercise[]>([]);
  const [step, setStep] = useState<"OVERVIEW" | "TYPE" | "MUSCLE" | "EXERCISES">("OVERVIEW");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeExercises, setActiveExercises] = useState<WorkoutHistoryEntry[]>([]);

  // Real-time Stop Watch
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeExercises.length > 0 && !timerRef.current) {
      timerRef.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);
    }
    if (activeExercises.length === 0 && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setElapsedSeconds(0);
    }
  }, [activeExercises.length]);

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const TypeSelect = async (type: "cardio" | "strength") => {
    setLoading(true);
    try {
      const data = await fetchFromApi(type === "cardio" ? "?type=cardio" : "?type=strength");
      setExercise(data);
      setStep(type === "cardio" ? "EXERCISES" : "MUSCLE");
    } catch (e) {
      Alert.alert("Error", "Failed to fetch exercises");
    } finally {
      setLoading(false);
    }
  };

  const handleMuscleSelect = async (muscle: MuscleGroup) => {
    setLoading(true);
    try {
      const data = await fetchFromApi(`?type=strength&muscle=${muscle}`);
      setExercise(data);
      setStep("EXERCISES");
    } catch (e) {
      Alert.alert("Error", "Failed to fetch exercises");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExerciseToWorkout = (exercise: Exercise) => {
    const newEntry: WorkoutHistoryEntry = {
      id: Date.now().toString(),
      exerciseName: exercise.name,
      type: (exercise.category === "cardio" ? "cardio" : "strength") as WorkoutType,
      muscle: exercise.primaryMuscles[0],
      sets: [{ id: Date.now().toString() + "-1", weight: "", reps: "" }],
      durationSeconds: 0,
      date: new Date().toISOString(),
    };
    setActiveExercises([...activeExercises, newEntry]);
    setStep("OVERVIEW");
  };

  const handleFinishWorkout = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert("Error", "You must be logged in to save workouts.");
      return;
    }

    const incomplete = activeExercises.some((ex) =>
      ex.sets.some((s) => {
        if (ex.type === "cardio") return !s.weight && !s.reps;
        return !s.weight || !s.reps;
      }),
    );

    if (incomplete) {
      Alert.alert("Incomplete sets", "Please fill in your exercise data before finishing.");
      return;
    }

    try {
      setSaving(true);
      const session = {
        date: new Date().toISOString(),
        durationSeconds: elapsedSeconds,
        exercises: activeExercises.map((ex) => {
          const exerciseDuration =
            ex.type === "cardio"
              ? ex.sets.reduce((sum, set) => {
                  const mins = parseInt(set.weight) || 0;
                  const secs = parseInt(set.reps) || 0;
                  return sum + mins * 60 + secs;
                }, 0)
              : 0;

          return {
            exerciseName: ex.exerciseName,
            type: ex.type,
            muscle: ex.muscle ?? null,
            sets: ex.sets,
            durationSeconds: exerciseDuration,
          };
        }),
      };

      await addDoc(collection(db, "users", uid, "workouts"), session);
      setActiveExercises([]);
      setElapsedSeconds(0);
      Alert.alert("Workout saved!", "Your Tiger Group workout is in the books!");
      setStep("OVERVIEW");
    } catch (error) {
      Alert.alert("Error", "Failed to save workout.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      {step === "OVERVIEW" && (
        <View style={{ flex: 1 }}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Summary</Text>
              {activeExercises.length > 0 && (
                <Text style={styles.timer}>{formatDuration(elapsedSeconds)}</Text>
              )}
            </View>
            {activeExercises.length > 0 && (
              <TouchableOpacity
                style={styles.headerFinishButton}
                onPress={handleFinishWorkout}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#FF6B00" />
                ) : (
                  <Text style={styles.headerFinishText}>Finish</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
            {activeExercises.map((item, index) => (
              <ActiveWorkoutCard
                key={item.id}
                workout={item}
                onUpdateSet={(setIndex, field, value) => {
                  setActiveExercises((prev) => {
                    const next = [...prev];
                    next[index].sets[setIndex][field] = value;
                    return next;
                  });
                }}
                onAddSet={() => {
                  setActiveExercises((prev) => {
                    const next = [...prev];
                    next[index].sets.push({
                      id: Date.now().toString() + "-" + Math.random(),
                      weight: "",
                      reps: "",
                    });
                    return next;
                  });
                }}
                onRemoveSet={(setIndex) => {
                  setActiveExercises((prev) => {
                    const next = [...prev];
                    next[index].sets.splice(setIndex, 1);
                    if (next[index].sets.length === 0) {
                      next[index].sets.push({ id: Date.now().toString(), weight: "", reps: "" });
                    }
                    return next;
                  });
                }}
                onRemoveExercise={() => {
                  setActiveExercises((prev) => prev.filter((_, i) => i !== index));
                }}
              />
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.floatingAddButton} onPress={() => setStep("TYPE")}>
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {step === "TYPE" && (
        <View>
          <TouchableOpacity onPress={() => setStep("OVERVIEW")} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>What's the plan?</Text>
          <TouchableOpacity style={styles.button} onPress={() => TypeSelect("strength")}>
            <Text style={styles.buttonText}>Strength Training</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => TypeSelect("cardio")}>
            <Text style={styles.buttonText}>Cardio</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === "MUSCLE" && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => setStep("TYPE")} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <FlatList
            data={MUSCLE_GROUPS}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.button} onPress={() => handleMuscleSelect(item)}>
                <Text style={styles.buttonText}>{item.replace("_", " ").toUpperCase()}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {step === "EXERCISES" && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => setStep(exercises[0]?.category === "cardio" ? "TYPE" : "MUSCLE")}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <FlatList
            data={exercises}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleAddExerciseToWorkout(item)}
              >
                <Text style={styles.bold}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9F9F9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#121212" },
  timer: { fontSize: 22, color: "#FF6B00", fontWeight: "700", marginTop: 2 },
  headerFinishButton: {
    backgroundColor: "#121212",
    paddingHorizontal: 16,
    width: 120,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#FF6B00",
  },
  headerFinishText: {
    color: "#FF6B00",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
    textAlign: "center",
  },
  button: {
    padding: 18,
    backgroundColor: "#fff",
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
  },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#121212" },
  card: {
    padding: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#FF6B00",
  },
  bold: { fontWeight: "bold", fontSize: 16 },
  backButton: { paddingVertical: 10, marginBottom: 10 },
  backText: { color: "#FF6B00", fontSize: 18, fontWeight: "bold" },
  floatingAddButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#FF6B00",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    zIndex: 999,
  },
});

import React, { useState } from "react";
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
import { WorkoutHistoryEntry } from "../types/workout";
import { WorkoutSet, WorkoutType, WorkoutHistoryEntry } from "../types/workout";
import ActiveWorkoutCard from "../components/ExerciseCard";

import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function WorkoutScreen() {
  const [exercises, setExercise] = useState<Exercise[]>([]);
  const [step, setStep] = useState<"OVERVIEW" | "TYPE" | "MUSCLE" | "EXERCISES">("OVERVIEW");
<<<<<<< HEAD
=======
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [step, setStep] = useState<"OVERVIEW" | "TYPE" | "MUSCLE" | "EXERCISES" | "LOGGING">("OVERVIEW");
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeExercises, setActiveExercises] = useState<WorkoutHistoryEntry[]>([]);

  const TypeSelect = async (type: "cardio" | "strength") => {
<<<<<<< HEAD
    setLoading(true);
    try {
      const data = await fetchFromApi(type === "cardio" ? "?type=cardio" : "?type=strength");
      setExercise(data);
      setStep(type === "cardio" ? "EXERCISES" : "MUSCLE");
    } catch (e) {
      Alert.alert("Error", "Failed to fetch exercises");
    } finally {
      setLoading(false);
=======
    if (type === "cardio") {
      setLoading(true);
      try {
        const data = await fetchFromApi("?type=cardio");
        setExercise(data);
        setStep("EXERCISES");
      } catch (error) {
        Alert.alert("Error", "Failed to fetch cardio exercises");
      } finally {
        setLoading(false);
      }
    } else {
      setStep("MUSCLE");
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
    }
  };

  const handleMuscleSelect = async (muscle: MuscleGroup) => {
    setLoading(true);
    try {
      const data = await fetchFromApi(`?type=strength&muscle=${muscle}`);
      setExercise(data);
      setStep("EXERCISES");
<<<<<<< HEAD
    } catch (e) {
=======
    } catch (error) {
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
      Alert.alert("Error", "Failed to fetch exercises");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExerciseToWorkout = (exercise: Exercise) => {
    const newEntry: WorkoutHistoryEntry = {
      id: Date.now().toString(),
      exerciseName: exercise.name,
<<<<<<< HEAD
      type: (exercise.category === "cardio" ? "cardio" : "strength") as WorkoutType,
      muscle: exercise.primaryMuscles[0],
=======
      type: exercise.type,
      muscle: exercise.muscle,
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
      sets: [{ id: Date.now().toString() + "-1", weight: "", reps: "" }],
      durationSeconds: 0,
      date: new Date().toISOString(),
    };
<<<<<<< HEAD
    setActiveExercises([...activeExercises, newEntry]);
    setStep("OVERVIEW");
=======

    setActiveExercises((prev) => [...prev, newEntry]);
    setStep("OVERVIEW");
  };

  const handleFinishWorkout = () => {
    console.log("Saving Workout Data:", activeExercises);
    Alert.alert("Success", "Workout saved successfully!", [
      { text: "OK", onPress: () => setActiveExercises([]) },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }
 const handleAddExerciseToWorkout = (exercise: Exercise) => {
  const newEntry: WorkoutHistoryEntry = {
    id: Date.now().toString(),
    exerciseName: exercise.name,
    type: (exercise.category === "cardio" ? "cardio" : "strength") as WorkoutType,           // changed
    muscle: exercise.primaryMuscles[0] ?? undefined,
    sets: [{ id: Date.now().toString() + "-1", weight: "", reps: "" }],
    durationSeconds: 0,
    date: new Date().toISOString(),
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
  };

  const handleFinishWorkout = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      Alert.alert("Error", "You must be logged in to save workouts.");
      return;
    }

    const incomplete = activeExercises.some((ex) =>
      ex.sets.some((s) => !s.weight || (ex.type !== "cardio" && !s.reps)),
    );

    if (incomplete) {
      Alert.alert("Incomplete sets", "Please fill in all fields before finishing.");
      return;
    }

    try {
      setSaving(true);
      const session = {
        date: new Date().toISOString(),
        exercises: activeExercises.map((ex) => ({
          exerciseName: ex.exerciseName,
          type: ex.type,
          muscle: ex.muscle ?? null,
          sets: ex.sets,
          durationSeconds: ex.durationSeconds,
        })),
      };

      await addDoc(collection(db, "users", uid, "workouts"), session);
      setActiveExercises([]);
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
    <View style={styles.container}>
      {step === "OVERVIEW" && (
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Workout Summary</Text>
<<<<<<< HEAD
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
=======

          <FlatList
            data={activeExercises}
            contentContainerStyle={{ paddingBottom: 160 }}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Tap the '+' to add an exercise!</Text>
            }
            renderItem={({ item, index }) => (
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
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
                      next[index].sets.push({
                        id: Date.now().toString(),
                        weight: "",
                        reps: "",
                      });
                    }
                    return next;
                  });
                }}
                onRemoveSet={(setIndex) => {
                  const newExercises = [...activeExercises];
                  newExercises[index].sets.splice(setIndex, 1);
                  if (newExercises[index].sets.length === 0) {
                    newExercises[index].sets.push({
                      id: Date.now().toString(),
                      weight: "",
                      reps: "",
                    });
                  }
                  setActiveExercises(newExercises);
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

          {activeExercises.length > 0 && (
            <TouchableOpacity style={styles.footerFinishButton} onPress={handleFinishWorkout}>
              <Text style={styles.finishText}>Finish Workout</Text>
            <TouchableOpacity
              style={styles.footerFinishButton}
              onPress={handleFinishWorkout}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FF6B00" />
              ) : (
                <Text style={styles.finishText}>Finish Workout</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}

      {step === "TYPE" && (
        <View>
          <TouchableOpacity onPress={() => setStep("OVERVIEW")} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
<<<<<<< HEAD
          <Text style={styles.title}>What's the plan?</Text>
=======
          <Text style={styles.title}>Select Type</Text>
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
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
<<<<<<< HEAD
            onPress={() => setStep(exercises[0]?.category === "cardio" ? "TYPE" : "MUSCLE")}
=======
            onPress={() => setStep(exercises[0]?.type === "cardio" ? "TYPE" : "MUSCLE")}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
            onPress={() => {
              const isCardio = exercises.length > 0 && exercises[0].category === "cardio";
              setStep(isCardio ? "TYPE" : "MUSCLE");
            }}
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
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
                <Text style={styles.subText}>{item.muscle.toUpperCase()}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9F9F9", paddingTop: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
<<<<<<< HEAD
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#121212" },
=======
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#1C1C1E" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#8E8E93", fontSize: 16 },
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
  button: {
    padding: 18,
    backgroundColor: "#fff",
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
<<<<<<< HEAD
  },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#121212" },
=======
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#1C1C1E" },
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
  card: {
    padding: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
<<<<<<< HEAD
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#FF6B00",
=======
  container: { flex: 1, padding: 20, backgroundColor: "#fff", paddingTop: 60 },
  center: { flex: 1, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: { padding: 15, backgroundColor: "#f0f0f0", marginVertical: 5, borderRadius: 8 },
  card: { padding: 15, borderBottomWidth: 1, borderColor: "#eee" },
  bold: { fontWeight: "bold" },
  backButton: {
    paddingVertical: 10,
    marginBottom: 10,
    borderLeftWidth: 5, // Made slightly thicker
    borderLeftColor: "#FF6B00", // 🐅 Tiger Orange stripe on the left
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  bold: { fontWeight: "bold", fontSize: 16 },
  subText: { color: "#8E8E93", fontSize: 12, marginTop: 4 },
  backButton: { paddingVertical: 10, marginBottom: 10 },
  backText: {
    color: "#FF6B00", // 🐅 Tiger Orange
    fontSize: 18,
    fontWeight: "bold",
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
  },
  bold: { fontWeight: "bold", fontSize: 16 },
  backButton: { paddingVertical: 10, marginBottom: 10 },
  backText: { color: "#FF6B00", fontSize: 18, fontWeight: "bold" },
  floatingAddButton: {
    position: "absolute",
<<<<<<< HEAD
    bottom: 10,
    right: 20,
    backgroundColor: "#FF6B00",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
  footerFinishButton: {
    backgroundColor: "#121212",
=======
    bottom: 110,
    right: 20,
    backgroundColor: "#FF6B00", // 🐅 Tiger Orange background
    width: 64,
    height: 64,
    borderRadius: 32,
    bottom: 90,
    right: 25,
    backgroundColor: "#32D74B",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#FF6B00", // Glowing orange shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    zIndex: 1000,
  },
  footerFinishButton: {
    backgroundColor: "#121212", // 🐅 Deep Black background
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
    padding: 18,
    borderRadius: 16,
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333", // Subtle border
  },
<<<<<<< HEAD
  finishText: { color: "#FF6B00", fontWeight: "bold", fontSize: 18, textTransform: "uppercase" },
});
=======
  finishText: {
    color: "#FF6B00", // 🐅 Tiger Orange text
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "uppercase", // Makes it look more aggressive/sporty
    letterSpacing: 1,
  },
});
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644

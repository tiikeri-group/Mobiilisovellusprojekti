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
import { WorkoutSet, WorkoutType, WorkoutHistoryEntry } from "../types/workout";
import ActiveWorkoutCard from "../components/ExerciseCard";

import { collection, addDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";

export default function WorkoutScreen() {
  const [exercises, setExercise] = useState<Exercise[]>([]);
  const [step, setStep] = useState<"OVERVIEW" | "TYPE" | "MUSCLE" | "EXERCISES">("OVERVIEW");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeExercises, setActiveExercises] = useState<WorkoutHistoryEntry[]>([]);

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
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
            {activeExercises.map((item, index) => (
              <ActiveWorkoutCard
                key={item.id}
                workout={item}
                onUpdateSet={(setIndex, field, value) => {
                  const newExercises = [...activeExercises];
                  newExercises[index].sets[setIndex][field] = value;
                  setActiveExercises(newExercises);
                }}
                onAddSet={() => {
                  const newExercises = [...activeExercises];
                  newExercises[index].sets.push({
                    id: Date.now().toString() + "-" + Math.random(),
                    weight: "",
                    reps: "",
                  });
                  setActiveExercises(newExercises);
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
                  setActiveExercises(activeExercises.filter((_, i) => i !== index));
                }}
              />
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.floatingAddButton} onPress={() => setStep("TYPE")}>
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>

          {activeExercises.length > 0 && (
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
  container: { flex: 1, padding: 20, backgroundColor: "#F9F9F9", paddingTop: 60 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#121212" },
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
    padding: 18,
    borderRadius: 16,
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  finishText: { color: "#FF6B00", fontWeight: "bold", fontSize: 18, textTransform: "uppercase" },
});

import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { fetchFromApi } from "../api/exerciseClient";
import { Exercise } from "../types/exercise";
import { MUSCLE_GROUPS, MuscleGroup } from "../constants/muscles";
import { WorkoutHistoryEntry } from "../types/workout";
import ActiveWorkoutCard from "../components/ExerciseCard";

export default function WorkoutScreen() {
  const [exercises, setExercise] = useState<Exercise[]>([]);
  const [step, setStep] = useState<"OVERVIEW" | "TYPE" | "MUSCLE" | "EXERCISES">("OVERVIEW");
  const [loading, setLoading] = useState(false);
  const [activeExercises, setActiveExercises] = useState<WorkoutHistoryEntry[]>([]);

  const TypeSelect = async (type: "cardio" | "strength") => {
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
    }
  };

  const handleMuscleSelect = async (muscle: MuscleGroup) => {
    setLoading(true);
    try {
      const data = await fetchFromApi(`?type=strength&muscle=${muscle}`);
      setExercise(data);
      setStep("EXERCISES");
    } catch (error) {
      Alert.alert("Error", "Failed to fetch exercises");
    } finally {
      setLoading(false);
    }
  };

  const handleAddExerciseToWorkout = (exercise: Exercise) => {
    const newEntry: WorkoutHistoryEntry = {
      id: Date.now().toString(),
      exerciseName: exercise.name,
      type: exercise.type,
      muscle: exercise.muscle,
      sets: [{ id: Date.now().toString() + "-1", weight: "", reps: "" }],
      durationSeconds: 0,
      date: new Date().toISOString(),
    };

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

  return (
    <View style={styles.container}>
      {step === "OVERVIEW" && (
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Workout Summary</Text>

          <FlatList
            data={activeExercises}
            contentContainerStyle={{ paddingBottom: 160 }}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Tap the '+' to add an exercise!</Text>
            }
            renderItem={({ item, index }) => (
              <ActiveWorkoutCard
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
                onRemoveExercise={() => {
                  setActiveExercises((prev) => prev.filter((_, i) => i !== index));
                }}
              />
            )}
          />

          <TouchableOpacity style={styles.floatingAddButton} onPress={() => setStep("TYPE")}>
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>

          {activeExercises.length > 0 && (
            <TouchableOpacity style={styles.footerFinishButton} onPress={handleFinishWorkout}>
              <Text style={styles.finishText}>Finish Workout</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {step === "TYPE" && (
        <View>
          <TouchableOpacity onPress={() => setStep("OVERVIEW")} style={styles.backButton}>
            <Text style={styles.backText}>← Back to Overview</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Select Type</Text>
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
            <Text style={styles.backText}>← Back to Categories</Text>
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
            onPress={() => setStep(exercises[0]?.type === "cardio" ? "TYPE" : "MUSCLE")}
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
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#1C1C1E" },
  emptyText: { textAlign: "center", marginTop: 50, color: "#8E8E93", fontSize: 16 },
  button: {
    padding: 18,
    backgroundColor: "#fff",
    marginVertical: 6,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  buttonText: { fontSize: 16, fontWeight: "600", color: "#1C1C1E" },
  card: {
    padding: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
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
  },
  floatingAddButton: {
    position: "absolute",
    bottom: 110,
    right: 20,
    backgroundColor: "#FF6B00", // 🐅 Tiger Orange background
    width: 64,
    height: 64,
    borderRadius: 32,
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
  finishText: {
    color: "#FF6B00", // 🐅 Tiger Orange text
    fontWeight: "bold",
    fontSize: 18,
    textTransform: "uppercase", // Makes it look more aggressive/sporty
    letterSpacing: 1,
  },
});

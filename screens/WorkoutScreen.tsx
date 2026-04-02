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
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [step, setStep] = useState<"OVERVIEW" | "TYPE" | "MUSCLE" | "EXERCISES" | "LOGGING">("OVERVIEW");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeExercises, setActiveExercises] = useState<WorkoutHistoryEntry[]>([]);

  const TypeSelect = async (type: "cardio" | "strength") => {
    if (type === "cardio") {
      setLoading(true);
      const data = await fetchFromApi("?type=cardio");
      setExercise(data);
      setLoading(false);
      setStep("EXERCISES");
    } else {
      setStep("MUSCLE");
    }
  };

  const handleMuscleSelect = async (muscle: MuscleGroup) => {
    setLoading(true);
    const data = await fetchFromApi(`?type=strength&muscle=${muscle}`);
    setExercise(data);
    setLoading(false);
    setStep("EXERCISES");
  };

 const handleAddExerciseToWorkout = (exercise: Exercise) => {
  const newEntry: WorkoutHistoryEntry = {
    id: Date.now().toString(),
    exerciseName: exercise.name,
    type: (exercise.category === "cardio" ? "cardio" : "strength") as WorkoutType,           // changed
    muscle: exercise.primaryMuscles[0] ?? undefined,
    sets: [{ id: Date.now().toString() + "-1", weight: "", reps: "" }],
    durationSeconds: 0,
    date: new Date().toISOString(),
  };
  setActiveExercises([...activeExercises, newEntry]);
  setStep("OVERVIEW");
};

  const handleFinishWorkout = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    // check all sets have weight and reps filled in
    const incomplete = activeExercises.some((ex) =>
      ex.sets.some((s) => !s.weight || !s.reps)
    );

    if (incomplete) {
      Alert.alert('Incomplete sets', 'Please fill in weight and reps for all sets before finishing.');
      return;
    }

    try {
      setSaving(true);

      const session = {
        date: new Date().toISOString(),
        exercises: activeExercises.map((exercise) => ({
          exerciseName: exercise.exerciseName,
          type: exercise.type,
          muscle: exercise.muscle ?? null,
          sets: exercise.sets,
          durationSeconds: exercise.durationSeconds,
        })),
      };

      await addDoc(collection(db, 'users', uid, 'workouts'), session);

      setActiveExercises([]);
      Alert.alert('Workout saved!', 'Your workout has been saved successfully.');

    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      {step === "OVERVIEW" && (
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Workout Summary</Text>

          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }}>
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
                <ActivityIndicator color="#32D74B" />
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
            <Text style={styles.backText}>← Back to Overview</Text>
          </TouchableOpacity>
          <Text style={styles.title}>What's the plan today?</Text>
          <TouchableOpacity style={styles.button} onPress={() => TypeSelect("strength")}>
            <Text>Strength Training</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => TypeSelect("cardio")}>
            <Text>Cardio</Text>
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
                <Text>{item.replace("_", " ").toUpperCase()}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {step === "EXERCISES" && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              const isCardio = exercises.length > 0 && exercises[0].category === "cardio";
              setStep(isCardio ? "TYPE" : "MUSCLE");
            }}
            style={styles.backButton}
          >
            <Text style={styles.backText}>
              {exercises.length > 0 && exercises[0].category === "cardio"
                ? "← Back to Categories"
                : "← Back to Muscles"}
            </Text>
          </TouchableOpacity>
          <FlatList
            data={exercises}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => handleAddExerciseToWorkout(item)}>
                <Text style={styles.bold}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {step === "LOGGING" && selectedExercise && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => setStep("EXERCISES")} style={styles.backButton}>
            <Text style={styles.backText}>← Back to Exercises</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{selectedExercise.name}</Text>
          <Text>{selectedExercise.instructions}</Text>
          <TouchableOpacity onPress={() => setStep("TYPE")}>
            <Text style={styles.backButton}>Start Over</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff", paddingTop: 60 },
  center: { flex: 1, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: { padding: 15, backgroundColor: "#f0f0f0", marginVertical: 5, borderRadius: 8 },
  card: { padding: 15, borderBottomWidth: 1, borderColor: "#eee" },
  bold: { fontWeight: "bold" },
  backButton: {
    paddingVertical: 10,
    marginBottom: 10,
    zIndex: 10,
  },
  backText: {
    color: "#007AFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  floatingAddButton: {
    position: "absolute",
    bottom: 90,
    right: 25,
    backgroundColor: "#32D74B",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },
  footerFinishButton: {
    backgroundColor: "#1C1C1E",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  finishText: {
    color: "#32D74B",
    fontWeight: "bold",
    fontSize: 16,
  },
});
import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WorkoutHistoryEntry, WorkoutSet } from "../types/workout";

type Props = {
  workout: WorkoutHistoryEntry;
  onUpdateSet: (setIndex: number, field: "weight" | "reps", value: string) => void;
  onAddSet: () => void;
  onRemoveExercise: () => void;
};

const ActiveWorkoutCard = ({ workout, onUpdateSet, onAddSet, onRemoveExercise }: Props) => {
  return (
    <View style={styles.card}>
      {/* Header: Name and Remove Button */}
      <View style={styles.header}>
        <Text style={styles.exerciseName}>{workout.exerciseName}</Text>
        <TouchableOpacity onPress={onRemoveExercise}>
          <Ionicons name="trash-outline" size={20} color="#FF453A" />
        </TouchableOpacity>
      </View>

      {/* Column Headers */}
      <View style={styles.labelRow}>
        <Text style={[styles.labelText, { width: 30 }]}>Set</Text>
        <Text style={[styles.labelText, { flex: 1, textAlign: "center" }]}>Weight (kg)</Text>
        <Text style={[styles.labelText, { flex: 1, textAlign: "center" }]}>Reps</Text>
      </View>

      {/* Mapping Sets */}
      {workout.sets.map((set, index) => (
        <View key={set.id} style={styles.setRow}>
          <Text style={styles.setNumber}>{index + 1}</Text>

          <View style={styles.inputBubble}>
            <TextInput
              style={styles.inputText}
              keyboardType="numeric"
              placeholder="0"
              value={set.weight}
              onChangeText={(val) => onUpdateSet(index, "weight", val)}
            />
          </View>

          <Text style={styles.multiplier}>×</Text>

          <View style={styles.inputBubble}>
            <TextInput
              style={styles.inputText}
              keyboardType="numeric"
              placeholder="0"
              value={set.reps}
              onChangeText={(val) => onUpdateSet(index, "reps", val)}
            />
          </View>
        </View>
      ))}

      {/* Add Set Button */}
      <TouchableOpacity style={styles.addSetButton} onPress={onAddSet}>
        <Ionicons name="add" size={18} color="#007AFF" />
        <Text style={styles.addSetText}>Add Set</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  exerciseName: { fontSize: 18, fontWeight: "bold", color: "#1C1C1E" },
  labelRow: { flexDirection: "row", marginBottom: 8, paddingHorizontal: 4 },
  labelText: { color: "#8E8E93", fontSize: 12, fontWeight: "600", textTransform: "uppercase" },
  setRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  setNumber: { width: 30, fontSize: 16, fontWeight: "600", color: "#8E8E93", textAlign: "center" },
  inputBubble: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  inputText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1C1C1E",
    width: "100%",
    textAlign: "center",
  },
  multiplier: { color: "#C7C7CC", fontSize: 18 },
  addSetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  addSetText: { color: "#007AFF", fontWeight: "bold", marginLeft: 4 },
});

export default ActiveWorkoutCard;

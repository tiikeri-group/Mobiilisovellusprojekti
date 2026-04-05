import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WorkoutHistoryEntry } from "../types/workout";

type Props = {
  workout: WorkoutHistoryEntry;
  onUpdateSet: (setIndex: number, field: "weight" | "reps", value: string) => void;
  onAddSet: () => void;
  onRemoveSet: (index: number) => void;
  onRemoveExercise: () => void;
};

const formatTimeInput = (text: string) => {
  const cleaned = text.replace(/[^0-9]/g, "");
  if (cleaned.length > 2) {
    return `${cleaned.slice(0, cleaned.length - 2)}:${cleaned.slice(-2)}`;
  }
  return cleaned;
};

const ActiveWorkoutCard = ({
  workout,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
  onRemoveExercise,
}: Props) => {
  const isCardio = workout.type === "cardio";

  return (
    <View style={styles.card}>
<<<<<<< HEAD
=======
      {/* Header */}
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
      <View style={styles.header}>
        <Text style={styles.exerciseName}>{workout.exerciseName}</Text>
        <TouchableOpacity onPress={onRemoveExercise}>
          <Ionicons name="trash-outline" size={20} color="#FF453A" />
        </TouchableOpacity>
      </View>

<<<<<<< HEAD
      <View style={styles.labelRow}>
        <Text style={[styles.labelText, { width: 35 }]}>{isCardio ? "Rnd" : "Set"}</Text>
        <Text style={[styles.labelText, { flex: 1, textAlign: "center" }]}>
          {isCardio ? "Duration (M:SS)" : "Weight (kg)"}
        </Text>
=======
      {/* Column Labels */}
      <View style={styles.labelRow}>
        <Text style={[styles.labelText, { width: 35 }]}>{isCardio ? "Rnd" : "Set"}</Text>

        <Text style={[styles.labelText, { flex: 1, textAlign: "center" }]}>
          {isCardio ? "Duration (M:SS)" : "Weight (kg)"}
        </Text>

        {/* 🛡️ ULTRA-SAFE CONDITIONAL: No '&&', No Fragments */}
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
        {!isCardio ? (
          <View style={styles.repsHeaderWrapper}>
            <View style={{ width: 20 }} />
            <Text style={[styles.labelText, { flex: 1, textAlign: "center" }]}>Reps</Text>
          </View>
        ) : null}
<<<<<<< HEAD
        <View style={{ width: 30 }} />
      </View>

=======

        <View style={{ width: 30 }} />
      </View>

      {/* Row Mapping */}
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
      {workout.sets.map((set, index) => (
        <View key={set.id} style={styles.setRow}>
          <Text style={styles.setNumber}>{index + 1}</Text>
          <View style={styles.inputBubble}>
            <TextInput
              style={styles.inputText}
              keyboardType="number-pad"
              placeholder={isCardio ? "0:00" : "0"}
              value={set.weight}
<<<<<<< HEAD
              onChangeText={(val) =>
                onUpdateSet(index, "weight", isCardio ? formatTimeInput(val) : val)
              }
            />
          </View>

=======
              onChangeText={(val) => {
                const formatted = isCardio ? formatTimeInput(val) : val;
                onUpdateSet(index, "weight", formatted);
              }}
            />
          </View>

          {/* 🛡️ ULTRA-SAFE CONDITIONAL */}
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
          {!isCardio ? (
            <View style={styles.repsInputWrapper}>
              <Text style={styles.multiplier}>×</Text>
              <View style={styles.inputBubble}>
                <TextInput
                  style={styles.inputText}
                  keyboardType="number-pad"
                  placeholder="0"
                  value={set.reps}
                  onChangeText={(val) => onUpdateSet(index, "reps", val)}
                />
              </View>
            </View>
          ) : null}

          <TouchableOpacity onPress={() => onRemoveSet(index)} style={styles.deleteSetButton}>
            <Ionicons name="close-circle" size={20} color="#C7C7CC" />
          </TouchableOpacity>
        </View>
      ))}

<<<<<<< HEAD
      <TouchableOpacity style={styles.addSetButton} onPress={onAddSet}>
        <Ionicons name="add" size={18} color="#FF6B00" />
=======
      {/* Add Button */}
      <TouchableOpacity style={styles.addSetButton} onPress={onAddSet}>
        <Ionicons name="add" size={18} color="#007AFF" />
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
        <Text style={styles.addSetText}>{isCardio ? "Add Round" : "Add Set"}</Text>
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
  },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
<<<<<<< HEAD
  exerciseName: { fontSize: 18, fontWeight: "bold", color: "#121212" },
=======
  exerciseName: { fontSize: 18, fontWeight: "bold", color: "#1C1C1E" },
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
  labelRow: { flexDirection: "row", marginBottom: 8, paddingHorizontal: 4, alignItems: "center" },
  labelText: { color: "#8E8E93", fontSize: 12, fontWeight: "600", textTransform: "uppercase" },
  repsHeaderWrapper: { flexDirection: "row", flex: 1 },
  setRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  setNumber: { width: 35, fontSize: 16, fontWeight: "600", color: "#8E8E93", textAlign: "center" },
  inputBubble: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  inputText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#121212",
    width: "100%",
    textAlign: "center",
  },
  repsInputWrapper: { flexDirection: "row", flex: 1, alignItems: "center", gap: 10 },
  multiplier: { color: "#C7C7CC", fontSize: 18, width: 20, textAlign: "center" },
  deleteSetButton: { padding: 5 },
  addSetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
<<<<<<< HEAD
  addSetText: { color: "#FF6B00", fontWeight: "bold", marginLeft: 4 },
=======
  addSetText: {
    color: "#FF6B00", 
    fontWeight: "bold",
    marginLeft: 4,
  },
>>>>>>> edf67d711c384db8ec10c4add7e885ddcdd32644
});

export default ActiveWorkoutCard;

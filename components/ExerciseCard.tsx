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
      <View style={styles.header}>
        <Text style={styles.exerciseName}>{workout.exerciseName}</Text>
        <TouchableOpacity onPress={onRemoveExercise}>
          <Ionicons name="trash-outline" size={20} color="#FF453A" />
        </TouchableOpacity>
      </View>

      <View style={styles.labelRow}>
        <Text style={[styles.labelText, { width: 35 }]}>{isCardio ? "Rnd" : "Set"}</Text>
        <Text style={[styles.labelText, { flex: 1, textAlign: "center" }]}>
          {isCardio ? "Duration (MIN : SEC)" : "Weight (kg)"}
        </Text>
        {!isCardio ? (
          <View style={styles.repsHeaderWrapper}>
            <View style={{ width: 20 }} />
            <Text style={[styles.labelText, { flex: 1, textAlign: "center" }]}>Reps</Text>
          </View>
        ) : null}
        <View style={{ width: 30 }} />
      </View>

      {workout.sets.map((set, index) => (
        <View key={set.id} style={styles.setRow}>
          <Text style={styles.setNumber}>{index + 1}</Text>

          {isCardio ? (
            <View style={styles.cardioInputWrapper}>
              <View style={styles.inputBubble}>
                <TextInput
                  style={styles.inputText}
                  keyboardType="number-pad"
                  placeholder="min"
                  value={set.weight}
                  onChangeText={(val) => onUpdateSet(index, "weight", val)}
                />
              </View>
              <Text style={styles.timeDivider}>:</Text>
              <View style={styles.inputBubble}>
                <TextInput
                  style={styles.inputText}
                  keyboardType="number-pad"
                  placeholder="sec"
                  maxLength={2}
                  value={set.reps}
                  onChangeText={(val) => {
                    const num = parseInt(val);
                    if (isNaN(num) || (num >= 0 && num < 60)) {
                      onUpdateSet(index, "reps", val);
                    }
                  }}
                />
              </View>
            </View>
          ) : (
            <>
              <View style={styles.inputBubble}>
                <TextInput
                  style={styles.inputText}
                  keyboardType="number-pad"
                  placeholder="0"
                  value={set.weight}
                  onChangeText={(val) => onUpdateSet(index, "weight", val)}
                />
              </View>

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
            </>
          )}

          <TouchableOpacity onPress={() => onRemoveSet(index)} style={styles.deleteSetButton}>
            <Ionicons name="close-circle" size={20} color="#ff0000" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addSetButton} onPress={onAddSet}>
        <Ionicons name="add" size={18} color="#FF6B00" />
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
    borderWidth: 1,
    borderColor: "#121212",
  },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  exerciseName: { fontSize: 18, fontWeight: "bold", color: "#121212" },
  labelRow: { flexDirection: "row", marginBottom: 8, paddingHorizontal: 4, alignItems: "center" },
  labelText: { color: "#000000", fontSize: 12, fontWeight: "600", textTransform: "uppercase" },
  repsHeaderWrapper: { flexDirection: "row", flex: 1 },
  setRow: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 },
  setNumber: { width: 35, fontSize: 16, fontWeight: "600", color: "#000000", textAlign: "center" },
  inputBubble: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#121212",
  },
  inputText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#121212",
    width: "100%",
    textAlign: "center",
  },
  cardioInputWrapper: { flex: 1, flexDirection: "row", alignItems: "center", gap: 5 },
  timeDivider: { fontSize: 20, fontWeight: "bold", color: "#FF6B00" },
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
  addSetText: { color: "#FF6B00", fontWeight: "bold", marginLeft: 4 },
});

export default ActiveWorkoutCard;

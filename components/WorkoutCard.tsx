import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { WorkoutSession } from "../types/workout";
import { formatDate, formatDuration } from "../utils/formatWorkout";

type Props = {
  workout: WorkoutSession;
  onPress: () => void;
  onLongPress?: () => void;
  selected?: boolean;
};

const WorkoutCard = ({ workout, onPress, onLongPress, selected }: Props) => {
  const exercises = workout.exercises ?? [];
  const strength = exercises.filter((ex) => ex.type === "strength");
  const cardio = exercises.filter((ex) => ex.type === "cardio");
  const totalSets = strength.reduce((sum, ex) => sum + ex.sets.length, 0);
  const totalRounds = cardio.reduce((sum, ex) => sum + ex.sets.length, 0);
  const exerciseNames = exercises.map((ex) => ex.exerciseName).join(", ") || "No exercises";

  const metaParts: string[] = [];
  if (strength.length > 0) metaParts.push(`${strength.length} strength · ${totalSets} sets`);
  if (cardio.length > 0) metaParts.push(`${cardio.length} cardio · ${totalRounds} rounds`);

  return (
    <Pressable
      style={selected ? [styles.card, styles.cardSelected] : styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={300}
    >
      <View style={styles.row}>
        <Text style={styles.date}>{formatDate(workout.date)}</Text>
      </View>
      <Text style={styles.name} numberOfLines={2}>
        {exerciseNames}
      </Text>
      <View style={[styles.row, { marginTop: 8, marginBottom: 0 }]}>
        <Text style={styles.meta}>{metaParts.join("  ·  ")}</Text>
        {workout.durationSeconds > 0 && (
          <Text style={styles.meta}>{formatDuration(workout.durationSeconds)}</Text>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#121212",
  },
  cardSelected: {
    backgroundColor: "#FFF5EE",
    borderWidth: 2,
    borderColor: "#FF6B00",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: { fontSize: 15, fontWeight: "600", color: "#121212", marginTop: 4 },
  date: { fontSize: 17, fontWeight: "bold", color: "#121212" },
  meta: { fontSize: 13, fontWeight: "600", color: "#000000" },
  right: { flexDirection: "row", alignItems: "center", gap: 8 },
});

export default WorkoutCard;

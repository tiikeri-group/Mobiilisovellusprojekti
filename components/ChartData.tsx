import React from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { WorkoutSession } from "../types/workout";

type Props = {
  data: { value: number; label: string }[];
  unit: string;
  chartType?: "time" | "volume" | "pr";
};

const getLastDays = (sessions: WorkoutSession[], days: number) => {
  return [...sessions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, days)
    .reverse();
};

const formatDateLabel = (dateString: string) => {
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.getMonth() + 1;

  return `${day}.${month}`;
}

export const buildTimeData = (
  sessions: WorkoutSession[],
  range: number
) => {
  const filtered = getLastDays(sessions, range);

  return [...filtered]
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    )
    .map(session => {

        const minutes = Math.round((session.durationSeconds || 0) / 60);

      return {
        value: minutes,
        label: formatDateLabel(session.date)
      };
    });
};

export const buildVolumeData = (
  sessions: WorkoutSession[],
  range: number
) => {
  const filtered = getLastDays(sessions, range);

  return [...filtered]
    .sort(
      (a, b) =>
        new Date(a.date).getTime() -
        new Date(b.date).getTime()
    )
    .map(session => {

      let totalVolume = 0;

      session.exercises.forEach(ex => {
        ex.sets.forEach(set => {
          const weight = Number(set.weight) || 0;
          const reps = Number(set.reps) || 0;

          totalVolume += weight * reps;
        });
      });

      return {
        value: totalVolume,
        label: formatDateLabel(session.date)
      };
    });
};

export const buildPRData = ( sessions: WorkoutSession[], range: number ) => {

  const exercisePRMap: Record<string, number> = {};

  sessions.forEach(session => {
    session.exercises.forEach(ex => {
      ex.sets.forEach(set => {

        const weight = Number(set.weight) || 0;

        if (weight > (exercisePRMap[ex.exerciseName] || 0)) {
          exercisePRMap[ex.exerciseName] = weight;
        }

      });
    });
  });

  return Object.keys(exercisePRMap).map(exerciseName => {
    return {
      value: exercisePRMap[exerciseName],
      label: exerciseName
    };
  });

};

export const MyBarChart = ({ data, unit, chartType }: Props) => {

  const isPRChart = chartType === "pr";

  return (
      <View>
      <BarChart data={data} 
      barWidth={isPRChart ? 12 : 8}
      spacing={isPRChart ? 60 : 22}
      xAxisLabelTextStyle={{ fontSize: isPRChart ? 6 : 10 }}
      height={150}
      isAnimated
      scrollToEnd={false}
      initialSpacing={isPRChart ? 40 : 20}
      endSpacing={10}
      yAxisThickness={1}
      xAxisThickness={1}
      yAxisTextStyle={{ fontSize: 10 }}
      noOfSections={5}
      formatYLabel={(value) => `${value} ${unit}`}
      />
    </View>
  );
};
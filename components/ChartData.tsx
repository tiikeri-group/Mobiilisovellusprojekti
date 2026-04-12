import React, { useState } from "react";
import { View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { WorkoutSession } from "../types/workout";

type Props = {
  data: { value: number; label: string }[];
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

export const buildTimeData = (sessions: WorkoutSession[], range: number) => {
  const filtered = getLastDays(sessions, range);

  return sessions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(session => {
      const totalSeconds = session.exercises.reduce((sum, ex) => {
        return sum + (ex.durationSeconds || 0);
      }, 0);

      const minutes = Math.round(totalSeconds / 60);

      return {
        value: minutes,
        label: formatDateLabel(session.date)
      };
    });
};

export const buildVolumeData = (sessions: WorkoutSession[], range: number) => {
  const filtered = getLastDays(sessions, range);
  return [...sessions]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
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

export const buildPRData = (sessions: WorkoutSession[], range: number) => {
  const filtered = getLastDays(sessions, range);
  return [...sessions]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(session => {
      let maxWeight = 0;

      session.exercises.forEach(ex => {
        ex.sets.forEach(set => {
          const weight = Number(set.weight) || 0;

          if (weight > maxWeight) {
            maxWeight = weight;
          }
        });
      });

      return {
        value: maxWeight,
        label: formatDateLabel(session.date)
      };
    });
};

export const MyBarChart = ({ data }: Props) => {

  return (
    <View>
      <BarChart data={data} 
      barWidth={8}
      spacing={22}
      height={150}
      xAxisLabelTextStyle={{ fontSize: 10 }}
      yAxisThickness={1}
      xAxisThickness={1}
      yAxisTextStyle={{ fontSize: 10 }}
      noOfSections={5}
      />
    </View>
  );
};
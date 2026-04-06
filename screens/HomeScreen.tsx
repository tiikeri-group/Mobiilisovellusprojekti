import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppUser } from '../types/auth';
import { WorkoutSession } from "../types/workout";
import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import WorkoutCard from '../components/WorkoutCard'

type Props = {
  user: AppUser;
};

const HomeScreen = ({ user }: Props) => {

  const [open, setOpen] = useState<boolean>(false);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>([]);

  useEffect(() => {
  const fetchWorkouts = async () => {
    const querySnapshot = await getDocs(collection(db, "users", user.id, "workouts"));

    const data: WorkoutSession[] = [];

    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...(doc.data() as any) });
    });

    setWorkouts(data);
  };

  fetchWorkouts();
}, []);

  type RootTabParamList = {
    Home: undefined;
    Workout: undefined;
    Camera: undefined;
    Profile: undefined;
    History: undefined;
  };

  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

  const calculateWorkoutTime = (workouts: WorkoutSession[]) => {
  const totalSeconds = workouts.reduce((total, session) => {
    return total + session.exercises.reduce(
      (sum, ex) => sum + (ex.durationSeconds || 0),
      0
    );
  }, 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 3600 % 60;

  return `${hours} : ${minutes} : ${seconds}`;
};

const totalTime = calculateWorkoutTime(workouts);

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Pressable
            style={styles.bigbutton}
            onPress={() => navigation.navigate("Workout")}>
            <Text style={styles.title}>Start workout</Text>
          </Pressable>
        </View>
        <View style={styles.info}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ textAlign: "center" }}>hr : min : sec</Text>
              <View style={styles.line} />
              {!workouts.length ? (<Text style={{ textAlign: "center" }}>-</Text>
              ) : (
                <Text style={{ textAlign: "center" }}>{totalTime}</Text>)}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ textAlign: "center" }}>Total workouts</Text>
              <View style={styles.line} />
              {!workouts.length ? (<Text style={{ textAlign: "center" }}>-</Text>
              ) : (
                <Text style={{ textAlign: "center" }}>{workouts.length}</Text>)}
            </View>
          </View>
          <Text style={styles.title}>Last workout</Text>
        </View>
        <View style={styles.line} />
        {workouts.length === 0 ? (
  <Text style={styles.modalText}>You don't have any workout</Text>
) : (
  <View>
    {workouts.slice(0, 5).map((item) => (
      <WorkoutCard
        key={item.id}
        workout={item}
        onPress={() => (navigation as any).navigate("WorkoutDetail", { workout: item })}
        onDelete={() => {}}
      />
    ))}
  </View>
)}
<View style={styles.line} />
        <Pressable style={styles.historyButton} onPress={() => navigation.navigate("History")}>
          <Text style={styles.historyButtonText}>View History</Text>
        </Pressable>
<View style={styles.line} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 25,
  },
  bigbutton: {
    height: 200,
    width: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#e32f45",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: '#fff',
    elevation: 10
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
    textAlign: "center",
    padding: 10
  },
  info: {
    flex: 2,
  },
  overlay: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: 'center',
    justifyContent: "center"
  },
  modalBox: {
    width: 350,
    backgroundColor: 'white',
    padding: 10,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    justifyContent: "center"
  },
  button: {
    outlineWidth: 3,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'center',
  },
  textButton: {
    textAlign: 'center',
    fontSize: 20,
  },
  card: {
    flexDirection: "row",
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3
  },
  stats: {
    flexDirection: "row",
    fontSize: 24
  },
  historyButton: {
    marginHorizontal: 15,
    padding: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  historyButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  line: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
    marginHorizontal: 15,
    outlineWidth: 0.5
  }
});

export default HomeScreen;

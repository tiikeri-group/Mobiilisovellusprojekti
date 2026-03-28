import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppUser } from '../types/auth';

type Props = {
  user: AppUser;
};

const HomeScreen = ({ user }: Props) => {

  const [open, setOpen] = useState<boolean>(false);
  const [workout, setworkout] = useState<string>();

  const historyData = [
    { id: '1', time: '00:30:45', workout: 'Pushups', date: '27.03.2026' },
    { id: '2', time: '00:45:10', workout: 'Squats', date: '26.03.2026' },
    { id: '3', time: '01:00:00', workout: 'Running', date: '25.03.2026' },
    { id: '4', time: '00:20:15', workout: 'Plank', date: '24.03.2026' },
    { id: '5', time: '00:35:00', workout: 'Burpees', date: '23.03.2026' },
    { id: '6', time: '00:35:00', workout: 'Burpees', date: '23.03.2026' },
  ];

  type RootTabParamList = {
    Home: undefined;
    Workout: undefined;
    Camera: undefined;
    Profile: undefined;
  };

  const navigation = useNavigation<NavigationProp<RootTabParamList>>();

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
              {!historyData ? (<Text style={{ textAlign: "center" }}>-</Text>
              ) : (
                <Text style={{ textAlign: "center" }}>Time</Text>)}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ textAlign: "center" }}>Total workouts</Text>
              <View style={styles.line} />
              {!historyData ? (<Text style={{ textAlign: "center" }}>-</Text>
              ) : (
                <Text style={{ textAlign: "center" }}>{historyData.length}</Text>)}
            </View>
          </View>
          <Text style={styles.title}>Last workout</Text>
        </View>
        <View style={styles.line} />
        {historyData.length === 0 ? (
          <Text style={styles.modalText}>You don't have any workout</Text>
        ) : (
          <>
            {historyData.slice(0, 5).map((data) => (
              <Pressable key={data.id} onPress={() => setOpen(true)}>
                <View style={styles.card}>
                  <Text style={{ flex: 1, textAlign: 'center' }}>{data.time}</Text>
                  <Text style={{ flex: 1, textAlign: 'center' }}>{data.workout}</Text>
                  <Text style={{ flex: 1, textAlign: 'center' }}>{data.date}</Text>
                </View>
              </Pressable>
            ))}
            {historyData.length > 5 && (
              <Pressable onPress={() => navigation.navigate("Home")}>
                <Text style={{ textAlign: 'center', marginTop: 10 }}>More</Text>
              </Pressable>
            )}
          </>
        )}
        <View style={styles.line} />
        <View>
          <Text style={styles.title}>Information</Text>
          <Text style={{ textAlign: "center" }}>Visiting hours 8-18</Text>
        </View>
      </ScrollView>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalBox}>
            <Text style={styles.title}>Your last workout</Text>
            <Pressable onPress={() => setOpen(false)} style={styles.button}>
              <Text style={styles.textButton}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  line: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 15,
    marginHorizontal: 15,
    outlineWidth: 0.5
  }
});

export default HomeScreen;

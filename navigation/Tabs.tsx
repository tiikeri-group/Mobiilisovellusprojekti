import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import CameraScreen from '../screens/CameraScreen';
import { AppUser } from "../types/auth";

const Tab = createBottomTabNavigator();

type Props = {
  user: AppUser;
  onLogout: () => Promise<void> | void;
};

const Tabs = ({ user, onLogout }: Props) => {
  return (
    <Tab.Navigator 
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          backgroundColor: "#ffff",
          borderRadius: 15,
          height: 90,
          ...styles.shadow
        }
      }}
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ focused }) => {
            return(
              <View style={{alignItems: "center", justifyContent: "center", top: 10}}>
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  style={{fontSize: 30, color: focused ? "#e32f45" : "#748c94"}}
                />
              </View>
            )
          },
        }}
      >
        {() => <HomeScreen user={user} />}
      </Tab.Screen>

      <Tab.Screen
        name="Workout"
        component={WorkoutScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return(
              <View style={{alignItems: "center", justifyContent: "center", top: 10}}>
                <Ionicons
                  name={focused ? "barbell" : "barbell-outline"}
                  style={{fontSize: 30, color: focused ? "#e32f45" : "#748c94"}}
                />
              </View>
            )
          },
        }}
      />

      <Tab.Screen
        name="Camera"
        options={{
          tabBarIcon: ({ focused }) => {
            return(
              <View style={{alignItems: "center", justifyContent: "center", top: 10}}>
                <Ionicons
                  name={focused ? "camera" : "camera-outline"}
                  style={{fontSize: 30, color: focused ? "#e32f45" : "#748c94"}}
                />
              </View>
            )
          },
        }}
      >
        {() => <CameraScreen user={user} />}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => {
            return(
              <View style={{alignItems: "center", justifyContent: "center", top: 10}}>
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  style={{fontSize: 30, color: focused ? "#e32f45" : "#748c94"}}
                />
              </View>
            )
          },
        }}
      >
        {() => <ProfileScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
})

export default Tabs;
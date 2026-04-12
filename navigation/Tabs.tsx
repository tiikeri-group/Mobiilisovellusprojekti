import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WorkoutScreen from '../screens/WorkoutScreen';
import CameraScreen from '../screens/CameraScreen';
import HistoryScreen from '../screens/HistoryScreen';
import WorkoutDetailScreen from '../screens/WorkoutDetailScreen';
import { AppUser } from "../types/auth";

const Tab = createBottomTabNavigator();

type Props = {
  user: AppUser;
  onLogout: () => Promise<void> | void;
  onUserUpdate: (updatedUser: AppUser) => void;
};

const Tabs = ({ user, onLogout, onUserUpdate }: Props) => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 56 + insets.bottom,
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          paddingBottom: insets.bottom,
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
        listeners={{
          tabPress: (e) => {
            if (!user.subscription_status) {
              e .preventDefault();
              Alert.alert('You need active membership to access the camera.');
            }
          },
        }}
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
        name="History"
        component={HistoryScreen}
        options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' } }}
      />

      <Tab.Screen
        name="WorkoutDetail"
        component={WorkoutDetailScreen}
        options={{ tabBarButton: () => null, tabBarItemStyle: { display: 'none' } }}
      />

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
        {() => <ProfileScreen user={user} onLogout={onLogout} onUserUpdate={onUserUpdate} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};


export default Tabs;
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthChoiceScreen from "../screens/AuthChoiceScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

type AuthStackParamList = {
  AuthChoice: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AuthChoice"
        component={AuthChoiceScreen}
        options={{ title: "Aloitus" }}
      />
      <Stack.Screen name="Login" options={{ title: "Kirjaudu sisään" }}>
        {() => <LoginScreen />}
      </Stack.Screen>
      <Stack.Screen name="Register" options={{ title: "Luo uusi käyttäjä" }}>
        {() => <RegisterScreen />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStack;
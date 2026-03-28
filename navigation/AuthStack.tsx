import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthChoiceScreen from "../screens/AuthChoiceScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import { AppUser } from "../types/auth";

type AuthStackParamList = {
  AuthChoice: undefined;
  Login: undefined;
  Register: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

type Props = {
  onAuthSuccess: (token: string, user: AppUser) => void;
};

const AuthStack = ({ onAuthSuccess }: Props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AuthChoice"
        component={AuthChoiceScreen}
        options={{ title: "Aloitus" }}
      />
      <Stack.Screen name="Login" options={{ title: "Kirjaudu sisään" }}>
        {() => <LoginScreen onLoginSuccess={onAuthSuccess} />}
      </Stack.Screen>
      <Stack.Screen name="Register" options={{ title: "Luo uusi käyttäjä" }}>
        {() => <RegisterScreen onRegisterSuccess={onAuthSuccess} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default AuthStack;
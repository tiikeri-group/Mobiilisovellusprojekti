import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Tabs from "./navigation/Tabs";
import AuthStack from "./navigation/AuthStack";
import { AppUser } from "./types/auth";
import {
  fetchCurrentUser,
  getStoredToken,
  removeStoredToken,
} from "./api/authClient";

export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await getStoredToken();

        if (!storedToken) {
          setLoadingAuth(false);
          return;
        }

        const data = await fetchCurrentUser(storedToken);
        setToken(storedToken);
        setUser(data.user);
      } catch (error) {
        await removeStoredToken();
        setToken(null);
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    restoreSession();
  }, []);

  const handleAuthSuccess = (newToken: string, newUser: AppUser) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = async () => {
    await removeStoredToken();
    setToken(null);
    setUser(null);
  };

  if (loadingAuth) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {token && user ? (
          <Tabs user={user} onLogout={handleLogout} />
        ) : (
          <AuthStack onAuthSuccess={handleAuthSuccess} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
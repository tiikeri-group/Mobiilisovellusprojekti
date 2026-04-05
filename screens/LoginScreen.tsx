import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { validateEmail } from "../constants/validation";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorText("");

    if (!email || !password) {
      setErrorText("Täytä kaikki kentät");
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setErrorText(emailError);
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      // no need to do anything here — onAuthStateChanged in App.tsx
      // detects the login and switches to Tabs automatically
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        setErrorText("Väärä sähköposti tai salasana");
      } else if (error.code === 'auth/too-many-requests') {
        setErrorText("Liian monta yritystä. Yritä myöhemmin uudelleen");
      } else {
        setErrorText("Kirjautuminen epäonnistui");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kirjaudu sisään</Text>
      <TextInput
        style={styles.input}
        placeholder="Sähköposti"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Salasana"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>Kirjaudu</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#d9d9d9",
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginBottom: 12,
  },
});
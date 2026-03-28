import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { registerUser, saveToken } from "../api/authClient";
import { validateEmail, validatePassword } from "../constants/validation";
import { AppUser } from "../types/auth";

type Props = {
  onRegisterSuccess: (token: string, user: AppUser) => void;
};

const PasswordCriteria = ({ password }: { password: string }) => {
  if (!password) return null;

  const criteria = [
    { label: "Vähintään 8 merkkiä", met: password.length >= 8 },
    { label: "Vähintään yksi iso kirjain", met: /[A-Z]/.test(password) },
    { label: "Vähintään yksi numero", met: /[0-9]/.test(password) },
  ];

  return (
    <View style={styles.criteriaContainer}>
      {criteria.map((c) => (
        <Text key={c.label} style={c.met ? styles.criteriaMet : styles.criteriaUnmet}>
          {c.met ? "✓" : "✗"} {c.label}
        </Text>
      ))}
    </View>
  );
};

const RegisterScreen = ({ onRegisterSuccess }: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setErrorText("");

    if (!name || !email || !password || !confirmPassword) {
      setErrorText("Täytä kaikki kentät");
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setErrorText(emailError);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorText(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setErrorText("Salasanat eivät täsmää");
      return;
    }

    try {
      setLoading(true);
      const data = await registerUser(name, email, password, confirmPassword);
      await saveToken(data.token);
      onRegisterSuccess(data.token, data.user);
    } catch (error: any) {
      setErrorText(error.message || "Rekisteröinti epäonnistui");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Luo uusi käyttäjä</Text>

      <TextInput
        style={styles.input}
        placeholder="Nimi"
        value={name}
        onChangeText={setName}
      />

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

      <PasswordCriteria password={password} />

      <TextInput
        style={styles.input}
        placeholder="Salasana uudelleen"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>Rekisteröidy</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

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
  criteriaContainer: {
    marginBottom: 12,
    paddingLeft: 4,
  },
  criteriaMet: {
    color: "green",
    fontSize: 13,
    marginBottom: 2,
  },
  criteriaUnmet: {
    color: "#999",
    fontSize: 13,
    marginBottom: 2,
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
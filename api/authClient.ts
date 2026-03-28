import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse, MeResponse } from "../types/auth";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const TOKEN_KEY = "auth_token";

const getBackendUrl = () => {
  if (!BACKEND_URL) {
    throw new Error("EXPO_PUBLIC_BACKEND_URL puuttuu .env-tiedostosta");
  }

  return BACKEND_URL;
};

export const saveToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getStoredToken = async () => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

export const removeStoredToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<AuthResponse> => {
  const response = await fetch(`${getBackendUrl()}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      confirmPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Rekisteröinti epäonnistui");
  }

  return data;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${getBackendUrl()}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Kirjautuminen epäonnistui");
  }

  return data;
};

export const fetchCurrentUser = async (token: string): Promise<MeResponse> => {
  const response = await fetch(`${getBackendUrl()}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Käyttäjän haku epäonnistui");
  }

  return data;
};
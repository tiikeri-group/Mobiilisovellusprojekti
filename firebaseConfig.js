import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAtIWbW2FJfkW48nardCX3daL973VtoLt0",
  authDomain: "mobiiliapp-f9b74.firebaseapp.com",
  projectId: "mobiiliapp-f9b74",
  storageBucket: "mobiiliapp-f9b74.firebasestorage.app",
  messagingSenderId: "429945040444",
  appId: "1:429945040444:web:5d74a20f4e8962c8d6dd39"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);
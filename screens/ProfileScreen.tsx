import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, } from 'react-native';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { AppUser } from '../types/auth';

type Props = {
  user: AppUser;
  onLogout: () => Promise<void> | void;
};

const ProfilePic = () => (
  <View style={styles.silhouetteContainer}>
    <View style={styles.silhouetteHead} />
    <View style={styles.silhouetteBody} />
  </View>
);

const ProfileScreen = ({ user, onLogout }: Props) => {
  const insets = useSafeAreaInsets();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Poista käyttäjä',
      'Oletko varma että haluat poistaa käyttäjän?',
      [
        {
          text: 'Peruuta',
          style: 'cancel',
        },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              const firebaseUser = auth.currentUser;

              if (!firebaseUser) {
                setDeleting(false);
                return;
              }

              await deleteDoc(doc(db, 'users', firebaseUser.uid));
              await deleteUser(firebaseUser);
              await onLogout();
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.nameContainer, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.name}>
          {user.first_name} {user.surname}
        </Text>
      </View>

      <View style={styles.avatarContainer}>
        <ProfilePic />
      </View>

      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.buttonText}>Kirjaudu ulos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.deleteButtonText}>Poista käyttäjä</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  silhouetteContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  silhouetteHead: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#bdbdbd',
    position: 'absolute',
    top: 26,
  },
  silhouetteBody: {
    width: 92,
    height: 62,
    borderRadius: 46,
    backgroundColor: '#bdbdbd',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    marginTop: 'auto',
    gap: 12,
  },
  logoutButton: {
    backgroundColor: '#ddd',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#e53935',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButtonText: {
    fontWeight: '600',
    fontSize: 16,
    color: '#fff',
  },
});

export default ProfileScreen;
import React, { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, } from 'react-native';
import { deleteUser } from 'firebase/auth';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { AppUser } from '../types/auth';

type Props = {
  user: AppUser;
  onLogout: () => Promise<void> | void;
  onUserUpdate: (updatedUser: AppUser) => void;
};

const ProfilePic = () => (
  <View style={styles.silhouetteContainer}>
    <View style={styles.silhouetteHead} />
    <View style={styles.silhouetteBody} />
  </View>
);

const ProfileScreen = ({ user, onLogout, onUserUpdate }: Props) => {
  const insets = useSafeAreaInsets();
  const [deleting, setDeleting] = useState(false);
  const [updatingSubscription, setUpdatingSubscription] = useState(false);

  const handleToggleSubscription = async () => {
    try {
      setUpdatingSubscription(true);
      const firebaseUser = auth.currentUser;

      if (!firebaseUser) {
        setUpdatingSubscription(false);
        return;
      }

      const newStatus = !user.subscription_status;

      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        subscription_status: newStatus,
      });

      onUserUpdate({
        ...user,
        subscription_status: newStatus,
      });
    } finally {
      setUpdatingSubscription(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete user',
      'Are you sure you want to delete the user?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
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

      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Membership: {user.subscription_status ? 'On' : 'Off'}
        </Text>
      </View>

      <View style={[styles.buttonContainer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={styles.subscriptionButton}
          onPress={handleToggleSubscription}
          disabled={updatingSubscription}
        >
          {updatingSubscription ? (
            <ActivityIndicator color="#000" />
          ) : (
            <Text style={styles.buttonText}>
              Membership {user.subscription_status ? 'Off' : 'On'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
          disabled={deleting}
        >
          {deleting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.deleteButtonText}>Delete account</Text>
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
  statusContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContainer: {
    marginTop: 'auto',
    gap: 12,
  },
  subscriptionButton: {
    backgroundColor: '#cfe8cf',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
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
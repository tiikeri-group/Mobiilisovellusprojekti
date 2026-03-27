import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppUser } from '../types/auth';

type Props = {
  user: AppUser;
  onLogout: () => Promise<void> | void;
};

const ProfileScreen = ({ user, onLogout }: Props) => {
  return (
    <View style={styles.container}>
      <Text>Olet nyt ProfileScreenissä</Text>
      <Text>Käyttäjänimi: {user.first_name}</Text>

      <TouchableOpacity style={styles.button} onPress={onLogout}>
        <Text style={styles.buttonText}>Kirjaudu ulos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  button: {
    marginTop: 20,
    backgroundColor: '#ddd',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    fontWeight: '600',
  },
});

export default ProfileScreen;
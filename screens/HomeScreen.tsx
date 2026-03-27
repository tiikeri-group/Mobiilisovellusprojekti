import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppUser } from '../types/auth';

type Props = {
  user: AppUser;
};

const HomeScreen = ({ user }: Props) => {
  return (
    <View style={styles.container}>
      <Text>Olet nyt HomeScreen</Text>
      <Text>käyttäjä nimi esim yläkulmaan? {user.first_name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});

export default HomeScreen;

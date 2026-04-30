# Tiger Group Workout Tracker

A mobile fitness tracking app built with React Native and Expo.

## Features

- Track strength and cardio workouts with a live session timer
- Browse and search exercises by muscle group
- View workout history with time, volume, and PR charts
- Camera support for workout photos
- User authentication and cloud sync via Firebase

## Tech Stack

- React Native + Expo
- Firebase (Firestore, Auth)
- React Navigation (tab + stack)
- TypeScript

## Getting Started

```bash
npm install
npm start
```

Then scan the QR code with Expo Go (iOS/Android) or press `a` for Android emulator / `i` for iOS simulator.

## Project Structure

```
screens/       # App screens (Home, Workout, History, Profile, Auth)
components/    # Reusable UI components and chart helpers
types/         # TypeScript types
api/           # Backend API calls
storage/       # Local storage utilities
```

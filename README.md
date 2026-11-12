# Smart Attendance App

A mobile attendance management app built with **React Native (Expo SDK 54)** and **Firebase**. It has separate panels for **Admin**, **Teacher** and **Parent**, and verifies teacher attendance with **GPS geofencing** and **face/biometric verification**.

## Features

- **Role-based login** – Admin, Teacher and Parent flows with Firebase Authentication (sign up, login, forgot password)
- **Admin dashboard** – add and manage teachers/classes, view attendance records
- **Teacher panel** – mark attendance only when inside the allowed campus area
- **GPS geofencing** – admin sets the campus location and radius on a map; the teacher's live location is checked against it
- **Face / biometric verification** – camera capture plus device biometric check before attendance is marked
- **Attendance reports** – view attendance history stored in Firebase Realtime Database
- **Parent view** – parents can check attendance information
- **Offline location storage** – SQLite (`expo-sqlite`) for saving the college location locally
- Modern UI with gradients, animations and a shared theme

## Tech Stack

| Area | Technology |
|------|-----------|
| Framework | React Native 0.81, Expo SDK 54 |
| Navigation | React Navigation (native stack) |
| Backend | Firebase Authentication, Firebase Realtime Database |
| Location | expo-location, react-native-maps |
| Verification | expo-camera, expo-local-authentication |
| Local DB | expo-sqlite |
| Build | EAS Build |

## Project Structure

```
├── App.js                  # Root component with navigation container
├── firebaseConfig.js       # Firebase initialization
├── app.json / eas.json     # Expo & EAS build config
├── assets/                 # App icon
└── src/
    ├── components/         # Reusable UI (MenuCard, AnimatedPressable, auth layout…)
    ├── navigation/         # AppNavigator (stack screens)
    ├── screens/            # Splash, Home, Login/Signup, Admin, Teacher, Parent,
    │                       # Geofencing, FaceVerification, AttendanceView, …
    └── theme/              # Colors, gradients, spacing, shadows
```

## Getting Started

```bash
git clone <this-repo-url>
cd attendance-app
npm install
npx expo start
```

Then open the app in **Expo Go** or an emulator. Maps, camera and biometric features work best in a development build:

```bash
npx eas build --profile development --platform android
```

### Firebase

The app uses the Firebase project configured in `firebaseConfig.js`. To use your own Firebase project, replace the values there with your project's web config and enable **Email/Password Authentication** and **Realtime Database**.

## Author

**Rehan Faryad** – BS Computer Science, GC University Faisalabad

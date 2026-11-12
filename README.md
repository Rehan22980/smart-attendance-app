# Smart Attendance App

A mobile **student attendance management** app built with **React Native (Expo SDK 54)** and **Firebase**. The administrator manages students and teachers, teachers log in and mark students **Present / Absent** class by class, and parents can check their child's attendance.

## Features

- **Role-based login** – Admin, Teacher and Parent flows with Firebase Authentication (sign up, login, forgot password)
- **Admin dashboard** – add students (name, roll no, class) and teachers, and view attendance records
- **Teacher panel** – teacher logs in, searches a class, marks each student Present/Absent and saves the day's attendance
- **GPS geofencing** – admin sets the campus location and radius on a map; teachers can mark attendance only from inside the campus
- **Face / biometric verification** – camera capture plus device biometric check for secure teacher access
- **Attendance reports** – date-wise and class-wise attendance stored in Firebase Realtime Database
- **Parent view** – parents can check their child's attendance
- **Offline location storage** – SQLite (`expo-sqlite`) for saving the college location locally
- Modern UI with gradients, animations and a shared theme

## How it works

1. **Admin** logs in, adds students and teachers, and sets the campus location (geofence).
2. **Teacher** logs in from inside the campus, opens a class, and marks every student Present or Absent.
3. Attendance is saved in Firebase under `attendance/<date>/<class>/<student>`.
4. **Parents** and the admin can view the attendance reports.

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
git clone https://github.com/Rehan22980/smart-attendance-app.git
cd smart-attendance-app
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
GitHub: [@Rehan22980](https://github.com/Rehan22980)

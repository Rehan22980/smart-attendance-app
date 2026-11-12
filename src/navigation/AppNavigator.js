import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SplashScreen from "../screens/SplashScreen";
import ParentScreen from "../screens/ParentScreen";
import HomeScreen from "../screens/HomeScreen";
import AdminScreen from "../screens/AdminScreen";
import TeacherScreen from "../screens/TeacherScreen";
import SignupScreen from "../screens/SignupScreen";
import LoginScreen from "../screens/LoginScreen";
import Loginteacher from "../screens/Loginteacher";
import Loginadmin from "../screens/Loginadmin";
import AttendanceView from "../screens/AttendanceView";
import sql from "../screens/sql";
import GeofencingScreen from "../screens/GeofencingScreen";
import FaceVerificationScreen from "../screens/FaceVerificationScreen";


import { colors } from "../theme";

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: colors.white,
  headerTitleStyle: {
    fontWeight: "700",
  },
  headerShadowVisible: false,
  animation: "slide_from_right",
};

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Geofencing"
        component={GeofencingScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FaceVerification"
        component={FaceVerificationScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="sql"
        component={sql}
      />


      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="signup"
        component={SignupScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="loginteacher"
        component={Loginteacher}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="loginadmin"
        component={Loginadmin}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Admin"
        component={AdminScreen}
        options={{ title: "Admin Dashboard" }}
      />

      <Stack.Screen
        name="Parent"
        component={ParentScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Teacher"
        component={TeacherScreen}
        options={{ title: "Teacher Panel" }}
      />

      <Stack.Screen
        name="AttendanceView"
        component={AttendanceView}
        options={{ title: "Attendance Report" }}
      />
    </Stack.Navigator>
  );
}

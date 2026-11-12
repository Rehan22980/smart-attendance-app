


import React, { useEffect, useState, useRef } from "react";
import { Alert } from "react-native";
import * as Location from "expo-location";


import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, database } from "../../firebaseConfig";
import AuthScreenLayout, {
  AuthHeader,
  AuthCard,
  AuthInput,
  AuthButton,
  AuthFooterLink,
} from "../components/AuthScreenLayout";

const Loginteacher = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(true);
  const [geofence, setGeofence] = useState(null);

  const calculateDistance = (
    latitude1,
    longitude1,
    latitude2,
    longitude2
  ) => {
    const toRadians = (value) => {
      return (value * Math.PI) / 180;
    };

    const earthRadius = 6371000;

    const dLatitude = toRadians(latitude2 - latitude1);
    const dLongitude = toRadians(longitude2 - longitude1);

    const a =
      Math.sin(dLatitude / 2) * Math.sin(dLatitude / 2) +
      Math.cos(toRadians(latitude1)) *
      Math.cos(toRadians(latitude2)) *
      Math.sin(dLongitude / 2) *
      Math.sin(dLongitude / 2);

    const c =
      2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  };

  const checkUserLocation = async () => {
    try {
      setCheckingLocation(true);

      // 1. Check GPS service
      const servicesEnabled =
        await Location.hasServicesEnabledAsync();

      if (!servicesEnabled) {
        setLocationAllowed(false);

        Alert.alert(
          "Location Required",
          "Please turn ON your mobile GPS/location service."
        );

        return false;
      }

      // 2. Ask permission
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocationAllowed(false);

        Alert.alert(
          "Location Permission Required",
          "Please allow location permission to continue."
        );

        return false;
      }

      // 3. Get current location
      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const userLatitude =
        currentLocation.coords.latitude;

      const userLongitude =
        currentLocation.coords.longitude;

      console.log("User Latitude:", userLatitude);
      console.log("User Longitude:", userLongitude);

      // 4. Get geofence from Firebase
      const geofenceRef =
        ref(database, "geofence");

      const snapshot =
        await get(geofenceRef);

      if (!snapshot.exists()) {
        setLocationAllowed(false);

        Alert.alert(
          "Geofence Error",
          "College geofencing location is not configured."
        );

        return false;
      }

      const geofenceData = snapshot.val();

setGeofence(geofenceData);

const collegeLatitude =
  Number(geofenceData.latitude);

const collegeLongitude =
  Number(geofenceData.longitude);

const geofenceRadius =
  Number(geofenceData.radius);

      
      // 5. Calculate distance
      const distance =
        calculateDistance(
          userLatitude,
          userLongitude,
          collegeLatitude,
          collegeLongitude
        );

      console.log(
        "Distance:",
        distance,
        "meters"
      );

      console.log(
        "Allowed Radius:",
        geofenceRadius,
        "meters"
      );

      // 6. Inside / Outside
      if (distance <= geofenceRadius) {
        setLocationAllowed(true);

        console.log(
          "USER IS INSIDE GEOFENCE"
        );

        return true;
      } else {
        setLocationAllowed(false);

        Alert.alert(
          "Outside College",
          `You are outside the college boundary.\n\nDistance: ${Math.round(
            distance
          )} meters\nAllowed: ${geofenceRadius} meters`
        );

        console.log(
          "USER IS OUTSIDE GEOFENCE"
        );

        return false;
      }

    } catch (error) {
      console.log(
        "Location Error:",
        error
      );

      setLocationAllowed(false);

      Alert.alert(
        "Location Error",
        "Unable to verify your current location."
      );

      return false;

    } finally {
      setCheckingLocation(false);
    }
  };

  useEffect(() => {
    checkUserLocation();
  }, []);


  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    const insideCollege = await checkUserLocation();

    if (!insideCollege) {
      Alert.alert(
        "Access Denied",
        "You must be inside the college boundary to login."
      );
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const uid = userCredential.user.uid;
      const snapshot = await get(ref(database, "users/" + uid));

      if (snapshot.exists()) {
        const userData = snapshot.val();
        setLoading(false);
        Alert.alert("Success", "Login Successful");
        navigation.replace("Teacher", { user: userData,  geofence: geofence, });
      } else {
        setLoading(false);
        Alert.alert("Error", "User data not found.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Login Failed", error.message);
    }




  };


  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        "Success",
        "Password reset link has been sent to your email."
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <AuthScreenLayout
      header={
        <AuthHeader
          badge="Teacher Login"
          title="Teacher Portal"
          subtitle="Access your class and mark daily attendance"
        />
      }
    >
      <AuthCard>
        <AuthInput
          icon="✉️"
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <AuthInput
          icon="🔒"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <AuthButton
          loading={loading || checkingLocation}
          label={
            checkingLocation
              ? "Checking Location..."
              : "Login"
          }
          onPress={handleLogin}
        />

        <AuthFooterLink
          text=""
          linkText="Forgot Password?"
          onPress={handleForgotPassword}
        />
      </AuthCard>
    </AuthScreenLayout>
  );
};

export default Loginteacher;

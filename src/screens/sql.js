import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import * as SQLite from "expo-sqlite";
import * as Location from "expo-location";
import MapView, { Marker, Circle } from "react-native-maps";

const db = SQLite.openDatabaseSync("college.db");

export default function App() {
  const [collegeLocation, setCollegeLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const [distance, setDistance] = useState(null);
  const [status, setStatus] = useState(null);

  const [loading, setLoading] = useState(false);

  const RADIUS = 100;

  // --------------------------------
  // Create SQLite table
  // --------------------------------
  useEffect(() => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS college_location (
        id INTEGER PRIMARY KEY,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        radius REAL NOT NULL
      );
    `);

    loadCollegeLocation();
  }, []);

  // --------------------------------
  // Load saved College Location
  // --------------------------------
  const loadCollegeLocation = () => {
    const result = db.getFirstSync(
      "SELECT * FROM college_location WHERE id = 1"
    );

    if (result) {
      setCollegeLocation({
        latitude: result.latitude,
        longitude: result.longitude,
        radius: result.radius,
      });
    }
  };

  // --------------------------------
  // First Time College Location
  // --------------------------------
  const setCollegeLocationNow = async () => {
    try {
      setLoading(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission deni hai."
        );

        setLoading(false);
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const latitude = location.coords.latitude;
      const longitude = location.coords.longitude;

      // Save College Location in SQLite
      db.runSync(
        `
        INSERT OR REPLACE INTO college_location
        (id, latitude, longitude, radius)
        VALUES (1, ?, ?, ?)
        `,
        [latitude, longitude, RADIUS]
      );

      setCollegeLocation({
        latitude,
        longitude,
        radius: RADIUS,
      });

      Alert.alert(
        "Success",
        "College ki location SQLite mein save ho gayi hai."
      );

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);

      Alert.alert(
        "Error",
        "College location save nahi ho saki."
      );
    }
  };

  // --------------------------------
  // Calculate Distance
  // --------------------------------
  const calculateDistance = (
    lat1,
    lon1,
    lat2,
    lon2
  ) => {
    const R = 6371000; // Earth radius in meters

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  };

  // --------------------------------
  // Get Current Location
  // --------------------------------
  const getCurrentLocation = async () => {
    try {
      setLoading(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission deni hai."
        );

        setLoading(false);
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const currentLat =
        location.coords.latitude;

      const currentLng =
        location.coords.longitude;

      // Current Location save
      setCurrentLocation({
        latitude: currentLat,
        longitude: currentLng,
      });

      // --------------------------------
      // Check Geofence
      // --------------------------------

      if (collegeLocation) {
        const calculatedDistance =
          calculateDistance(
            collegeLocation.latitude,
            collegeLocation.longitude,
            currentLat,
            currentLng
          );

        setDistance(calculatedDistance);

        if (
          calculatedDistance <=
          collegeLocation.radius
        ) {
          setStatus("INSIDE");
        } else {
          setStatus("OUTSIDE");
        }

        console.log(
          "Distance:",
          calculatedDistance
        );

        console.log(
          "Status:",
          calculatedDistance <=
            collegeLocation.radius
            ? "INSIDE"
            : "OUTSIDE"
        );
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);

      Alert.alert(
        "Error",
        "Current location nahi mil saki."
      );
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        College Geofencing Demo
      </Text>

      {/* First Time Setup */}
      {!collegeLocation ? (
        <View style={styles.card}>
          <Text style={styles.heading}>
            🏫 First Time Setup
          </Text>

          <Text style={styles.info}>
            College mein kharay ho kar neeche
            button press karein.
          </Text>

          <Button
            title={
              loading
                ? "Location Getting..."
                : "Set College Location"
            }
            onPress={setCollegeLocationNow}
            disabled={loading}
          />
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.heading}>
            🏫 College Location
          </Text>

          <Text style={styles.label}>
            Latitude
          </Text>

          <Text>
            {collegeLocation.latitude}
          </Text>

          <Text style={styles.label}>
            Longitude
          </Text>

          <Text>
            {collegeLocation.longitude}
          </Text>

          <Text style={styles.label}>
            Boundary
          </Text>

          <Text>
            {collegeLocation.radius} meters
          </Text>

          <Text style={styles.saved}>
            ✅ SQLite mein permanently saved
          </Text>
        </View>
      )}

      {/* Current Location */}
      {collegeLocation && (
        <View style={styles.card}>
          <Text style={styles.heading}>
            📍 Current Location Check
          </Text>

          <Button
            title="Check My Location"
            onPress={getCurrentLocation}
            disabled={loading}
          />

          {/* Distance */}
          {distance !== null && (
            <View style={styles.statusBox}>
              <Text style={styles.distance}>
                📏 Distance:{" "}
                {distance.toFixed(2)} meters
              </Text>

              {status === "INSIDE" ? (
                <>
                  <Text style={styles.inside}>
                    🟢 INSIDE GEOFENCE
                  </Text>

                  <Text>
                    ✅ Aap College ki boundary
                    ke andar hain.
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.outside}>
                    🔴 OUTSIDE GEOFENCE
                  </Text>

                  <Text>
                    ❌ Aap College ki 100 meter
                    boundary se bahar hain.
                  </Text>
                </>
              )}
            </View>
          )}
        </View>
      )}

      {/* Satellite Map */}
      {collegeLocation && (
        <View style={styles.mapContainer}>
          <Text style={styles.heading}>
            🛰️ Satellite Map
          </Text>

          <MapView
            style={styles.map}
            mapType="satellite"
            initialRegion={{
              latitude:
                collegeLocation.latitude,
              longitude:
                collegeLocation.longitude,
              latitudeDelta: 0.003,
              longitudeDelta: 0.003,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {/* College */}
            <Marker
              coordinate={{
                latitude:
                  collegeLocation.latitude,
                longitude:
                  collegeLocation.longitude,
              }}
              title="College"
              description="100 Meter Boundary"
            />

            {/* 100 Meter Geofence */}
            <Circle
              center={{
                latitude:
                  collegeLocation.latitude,
                longitude:
                  collegeLocation.longitude,
              }}
              radius={collegeLocation.radius}
              strokeWidth={3}
              fillColor="rgba(0, 150, 255, 0.2)"
            />

            {/* Current Location */}
            {currentLocation && (
              <Marker
                coordinate={currentLocation}
                title="My Current Location"
              />
            )}
          </MapView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },

  card: {
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    backgroundColor: "#fff",
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  info: {
    fontSize: 16,
    marginBottom: 15,
  },

  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
  },

  saved: {
    marginTop: 15,
    fontWeight: "bold",
  },

  statusBox: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
  },

  distance: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },

  inside: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },

  outside: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },

  mapContainer: {
    marginTop: 10,
  },

  map: {
    width: "100%",
    height: 400,
    borderRadius: 12,
  },
});
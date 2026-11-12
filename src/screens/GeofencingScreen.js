
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";

import MapView, {
  Marker,
  Circle,
  PROVIDER_GOOGLE,
} from "react-native-maps";

import { SafeAreaView } from "react-native-safe-area-context";
import { database } from "../../firebaseConfig";
import { ref, set, onValue, remove } from "firebase/database";

export default function GeofencingScreen() {

  const [location, setLocation] = useState({
    latitude: 32.1617,
    longitude: 74.1883,
  });

  useEffect(() => {
  const geofenceRef = ref(database, "geofence");

  const unsubscribe = onValue(geofenceRef, (snapshot) => {
    const data = snapshot.val();

    if (data) {
      setLocation({
        latitude: Number(data.latitude),
        longitude: Number(data.longitude),
      });

      setRadius(String(data.radius));
    }
  });

  return () => unsubscribe();
}, []);

  const [radius, setRadius] = useState("100");

  // Map پر tap کرنے سے location change
  const handleMapPress = (event) => {
    const { latitude, longitude } =
      event.nativeEvent.coordinate;

    setLocation({
      latitude,
      longitude,
    });
  };

  // Marker drag کرنے سے location change
  const handleMarkerDrag = (event) => {
    const { latitude, longitude } =
      event.nativeEvent.coordinate;

    setLocation({
      latitude,
      longitude,
    });
  };

  // Radius
  const handleRadiusChange = (value) => {

    const numericValue =
      value.replace(/[^0-9]/g, "");

    setRadius(numericValue);
  };

  // Temporary save
  const handleSaveLocation = async () => {
  if (!radius || Number(radius) <= 0) {
    Alert.alert(
      "Invalid Radius",
      "Please enter a valid radius."
    );
    return;
  }

  try {
    const geofenceRef = ref(database, "geofence");

    await set(geofenceRef, {
      latitude: location.latitude,
      longitude: location.longitude,
      radius: Number(radius),
      updatedAt: new Date().toISOString(),
    });

    Alert.alert(
      "Success",
      "College geofencing location saved successfully."
    );

  } catch (error) {
    console.log("Firebase Save Error:", error);

    Alert.alert(
      "Error",
      "Failed to save geofencing location."
    );
  }
};

  return (

    <SafeAreaView style={styles.safeArea}>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ================= HEADER ================= */}

        <View style={styles.header}>

          <Text style={styles.title}>
            College Geofencing
          </Text>

          <Text style={styles.subtitle}>
            Select college location and set boundary
          </Text>

        </View>


        {/* ================= MAP ================= */}

        <View style={styles.mapWrapper}>

          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}

            mapType="satellite"

            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}

            onPress={handleMapPress}

            showsUserLocation={true}
            showsMyLocationButton={true}
          >

            {/* MARKER */}

            <Marker
              coordinate={location}
              title="College Location"
              description="Geofencing center point"
              draggable={true}
              onDragEnd={handleMarkerDrag}
            />

            {/* GEOFENCE CIRCLE */}

            <Circle
              center={location}
              radius={Number(radius) || 0}

              strokeWidth={2}

              strokeColor="rgba(37, 99, 235, 0.9)"

              fillColor="rgba(37, 99, 235, 0.20)"
            />

          </MapView>

        </View>


        {/* ================= LOCATION CARD ================= */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Selected Location
          </Text>


          {/* LATITUDE */}

          <View style={styles.locationRow}>

            <Text style={styles.label}>
              Latitude
            </Text>

            <Text style={styles.value}>
              {location.latitude.toFixed(6)}
            </Text>

          </View>


          {/* LONGITUDE */}

          <View style={styles.locationRow}>

            <Text style={styles.label}>
              Longitude
            </Text>

            <Text style={styles.value}>
              {location.longitude.toFixed(6)}
            </Text>

          </View>


          {/* RADIUS */}

          <Text style={styles.radiusLabel}>
            Geofence Radius
          </Text>

          <View style={styles.radiusRow}>

            <TextInput
              value={radius}
              onChangeText={handleRadiusChange}
              keyboardType="numeric"
              placeholder="100"
              style={styles.radiusInput}
            />

            <Text style={styles.meterText}>
              meters
            </Text>

          </View>


          {/* SAVE BUTTON */}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveLocation}
          >

            <Text style={styles.saveButtonText}>
              Save Location
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  container: {
    flex: 1,
  },

  content: {
    paddingBottom: 30,
  },


  // ================= HEADER =================

  header: {
    backgroundColor: "#FFFFFF",

    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,

    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2563EB",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 5,
  },


  // ================= MAP =================

  mapWrapper: {
    height: 300,

    marginHorizontal: 12,
    marginTop: 12,

    borderRadius: 18,

    overflow: "hidden",

    backgroundColor: "#E2E8F0",
  },

  map: {
    width: "100%",
    height: "100%",
  },


  // ================= CARD =================

  card: {

    backgroundColor: "#FFFFFF",

    marginHorizontal: 12,
    marginTop: 12,

    padding: 16,

    borderRadius: 18,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 6,

    elevation: 3,
  },


  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",

    marginBottom: 12,
  },


  locationRow: {

    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",

    marginBottom: 8,
  },


  label: {
    fontSize: 14,
    color: "#64748B",
  },


  value: {
    fontSize: 14,

    fontWeight: "600",

    color: "#0F172A",
  },


  // ================= RADIUS =================

  radiusLabel: {

    fontSize: 15,

    fontWeight: "700",

    color: "#0F172A",

    marginTop: 8,

    marginBottom: 8,
  },


  radiusRow: {

    flexDirection: "row",

    alignItems: "center",
  },


  radiusInput: {

    flex: 1,

    height: 48,

    borderWidth: 1,

    borderColor: "#CBD5E1",

    borderRadius: 12,

    paddingHorizontal: 14,

    fontSize: 16,

    color: "#0F172A",

    backgroundColor: "#F8FAFC",
  },


  meterText: {

    marginLeft: 10,

    fontSize: 15,

    color: "#475569",

    fontWeight: "600",
  },


  // ================= SAVE =================

  saveButton: {

    marginTop: 16,

    backgroundColor: "#2563EB",

    paddingVertical: 14,

    borderRadius: 12,
  },


  saveButtonText: {

    textAlign: "center",

    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: "700",
  },

});
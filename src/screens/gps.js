import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

export default function App() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    try {
      setLoading(true);

      // 1. Ask for GPS permission
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required."
        );

        setLoading(false);
        return;
      }

      // 2. Get current GPS location
      const result =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      console.log("GPS Location:", result);

      setLocation(result);

      // 3. Convert GPS coordinates into address
      const addressResult =
        await Location.reverseGeocodeAsync({
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
        });

      console.log("Address:", addressResult);

      if (addressResult.length > 0) {
        setAddress(addressResult[0]);
      }

      setLoading(false);
    } catch (error) {
      console.log("Location Error:", error);

      Alert.alert(
        "Error",
        "Unable to get your current location."
      );

      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      {/* Title */}
      <Text style={styles.title}>
        My Current Location
      </Text>

      {/* Button */}
      <Button
        title={
          loading
            ? "Getting Location..."
            : "Get My Location"
        }
        onPress={getLocation}
        disabled={loading}
      />

      {/* GPS Information */}
      {location && (
        <View style={styles.card}>
          <Text style={styles.heading}>
            📍 GPS Information
          </Text>

          {/* Latitude */}
          <Text style={styles.label}>
            Latitude
          </Text>

          <Text style={styles.value}>
            {location.coords.latitude}
          </Text>

          {/* Longitude */}
          <Text style={styles.label}>
            Longitude
          </Text>

          <Text style={styles.value}>
            {location.coords.longitude}
          </Text>

          {/* Accuracy */}
          <Text style={styles.label}>
            Accuracy
          </Text>

          <Text style={styles.value}>
            {location.coords.accuracy
              ? `${location.coords.accuracy.toFixed(
                  2
                )} meters`
              : "Not Available"}
          </Text>

          {/* Altitude */}
          <Text style={styles.label}>
            Altitude
          </Text>

          <Text style={styles.value}>
            {location.coords.altitude != null
              ? `${location.coords.altitude.toFixed(
                  2
                )} meters`
              : "Not Available"}
          </Text>
        </View>
      )}

      {/* Address */}
      {address && (
        <View style={styles.card}>
          <Text style={styles.heading}>
            🏠 Address Information
          </Text>

          {/* Name / Area */}
          <Text style={styles.label}>
            Area / Name
          </Text>

          <Text style={styles.value}>
            {address.name || "Not Available"}
          </Text>

          {/* Street */}
          <Text style={styles.label}>
            Street
          </Text>

          <Text style={styles.value}>
            {address.street || "Not Available"}
          </Text>

          {/* District */}
          <Text style={styles.label}>
            District
          </Text>

          <Text style={styles.value}>
            {address.district || "Not Available"}
          </Text>

          {/* City */}
          <Text style={styles.label}>
            City
          </Text>

          <Text style={styles.value}>
            {address.city || "Not Available"}
          </Text>

          {/* Subregion */}
          <Text style={styles.label}>
            Village / Subregion
          </Text>

          <Text style={styles.value}>
            {address.subregion || "Not Available"}
          </Text>

          {/* Region */}
          <Text style={styles.label}>
            Region
          </Text>

          <Text style={styles.value}>
            {address.region || "Not Available"}
          </Text>

          {/* Postal Code */}
          <Text style={styles.label}>
            Postal Code
          </Text>

          <Text style={styles.value}>
            {address.postalCode || "Not Available"}
          </Text>

          {/* Country */}
          <Text style={styles.label}>
            Country
          </Text>

          <Text style={styles.value}>
            {address.country || "Not Available"}
          </Text>
        </View>
      )}

      {/* Satellite Map */}
      {location && (
        <View style={styles.mapContainer}>
          <Text style={styles.heading}>
            🛰️ Satellite Map
          </Text>

          <MapView
            style={styles.map}
            mapType="satellite"
            initialRegion={{
              latitude:
                location.coords.latitude,
              longitude:
                location.coords.longitude,

              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            <Marker
              coordinate={{
                latitude:
                  location.coords.latitude,
                longitude:
                  location.coords.longitude,
              }}
              title="My Current Location"
              description={
                address?.city ||
                address?.district ||
                "Current Location"
              }
            />
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
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },

  card: {
    marginTop: 20,
    padding: 20,
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

  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 10,
  },

  value: {
    fontSize: 16,
    marginTop: 3,
  },

  mapContainer: {
    marginTop: 20,
  },

  map: {
    width: "100%",
    height: 350,
    borderRadius: 12,
    marginTop: 10,
  },
});
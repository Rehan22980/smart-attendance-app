import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { signOut } from "firebase/auth";
import { auth, database } from "../../firebaseConfig";
import { ref, get, set } from "firebase/database";
import AnimatedPressable from "../components/AnimatedPressable";
import { colors, radius, shadows } from "../theme";
import { Ionicons } from '@expo/vector-icons';

export default function TeacherAttendanceScreen({ route,
  navigation, }) {
  const user = route?.params?.user;
   const geofence = route?.params?.geofence;

  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [searchClass, setSearchClass] = useState("");

  const isLoggingOut = useRef(false);

    // Calculate distance between current location
  // and college geofence location
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

    const dLatitude = toRadians(
      latitude2 - latitude1
    );

    const dLongitude = toRadians(
      longitude2 - longitude1
    );

    const a =
      Math.sin(dLatitude / 2) *
        Math.sin(dLatitude / 2) +
      Math.cos(toRadians(latitude1)) *
        Math.cos(toRadians(latitude2)) *
        Math.sin(dLongitude / 2) *
        Math.sin(dLongitude / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return earthRadius * c;
  };


  // Check GPS + Geofence continuously
  const checkTeacherGeofence = async () => {
    try {
      // Already logging out
      if (isLoggingOut.current) {
        return;
      }

      // 1. Check GPS service
      const servicesEnabled =
        await Location.hasServicesEnabledAsync();

      // GPS OFF
      if (!servicesEnabled) {
        isLoggingOut.current = true;

        Alert.alert(
          "Location Required",
          "Your location has been turned OFF. You will be logged out.",
          [
            {
              text: "OK",
              onPress: async () => {
                try {
                  await signOut(auth);

                  navigation.replace("login");
                } catch (error) {
                  console.log(
                    "Logout Error:",
                    error
                  );
                }
              },
            },
          ],
          {
            cancelable: false,
          }
        );

        return;
      }


      // 2. Check location permission
      const { status } =
        await Location.getForegroundPermissionsAsync();

      if (status !== "granted") {
        isLoggingOut.current = true;

        Alert.alert(
          "Location Permission",
          "Location permission has been disabled. You will be logged out.",
          [
            {
              text: "OK",
              onPress: async () => {
                try {
                  await signOut(auth);

                  navigation.replace("login");
                } catch (error) {
                  console.log(
                    "Logout Error:",
                    error
                  );
                }
              },
            },
          ],
          {
            cancelable: false,
          }
        );

        return;
      }


      // 3. Check geofence data
      if (!geofence) {
        console.log(
          "Geofence data not found"
        );

        return;
      }


      // 4. Get current GPS location
      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const userLatitude =
        currentLocation.coords.latitude;

      const userLongitude =
        currentLocation.coords.longitude;


      // 5. College saved location
      const collegeLatitude =
        Number(geofence.latitude);

      const collegeLongitude =
        Number(geofence.longitude);

      const geofenceRadius =
        Number(geofence.radius);


      // 6. Calculate distance
      const distance =
        calculateDistance(
          userLatitude,
          userLongitude,
          collegeLatitude,
          collegeLongitude
        );


      console.log(
        "Current Distance:",
        Math.round(distance),
        "meters"
      );

      console.log(
        "Allowed Radius:",
        geofenceRadius,
        "meters"
      );


      // 7. User outside boundary
      if (
        distance > geofenceRadius
      ) {
        isLoggingOut.current = true;

        Alert.alert(
          "Outside College",
          `You have left the college boundary.\n\nDistance: ${Math.round(
            distance
          )} meters\nAllowed: ${geofenceRadius} meters\n\nYou will be logged out.`,
          [
            {
              text: "OK",
              onPress: async () => {
                try {
                  await signOut(auth);

                  navigation.replace("login");
                } catch (error) {
                  console.log(
                    "Logout Error:",
                    error
                  );
                }
              },
            },
          ],
          {
            cancelable: false,
          }
        );

        return;
      }


      // 8. User is inside
      console.log(
        "USER IS INSIDE GEOFENCE"
      );

    } catch (error) {
      console.log(
        "Geofence Monitoring Error:",
        error
      );
    }
  };

    useEffect(() => {
    const interval = setInterval(() => {
      checkTeacherGeofence();
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const loadStudents = async () => {
    const snapshot = await get(ref(database, "students"));

    if (snapshot.exists()) {
      const data = [];

      snapshot.forEach((child) => {
        data.push({
          id: child.key,
          ...child.val(),
          present: false,
        });
      });

      setAllStudents(data);
      setStudents(data);
    }
  };

  const searchStudents = () => {
    const filtered = allStudents.filter(
      (item) =>
        item.studentClass.toLowerCase().trim() ===
        searchClass.toLowerCase().trim()
    );

    setStudents(filtered);
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const toggleAttendance = (id) => {
    const updated = students.map((student) =>
      student.id === id
        ? { ...student, present: !student.present }
        : student
    );

    setStudents(updated);
  };

  const saveAttendance = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      for (const student of students) {
        await set(
          ref(
            database,
            `attendance/${today}/${student.studentClass}/${student.id}`
          ),
          {
            Teacher: user?.name,
            studentId: student.id,
            studentName: student.studentName,
            rollNo: student.rollNo,
            studentClass: student.studentClass,
            status: student.present ? "Present" : "Absent",
            date: today,
          }
        );
      }

      Alert.alert("Success", "Attendance Saved Successfully");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.roll}>{item.rollNo}</Text>
      <Text style={styles.name}>{item.studentName}</Text>

      <AnimatedPressable onPress={() => toggleAttendance(item.id)}>
        <View
          style={[
            styles.statusButton,
            {
              backgroundColor: item.present ? colors.success : colors.danger,
            },
          ]}
        >
          <Text style={styles.buttonText}>
            {item.present ? "Present" : "Absent"}
          </Text>
        </View>
      </AnimatedPressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.profileInfo}>
          <Text style={styles.heading}>Teacher Dashboard</Text>
          <Text style={styles.welcome}>Welcome, {user?.name}</Text>
        </View>

        <Image source={{ uri: user?.image }} style={styles.profileImage} />
      </View>

      <View style={styles.searchCard}>
        <TextInput
          placeholder="Enter Class Name (e.g., Class 5)"
          placeholderTextColor={colors.textMuted}
          value={searchClass}
          onChangeText={setSearchClass}
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={searchStudents}
        />

        <TouchableOpacity style={styles.searchIconButton} onPress={searchStudents} accessibilityRole="button" accessibilityLabel="Search">
          <Ionicons name="search" size={26} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Roll</Text>
        <Text style={styles.headerText}>Student</Text>
        <Text style={styles.headerText}>Status</Text>
      </View>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <AnimatedPressable onPress={saveAttendance}>
        <View style={styles.saveButton}>
          <Text style={styles.saveText}>Save Attendance</Text>
        </View>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: radius.lg,
    marginBottom: 16,
    ...shadows.card,
  },
  profileInfo: {
    flex: 1,
    paddingRight: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
  },
  welcome: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  profileImage: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  searchCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 8,
    marginBottom: 14,
    ...shadows.soft,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
    color: colors.text,
  },
  searchIconButton: {
    marginLeft: 8,
    backgroundColor: "transparent",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: radius.md,
    marginBottom: 10,
  },
  headerText: {
    flex: 1,  
    color: colors.white,
    fontWeight: "700",
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 14,
    marginBottom: 8,
    borderRadius: radius.md,
    ...shadows.soft,
  },
  roll: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    color: colors.text,
    fontWeight: "600",
  },
  name: {
    flex: 2,
    fontSize: 15,
    color: colors.text,
    marginLeft:70,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal:15,
    borderRadius: radius.sm,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 13,
  },
  saveButton: {
    backgroundColor: colors.primaryDark,
    padding: 16,
    borderRadius: radius.lg,
    marginTop: 8,
    marginBottom: 25,
    ...shadows.card,
  },
  saveText: {
    color: colors.white,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 17,
  },
});

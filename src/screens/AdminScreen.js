import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import AnimatedPressable from "../components/AnimatedPressable";
import { colors, radius, shadows } from "../theme";

import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import FadeInView from "../components/FadeInView";
import { gradients, spacing } from "../theme";


import { database } from "../../firebaseConfig";
import { ref, push } from "firebase/database";
import { Dropdown } from "react-native-element-dropdown";

import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";




export default function AdminScreen({ navigation, route }) {


   console.log("Route Params:", route?.params);

const user = route?.params?.user;

console.log("User:", user);
  
  const [showClass, setShowClass] = useState(false);
  const [showTeacher, setShowTeacher] = useState(false);
  const [showStudent, setShowStudent] = useState(false);

  //dropdown class
  const classList = [
    { label: "Class 1", value: "Class 1" },
    { label: "Class 2", value: "Class 2" },
    { label: "Class 3", value: "Class 3" },
    { label: "Class 4", value: "Class 4" },
    { label: "Class 5", value: "Class 5" },
    { label: "Class 6", value: "Class 6" },
    { label: "Class 7", value: "Class 7" },
    { label: "Class 8", value: "Class 8" },
    { label: "Class 9", value: "Class 9" },
    { label: "Class 10", value: "Class 10" },
  ];


  // Add Class

  const [className, setClassName] = useState("");

  // Add Teacher
  const [teacherName, setTeacherName] = useState("");
  const [qualification, setQualification] = useState("");
  const [teacherPhone, setTeacherPhone] = useState("");
  const [assignClass, setAssignClass] = useState("");

  // Student States

  const [studentName, setStudentName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [parentPhone, setParentPhone] = useState("");


//logout
const handleLogout = async () => {
  try {
    await signOut(auth);

    Alert.alert("Success", "Logout Successfully");

    navigation.replace("login");
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};

  // ADD CLASS
  const saveClass = () => {

    if (className.trim() === "") {
      alert("Error", "Please Enter Class Name");

      return;
    }

    push(ref(database, "classes"), {
      className: className,
      createdAt: new Date().toISOString(),
    });

    alert("Success", "Class Saved Successfully");

    setClassName("");

  };

  // ADD TEACHER

  const saveTeacher = () => {

    if (
      teacherName.trim() === "" ||
      qualification.trim() === "" ||
      teacherPhone.trim() === "" ||
      assignClass.trim() === ""
    ) {
      alert("Error", "Please Fill All Fields");
      return;
    }

    push(ref(database, "teachers"), {

      teacherName: teacherName,

      qualification: qualification,

      teacherPhone: teacherPhone,

      assignClass: assignClass,

      createdAt: new Date().toISOString(),

    });

    Alert.alert("Success", "Teacher Saved Successfully");

    setTeacherName("");
    setQualification("");
    setTeacherPhone("");
    setAssignClass("");

  };


  // STUDENT SAVE FUNCTION

  const saveStudent = () => {

    if (
      studentName.trim() === "" ||
      rollNo.trim() === "" ||
      studentClass.trim() === "" ||
      fatherName.trim() === "" ||
      parentPhone.trim() === ""
    ) {

      alert("Error", "Please Fill All Fields");
      return;

    }

    push(ref(database, "students"), {

      studentName: studentName,

      rollNo: rollNo,

      studentClass: studentClass,

      fatherName: fatherName,

      parentPhone: parentPhone,

      createdAt: new Date().toISOString(),

    });

    Alert.alert("Success", "Student Saved Successfully");

    setStudentName("");
    setRollNo("");
    setStudentClass("");
    setFatherName("");
    setParentPhone("");

  };

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>

        <View>
          <Text style={styles.heading}>
            Admin Dashboard
          </Text>

          <Text style={styles.welcome}>
            Welcome, {user?.name}
          </Text>
        </View>

        <Image
          source={{ uri: user?.image }}
          style={styles.profileImage}
        />

      </View>

      {/* ================= Add Class ================= */}

      <AnimatedPressable onPress={() => setShowClass(!showClass)}>
  <LinearGradient
    colors={["#2563EB", "#3B82F6"]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.menuCard}
  >
    <Text style={styles.menuIcon}>🏫</Text>

    <View style={{ flex: 1 }}>
      <Text style={styles.menuTitle}>Add Class</Text>
      <Text style={styles.menuSubtitle}>
        Create and manage school classes
      </Text>
    </View>

    <Text style={styles.arrow}>›</Text>
  </LinearGradient>
</AnimatedPressable>

      {showClass && (
        <View style={styles.form}>

          <View style={styles.pickerContainer}>
            <Dropdown
              style={styles.dropdown}
              data={classList}
              labelField="label"
              valueField="value"
              placeholder="Select Class"
              value={studentClass}
              onChange={(item) => setStudentClass(item.value)}
            />
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={saveClass}
          >
            <Text style={styles.buttonText}>
              Save Class
            </Text>
          </TouchableOpacity>

        </View>
      )}

      {/* ================= Add Teacher ================= */}

      <AnimatedPressable onPress={() => setShowTeacher(!showTeacher)}>
  <LinearGradient
    colors={["#0EA5E9", "#06B6D4"]}
    style={styles.menuCard}
  >
    <Text style={styles.menuIcon}>👨‍🏫</Text>

    <View style={{ flex: 1 }}>
      <Text style={styles.menuTitle}>Add Teacher</Text>
      <Text style={styles.menuSubtitle}>
        Register new teachers
      </Text>
    </View>

    <Text style={styles.arrow}>›</Text>
  </LinearGradient>
</AnimatedPressable>

      {showTeacher && (

        <View style={styles.form}>

          <TextInput
            placeholder="Teacher Name"
            style={styles.input} value={teacherName} onChangeText={setTeacherName}
          />

          <TextInput
            placeholder="Qualification"
            style={styles.input} value={qualification} onChangeText={setQualification}
          />

          <TextInput
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            style={styles.input} value={teacherPhone} onChangeText={setTeacherPhone}
          />

          <View style={styles.pickerContainer}>
            <Dropdown
              style={styles.dropdown}
              data={classList}
              labelField="label"
              valueField="value"
              placeholder="Assign Class"
              value={assignClass}
              onChange={(item) => setAssignClass(item.value)}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={saveTeacher}>
            <Text style={styles.buttonText}>
              Save Teacher
            </Text>
          </TouchableOpacity>

        </View>

      )}

      {/* ================= Geofencing Settings ================= */}

<AnimatedPressable
  onPress={() => navigation.navigate("Geofencing")}
>
  <LinearGradient
    colors={["#F59E0B", "#F97316"]}
    style={styles.menuCard}
  >
    <Text style={styles.menuIcon}>📍</Text>

    <View style={{ flex: 1 }}>
      <Text style={styles.menuTitle}>
        Geofencing
      </Text>

      <Text style={styles.menuSubtitle}>
        Set college location and boundary
      </Text>
    </View>

    <Text style={styles.arrow}>›</Text>
  </LinearGradient>
</AnimatedPressable>

      {/* ================= Add Student ================= */}

      <AnimatedPressable onPress={() => setShowStudent(!showStudent)}>
  <LinearGradient
    colors={["#10B981", "#22C55E"]}
    style={styles.menuCard}
  >
    <Text style={styles.menuIcon}>🎓</Text>

    <View style={{ flex: 1 }}>
      <Text style={styles.menuTitle}>Add Student</Text>
      <Text style={styles.menuSubtitle}>
        Register new students
      </Text>
    </View>

    <Text style={styles.arrow}>›</Text>
  </LinearGradient>
</AnimatedPressable>
      {showStudent && (

        <View style={styles.form}>

          <TextInput
            placeholder="Student Name"
            style={styles.input} value={studentName} onChangeText={setStudentName}
          />

          <TextInput
            placeholder="Roll Number"
            keyboardType="numeric"
            style={styles.input} value={rollNo} onChangeText={setRollNo}
          />

          <View style={styles.pickerContainer}>
            <Dropdown
              style={styles.dropdown}
              data={classList}
              labelField="label"
              valueField="value"
              placeholder="Select Class"
              value={studentClass}
              onChange={(item) => setStudentClass(item.value)}
            />
          </View>

          <TextInput
            placeholder="Father Name"
            style={styles.input} value={fatherName} onChangeText={setFatherName}
          />

          <TextInput
            placeholder="Parent Mobile"
            keyboardType="phone-pad"
            style={styles.input} value={parentPhone} onChangeText={setParentPhone}
          />

          <TouchableOpacity style={styles.button} onPress={saveStudent}>
            <Text style={styles.buttonText}>
              Save Student
            </Text>
          </TouchableOpacity>

        </View>


      )}

     <AnimatedPressable onPress={() => navigation.navigate("signup")}>
  <LinearGradient
    colors={["#8B5CF6", "#A855F7"]}
    style={styles.menuCard}
  >
    <Text style={styles.menuIcon}>➕</Text>

    <View style={{ flex: 1 }}>
      <Text style={styles.menuTitle}>Create Account</Text>
      <Text style={styles.menuSubtitle}>
        Register a new teacher account
      </Text>
    </View>

    <Text style={styles.arrow}>›</Text>
  </LinearGradient>
</AnimatedPressable>

      <AnimatedPressable onPress={handleLogout}>
  <LinearGradient
    colors={["#EF4444", "#DC2626"]}
    style={styles.menuCard}
  >
    <Text style={styles.menuIcon}>🚪</Text>

    <View style={{ flex: 1 }}>
      <Text style={styles.menuTitle}>Logout</Text>
      <Text style={styles.menuSubtitle}>
        Sign out from admin account
      </Text>
    </View>

    <Text style={styles.arrow}>›</Text>
  </LinearGradient>
</AnimatedPressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
  },
  card: {
    backgroundColor: colors.primary,
    padding: 25,
    borderRadius: radius.lg,
    marginBottom: 12,
    ...shadows.soft,
    
  },
  secondaryCard: {
    backgroundColor: colors.secondary,
  },
  logoutCard: {
    backgroundColor: colors.danger,
    marginBottom: 24,
  },
  cardText: {
    color: colors.white,
    fontSize: 17,
    textAlign: "center",
    fontWeight: "700",
  },
  form: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: radius.lg,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 12,
    backgroundColor: "#F8FAFC",
    color: colors.text,
  },
  button: {
    backgroundColor: colors.success,
    padding: 15,
    borderRadius: radius.md,
  },
  dropdown: {
    height: 52,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#F8FAFC",
  },
  buttonText: {
    color: colors.white,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    marginBottom: 12,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: radius.lg,
    marginTop: 8,
    marginBottom: 18,
    ...shadows.card,
  },
  welcome: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: colors.primary,
  },



menuCard: {
  flexDirection: "row",
  alignItems: "center",
  padding: 20,
  borderRadius: 20,
  marginBottom: 15,
},

menuIcon: {
  fontSize: 34,
  marginRight: 18,
},

menuTitle: {
  color: "#fff",
  fontSize: 20,
  fontWeight: "700",
},

menuSubtitle: {
  color: "rgba(255,255,255,0.85)",
  marginTop: 4,
  fontSize: 13,
},

arrow: {
  color: "#fff",
  fontSize: 30,
  fontWeight: "bold",
},

});
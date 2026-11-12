import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet, } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import { ref, set } from "firebase/database";
import { auth, database } from "../../firebaseConfig";
import AuthScreenLayout, {
  AuthHeader,
  AuthCard,
  AuthInput,
  AuthButton,
  AuthFooterLink,
} from "../components/AuthScreenLayout2";
import { colors, radius, shadows } from "../theme";

const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert("Permission Required");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImageToCloudinary = async () => {
    try {
      const data = new FormData();
      data.append("file", {
        uri: image,
        type: "image/jpeg",
        name: "profile.jpg",
      });
      data.append("upload_preset", "attendance_app");

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dskjdqtto/image/upload",
        { method: "POST", body: data }
      );

      const result = await response.json();
      return result.secure_url;
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Please fill all fields");
      return;
    }

    if (!image) {
      Alert.alert("Please select profile image");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const imageUrl = await uploadImageToCloudinary();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await set(ref(database, "users/" + userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        image: imageUrl,
      });

      setLoading(false);
      Alert.alert("Success");
      navigation.navigate("login");
    } catch (error) {
      setLoading(false);
      Alert.alert(error.message);
    }
  };

  return (
    <AuthScreenLayout
      header={
        <AuthHeader
          badge="New Account"
          title="Create Account"
          subtitle="Register to access the attendance system"
        />
      }
    >
      
      <AuthCard>
        <AuthInput
          icon="👤"
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

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

        <AuthInput
          icon="🔐"
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
            backgroundColor: "#F8FAFC",
            padding: 14,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Image
            source={
              image
                ? { uri: image }
                : {
                    uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                  }
            }
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              borderWidth: 2,
              borderColor: colors.primary,
            }}
          />

          <TouchableOpacity
            onPress={pickImage}
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 18,
              paddingVertical: 12,
              borderRadius: radius.sm,
              ...shadows.soft,
            }}
          >
            <Text style={{ color: colors.white, fontWeight: "700" }}>
              Select Photo
            </Text>
          </TouchableOpacity>
        </View>

        <AuthButton loading={loading} label="Sign Up" onPress={handleSignup} />

        <AuthFooterLink
          text="Already have an account? "
          linkText="Login"
          onPress={() => navigation.navigate("login")}
        />
      </AuthCard>
    </AuthScreenLayout>
  );
}; 

export default SignupScreen;

 const styles = StyleSheet.create({
  container: {
    marginTop: -30,
    backgroundColor: colors.background,
  },
});
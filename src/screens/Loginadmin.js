import React, { useState } from "react";
import { Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, database } from "../../firebaseConfig";
import AuthScreenLayout, {
  AuthHeader,
  AuthCard,
  AuthInput,
  AuthButton,
  AuthFooterLink,
} from "../components/AuthScreenLayout";

const Loginadmin = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
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
        navigation.replace("Admin", { user: userData });
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
          badge="Admin Login"
          title="Admin Control"
          subtitle="Manage classes, teachers, and student records"
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
      
              <AuthButton loading={loading} label="Login" onPress={handleLogin} />
      
              <AuthFooterLink
                text=""
                linkText="Forgot Password?"
                onPress={handleForgotPassword}
              />
            </AuthCard>
    </AuthScreenLayout>
  );
};

export default Loginadmin;

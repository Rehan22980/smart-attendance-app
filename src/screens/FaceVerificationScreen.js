import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as LocalAuthentication from "expo-local-authentication";

import { AuthHeader } from "../components/AuthScreenLayout";
import FadeInView from "../components/FadeInView";
import AnimatedPressable from "../components/AnimatedPressable";
import { colors, radius, shadows, spacing } from "../theme";

export default function FaceVerificationScreen({ navigation }) {
  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [biometricInfo, setBiometricInfo] = useState("Checking device...");

  // ==========================================
  // CHECK DEVICE BIOMETRIC
  // ==========================================

  const checkBiometric = async () => {
    try {
      console.log("");
      console.log("================================");
      console.log("🔐 BIOMETRIC CHECK START");
      console.log("================================");

      const hardware = await LocalAuthentication.hasHardwareAsync();

      console.log(
        "Hardware:",
        hardware ? "✅ AVAILABLE" : "❌ NOT AVAILABLE"
      );

      if (!hardware) {
        setBiometricInfo("❌ Biometric authentication not supported");
        return false;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();

      console.log("Enrolled:", enrolled ? "✅ YES" : "❌ NO");

      if (!enrolled) {
        setBiometricInfo("⚠️ Setup Face Unlock or Fingerprint first");
        return false;
      }

      const types =
        await LocalAuthentication.supportedAuthenticationTypesAsync();

      console.log("Raw biometric types:", types);

      const face = types.includes(
        LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
      );

      const fingerprint = types.includes(
        LocalAuthentication.AuthenticationType.FINGERPRINT
      );

      console.log(
        "😀 Face Recognition:",
        face ? "✅ AVAILABLE" : "❌ NOT AVAILABLE"
      );

      console.log(
        "👆 Fingerprint:",
        fingerprint ? "✅ AVAILABLE" : "❌ NOT AVAILABLE"
      );

      if (face && fingerprint) {
        setBiometricInfo("😀 Face + 👆 Fingerprint Available");
      } else if (face) {
        setBiometricInfo("😀 Face Recognition Available");
      } else if (fingerprint) {
        setBiometricInfo("👆 Fingerprint Available");
      } else {
        setBiometricInfo("🔐 Device Biometric Available");
      }

      console.log("================================");
      console.log("🔐 BIOMETRIC CHECK COMPLETE");
      console.log("================================");

      return true;
    } catch (error) {
      console.log("🔥 BIOMETRIC CHECK ERROR:", error);
      setBiometricInfo("❌ Biometric check failed");
      return false;
    }
  };

  // ==========================================
  // VERIFY IDENTITY
  // ==========================================

  const startVerification = async () => {
    if (!cameraReady) {
      console.log("❌ CAMERA NOT READY");
      return;
    }

    if (loading) {
      return;
    }

    try {
      console.log("");
      console.log("================================");
      console.log("🟢 VERIFY BUTTON PRESSED");
      console.log("================================");

      setLoading(true);

      const biometricAvailable = await checkBiometric();

      if (!biometricAvailable) {
        setLoading(false);

        Alert.alert(
          "Biometric Unavailable",
          "Please setup Face Unlock or Fingerprint on your phone."
        );

        return;
      }

      console.log("📷 Capturing image...");

      if (!cameraRef.current) {
        console.log("❌ Camera reference missing");
        setLoading(false);
        return;
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        skipProcessing: true,
      });

      console.log("✅ PHOTO CAPTURED");
      console.log("📸 IMAGE:", photo?.uri);

      console.log("");
      console.log("================================");
      console.log("🔐 OPENING DEVICE BIOMETRIC");
      console.log("================================");
      console.log("👉 Try Face Unlock or Fingerprint");

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Verify your identity",
        promptDescription: "Use Face Unlock or Fingerprint to continue",
        cancelLabel: "Cancel",
        disableDeviceFallback: false,
      });

      console.log("");
      console.log("🔐 AUTHENTICATION RESULT:");
      console.log(result);

      if (result.success) {
        console.log("");
        console.log("================================");
        console.log("🎉 VERIFICATION SUCCESS");
        console.log("✅ USER VERIFIED");
        console.log("================================");

        setVerified(true);
        setLoading(false);

        setTimeout(() => {
          console.log("➡️ NAVIGATING TO HOME");
          navigation.navigate("Home");
        }, 1000);

        return;
      }

      console.log("❌ BIOMETRIC VERIFICATION FAILED");
      console.log("Error:", result.error);

      setLoading(false);

      Alert.alert(
        "Verification Failed",
        "Face/Fingerprint verification failed. Please try again."
      );
    } catch (error) {
      console.log("");
      console.log("================================");
      console.log("🔥 VERIFICATION ERROR");
      console.log(error);
      console.log("================================");

      setLoading(false);

      Alert.alert("Error", "Something went wrong during verification.");
    }
  };

  // ==========================================
  // PERMISSION LOADING
  // ==========================================

  if (!permission) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <AuthHeader
          badge="Security Check"
          title="Face Verification"
          subtitle="Preparing secure identity verification"
        />
        <View style={styles.centerContent}>
          <FadeInView delay={120}>
            <View style={styles.stateCard}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.stateTitle}>Loading camera...</Text>
              <Text style={styles.stateText}>
                Please wait while we initialize the camera module.
              </Text>
            </View>
          </FadeInView>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // PERMISSION NOT GRANTED
  // ==========================================

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <AuthHeader
          badge="Security Check"
          title="Face Verification"
          subtitle="Camera access is required for identity verification"
        />
        <View style={styles.centerContent}>
          <FadeInView delay={120}>
            <View style={styles.stateCard}>
              <View style={styles.stateIconWrap}>
                <Text style={styles.stateIcon}>📷</Text>
              </View>
              <Text style={styles.stateTitle}>Camera Permission Required</Text>
              <Text style={styles.stateText}>
                Camera access is required to verify your identity securely.
              </Text>
              <AnimatedPressable
                style={styles.primaryButton}
                onPress={requestPermission}
              >
                <Text style={styles.buttonText}>Allow Camera</Text>
              </AnimatedPressable>
            </View>
          </FadeInView>
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // MAIN SCREEN
  // ==========================================

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <AuthHeader
        badge="Security Check"
        title="Face Verification"
        subtitle="Verify your identity to continue"
      />

      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FadeInView delay={180} style={styles.cameraSection}>
          <View style={styles.cameraContainer}>
            <CameraView
              ref={cameraRef}
              style={styles.camera}
              facing="front"
              onCameraReady={() => {
                console.log("📷 CAMERA READY");
                setCameraReady(true);
                checkBiometric();
              }}
            />

            <View style={styles.faceGuide}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </View>

            <View style={styles.cameraOverlay}>
              <View style={styles.cameraHintPill}>
                <Text style={styles.cameraText}>
                  Position your face inside the frame
                </Text>
              </View>
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={300}>
          <View style={styles.statusCard}>
            <View style={styles.statusIconWrap}>
              <Text style={styles.statusIcon}>🔐</Text>
            </View>
            <View style={styles.statusContent}>
              <Text style={styles.statusTitle}>Device Security</Text>
              <Text style={styles.statusText}>{biometricInfo}</Text>
            </View>
          </View>
        </FadeInView>

        

        <FadeInView delay={420}>
          <AnimatedPressable
            style={[
              styles.verifyButton,
              (!cameraReady || loading) && styles.disabledButton,
            ]}
            onPress={startVerification}
            disabled={!cameraReady || loading}
          >
            {loading ? (
              <>
                <ActivityIndicator color={colors.white} size="small" />
                <Text style={styles.buttonText}>Verifying...</Text>
              </>
            ) : (
              <Text style={styles.buttonText}>Verify Identity</Text>
            )}
          </AnimatedPressable>

          <Text style={styles.bottomText}>
            Secure device biometric verification
          </Text>
        </FadeInView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  centerContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    justifyContent: "flex-start",
  },
  stateCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  stateIconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  stateIcon: {
    fontSize: 30,
  },
  stateTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  stateText: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    borderRadius: radius.md,
    alignSelf: "stretch",
    alignItems: "center",
    ...shadows.soft,
  },
  cameraSection: {
    marginTop: spacing.xs,
  },
  cameraContainer: {
    height: 280,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.text,
    position: "relative",
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
    marginTop:30,
  },
  camera: {
    flex: 1,
  },
  faceGuide: {
    position: "absolute",
    width: 180,
    height: 220,
    alignSelf: "center",
    top: 28,
  },
  cornerTopLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 45,
    height: 45,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: colors.white,
    borderTopLeftRadius: radius.md,
  },
  cornerTopRight: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 45,
    height: 45,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: colors.white,
    borderTopRightRadius: radius.md,
  },
  cornerBottomLeft: {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: 45,
    height: 45,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: colors.white,
    borderBottomLeftRadius: radius.md,
  },
  cornerBottomRight: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 45,
    height: 45,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: colors.white,
    borderBottomRightRadius: radius.md,
  },
  cameraOverlay: {
    position: "absolute",
    bottom: spacing.md,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  cameraHintPill: {
    backgroundColor: colors.overlay,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  cameraText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm + 4,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  statusIconWrap: {
    width: 42,
    height: 42,
    borderRadius: radius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  statusIcon: {
    fontSize: 22,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statusText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 21,
  },
  successCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: radius.lg,
    padding: spacing.sm + 4,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    ...shadows.soft,
  },
  successCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#DCFCE7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  successIcon: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.success,
  },
  successContent: {
    flex: 1,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#166534",
  },
  successSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  verifyButton: {
    minHeight: 70,
    borderRadius: radius.lg,
    marginTop: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    flexDirection: "row",
    gap: spacing.sm,
    ...shadows.soft,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
  bottomText: {
    textAlign: "center",
    marginTop: spacing.sm,
    color: colors.textMuted,
    fontSize: 13,
  },
});

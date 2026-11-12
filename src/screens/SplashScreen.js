import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, gradients, radius, shadows } from "../theme";

export default function SplashScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const ringRotate = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(ringRotate, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.timing(progressWidth, {
      toValue: 1,
      duration: 3800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace("FaceVerification");
    }, 7000);

    return () => clearTimeout(timer);
  }, [fadeAnim, logoScale, navigation, progressWidth, pulseAnim, ringRotate, slideAnim]);

  const spin = ringRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const barWidth = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <LinearGradient
      colors={gradients.splash}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.mainContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.logoOuter,
              {
                transform: [{ scale: logoScale }, { rotate: spin }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.logoInner,
                { transform: [{ scale: pulseAnim }] },
              ]}
            >
              <Text style={styles.icon}>📋</Text>
            </Animated.View>
          </Animated.View>

          <Text style={styles.title}>Attendance App</Text>
          <Text style={styles.tagline}>Smart • Simple • Professional</Text>

          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: barWidth }]} />
          </View>

          <Text style={styles.loadingText}>Loading your dashboard...</Text>
        </Animated.View>

        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <View style={styles.footerCard}>
            <View style={styles.profileRing}>
              <Image
                source={require("../../assets/icon.png")}
                style={styles.profile}
              />
            </View>
            <Text style={styles.developer}>Developer</Text>
            <Text style={styles.name}>Rehan Faryad Ali (BSCS)</Text>
            <Text style={styles.email}>faryadrehan00@gmail.com</Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowTop: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  glowBottom: {
    position: "absolute",
    bottom: 120,
    left: -70,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoOuter: {
    width: 118,
    height: 118,
    borderRadius: 59,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  logoInner: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.card,
  },
  icon: {
    fontSize: 44,
  },
  title: {
    fontSize: 34,
    color: colors.white,
    fontWeight: "800",
    letterSpacing: 1,
    textAlign: "center",
  },
  tagline: {
    marginTop: 10,
    color: "rgba(255,255,255,0.82)",
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  progressTrack: {
    width: 220,
    height: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginTop: 34,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.white,
  },
  loadingText: {
    marginTop: 14,
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: "center",
  },
  footerCard: {
    width: "100%",
    maxWidth: 320,
    alignItems: "center",
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  profileRing: {
    padding: 3,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: colors.white,
    marginBottom: 12,
  },
  profile: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  developer: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  email: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "lowercase",
  },
  name: {
    color: colors.white,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },
});

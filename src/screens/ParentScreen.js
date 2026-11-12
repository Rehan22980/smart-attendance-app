import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import FadeInView from "../components/FadeInView";
import MenuCard from "../components/MenuCard";
import { colors, gradients, spacing } from "../theme";

export default function ParentScreen({ navigation }) {
  const classes = [
    "Nursery",
    "Prep",
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "11th",
  ];

  const cardGradients = [
    ["#2563EB", "#3B82F6"],
    ["#7C3AED", "#A855F7"],
    ["#0F766E", "#14B8A6"],
    ["#DB2777", "#EC4899"],
    ["#D97706", "#F59E0B"],
    ["#4F46E5", "#6366F1"],
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients.parent}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView edges={["top"]}>
          <FadeInView>
            <Text style={styles.badge}>Parent View</Text>
            <Text style={styles.heading}>Parent Dashboard</Text>
            <Text style={styles.subheading}>
              Select a class to view attendance
            </Text>
          </FadeInView>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {classes.map((item, index) => (
          <FadeInView key={item} delay={80 + index * 60}>
            <MenuCard
              title={item}
              subtitle="Tap to view attendance records"
              icon="📚"
              gradient={cardGradients[index % cardGradients.length]}
              onPress={() =>
                navigation.navigate("AttendanceView", { className: item })
              }
            />
          </FadeInView>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 28,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 79,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    color: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.white,
    marginBottom: 6,
  },
  subheading: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
});

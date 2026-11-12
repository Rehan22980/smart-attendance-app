import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import FadeInView from "../components/FadeInView";
import MenuCard from "../components/MenuCard";
import { colors, gradients, spacing } from "../theme";

export default function HomeScreen({ navigation }) {
  const panels = [

    {
      title: "Admin Panel",
      subtitle: "Manage classes, teachers and students",
      icon: "🛡️",
      gradient: gradients.admin,
      route: "loginadmin",
    },
    {
      title: "Teacher Panel",
      subtitle: "Mark attendance and manage your class",
      icon: "👨‍🏫",
      gradient: gradients.teacher,
      route: "loginteacher",
    },
    {
      title: "Parent Dashboard",
      subtitle: "View your child's attendance records",
      icon: "👨‍👩‍👧",
      gradient: gradients.parent,
      route: "Parent",
    },
    
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <SafeAreaView edges={["top"]}>
          <FadeInView delay={0}>
            <Text style={styles.badge}>Attendance System</Text>
            <Text style={styles.heading}>Welcome Back</Text>
            <Text style={styles.subheading}>
              Choose your panel to continue
            </Text>
          </FadeInView>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.content}>
        {panels.map((panel, index) => (
          <FadeInView key={panel.route} delay={120 + index * 120}>
            <MenuCard
              title={panel.title}
              subtitle={panel.subtitle}
              icon={panel.icon}
              gradient={panel.gradient}
              onPress={() => navigation.navigate(panel.route)}
            />
          </FadeInView>
        ))}

        <FadeInView delay={500} style={styles.footerNote}>
          <Text style={styles.footerText}>
            Professional attendance management for schools
          </Text>
        </FadeInView>
      </View>
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
    paddingBottom: 34,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 70,
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
    marginBottom: 14,
    overflow: "hidden",
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: colors.white,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    color: "rgba(255,255,255,0.88)",
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap:15,
  },
  footerNote: {
    marginTop: 8,
    alignItems: "center",
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
  },
});

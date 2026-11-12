import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AnimatedPressable from "./AnimatedPressable";
import { colors, radius, shadows } from "../theme";

export default function MenuCard({
  title,
  subtitle,
  icon,
  gradient,
  onPress,
  delay = 0,
}) {
  return (
    <AnimatedPressable onPress={onPress} style={styles.wrapper}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>{icon}</Text>
        </View>

        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        <Text style={styles.arrow}>›</Text>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 18,
    borderRadius: radius.lg,
    ...shadows.card,
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  icon: {
    fontSize: 26,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    lineHeight: 18,
  },
  arrow: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "300",
    marginLeft: 8,
  },
});

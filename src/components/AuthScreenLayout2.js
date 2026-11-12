import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import FadeInView from "./FadeInView";
import { colors, gradients, radius, shadows, spacing } from "../theme";

export function AuthHeader({ badge, title, subtitle }) {
  return (
    <LinearGradient
      colors={gradients.auth}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <FadeInView delay={0}>
        {badge ? <Text style={styles.badge}>{badge}</Text> : null}
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </FadeInView>
    </LinearGradient>
  );
}

export function AuthCard({ children }) {
  return (
    <FadeInView delay={180} style={styles.card}>
      {children}
    </FadeInView>
  );
}

export function AuthInput({ icon, ...props }) {
  return (
    <View style={styles.inputWrap}>
      {icon ? <Text style={styles.inputIcon}>{icon}</Text> : null}
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

export function AuthButton({ onPress, loading, label, variant = "primary" }) {
  const isDanger = variant === "danger";

  return (
    <TouchableOpacity
      style={[styles.button, isDanger && styles.buttonDanger]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.buttonText}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

export function AuthFooterLink({ text, linkText, onPress }) {
  return (
    <View style={styles.footerRow}>
      <Text style={styles.footerText}>{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.footerLink}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AuthScreenLayout({ header, children }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {header}
        <ScrollView
  style={{ flex: 1 }}
  contentContainerStyle={styles.scroll}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  bounces={true}
>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop:10,
    paddingBottom: 20,
    borderBottomLeftRadius:1,
    borderBottomRightRadius: 65,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    color: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.full,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  headerTitle: {
    color: colors.white,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 8,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 15,
    lineHeight: 22,
  },
 scroll: {
  flexGrow: 1,
  paddingHorizontal: spacing.lg,
  paddingTop: 25,
  paddingBottom: 270,
},
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    ...shadows.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop:5,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
    paddingHorizontal: 14,
    minHeight: 56,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    paddingVertical: 14,
    
  },
  button: {
    backgroundColor: colors.primary,
    minHeight: 50,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    ...shadows.soft,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
  },
  footerText: {
    color: colors.textMuted,
  },
  footerLink: {
    color: colors.primary,
    fontWeight: "700",
  },
});

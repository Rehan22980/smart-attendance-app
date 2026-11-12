import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { database } from "../../firebaseConfig";
import { ref, get } from "firebase/database";
import { colors, radius, shadows } from "../theme";

export default function AttendanceView({ route }) {
  const { className } = route.params;
  const [attendance, setAttendance] = useState([]);

  const loadAttendance = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const snapshot = await get(
        ref(database, `attendance/${today}/${className}`)
      );

      if (snapshot.exists()) {
        const data = [];

        snapshot.forEach((child) => {
          data.push({
            id: child.key,
            ...child.val(),
          });
        });

        setAttendance(data);
      } else {
        setAttendance([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.roll}>{item.rollNo}</Text>
      <Text style={styles.name}>{item.studentName}</Text>

      <View
        style={[
          styles.statusBadge,
          item.status === "Present"
            ? styles.presentBadge
            : styles.absentBadge,
        ]}
      >
        <Text
          style={[
            styles.status,
            {
              color: item.status === "Present" ? colors.success : colors.danger,
            },
          ]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.titleCard}>
        <Text style={styles.badge}>Today's Report</Text>
        <Text style={styles.heading}>{className} Attendance</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.headerText}>Roll</Text>
        <Text style={styles.headerText}>Student</Text>
        <Text style={styles.headerText}>Status</Text>
      </View>

      <FlatList
        data={attendance}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.empty}>No Attendance Found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  titleCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 18,
    marginBottom: 16,
    ...shadows.card,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 8,
    overflow: "hidden",
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.text,
  },
  header: {
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
    paddingBottom: 20,
  },
  row: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: radius.md,
    marginBottom: 8,
    alignItems: "center",
    ...shadows.soft,
  },
  roll: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  name: {
    flex: 2,
    fontSize: 15,
    color: colors.text,
  },
  statusBadge: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  presentBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.12)",
  },
  absentBadge: {
    backgroundColor: "rgba(239, 68, 68, 0.12)",
  },
  status: {
    fontWeight: "700",
    fontSize: 13,
  },
  emptyWrap: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 42,
    marginBottom: 10,
  },
  empty: {
    textAlign: "center",
    fontSize: 16,
    color: colors.textMuted,
  },
});

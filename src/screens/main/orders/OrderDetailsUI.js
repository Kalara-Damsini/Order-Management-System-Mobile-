import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import PlatformIcon from "../../../features/orders/components/PlatformIcon";
import StatusTag from "../../../features/orders/components/StatusTag";
import UploadProofBox from "../../../features/orders/components/UploadProofBox";
import { mockOrders } from "../../../features/orders/data/mockOrders";
import Screen from "../../../shared/components/Screen";

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function OrderDetailsUI() {
  const { id } = useLocalSearchParams();
  const order = useMemo(() => mockOrders.find((o) => o.id === id), [id]);

  const balance = order ? Math.max(0, (order.total || 0) - (order.advance || 0)) : 0;

  if (!order) {
    return (
      <Screen>
        <Text style={styles.title}>Order not found</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>{order.id}</Text>

      {/* Status + update buttons (UI only) */}
      <Section title="Status">
        <View style={styles.statusRow}>
          <StatusTag status={order.status} />
          <View style={styles.statusBtns}>
            <Pressable style={styles.smallBtn}><Text style={styles.smallBtnText}>Pending</Text></Pressable>
            <Pressable style={styles.smallBtn}><Text style={styles.smallBtnText}>In Progress</Text></Pressable>
            <Pressable style={styles.smallBtn}><Text style={styles.smallBtnText}>Completed</Text></Pressable>
          </View>
        </View>
      </Section>

      <Section title="Customer & Platform">
        <Row label="Customer" value={order.customerName} />
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Platform</Text>
          <View style={styles.platformValue}>
            <PlatformIcon platform={order.platform} />
            <Text style={styles.rowValue}>{order.platform}</Text>
          </View>
        </View>
      </Section>

      <Section title="Payments">
        <Row label="Total" value={`LKR ${order.total.toLocaleString()}`} />
        <Row label="Advance" value={`LKR ${order.advance.toLocaleString()}`} />
        <Row label="Balance" value={`LKR ${balance.toLocaleString()}`} />
      </Section>

      <Section title="Deadline & Reminders">
        <Row label="Deadline" value={order.deadline} />
        <Row label="Reminder" value="Off (UI only)" />
      </Section>

      <Section title="Notes">
        <Text style={styles.noteText}>{order.notes || "No notes"}</Text>
      </Section>

      <Section title="Delivery Proof">
        <UploadProofBox />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "900", color: "#111827", marginBottom: 14 },

  section: {
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 13, fontWeight: "900", color: "#111827", marginBottom: 10 },

  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  rowLabel: { fontSize: 12, fontWeight: "800", color: "#6B7280" },
  rowValue: { fontSize: 13, fontWeight: "900", color: "#111827" },

  platformValue: { flexDirection: "row", alignItems: "center", gap: 8 },

  statusRow: { gap: 10 },
  statusBtns: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  smallBtn: { backgroundColor: "#F3F4F6", paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999 },
  smallBtnText: { fontSize: 12, fontWeight: "900", color: "#374151" },

  noteText: { color: "#374151", fontWeight: "700", lineHeight: 20 },
});

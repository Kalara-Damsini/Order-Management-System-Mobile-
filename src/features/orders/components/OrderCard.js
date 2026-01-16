import { Pressable, StyleSheet, Text, View } from "react-native";
import StatusTag from "./StatusTag"; // ✅ use your existing colored status component

export default function OrderCard({ order, onPress, rightAction }) {
  const orderId = order?.orderCode || order?.id || "-";
  const customerName = order?.customerName || "-";
  const platform = order?.platform || "-";
  const placedDate = order?.placedDate || order?.orderDate || "-";

  return (
    <Pressable onPress={onPress} style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={styles.orderId}>{String(orderId)}</Text>
          <Text style={styles.customer}>{customerName}</Text>
        </View>

        {/* ✅ Right side actions: StatusTag + Delete button */}
        <View style={styles.headerRight}>
          {/* ✅ Colored status tag (same as before) */}
          <StatusTag status={order?.status} />

          {/* ✅ Delete button slot */}
          {rightAction ? <View style={styles.rightAction}>{rightAction}</View> : null}
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Platform</Text>
          <Text style={styles.metaValue}>{platform}</Text>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Placed</Text>
          <Text style={styles.metaValue}>{placedDate}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: "#EEF2F6",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  headerLeft: { flex: 1 },

  headerRight: {
    alignItems: "flex-end",
    gap: 10, // space between StatusTag and delete button
  },
  rightAction: {
    alignSelf: "flex-end",
  },

  orderId: { fontSize: 14, fontWeight: "900", color: "#111827" },
  customer: { marginTop: 3, fontSize: 12, fontWeight: "700", color: "#6B7280" },

  body: { marginTop: 12, gap: 8 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  metaLabel: { fontSize: 12, fontWeight: "800", color: "#6B7280" },
  metaValue: { fontSize: 12, fontWeight: "900", color: "#111827" },
});

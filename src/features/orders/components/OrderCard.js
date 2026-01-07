import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import PlatformIcon from "./PlatformIcon";
import StatusTag from "./StatusTag";

export default function OrderCard({ order, onPress }) {
  const balance = useMemo(() => Math.max(0, (order.total || 0) - (order.advance || 0)), [order]);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.left}>
          <Text style={styles.customer}>{order.customerName}</Text>
          <View style={styles.metaRow}>
            <PlatformIcon platform={order.platform} />
            <Text style={styles.deadline}>Deadline: {order.deadline}</Text>
          </View>
        </View>

        <View style={styles.right}>
          <StatusTag status={order.status} />
          {balance > 0 && <Text style={styles.balance}>Balance: LKR {balance.toLocaleString()}</Text>}
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
  topRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  left: { flex: 1 },
  right: { alignItems: "flex-end", gap: 8 },
  customer: { fontSize: 16, fontWeight: "900", color: "#111827" },
  metaRow: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 8 },
  deadline: { fontSize: 12, color: "#6B7280", fontWeight: "700" },
  balance: { fontSize: 12, color: "#111827", fontWeight: "900" },
});

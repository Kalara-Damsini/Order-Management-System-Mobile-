import { StyleSheet, Text, View } from "react-native";

export default function OrderStatusPill({ status }) {
  const s = (status || "").toLowerCase();

  const pillStyle =
    s === "paid"
      ? styles.paid
      : s === "shipped"
      ? styles.shipped
      : styles.pending;

  const textStyle =
    s === "paid"
      ? styles.paidText
      : s === "shipped"
      ? styles.shippedText
      : styles.pendingText;

  return (
    <View style={[styles.pill, pillStyle]}>
      <Text style={[styles.text, textStyle]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  text: { fontSize: 12, fontWeight: "900" },

  pending: { backgroundColor: "#FEF3C7" },
  pendingText: { color: "#92400E" },

  paid: { backgroundColor: "#DCFCE7" },
  paidText: { color: "#166534" },

  shipped: { backgroundColor: "#EAF3FF" },
  shippedText: { color: "#1677FF" },
});

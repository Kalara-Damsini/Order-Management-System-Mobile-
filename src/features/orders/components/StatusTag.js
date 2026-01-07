import { StyleSheet, Text, View } from "react-native";

const map = {
  pending: { bg: "#FEF3C7", text: "#92400E", label: "Pending" },
  in_progress: { bg: "#EAF3FF", text: "#1677FF", label: "In Progress" },
  completed: { bg: "#DCFCE7", text: "#166534", label: "Completed" },
  cancelled: { bg: "#FEE2E2", text: "#991B1B", label: "Cancelled" },
};

export default function StatusTag({ status }) {
  const s = map[status] || map.pending;
  return (
    <View style={[styles.tag, { backgroundColor: s.bg }]}>
      <Text style={[styles.text, { color: s.text }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  text: { fontSize: 12, fontWeight: "900" },
});

import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AppHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      {!!actionLabel && (
        <Pressable style={styles.actionBtn} onPress={onAction}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: { fontSize: 22, fontWeight: "900", color: "#111827" },
  subtitle: { marginTop: 4, fontSize: 13, color: "#6B7280" },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1677FF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
  },
  actionText: { color: "#fff", fontWeight: "900", fontSize: 13 },
});

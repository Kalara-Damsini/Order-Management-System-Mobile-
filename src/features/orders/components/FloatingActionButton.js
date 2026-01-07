import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function FloatingActionButton({ label = "Add Order", onPress }) {
  return (
    <Pressable style={styles.fab} onPress={onPress}>
      <View style={styles.row}>
        <Ionicons name="add" size={20} color="#fff" />
        <Text style={styles.text}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 18,
    bottom: 18,
    backgroundColor: "#1677FF",
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 6,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  text: { color: "#fff", fontWeight: "900", fontSize: 14 },
});

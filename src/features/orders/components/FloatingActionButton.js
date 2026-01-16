import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function FloatingActionButton({
  label,
  icon = "add",
  color = "#1677FF",
  onPress,
  disabled = false,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.fab,
        { backgroundColor: color },
        disabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.row}>
        <Ionicons name={icon} size={20} color="#fff" />
        {label ? <Text style={styles.text}>{label}</Text> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 18,
    bottom: 18,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 6,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  text: { color: "#fff", fontWeight: "900", fontSize: 14 },
  disabled: { opacity: 0.6 },
});

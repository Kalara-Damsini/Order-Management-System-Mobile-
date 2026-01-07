import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ChipRow({ chips, active, onChange }) {
  return (
    <View style={styles.row}>
      {chips.map((c) => {
        const isActive = c === active;
        return (
          <Pressable
            key={c}
            onPress={() => onChange?.(c)}
            style={[styles.chip, isActive && styles.chipActive]}
          >
            <Text style={[styles.text, isActive && styles.textActive]}>{c}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  chipActive: { backgroundColor: "#EAF3FF" },
  text: { fontSize: 13, fontWeight: "800", color: "#374151" },
  textActive: { color: "#1677FF" },
});

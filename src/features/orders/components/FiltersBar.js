import { Pressable, StyleSheet, Text, View } from "react-native";

function Pill({ label, active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.pill, active && styles.pillActive]}>
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function FiltersBar({
  status,
  platform,
  onChangeStatus,
  onChangePlatform,
}) {
  return (
    <View style={{ gap: 10 }}>
      <View style={styles.row}>
        {["All", "Pending", "In Progress", "Completed", "Cancelled"].map((s) => (
          <Pill
            key={s}
            label={s}
            active={status === s}
            onPress={() => onChangeStatus?.(s)}
          />
        ))}
      </View>

      <View style={styles.row}>
        {["All", "Instagram", "WhatsApp", "Facebook", "Website"].map((p) => (
          <Pill
            key={p}
            label={p}
            active={platform === p}
            onPress={() => onChangePlatform?.(p)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  pillActive: { backgroundColor: "#EAF3FF" },
  pillText: { fontSize: 12, fontWeight: "800", color: "#374151" },
  pillTextActive: { color: "#1677FF" },
});

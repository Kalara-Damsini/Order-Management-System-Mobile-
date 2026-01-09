import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

function formatDate(date) {
  if (!date) return "";
  // YYYY-MM-DD (best for storage + sorting)
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DateField({ label, value, onChange, placeholder = "Select date" }) {
  const [open, setOpen] = useState(false);

  const display = useMemo(() => (value ? formatDate(value) : placeholder), [value, placeholder]);

  const onPick = (_, selectedDate) => {
    // Android closes automatically; iOS can stay open if you want
    if (Platform.OS === "android") setOpen(false);

    if (selectedDate) onChange?.(selectedDate);
  };

  return (
    <View style={styles.field}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <Pressable style={styles.box} onPress={() => setOpen(true)}>
        <Text style={[styles.text, !value && styles.placeholder]}>{display}</Text>
        <Ionicons name="calendar-outline" size={18} color="#6B7280" />
      </Pressable>

      {open && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onPick}
        />
      )}

      {/* iOS: add a close button feel (optional simple way) */}
      {open && Platform.OS === "ios" && (
        <Pressable style={styles.iosDone} onPress={() => setOpen(false)}>
          <Text style={styles.iosDoneText}>Done</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flex: 1, gap: 6, marginBottom: 12 },
  label: { fontSize: 12, fontWeight: "800", color: "#111827" },

  box: {
    height: 46,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  text: { fontSize: 13, fontWeight: "800", color: "#111827" },
  placeholder: { color: "#9CA3AF" },

  iosDone: {
    marginTop: 8,
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#EAF3FF",
  },
  iosDoneText: { color: "#1677FF", fontWeight: "900", fontSize: 13 },
});

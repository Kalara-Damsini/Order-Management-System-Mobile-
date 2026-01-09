import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function Dropdown({
  label,
  value,
  placeholder = "Select",
  options = [],
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const display = useMemo(() => {
    if (value === null || value === undefined || value === "") return placeholder;
    return value;
  }, [value, placeholder]);

  return (
    <>
      <View style={styles.field}>
        {!!label && <Text style={styles.label}>{label}</Text>}

        <Pressable onPress={() => setOpen(true)} style={styles.box}>
          <Text style={[styles.value, display === placeholder && styles.placeholder]}>
            {display}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#6B7280" />
        </Pressable>
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />

        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{label || "Select"}</Text>
            <Pressable onPress={() => setOpen(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color="#111827" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((opt) => {
              const active = opt === value;
              return (
                <Pressable
                  key={opt}
                  style={[styles.option, active && styles.optionActive]}
                  onPress={() => {
                    onChange?.(opt);
                    setOpen(false);
                  }}
                >
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>{opt}</Text>
                  {active && <Ionicons name="checkmark" size={18} color="#1677FF" />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  field: { flex: 1, gap: 6 },
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
  value: { fontSize: 13, fontWeight: "800", color: "#111827" },
  placeholder: { color: "#9CA3AF" },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  sheet: {
    position: "absolute",
    left: 14,
    right: 14,
    top: 120,
    bottom: 120,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    marginBottom: 10,
  },
  sheetTitle: { fontSize: 14, fontWeight: "900", color: "#111827" },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  option: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionActive: { backgroundColor: "#EAF3FF" },
  optionText: { fontSize: 13, fontWeight: "800", color: "#374151" },
  optionTextActive: { color: "#1677FF" },
});

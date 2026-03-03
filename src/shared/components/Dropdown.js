import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../theme/ThemeContext"; // ✅ adjust path if needed

export default function Dropdown({
  label,
  value,
  placeholder = "Select",
  options = [],
  onChange,
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

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
          <Ionicons name="chevron-down" size={18} color={theme.subtext} />
        </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)} />

        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>{label || "Select"}</Text>
            <Pressable onPress={() => setOpen(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={18} color={theme.text} />
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
                  <Text style={[styles.optionText, active && styles.optionTextActive]}>
                    {opt}
                  </Text>
                  {active && <Ionicons name="checkmark" size={18} color={theme.primary} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    field: { flex: 1, gap: 6 },
    label: { fontSize: 12, fontWeight: "800", color: theme.text },

    box: {
      height: 46,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.cardSoft,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    value: { fontSize: 13, fontWeight: "800", color: theme.text },
    placeholder: { color: theme.mutedText },

    backdrop: {
      flex: 1,
      backgroundColor: theme.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.35)",
    },

    sheet: {
      position: "absolute",
      left: 14,
      right: 14,
      top: 120,
      bottom: 120,
      backgroundColor: theme.card,
      borderRadius: 18,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sheetHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSoft,
      marginBottom: 10,
    },
    sheetTitle: { fontSize: 14, fontWeight: "900", color: theme.text },
    closeBtn: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: theme.borderSoft,
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
    optionActive: {
      backgroundColor: theme.mode === "dark" ? "#0B2A55" : "#EAF3FF",
    },
    optionText: { fontSize: 13, fontWeight: "800", color: theme.text },
    optionTextActive: { color: theme.primary },
  });
}
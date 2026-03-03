import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function AppHeader({ title, subtitle, actionLabel, onAction }) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}Ammo</Text>
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

function createStyles(theme) {
  return StyleSheet.create({
    header: {
      flexDirection: "row",
      gap: 12,
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: 14,
    },
    title: { fontSize: 22, fontWeight: "900", color: theme.text },
    subtitle: { marginTop: 4, fontSize: 13, color: theme.subText },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: theme.primary,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
    },
    actionText: { color: theme.white, fontWeight: "900", fontSize: 13 },
  });
}

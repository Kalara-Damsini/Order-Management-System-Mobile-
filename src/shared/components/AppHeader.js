import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import BackButton from "./BackButton";

export default function AppHeader({
  title,
  subtitle,
  actionLabel,
  onAction,
  showBack = false,          
  onBack,                    
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.header}>
      {/* Left: Back */}
      <View style={styles.left}>
        {showBack ? <BackButton onPress={onBack} /> : null}
      </View>

      {/* Center: Title */}
      <View style={styles.center}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        {!!subtitle && (
          <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        )}
      </View>

      {/* Right: Action */}
      <View style={styles.right}>
        {!!actionLabel && (
          <Pressable style={styles.actionBtn} onPress={onAction}>
            <Ionicons name="add" size={18} color="#fff" />
            <Text style={styles.actionText}>{actionLabel}</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 14,
    },

    left: { width: 44, alignItems: "flex-start" },
    center: { flex: 1 },
    right: { minWidth: 44, alignItems: "flex-end" },

    title: { fontSize: 22, fontWeight: "900", color: theme.text },
    subtitle: { marginTop: 4, fontSize: 13, color: theme.subText || theme.subtext },

    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: theme.primary,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
    },
    actionText: { color: "#fff", fontWeight: "900", fontSize: 13 },
  });
}
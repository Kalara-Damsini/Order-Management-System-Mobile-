import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useTheme } from "../theme/ThemeContext"; // ✅ adjust path if needed

export default function SearchBar({ value, onChangeText, placeholder }) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.wrap}>
      <Ionicons name="search-outline" size={18} color={theme.subtext} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || "Search..."}
        placeholderTextColor={theme.mutedText}
        autoCapitalize="none"
      />
    </View>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    wrap: {
      height: 48,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.cardSoft,
      paddingHorizontal: 12,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      marginBottom: 12,
    },
    input: {
      flex: 1,
      fontSize: 14,
      fontWeight: "700",
      color: theme.text,
    },
  });
}
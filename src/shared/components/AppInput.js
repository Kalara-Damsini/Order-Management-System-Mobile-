import { useMemo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme } from "../theme/ThemeContext"; // ✅ adjust path if needed

export default function AppInput({
  label,
  placeholder,
  secureTextEntry,
  keyboardType,
  value,
  onChangeText,
  autoCapitalize = "none",
}) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.mutedText}
        style={styles.input}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    container: { marginBottom: 16 },
    label: { fontSize: 14, marginBottom: 6, color: theme.subtext, fontWeight: "700" },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 12,
      paddingHorizontal: 12,
      fontSize: 16,
      backgroundColor: theme.inputBg,
      color: theme.text,
    },
  });
}
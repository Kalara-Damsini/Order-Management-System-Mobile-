import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../theme/colors";

export default function AppInput({ label, placeholder, secureTextEntry, keyboardType }) {
  return (
    <View style={styles.container}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 6, color: "#333" },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: colors.bg,
  },
});

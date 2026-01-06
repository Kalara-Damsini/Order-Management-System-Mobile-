import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";

export default function AppButton({ title }) {
  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.9}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  text: { color: colors.white, fontSize: 16, fontWeight: "600" },
});

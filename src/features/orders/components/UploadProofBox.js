import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function UploadProofBox() {
  return (
    <View style={styles.box}>
      <Ionicons name="cloud-upload-outline" size={22} color="#9CA3AF" />
      <Text style={styles.title}>Click to upload</Text>
      <Text style={styles.sub}>PNG, JPG up to 10MB (UI only)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D1D5DB",
    paddingVertical: 26,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F9FAFB",
  },
  title: { fontWeight: "900", color: "#111827" },
  sub: { fontSize: 12, color: "#6B7280" },
});

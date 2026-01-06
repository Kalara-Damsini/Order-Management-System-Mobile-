import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function AuthSegment() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.activeItem}>
          <Text style={styles.activeText}>Log In</Text>
        </View>
        <View style={styles.inactiveItem}>
          <Text style={styles.inactiveText}>Sign Up</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { alignItems: "center", marginBottom: 32 },
  container: {
    flexDirection: "row",
    backgroundColor: colors.pillBg,
    borderRadius: 999,
    padding: 4,
  },
  activeItem: {
    backgroundColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 26,
    borderRadius: 999,
  },
  inactiveItem: { paddingVertical: 8, paddingHorizontal: 26 },
  activeText: { fontSize: 14, fontWeight: "600", color: colors.text },
  inactiveText: { fontSize: 14, fontWeight: "600", color: colors.muted },
});

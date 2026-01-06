import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

export default function AuthSegment({ active = "login", onPressLogin, onPressSignup }) {

    const isLogin = active === "login";
    const isSignup = active === "signup";

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Pressable
          onPress={onPressLogin}
          style={[styles.item, isLogin && styles.activeItem]}
        >
          <Text style={[styles.text, isLogin && styles.activeText]}>Log In</Text>
        </Pressable>

        <Pressable
          onPress={onPressSignup}
          style={[styles.item, isSignup && styles.activeItem]}
        >
          <Text style={[styles.text, isSignup && styles.activeText]}>Sign Up</Text>
        </Pressable>
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
  item: {
    paddingVertical: 8,
    paddingHorizontal: 26,
    borderRadius: 999,
  },
  activeItem: {
    backgroundColor: colors.white,
  },
  text: { fontSize: 14, fontWeight: "600", color: colors.muted },
  activeText: { color: colors.text },
});

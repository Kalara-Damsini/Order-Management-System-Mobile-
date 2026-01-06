import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppButton from "../../shared/components/AppButton";
import AppInput from "../../shared/components/AppInput";
import AuthSegment from "../../shared/components/AuthSegment";
import Screen from "../../shared/components/Screen";
import { colors } from "../../shared/theme/colors";
export default function SignupUI() {
  const router = useRouter();

  return (
    <Screen>
      {/* Brand / Intro */}
      <View style={styles.brandBlock}>
        <Text style={styles.brandTitle}>Orderly</Text>
        <Text style={styles.brandSubtitle}>Manage all orders in one place.</Text>
      </View>

      {/* Segment */}
      <AuthSegment
        active="signup"
        onPressLogin={() => router.push("/(auth)/login")}
        onPressSignup={() => {}}
      />

      {/* Page Title */}
      <Text style={styles.pageTitle}>Create Account</Text>
      <Text style={styles.pageSubtitle}>Sign up to get started</Text>

      {/* Inputs */}
      <AppInput label="Full Name" placeholder="Enter your name" />
      <AppInput label="Email" placeholder="Enter your email" keyboardType="email-address" />
      <AppInput label="Password" placeholder="Create a password" secureTextEntry />
      <AppInput label="Confirm Password" placeholder="Confirm your password" secureTextEntry />

      {/* Terms */}
      <Text style={styles.termsText}>
        By signing up, you agree to our <Text style={styles.link}>Terms</Text> and{" "}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>

      {/* Button */}
      <AppButton title="Sign Up" />

      {/* Footer */}
      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Pressable onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.link}>Log In</Text>
        </Pressable>
      </Text>
     </Screen>
  );
}

const styles = StyleSheet.create({
  brandBlock: {
    alignItems: "center",
    marginBottom: 18,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 6,
  },
  brandSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },

  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 6,
    color: colors.text,
  },
  pageSubtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 18,
  },

  termsText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 18,
  },
  footerText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#555",
  },
  link: {
    color: colors.primary,
    fontWeight: "600",
  },
});

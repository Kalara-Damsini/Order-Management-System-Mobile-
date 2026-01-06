import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppButton from "../../shared/components/AppButton";
import AppInput from "../../shared/components/AppInput";
import AuthSegment from "../../shared/components/AuthSegment";
import { colors } from "../../shared/theme/colors";

export default function SignupUI() {
     const router = useRouter();
  return (
    <View style={styles.container}>
      <AuthSegment
        active="signup"
        onPressLogin={() => router.push("/(auth)/login")}
        onPressSignup={() => {}}
      />

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to get started</Text>

      <AppInput label="Full Name" placeholder="Enter your name" />
      <AppInput label="Email" placeholder="Enter your email" keyboardType="email-address" />
      <AppInput label="Password" placeholder="Create a password" secureTextEntry />
      <AppInput label="Confirm Password" placeholder="Confirm your password" secureTextEntry />

      <Text style={styles.termsText}>
        By signing up, you agree to our <Text style={styles.link}>Terms</Text> and{" "}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>

      <AppButton title="Sign Up" />

      <Text style={styles.footerText}>
        Already have an account?{" "}
        <Pressable onPress={() => router.push("/(auth)/login")}>
          <Text style={styles.link}>Log In</Text>
        </Pressable>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
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

import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { registerApi } from "../../features/auth/api/auth.api";
import AppButton from "../../shared/components/AppButton";
import AppInput from "../../shared/components/AppInput";
import AuthSegment from "../../shared/components/AuthSegment";
import Screen from "../../shared/components/Screen";
import { colors } from "../../shared/theme/colors";

export default function SignupUI() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    console.log("REGISTER BUTTON PRESSED ✅");
    const e = email.trim();

    if (!fullName.trim() || !e || !password || !confirmPassword) {
      Alert.alert("Missing fields", "Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Password and Confirm Password must match.");
      return;
    }
try {
  setLoading(true);

  console.log("SENDING REGISTER:", { fullName: fullName.trim(), email: e });

  const res = await registerApi(fullName.trim(), e, password);

  console.log("REGISTER SUCCESS:", res);

  Alert.alert("Success", "Account created! Please log in.");
  router.replace("/(auth)/login");
} catch (err) {
  console.log("REGISTER ERROR:", err);
  Alert.alert("Signup failed", err?.message || "Request failed");
} finally {
  setLoading(false);
}
  };

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
      <AppInput
        label="Full Name"
        placeholder="Enter your name"
        value={fullName}
        onChangeText={setFullName}
      />

      <AppInput
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <AppInput
        label="Password"
        placeholder="Create a password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <AppInput
        label="Confirm Password"
        placeholder="Confirm your password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Terms (UI only) */}
      <Text style={styles.termsText}>
        By signing up, you agree to our <Text style={styles.link}>Terms</Text> and{" "}
        <Text style={styles.link}>Privacy Policy</Text>.
      </Text>

      {/* Button */}
      <AppButton title={loading ? "Creating..." : "Sign Up"} onPress={onSignup} />

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
  brandBlock: { alignItems: "center", marginBottom: 18 },
  brandTitle: { fontSize: 34, fontWeight: "800", color: colors.text, marginBottom: 6 },
  brandSubtitle: { fontSize: 14, color: "#6B7280", textAlign: "center" },

  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 6,
    color: colors.text,
  },
  pageSubtitle: { fontSize: 15, color: "#666", textAlign: "center", marginBottom: 18 },

  termsText: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 18,
  },
  footerText: { textAlign: "center", marginTop: 20, fontSize: 14, color: "#555" },
  link: { color: colors.primary, fontWeight: "600" },
});

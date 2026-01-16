import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import { loginApi } from "../../features/auth/api/auth.api";
import AppButton from "../../shared/components/AppButton";
import AppInput from "../../shared/components/AppInput";
import AuthSegment from "../../shared/components/AuthSegment";
import Screen from "../../shared/components/Screen";
import { colors } from "../../shared/theme/colors";

export default function LoginUi() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const e = email.trim();

    if (!e || !password) {
      Alert.alert("Missing fields", "Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      await loginApi(e, password);

      router.replace("/(main)/home");
    } catch (err) {
      Alert.alert("Login failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={styles.brand}>Orderly</Text>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Manage all orders in one place.</Text>

        <AuthSegment
          active="login"
          onPressLogin={() => {}}
          onPressSignup={() => router.push("/(auth)/signup")}
        />

        <AppInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Forgot password (UI only for now) */}
        <Pressable
          onPress={() => Alert.alert("Forgot Password", "We will add this later.")}
          style={styles.forgotWrapper}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>

        <AppButton title={loading ? "Logging in..." : "Login"} onPress={handleLogin} />

        <Text style={styles.footerText}>
          Don’t have an account?{" "}
          <Pressable onPress={() => router.push("/(auth)/signup")}>
            <Text style={styles.link}>Register</Text>
          </Pressable>
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: 24, justifyContent: "center" },

  brand: { fontSize: 38, fontWeight: "800", textAlign: "center", marginBottom: 4, color: colors.text },
  title: { fontSize: 24, fontWeight: "800", textAlign: "center", marginBottom: 6, color: colors.text },
  subtitle: { fontSize: 15, color: "#666", textAlign: "center", marginBottom: 22 },

  forgotWrapper: { alignSelf: "flex-end", marginTop: -6, marginBottom: 18 },
  forgotText: { fontSize: 14, color: colors.primary, fontWeight: "600" },

  footerText: { textAlign: "center", marginTop: 22, fontSize: 14, color: "#555" },
  link: { color: colors.primary, fontWeight: "700" },
});

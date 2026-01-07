import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { getTempUser, seedTempUser } from "../../services/tempAuth";
import AppButton from "../../shared/components/AppButton";
import AppInput from "../../shared/components/AppInput";
import AuthSegment from "../../shared/components/AuthSegment";
import Screen from "../../shared/components/Screen";
import { colors } from "../../shared/theme/colors";


export default  function LoginUi(){

    const router = useRouter();

    useEffect(() => {
    seedTempUser(); // saves damsi@gmail.com & 123 once
    }, []);

    const handleLogin = async () => {
    const user = await getTempUser();

    if (!user) {
        alert("No user found");
        return;
    }

    if (email === user.email && password === user.password) {
         router.replace("/(main)/home");
        // later → router.replace("/(main)/home");
    } else {
        alert("Invalid email or password");
    }
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");




    return(
        <Screen>
            <View style={styles.container}>
            <Text style={styles.title}>Orderly</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Manage All orders in one place.</Text>

            <AuthSegment
                active="login"
                onPressLogin={() => {}}
                onPressSignup={() => router.push("/(auth)/signup")}
            />

            <AppInput label="Email" placeholder="Enter your email" value={email} onChangeText={setEmail} />
<AppInput label="Password" placeholder="Enter your password" secureTextEntry value={password} onChangeText={setPassword} />

             {/* Forgot password (UI only) */}
            <View style={styles.forgotWrapper}>
                <Text style={styles.forgotText}>Forgot password?</Text>
            </View>

            <AppButton title="Login" onPress={handleLogin} />


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
    container: { flex: 1, backgroundColor: colors.bg, padding: 24, justifyContent: "center"},
    title: { fontSize: 38, fontWeight: "700", textAlign: "center", marginBottom: 8, color: colors.text },
    subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 32 },
    forgotWrapper: { alignItems: "flex-end", marginBottom: 20, marginTop: -6 },
    forgotText: { fontSize: 14, color: colors.primary, fontWeight: "500" },
    footerText: { textAlign: "center", marginTop: 24, fontSize: 14, color: "#555" },
    link: { color: colors.primary, fontWeight: "600" },
});
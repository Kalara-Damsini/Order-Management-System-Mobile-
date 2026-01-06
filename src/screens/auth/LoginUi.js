import { StyleSheet, Text, View } from "react-native";
import AppButton from "../../shared/components/AppButton";
import AppInput from "../../shared/components/AppInput";
import AuthSegment from "../../shared/components/AuthSegment";
import { colors } from "../../shared/theme/colors";

export default  function LoginUi(){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Orderly</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Manage All orders in one place.</Text>

            <AuthSegment />

            <AppInput label="Email" placeholder="Enter your email" keyboardType="email-address" />
            <AppInput label="Password" placeholder="Enter your password" secureTextEntry />

             {/* Forgot password (UI only) */}
            <View style={styles.forgotWrapper}>
                <Text style={styles.forgotText}>Forgot password?</Text>
            </View>

            <AppButton title="Login" />

            <Text style={styles.footerText}>
                Don’t have an account? <Text style={styles.link}>Register</Text>
            </Text>

        </View>
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
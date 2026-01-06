import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../shared/theme/colors";

export default  function LoginUi(){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Orderly</Text>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Manage All orders in one place.</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.bg, padding: 24, justifyContent: "center"},
    title: { fontSize: 38, fontWeight: "700", textAlign: "center", marginBottom: 8, color: colors.text },
    subtitle: { fontSize: 16, color: "#666", textAlign: "center", marginBottom: 32 },
});
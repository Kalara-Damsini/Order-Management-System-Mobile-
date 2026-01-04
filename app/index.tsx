import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push({ pathname: "/hello", params: { name: "Damsi" } })}
      >
        <Text style={styles.buttonText}>Go Next</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 16 },
  button: { backgroundColor: "black", paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
});

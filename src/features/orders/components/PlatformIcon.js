import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export default function PlatformIcon({ platform, size = 20 }) {
  const icon =
    platform === "instagram"
      ? <Ionicons name="logo-instagram" size={size} color="#E1306C" />
      : platform === "whatsapp"
      ? <Ionicons name="logo-whatsapp" size={size} color="#25D366" />
      : platform === "facebook"
      ? <Ionicons name="logo-facebook" size={size} color="#1877F2" />
      : <MaterialCommunityIcons name="web" size={size} color="#111827" />;

  return <View style={styles.wrap}>{icon}</View>;
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center" },
});

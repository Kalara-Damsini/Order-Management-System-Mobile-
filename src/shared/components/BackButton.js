import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";

export default function BackButton({ onPress, style }) {
    const router = useRouter();
    const { theme } = useTheme();

    const goBack = () => {
        if (onPress) return onPress();
        router.back();
    };

    return (
        <Pressable
            onPress={goBack}
            style={({ pressed }) => [
                styles.btn,
                { backgroundColor: theme.mode === "dark" ? "#0F172A" : "#F3F4F6" },
                pressed && { opacity: 0.85 },
                style,
            ]}
            hitSlop={10}
        >
            <Ionicons name="chevron-back" size={20} color={theme.text} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    btn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
});
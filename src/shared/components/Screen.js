import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../shared/theme/ThemeContext";

export default function Screen({ children, center = false, contentStyle }) {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          style={[styles.flex, { backgroundColor: theme.background }]}
          contentContainerStyle={[
            styles.container,
            center ? styles.center : styles.top,
            contentStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 }, 
  flex: { flex: 1 },

  container: {
    flexGrow: 1,
    padding: 18,
    paddingBottom: 120,
  },

  center: { justifyContent: "center" },
  top: { justifyContent: "flex-start" },
});
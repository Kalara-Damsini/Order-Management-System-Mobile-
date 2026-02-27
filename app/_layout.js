import { Stack } from "expo-router";
import { ThemeProvider } from "../src/shared/theme/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
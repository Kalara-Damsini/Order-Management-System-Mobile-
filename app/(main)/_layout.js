import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerContent from "../../src/shared/components/DrawerContent";
import { useTheme } from "../../src/shared/theme/ThemeContext"; // ✅ adjust path if needed

export default function MainLayout() {
  const { theme } = useTheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          drawerType: "front",

          // drawer
          drawerStyle: { width: 300, backgroundColor: "transparent" },

          // the screen background behind routes
          sceneContainerStyle: { backgroundColor: theme.bg },

          // header
          headerStyle: { backgroundColor: theme.card },
          headerTintColor: theme.text,
          headerTitleStyle: { color: theme.text },

          // drawer item colors (if default drawer list used anywhere)
          drawerActiveTintColor: theme.primary,
          drawerInactiveTintColor: theme.subtext,
          drawerActiveBackgroundColor:
            theme.mode === "dark" ? "#0B2A55" : "#EAF3FF",
        }}
      >
        <Drawer.Screen name="home" options={{ title: "Dashboard" }} />
        <Drawer.Screen name="orders/index" options={{ title: "Orders" }} />
        <Drawer.Screen name="orders/create" options={{ title: "Add Order" }} />
        <Drawer.Screen name="settings" options={{ title: "Settings" }} />
        <Drawer.Screen name="help" options={{ title: "Help & Support" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
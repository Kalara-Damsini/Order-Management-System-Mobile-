import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Pressable } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import DrawerContent from "../../src/shared/components/DrawerContent";
import { useTheme } from "../../src/shared/theme/ThemeContext";

export default function MainLayout() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={({ navigation, route }) => {
          // ✅ screens that should show MENU (drawer open)
          const menuScreens = ["home", "orders/index"];

          const showMenu = menuScreens.includes(route.name);

          return {
            headerShown: true,
            drawerType: "front",

            drawerStyle: { width: 300, backgroundColor: "transparent" },
            sceneContainerStyle: { backgroundColor: theme.bg },

            headerStyle: { backgroundColor: theme.card },
            headerTintColor: theme.text,
            headerTitleStyle: { color: theme.text },

            headerLeft: () => (
              <Pressable
                onPress={() => {
                  if (showMenu) navigation.dispatch(DrawerActions.openDrawer());
                  else router.back();
                }}
                style={{ marginLeft: 12, padding: 8 }}
                hitSlop={10}
              >
                <Ionicons
                  name={showMenu ? "menu" : "chevron-back"}
                  size={24}
                  color={theme.text}
                />
              </Pressable>
            ),
          };
        }}
      >
        <Drawer.Screen name="home" options={{ title: "Dashboard" }} />

        <Drawer.Screen name="orders/index" options={{ title: "Orders" }} />
        <Drawer.Screen name="orders/create" options={{ title: "Add Order" }} />
        <Drawer.Screen name="orders/[id]" options={{ title: "Order Details" }} />

        <Drawer.Screen name="profile" options={{ title: "Profile" }} />

        <Drawer.Screen name="setting" options={{ title: "Settings" }} />

        <Drawer.Screen name="help" options={{ title: "Help & Support" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}
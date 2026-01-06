import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DrawerContent from "../../src/shared/components/DrawerContent";

export default function MainLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          drawerType: "front",
          drawerStyle: { width: 300, backgroundColor: "transparent" },
          sceneContainerStyle: { backgroundColor: "#FFFFFF" },
        }}
      >
        {/* must match your route files */}
        <Drawer.Screen name="home" options={{ title: "Dashboard" }} />
        <Drawer.Screen name="orders/index" options={{ title: "Orders" }} />
        <Drawer.Screen name="orders/create" options={{ title: "Add Order" }} />

        {/* add these only if you create routes */}
        <Drawer.Screen name="customers" options={{ title: "Customers" }} />
        <Drawer.Screen name="reports" options={{ title: "Reports" }} />
        <Drawer.Screen name="settings" options={{ title: "Settings" }} />
        <Drawer.Screen name="help" options={{ title: "Help & Support" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}

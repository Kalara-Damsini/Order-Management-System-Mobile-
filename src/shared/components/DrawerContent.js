import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getMyProfileApi } from "../../features/auth/api/auth.api";
import { getOrdersApi } from "../../features/orders/api/orders.api";

const MENU = [
  { label: "Dashboard", icon: (c, s) => <Ionicons name="grid-outline" size={s} color={c} />, route: "/(main)/home" },
  { label: "Profile", icon: (c, s) => <Ionicons name="person-outline" size={s} color={c} />, route: "/(main)/profile" },
  { label: "Orders", icon: (c, s) => <MaterialCommunityIcons name="cart-outline" size={s} color={c} />, route: "/(main)/orders" },
];

const UTILITY = [
  { label: "Settings", icon: (c, s) => <Ionicons name="settings-outline" size={s} color={c} />, route: "/(main)/settings" },
  { label: "Help & Support", icon: (c, s) => <Feather name="help-circle" size={s} color={c} />, route: "/(main)/help" },
];

function initialLetter(name) {
  const n = String(name || "").trim();
  return n ? n[0].toUpperCase() : "?";
}

export default function DrawerContent(props) {
  const router = useRouter();
  const pathname = usePathname();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // badge count
  const [ordersCount, setOrdersCount] = useState(0);

  const go = (route) => {
    props.navigation?.closeDrawer?.();
    router.push(route);
  };

  const isActive = (route) =>
    pathname === route || pathname?.startsWith(route + "/");

  const renderItem = (item) => {
    const active = isActive(item.route);
    const iconColor = active ? "#1677FF" : "#4B5563";

    const badgeValue =
      item.route === "/(main)/orders" ? ordersCount : item.badge;

    return (
      <Pressable
        key={item.label}
        onPress={() => go(item.route)}
        style={({ pressed }) => [
          styles.item,
          active && styles.itemActive,
          pressed && styles.itemPressed,
        ]}
      >
        <View style={styles.itemLeft}>
          {item.icon(iconColor, 22)}
          <Text style={[styles.itemText, active && styles.itemTextActive]}>
            {item.label}
          </Text>
        </View>

        {badgeValue > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badgeValue}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  const loadProfile = useCallback(async () => {
    try {
      setLoadingProfile(true);

      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      const me = await getMyProfileApi();
      setProfile(me);
    } catch (e) {
      console.log("PROFILE ERROR:", e?.message);

      const msg = String(e?.message || "");
      const isAuthError =
        msg.includes("401") ||
        msg.includes("403") ||
        msg.toLowerCase().includes("unauthorized");

      if (isAuthError) router.replace("/(auth)/login");
      else setProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  }, [router]);

  // This is the important part: Drawer calculates count itself
  const loadOrdersCount = useCallback(async () => {
    try {
      const data = await getOrdersApi();
      const list = Array.isArray(data) ? data : [];

      // exclude completed (case-insensitive)
      const count = list.filter(
        (o) => String(o?.status || "").toLowerCase().trim() !== "completed"
      ).length;

      console.log("DRAWER ORDERS COUNT =", count);
      setOrdersCount(count);
    } catch (e) {
      console.log("DRAWER ORDERS COUNT ERROR:", e?.message);
      setOrdersCount(0);
    }
  }, []);

  // initial load
  useEffect(() => {
    loadProfile();
    loadOrdersCount();
  }, [loadProfile, loadOrdersCount]);

  //refresh when drawer opens (VERY RELIABLE)
  useEffect(() => {
    const unsub = props.navigation?.addListener?.("drawerOpen", () => {
      loadProfile();
      loadOrdersCount();
    });
    return unsub;
  }, [props.navigation, loadProfile, loadOrdersCount]);

  // optional: also refresh when you emit
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("orders.updated", () => {
      loadOrdersCount();
    });
    return () => sub.remove();
  }, [loadOrdersCount]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener("profile.updated", () => {
      loadProfile();
    });
    return () => sub.remove();
  }, [loadProfile]);

  const fullName = profile?.fullName || (loadingProfile ? "Loading..." : "User");
  const shopName = profile?.shopName || "My Shop";
  const avatarUrl = profile?.avatarFullUrl || "";
  const email = profile?.email || "";

  const onLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    props.navigation?.closeDrawer?.();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.root}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarLetter}>
                  {initialLetter(fullName)}
                </Text>
              </View>
            )}
            <View style={styles.onlineDot} />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.name} numberOfLines={1}>{fullName}</Text>

            <View style={styles.subRow}>
              <Text style={styles.company} numberOfLines={1}>{shopName}</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.pro}>PRO</Text>
            </View>

            {!!email && (
              <Text style={styles.email} numberOfLines={1}>{email}</Text>
            )}
          </View>

          <Pressable
            onPress={() => props.navigation?.closeDrawer?.()}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={18} color="#111827" />
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>MAIN MENU</Text>
        <View style={styles.section}>{MENU.map(renderItem)}</View>

        <Text style={styles.sectionTitle}>UTILITY</Text>
        <View style={styles.section}>{UTILITY.map(renderItem)}</View>

        <View style={{ height: 30 }} />
      </DrawerContentScrollView>

      <View style={styles.bottom}>
        <Pressable onPress={onLogout} style={styles.logoutRow}>
          <Ionicons name="log-out-outline" size={20} color="#E11D48" />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>Version 1.0.4</Text>
          <Text style={styles.metaText}>© 2024</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFFFF", borderTopRightRadius: 22, borderBottomRightRadius: 22, overflow: "hidden" },
  scrollContent: { paddingBottom: 10 },

  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 16, flexDirection: "row", alignItems: "center", gap: 14 },
  avatarWrap: { width: 62, height: 62 },
  avatar: { width: 62, height: 62, borderRadius: 31, backgroundColor: "#E5E7EB" },
  avatarFallback: { width: 62, height: 62, borderRadius: 31, backgroundColor: "#E5E7EB", alignItems: "center", justifyContent: "center" },
  avatarLetter: { fontSize: 20, fontWeight: "900", color: "#111827" },

  onlineDot: { position: "absolute", width: 14, height: 14, borderRadius: 7, backgroundColor: "#22C55E", right: 2, bottom: 2, borderWidth: 2, borderColor: "#FFFFFF" },

  headerInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: "800", color: "#111827" },
  subRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  company: { fontSize: 14, color: "#6B7280", flexShrink: 1 },
  dot: { marginHorizontal: 8, color: "#9CA3AF" },
  pro: { fontSize: 14, fontWeight: "700", color: "#1677FF" },
  email: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },

  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(17,24,39,0.06)", justifyContent: "center", alignItems: "center" },

  sectionTitle: { marginTop: 18, marginBottom: 10, paddingHorizontal: 20, fontSize: 12, letterSpacing: 1.2, fontWeight: "800", color: "#9CA3AF" },
  section: { paddingHorizontal: 14, gap: 10 },

  item: { height: 56, borderRadius: 16, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  itemPressed: { opacity: 0.9 },
  itemActive: { backgroundColor: "#EAF3FF" },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  itemText: { fontSize: 16, fontWeight: "600", color: "#374151" },
  itemTextActive: { color: "#1677FF" },

  badge: { minWidth: 30, height: 30, borderRadius: 15, backgroundColor: "#1677FF", justifyContent: "center", alignItems: "center", paddingHorizontal: 8 },
  badgeText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },

  bottom: { borderTopWidth: 1, borderTopColor: "#F3F4F6", paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16 },
  logoutRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 10 },
  logoutText: { fontSize: 16, fontWeight: "700", color: "#E11D48" },
  metaRow: { marginTop: 8, flexDirection: "row", justifyContent: "space-between" },
  metaText: { fontSize: 12, color: "#9CA3AF" },
});
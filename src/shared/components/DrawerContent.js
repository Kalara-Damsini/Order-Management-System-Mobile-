import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { usePathname, useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const MENU = [
  { label: "Dashboard", icon: (c, s) => <Ionicons name="grid-outline" size={s} color={c} />, route: "/(main)/home" },
  { label: "Orders", icon: (c, s) => <MaterialCommunityIcons name="cart-outline" size={s} color={c} />, route: "/(main)/orders", badge: 3 },
  
];

const UTILITY = [
  { label: "Settings", icon: (c, s) => <Ionicons name="settings-outline" size={s} color={c} />, route: "/(main)/settings" },
  { label: "Help & Support", icon: (c, s) => <Feather name="help-circle" size={s} color={c} />, route: "/(main)/help" },
];

export default function DrawerContent(props) {
  const router = useRouter();
  const pathname = usePathname();

  const go = (route) => {
    props.navigation?.closeDrawer?.();
    router.push(route);
  };

  const isActive = (route) => pathname === route || pathname?.startsWith(route + "/");

  const renderItem = (item) => {
    const active = isActive(item.route);
    const iconColor = active ? "#1677FF" : "#4B5563";

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

        {!!item.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.root}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=12" }}
              style={styles.avatar}
            />
            <View style={styles.onlineDot} />
          </View>

          <View style={styles.headerInfo}>
            <Text style={styles.name}>Alex Freelancer</Text>
            <View style={styles.subRow}>
              <Text style={styles.company}>My Design Shop</Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.pro}>PRO</Text>
            </View>
          </View>

          <Pressable onPress={() => props.navigation?.closeDrawer?.()} style={styles.closeBtn}>
            <Ionicons name="close" size={18} color="#111827" />
          </Pressable>
        </View>

        {/* MAIN MENU */}
        <Text style={styles.sectionTitle}>MAIN MENU</Text>
        <View style={styles.section}>{MENU.map(renderItem)}</View>

        {/* UTILITY */}
        <Text style={styles.sectionTitle}>UTILITY</Text>
        <View style={styles.section}>{UTILITY.map(renderItem)}</View>

        {/* Spacer so footer stays at bottom */}
        <View style={{ height: 30 }} />
      </DrawerContentScrollView>

      {/* Bottom footer */}
      <View style={styles.bottom}>
        <Pressable
          onPress={() => {
            // UI-only: later you’ll clear storage + router.replace("/(auth)/login")
            router.replace("/(auth)/login");
          }}
          style={styles.logoutRow}
        >
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
  root: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopRightRadius: 22,
    borderBottomRightRadius: 22,
    overflow: "hidden",
  },
  scrollContent: {
    paddingBottom: 10,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatarWrap: { width: 62, height: 62 },
  avatar: { width: 62, height: 62, borderRadius: 31, backgroundColor: "#E5E7EB" },
  onlineDot: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    right: 2,
    bottom: 2,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  headerInfo: { flex: 1 },
  name: { fontSize: 20, fontWeight: "800", color: "#111827" },
  subRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  company: { fontSize: 14, color: "#6B7280" },
  dot: { marginHorizontal: 8, color: "#9CA3AF" },
  pro: { fontSize: 14, fontWeight: "700", color: "#1677FF" },

  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(17,24,39,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    paddingHorizontal: 20,
    fontSize: 12,
    letterSpacing: 1.2,
    fontWeight: "800",
    color: "#9CA3AF",
  },
  section: {
    paddingHorizontal: 14,
    gap: 10,
  },

  item: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemPressed: { opacity: 0.9 },
  itemActive: { backgroundColor: "#EAF3FF" },

  itemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  itemText: { fontSize: 16, fontWeight: "600", color: "#374151" },
  itemTextActive: { color: "#1677FF" },

  badge: {
    minWidth: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#1677FF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  badgeText: { color: "#FFFFFF", fontWeight: "800", fontSize: 13 },

  bottom: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  logoutText: { fontSize: 16, fontWeight: "700", color: "#E11D48" },

  metaRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: { fontSize: 12, color: "#9CA3AF" },
});

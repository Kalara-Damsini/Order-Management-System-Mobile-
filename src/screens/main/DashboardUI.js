import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { getMyProfileApi } from "../../features/auth/api/auth.api";
import { getOrdersApi } from "../../features/orders/api/orders.api";
import { useTheme } from "../../shared/theme/ThemeContext";

export default function DashboardUI() {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      const [me, ordersRes] = await Promise.all([getMyProfileApi(), getOrdersApi()]);
      setProfile(me);
      setOrders(Array.isArray(ordersRes) ? ordersRes : []);
    } catch (e) {
      Alert.alert("Dashboard error", e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  const fullName = profile?.fullName || "User";
  const shopName = profile?.shopName || "My Shop";

  const pendingTasks = useMemo(() => {
    return (Array.isArray(orders) ? orders : []).filter(
      (o) => String(o?.status || "").toLowerCase().trim() !== "completed"
    ).length;
  }, [orders]);

  const completedTasks = useMemo(() => {
    return (Array.isArray(orders) ? orders : []).filter(
      (o) => String(o?.status || "").toLowerCase().trim() === "completed"
    ).length;
  }, [orders]);

  const inProgressTasks = useMemo(() => {
    return (Array.isArray(orders) ? orders : []).filter((o) => {
      const s = String(o?.status || "").toLowerCase().trim();
      return s === "in_progress" || s === "in progress";
    }).length;
  }, [orders]);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning,";
    if (h < 18) return "Good Afternoon,";
    return "Good Evening,";
  }, []);

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.bg }]} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>{greeting}</Text>
          <Text style={styles.name}>{loading ? "Loading..." : `${firstName(fullName)} 👋`}</Text>
        </View>

        <View style={styles.headerRight}>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color={theme.text} />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="search-outline" size={20} color={theme.text} />
          </Pressable>
        </View>
      </View>

      <View style={styles.storeCard}>
        <View style={styles.storeLeft}>
          <Text style={styles.storeTitle}>{loading ? "Loading shop..." : shopName}</Text>
          <Text style={styles.storeSub}>{loading ? "Fetching overview..." : "Today’s overview"}</Text>
        </View>
        <View style={styles.proBadge}>
          <Text style={styles.proBadgeText}>PRO</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <StatCard title="Pending Tasks" value={loading ? "..." : String(pendingTasks)} icon="time-outline" theme={theme} styles={styles} />
        <StatCard title="Completed Tasks" value={loading ? "..." : String(completedTasks)} icon="checkmark-circle-outline" theme={theme} styles={styles} />
        <StatCard title="In Progress" value={loading ? "..." : String(inProgressTasks)} icon="construct-outline" theme={theme} styles={styles} />
      </View>
    </ScrollView>
  );
}

function firstName(fullName) {
  const s = String(fullName || "").trim();
  if (!s) return "User";
  return s.split(" ")[0];
}

function StatCard({ title, value, icon, theme, styles }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statTop}>
        <Ionicons name={icon} size={18} color={theme.primary} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    screen: { flex: 1 },
    container: { padding: 18, paddingBottom: 28 },

    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 14,
    },
    welcome: { fontSize: 13, color: theme.subtext },
    name: { fontSize: 22, fontWeight: "800", color: theme.text, marginTop: 2 },
    headerRight: { flexDirection: "row", gap: 10 },
    iconBtn: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: theme.borderSoft,
      alignItems: "center",
      justifyContent: "center",
    },

    storeCard: {
      backgroundColor: theme.cardSoft,
      borderRadius: 18,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 16,
    },
    storeLeft: { gap: 4 },
    storeTitle: { fontSize: 16, fontWeight: "800", color: theme.text },
    storeSub: { fontSize: 13, color: theme.subtext },
    proBadge: {
      backgroundColor: theme.mode === "dark" ? "#0B2A55" : "#EAF3FF",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
    },
    proBadgeText: { color: theme.primary, fontWeight: "800", fontSize: 12 },

    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    statCard: {
      width: "48%",
      backgroundColor: theme.card,
      borderRadius: 16,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    statTop: { flexDirection: "row", alignItems: "center", gap: 8 },
    statTitle: { fontSize: 13, color: theme.subtext, fontWeight: "700" },
    statValue: { marginTop: 10, fontSize: 18, fontWeight: "900", color: theme.text },
  });
}
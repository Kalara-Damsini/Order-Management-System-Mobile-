import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { getMyProfileApi } from "../../features/auth/api/auth.api";
import { getOrdersApi } from "../../features/orders/api/orders.api";

export default function DashboardUI() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      // load both in parallel
      const [me, ordersRes] = await Promise.all([
        getMyProfileApi(),
        getOrdersApi(),
      ]);

      setProfile(me);
      setOrders(Array.isArray(ordersRes) ? ordersRes : []);
    } catch (e) {
      console.log("DASHBOARD ERROR:", e?.message);
      Alert.alert("Dashboard error", e?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  // refresh whenever dashboard screen is focused
  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  // dynamic values
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

      // supports: "in_progress" OR "in progress"
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
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>{greeting}</Text>
          <Text style={styles.name}>
            {loading ? "Loading..." : `${firstName(fullName)} 👋`}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={20} color="#111827" />
          </Pressable>
          <Pressable style={styles.iconBtn}>
            <Ionicons name="search-outline" size={20} color="#111827" />
          </Pressable>
        </View>
      </View>

      {/* Store card */}
      <View style={styles.storeCard}>
        <View style={styles.storeLeft}>
          <Text style={styles.storeTitle}>
            {loading ? "Loading shop..." : shopName}
          </Text>
          <Text style={styles.storeSub}>
            {loading ? "Fetching overview..." : "Today’s overview"}
          </Text>
        </View>
        <View style={styles.proBadge}>
          <Text style={styles.proBadgeText}>PRO</Text>
        </View>
      </View>

      {/* Summary cards */}
      <View style={styles.grid}>
        <StatCard
          title="Pending Tasks"
          value={loading ? "..." : String(pendingTasks)}
          icon="time-outline"
        />

          <StatCard
            title="Completed Tasks"
            value={loading ? "..." : String(completedTasks)}
            icon="checkmark-circle-outline"
          />

        <StatCard
          title="In Progress"
          value={loading ? "..." : String(inProgressTasks)}
          icon="construct-outline"
        />

      </View>

    </ScrollView>
  );
}

function firstName(fullName) {
  const s = String(fullName || "").trim();
  if (!s) return "User";
  return s.split(" ")[0];
}

/* ---- Small UI components ---- */

function StatCard({ title, value, icon }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statTop}>
        <Ionicons name={icon} size={18} color="#1677FF" />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#FFFFFF" },
  container: { padding: 18, paddingBottom: 28 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  welcome: { fontSize: 13, color: "#6B7280" },
  name: { fontSize: 22, fontWeight: "800", color: "#111827", marginTop: 2 },
  headerRight: { flexDirection: "row", gap: 10 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  storeCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    marginBottom: 16,
  },
  storeLeft: { gap: 4 },
  storeTitle: { fontSize: 16, fontWeight: "800", color: "#111827" },
  storeSub: { fontSize: 13, color: "#6B7280" },
  proBadge: {
    backgroundColor: "#EAF3FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  proBadgeText: { color: "#1677FF", fontWeight: "800", fontSize: 12 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#EEF2F6",
  },
  statTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  statTitle: { fontSize: 13, color: "#6B7280", fontWeight: "700" },
  statValue: { marginTop: 10, fontSize: 18, fontWeight: "900", color: "#111827" },

  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    fontSize: 14,
    color: "#111827",
    fontWeight: "900",
  },

  actions: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  chipText: { fontSize: 13, fontWeight: "800", color: "#111827" },

  list: { gap: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderRadius: 16,
    padding: 12,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  rowBody: { flex: 1 },
  rowTitle: { fontSize: 14, fontWeight: "900", color: "#111827" },
  rowSub: { fontSize: 12, color: "#6B7280", marginTop: 2 },
  rowTime: { fontSize: 12, color: "#9CA3AF", fontWeight: "700" },
});
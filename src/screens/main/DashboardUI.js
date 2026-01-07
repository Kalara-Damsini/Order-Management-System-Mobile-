import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function DashboardUI() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Good Morning,</Text>
          <Text style={styles.name}>Alex 👋</Text>
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
          <Text style={styles.storeTitle}>My Design Shop</Text>
          <Text style={styles.storeSub}>Today’s overview</Text>
        </View>
        <View style={styles.proBadge}>
          <Text style={styles.proBadgeText}>PRO</Text>
        </View>
      </View>

      {/* Summary cards (NOT orders list) */}
      <View style={styles.grid}>
        <StatCard title="Revenue" value="LKR 124,500" icon="cash-outline" />
        <StatCard title="Customers" value="48" icon="people-outline" />
        <StatCard title="Pending Tasks" value="7" icon="time-outline" />
        <StatCard title="Low Stock" value="3 Items" icon="alert-circle-outline" />
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actions}>
        <ActionChip icon="add-circle-outline" label="New Order" />
        <ActionChip icon="person-add-outline" label="Add Customer" />
        <ActionChip icon="qr-code-outline" label="Scan" />
        <ActionChip icon="document-text-outline" label="Generate Report" />
      </View>

      {/* Recent Activity (simple list) */}
      <Text style={styles.sectionTitle}>Recent Activity</Text>
      <View style={styles.list}>
        <ActivityRow
          icon="checkmark-circle-outline"
          title="Payment received"
          subtitle="Invoice #INV-1021"
          time="2h ago"
        />
        <ActivityRow
          icon="person-outline"
          title="New customer added"
          subtitle="Nimal Perera"
          time="5h ago"
        />
        <ActivityRow
          icon="warning-outline"
          title="Stock running low"
          subtitle="Item: Paper Bags"
          time="1d ago"
        />
      </View>
    </ScrollView>
  );
}

/* ---- Small UI components (still UI only) ---- */

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

function ActionChip({ icon, label }) {
  return (
    <Pressable style={styles.chip}>
      <Ionicons name={icon} size={18} color="#111827" />
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

function ActivityRow({ icon, title, subtitle, time }) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color="#111827" />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSub}>{subtitle}</Text>
      </View>
      <Text style={styles.rowTime}>{time}</Text>
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

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
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

  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
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

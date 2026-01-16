import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import FloatingActionButton from "../../../features/orders/components/FloatingActionButton";
import OrderCard from "../../../features/orders/components/OrderCard";
import OrdersFilterBar from "../../../features/orders/components/OrdersFilterBar";
import { mockOrders } from "../../../features/orders/data/mockOrders";
import Screen from "../../../shared/components/Screen";
import SearchBar from "../../../shared/components/SearchBar";

export default function OrdersListUI() {
  const router = useRouter();

  const [orders, setOrders] = useState(() =>
    Array.isArray(mockOrders) ? mockOrders : []
  );

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [placedDate, setPlacedDate] = useState(null);

  const toYMD = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  };

  const onDelete = (order) => {
    const id = String(order?.id || "");
    if (!id) return;

    Alert.alert("Delete order?", `Order ${order?.orderCode || id} will be removed.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          setOrders((prev) => prev.filter((o) => String(o?.id) !== id));
        },
      },
    ]);
  };

  const filtered = useMemo(() => {
    const mapStatus = {
      Pending: "pending",
      "In Progress": "in_progress",
      Completed: "completed",
      Cancelled: "cancelled",
    };

    const mapPlatform = {
      Instagram: "instagram",
      WhatsApp: "whatsapp",
      Facebook: "facebook",
      Website: "website",
    };

    const q = query.trim().toLowerCase();
    const pickedPlacedDate = toYMD(placedDate);

    const list = Array.isArray(orders) ? orders : [];

    return list.filter((o) => {
      const customerName = String(o?.customerName ?? "").toLowerCase();
      const orderId = String(o?.orderCode ?? o?.id ?? "").toLowerCase();

      const textOk = !q || customerName.includes(q) || orderId.includes(q);
      const statusOk = status === "All" ? true : o?.status === mapStatus[status];
      const platformOk = platform === "All" ? true : o?.platform === mapPlatform[platform];

      const placedOk =
        !pickedPlacedDate ? true : String(o?.placedDate ?? "") === pickedPlacedDate;

      return textOk && statusOk && platformOk && placedOk;
    });
  }, [orders, query, status, platform, placedDate]);

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.sub}>Filter orders by placed date</Text>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search by customer or order id..."
        />

        <OrdersFilterBar
          status={status}
          platform={platform}
          placedDate={placedDate}
          onChangeStatus={setStatus}
          onChangePlatform={setPlatform}
          onChangePlacedDate={setPlacedDate}
        />

        <View style={styles.list}>
          {filtered.map((o) => (
            <OrderCard
              key={String(o.id)}
              order={o}
              onPress={() => router.push(`/(main)/orders/${o.id}`)}
              rightAction={
                <FloatingActionButton
                  label="" // icon only
                  icon="trash"
                  color="#DC2626"
                  onPress={() => onDelete(o)}
                  style={styles.deleteInsideCardBtn}
                />
              }
            />
          ))}
        </View>

        <View style={{ height: 90 }} />
      </Screen>

      {/* Add Order floating button */}
      <FloatingActionButton
        label="Add Order"
        icon="add"
        onPress={() => router.push("/(main)/orders/create")}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "900", marginBottom: 4 },
  sub: { fontSize: 13, color: "#6B7280", marginBottom: 14 },
  list: { marginTop: 14, gap: 12 },

  // makes the FAB behave like a small icon button INSIDE the card
  deleteInsideCardBtn: {
    position: "relative",
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    elevation: 0,
  },
});

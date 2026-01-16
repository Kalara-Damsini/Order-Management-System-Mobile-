
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { getOrdersApi } from "../../../features/orders/api/orders.api";
import FloatingActionButton from "../../../features/orders/components/FloatingActionButton";
import OrderCard from "../../../features/orders/components/OrderCard";
import OrdersFilterBar from "../../../features/orders/components/OrdersFilterBar";
import Screen from "../../../shared/components/Screen";
import SearchBar from "../../../shared/components/SearchBar";

export default function OrdersListUI() {
  const router = useRouter();


  // keep orders in state so delete can work
  const [orders, setOrders] = useState(() => (Array.isArray(mockOrders) ? mockOrders : []));

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

    Alert.alert("Delete order?", `Order ${id} will be removed.`, [
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
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrdersApi(); // ✅ GET /orders
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert("Orders error", e?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ This runs EVERY time you come back to this screen
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

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


    list = list.filter((o) => {
      const customerName = String(o?.customerName ?? "").toLowerCase();
      const orderId = String(o?.orderCode ?? o?.id ?? "").toLowerCase();


      const statusOk = status === "All" ? true : o?.status === mapStatus[status];
      const platformOk = platform === "All" ? true : o?.platform === mapPlatform[platform];

      const placedOk = !pickedPlacedDate ? true : String(o?.placedDate ?? "") === pickedPlacedDate;

      return textOk && statusOk && platformOk && placedOk;
    });
  }, [orders, query, status, platform, placedDate]);


  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.sub}>
          {loading ? "Loading orders..." : "Filter orders by placed date"}
        </Text>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search by customer or order code..."
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
            <View key={String(o.id)} style={styles.itemWrap}>
              <OrderCard
                order={o}
                onPress={() => router.push(`/(main)/orders/${o.id}`)}
              />

              {/* Delete button per order */}
              <FloatingActionButton style={styles.floatbtn}
                label="Delete"
                icon="trash"
                color="#DC2626"
                onPress={() => onDelete(o)}
              />
            </View>

          ))}
        </View>

        <View style={{ height: 90 }} />
      </Screen>
      {/* Add Order floating button */}
connection
      <FloatingActionButton onPress={() => router.push("/(main)/orders/create")} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "900", marginBottom: 4 },
  sub: { fontSize: 13, color: "#6B7280", marginBottom: 14 },
  list: { marginTop: 14, gap: 12 },
  itemWrap: { gap: 8 },
  floatbtn:{position: "relative",alignSelf: "flex-end",}
});

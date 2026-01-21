import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

import {
  deleteOrderApi,
  getOrdersApi,
} from "../../../features/orders/api/orders.api";
import FloatingActionButton from "../../../features/orders/components/FloatingActionButton";
import OrderCard from "../../../features/orders/components/OrderCard";
import OrdersFilterBar from "../../../features/orders/components/OrdersFilterBar";
import Screen from "../../../shared/components/Screen";
import SearchBar from "../../../shared/components/SearchBar";

export default function OrdersListUI() {
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [placedDate, setPlacedDate] = useState(null);

  const getId = useCallback((o) => String(o?.id ?? o?._id ?? ""), []);

  const toYMD = useCallback((date) => {
    if (!date) return "";
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrdersApi();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert("Orders error", e?.message || "Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders]),
  );

  const performDelete = useCallback(
    async (order) => {
      const id = getId(order);
      if (!id || deletingId) return;

      try {
        setDeletingId(id);

        // ✅ delete from backend
        await deleteOrderApi(id);

        // ✅ remove from UI
        setOrders((prev) => prev.filter((o) => getId(o) !== id));
      } catch (e) {
        Alert.alert(
          "Delete failed",
          e?.message || "Could not delete this order",
        );
      } finally {
        setDeletingId(null);
      }
    },
    [deletingId, getId],
  );

  // ✅ ONLY ONE onDelete (no duplicates)
  const onDelete = useCallback(
    (order) => {
      const id = getId(order);
      if (!id) return;

      Alert.alert(
        "Delete order?",
        `Order ${order?.orderCode || id} will be removed from database.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => performDelete(order),
          },
        ],
      );
    },
    [getId, performDelete],
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

    let list = Array.isArray(orders) ? orders : [];

    list = list.filter((o) => {
      const customerName = String(o?.customerName ?? "").toLowerCase();
      const orderIdText = String(o?.orderCode ?? getId(o) ?? "").toLowerCase();

      const textOk = !q || customerName.includes(q) || orderIdText.includes(q);
      const statusOk =
        status === "All" ? true : String(o?.status ?? "") === mapStatus[status];
      const platformOk =
        platform === "All"
          ? true
          : String(o?.platform ?? "") === mapPlatform[platform];

      // if backend uses orderDate, change o?.placedDate -> o?.orderDate
      const placedOk = !pickedPlacedDate
        ? true
        : toYMD(o?.placedDate) === pickedPlacedDate;

      return textOk && statusOk && platformOk && placedOk;
    });

    list = [...list].sort((a, b) =>
      String(a?.deadline || "").localeCompare(String(b?.deadline || "")),
    );

    return list;
  }, [orders, query, status, platform, placedDate, toYMD, getId]);

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
          {!loading && filtered.length === 0 ? (
            <Text style={styles.empty}>No orders found.</Text>
          ) : null}

          {filtered.map((o) => {
            const id = getId(o);
            if (!id) return null;

            const isDeleting = deletingId === id;

            return (
              <OrderCard
                key={id}
                order={o}
                onPress={() => router.push(`/(main)/orders/${id}`)}
                rightAction={
                  <Pressable
                    onPress={() => onDelete(o)}
                    disabled={!!deletingId}
                    style={[styles.iconBtn, isDeleting && { opacity: 0.5 }]}
                    hitSlop={10}
                  >
                    <Ionicons name="trash" size={18} color="#DC2626" />
                  </Pressable>
                }
              />
            );
          })}
        </View>

        <View style={{ height: 90 }} />
      </Screen>

      <FloatingActionButton
        label="Add Order"
        icon="add"
        onPress={() => router.push("/orders/create")} // ✅ safer route
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "900", marginBottom: 4 },
  sub: { fontSize: 13, color: "#6B7280", marginBottom: 14 },
  list: { marginTop: 14, gap: 12 },
  empty: { marginTop: 12, color: "#6B7280", fontWeight: "700" },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
});

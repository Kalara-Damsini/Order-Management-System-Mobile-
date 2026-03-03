import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  DeviceEventEmitter,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  deleteOrderApi,
  getOrdersApi,
} from "../../../features/orders/api/orders.api";
import FloatingActionButton from "../../../features/orders/components/FloatingActionButton";
import OrderCard from "../../../features/orders/components/OrderCard";
import OrdersFilterBar from "../../../features/orders/components/OrdersFilterBar";
import Screen from "../../../shared/components/Screen";
import SearchBar from "../../../shared/components/SearchBar";
import { useTheme } from "../../../shared/theme/ThemeContext";

export default function OrdersListUI() {
  const router = useRouter();
  const { theme } = useTheme();

  // ✅ force dark palette (NO WHITE)
  const darkOnly = useMemo(
    () => ({
      bg: "#0B1220",
      card: "#0F172A",
      cardSoft: "#0B1730",
      text: "#E5E7EB",
      subtext: "#9CA3AF",
      border: "#1F2A44",
      borderSoft: "#22304D",
      danger: theme.danger, // keep from theme if you want
      dangerBg: "#2A1212",
      dangerBorder: "#5B1C1C",
    }),
    [theme.danger]
  );

  const styles = useMemo(() => makeStyles(darkOnly), [darkOnly]);

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

  const emitOrdersCount = useCallback((list) => {
    const arr = Array.isArray(list) ? list : [];
    const count = arr.filter(
      (o) => String(o?.status || "").toLowerCase().trim() !== "completed"
    ).length;

    DeviceEventEmitter.emit("orders.count", count);
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrdersApi();
      const list = Array.isArray(data) ? data : [];
      setOrders(list);
      emitOrdersCount(list);
    } catch (e) {
      Alert.alert("Orders error", e?.message || "Failed to load orders");
      setOrders([]);
      emitOrdersCount([]);
    } finally {
      setLoading(false);
    }
  }, [emitOrdersCount]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const performDelete = useCallback(
    async (order) => {
      const id = getId(order);
      if (!id || deletingId) return;

      try {
        setDeletingId(id);
        await deleteOrderApi(id);

        setOrders((prev) => {
          const next = prev.filter((o) => getId(o) !== id);
          emitOrdersCount(next);
          return next;
        });
      } catch (e) {
        Alert.alert("Delete failed", e?.message || "Could not delete this order");
      } finally {
        setDeletingId(null);
      }
    },
    [deletingId, getId, emitOrdersCount]
  );

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
        ]
      );
    },
    [getId, performDelete]
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

      const placedOk = !pickedPlacedDate
        ? true
        : toYMD(o?.placedDate) === pickedPlacedDate;

      return textOk && statusOk && platformOk && placedOk;
    });

    list = [...list].sort((a, b) =>
      String(a?.deadline || "").localeCompare(String(b?.deadline || ""))
    );

    return list;
  }, [orders, query, status, platform, placedDate, toYMD, getId]);

  return (
    <View style={{ flex: 1, backgroundColor: darkOnly.bg }}>
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
                    <Ionicons name="trash" size={18} color={darkOnly.danger} />
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
        onPress={() => router.push("/(main)/orders/create")}
      />
    </View>
  );
}

function makeStyles(t) {
  return StyleSheet.create({
    title: { fontSize: 22, fontWeight: "900", marginBottom: 4, color: t.text },
    sub: { fontSize: 13, color: t.subtext, marginBottom: 14 },
    list: { marginTop: 14, gap: 12 },
    empty: { marginTop: 12, color: t.subtext, fontWeight: "700" },

    iconBtn: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: t.dangerBg,
      borderWidth: 1,
      borderColor: t.dangerBorder,
    },
  });
}
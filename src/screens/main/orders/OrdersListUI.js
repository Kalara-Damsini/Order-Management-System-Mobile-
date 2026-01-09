import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import FloatingActionButton from "../../../features/orders/components/FloatingActionButton";
import OrderCard from "../../../features/orders/components/OrderCard";
import OrdersFilterBar from "../../../features/orders/components/OrdersFilterBar";
import { mockOrders } from "../../../features/orders/data/mockOrders";
import Screen from "../../../shared/components/Screen";
import SearchBar from "../../../shared/components/SearchBar";

export default function OrdersListUI() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [platform, setPlatform] = useState("All");

  // ✅ DATE DROPDOWN STATE (placed date)
  const [placedDate, setPlacedDate] = useState(null);

  // Date → YYYY-MM-DD
  const toYMD = (date) => {
    if (!date) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
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

    const list = Array.isArray(mockOrders) ? mockOrders : [];

    return list.filter((o) => {
      const customerName = String(o?.customerName ?? "").toLowerCase();
      const orderId = String(o?.id ?? "").toLowerCase();

      const textOk =
        !q || customerName.includes(q) || orderId.includes(q);

      const statusOk =
        status === "All" ? true : o?.status === mapStatus[status];

      const platformOk =
        platform === "All" ? true : o?.platform === mapPlatform[platform];

      // ✅ PLACED DATE FILTER (ONLY DATE FILTER)
      const placedOk =
        !pickedPlacedDate
          ? true
          : String(o?.placedDate ?? "") === pickedPlacedDate;

      return textOk && statusOk && platformOk && placedOk;
    });
  }, [query, status, platform, placedDate]);

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

        {/* ✅ FILTER BAR WITH DATE DROPDOWN */}
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
            />
          ))}
        </View>

        <View style={{ height: 90 }} />
      </Screen>

      <FloatingActionButton
        onPress={() => router.push("/(main)/orders/create")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "900", marginBottom: 4 },
  sub: { fontSize: 13, color: "#6B7280", marginBottom: 14 },
  list: { marginTop: 14, gap: 12 },
});

import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import FiltersBar from "../../../features/orders/components/FiltersBar";
import FloatingActionButton from "../../../features/orders/components/FloatingActionButton";
import OrderCard from "../../../features/orders/components/OrderCard";
import { mockOrders } from "../../../features/orders/data/mockOrders";
import Screen from "../../../shared/components/Screen";
import SearchBar from "../../../shared/components/SearchBar";

export default function OrdersListUI() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");
  const [platform, setPlatform] = useState("All");

  const filtered = useMemo(() => {
    return mockOrders.filter((o) => {
      const textOk =
        o.customerName.toLowerCase().includes(query.toLowerCase()) ||
        o.id.toLowerCase().includes(query.toLowerCase());

      const statusOk =
        status === "All"
          ? true
          : (status === "Pending" && o.status === "pending") ||
            (status === "In Progress" && o.status === "in_progress") ||
            (status === "Completed" && o.status === "completed") ||
            (status === "Cancelled" && o.status === "cancelled");

      const platformOk =
        platform === "All"
          ? true
          : (platform === "Instagram" && o.platform === "instagram") ||
            (platform === "WhatsApp" && o.platform === "whatsapp") ||
            (platform === "Facebook" && o.platform === "facebook") ||
            (platform === "Website" && o.platform === "website");

      return textOk && statusOk && platformOk;
    });
  }, [query, status, platform]);

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.sub}>Quickly scan deadlines and balances</Text>

        <SearchBar value={query} onChangeText={setQuery} placeholder="Search by customer or order id..." />

        <FiltersBar
          status={status}
          platform={platform}
          onChangeStatus={setStatus}
          onChangePlatform={setPlatform}
        />

        <View style={styles.list}>
          {filtered.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              onPress={() => router.push(`/(main)/orders/${o.id}`)}
            />
          ))}
        </View>
      </Screen>

      <FloatingActionButton onPress={() => router.push("/(main)/orders/create")} />
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "900", color: "#111827", marginBottom: 4 },
  sub: { fontSize: 13, color: "#6B7280", marginBottom: 14 },
  list: { marginTop: 14, gap: 12 },
});

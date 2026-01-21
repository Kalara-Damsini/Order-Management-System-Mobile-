import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import {
  getOrderApi,
  updateOrderApi,
  uploadOrderProofApi,
} from "../../../features/orders/api/orders.api";
import PlatformIcon from "../../../features/orders/components/PlatformIcon";
import StatusTag from "../../../features/orders/components/StatusTag";
import UploadProofBox from "../../../features/orders/components/UploadProofBox";
import Screen from "../../../shared/components/Screen";

function Section({ title, children }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function OrderDetailsUI() {
  const { id } = useLocalSearchParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getOrderApi(id);
      setOrder(data);
    } catch (e) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) load();
  }, [id, load]);

  const balance = useMemo(() => {
    if (!order) return 0;
    const t = Number(order.total || 0);
    const a = Number(order.advance || 0);
    return Math.max(0, t - a);
  }, [order]);

  const uploadProof = async (assets) => {
    try {
      if (!id) return;
      setLoading(true);
      await uploadOrderProofApi(String(id), assets);
      Alert.alert("Success", "Proof uploaded!");
      await load(); // reload order to show proof URLs if backend returns them
    } catch (e) {
      Alert.alert("Upload failed", e.message);
    } finally {
      setLoading(false);
    }
  };

  const setStatus = async (newStatus) => {
    try {
      await updateOrderApi(String(id), { status: newStatus }); // ✅ PATCH
      await load();
    } catch (e) {
      Alert.alert("Update failed", e.message);
    }
  };

  if (loading && !order) {
    return (
      <Screen>
        <Text style={styles.title}>Loading...</Text>
      </Screen>
    );
  }

  if (!order) {
    return (
      <Screen>
        <Text style={styles.title}>Order not found</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>{order.orderCode || order.id}</Text>

      {/* Status + update buttons */}
      <Section title="Status">
        <View style={styles.statusRow}>
          <StatusTag status={order.status} />
          <View style={styles.statusBtns}>
            <Pressable
              style={styles.smallBtn}
              onPress={() => setStatus("pending")}
            >
              <Text style={styles.smallBtnText}>Pending</Text>
            </Pressable>
            <Pressable
              style={styles.smallBtn}
              onPress={() => setStatus("in_progress")}
            >
              <Text style={styles.smallBtnText}>In Progress</Text>
            </Pressable>
            <Pressable
              style={styles.smallBtn}
              onPress={() => setStatus("completed")}
            >
              <Text style={styles.smallBtnText}>Completed</Text>
            </Pressable>
          </View>
        </View>
      </Section>

      <Section title="Customer & Platform">
        <Row label="Customer" value={order.customerName} />
        <Row label="Mobile" value={order.mobileNo || "-"} />
        <Row label="Address" value={order.address || "-"} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Platform</Text>
          <View style={styles.platformValue}>
            <PlatformIcon platform={order.platform} />
            <Text style={styles.rowValue}>{order.platform}</Text>
          </View>
        </View>
      </Section>

      <Section title="Payments">
        <Row
          label="Total"
          value={`LKR ${Number(order.total || 0).toLocaleString()}`}
        />
        <Row
          label="Advance"
          value={`LKR ${Number(order.advance || 0).toLocaleString()}`}
        />
        <Row label="Balance" value={`LKR ${balance.toLocaleString()}`} />
      </Section>

      <Section title="Dates">
        <Row label="Order Date" value={order.orderDate || "-"} />
        <Row label="Deadline" value={order.deadline || "-"} />
      </Section>

      <Section title="Notes">
        <Text style={styles.noteText}>{order.notes || "No notes"}</Text>
      </Section>

      <Section title="Delivery Proof">
        {/* UI now, backend upload later */}
        <UploadProofBox onPick={uploadProof} />
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 14,
  },

  section: {
    borderWidth: 1,
    borderColor: "#EEF2F6",
    borderRadius: 18,
    padding: 14,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  rowLabel: { fontSize: 12, fontWeight: "800", color: "#6B7280" },
  rowValue: {
    fontSize: 13,
    fontWeight: "900",
    color: "#111827",
    flexShrink: 1,
    textAlign: "right",
  },

  platformValue: { flexDirection: "row", alignItems: "center", gap: 8 },

  statusRow: { gap: 10 },
  statusBtns: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  smallBtn: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
  },
  smallBtnText: { fontSize: 12, fontWeight: "900", color: "#374151" },

  noteText: { color: "#374151", fontWeight: "700", lineHeight: 20 },
});

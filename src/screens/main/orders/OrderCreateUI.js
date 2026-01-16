import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { createOrderApi } from "../../../features/orders/api/orders.api";
import OrderForm from "../../../features/orders/components/OrderForm";
import AppButton from "../../../shared/components/AppButton";
import Screen from "../../../shared/components/Screen";


function toYMD(date) {
  if (!date) return "";
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function OrderCreateUI() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    customerName: "",
    mobileNo: "",
    address: "",
    productName: "",
    orderDate: null,
    deadline: null,
    platform: "instagram",
    platformLabel: "Instagram",
    total: "",
    advance: "",
    description: "",
    notes: "",
  });

  const balance = useMemo(() => {
    const total = Number(values.total || 0);
    const adv = Number(values.advance || 0);
    const b = Math.max(0, total - adv);
    return Number.isFinite(b) ? String(b) : "";
  }, [values.total, values.advance]);

  const onChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = async () => {
    if (!values.customerName.trim()) return Alert.alert("Missing", "Customer name is required");
    if (!values.mobileNo.trim()) return Alert.alert("Missing", "Mobile number is required");
    if (!values.address.trim()) return Alert.alert("Missing", "Address is required");
    if (!values.productName.trim()) return Alert.alert("Missing", "Product / Service is required");
    if (!values.orderDate) return Alert.alert("Missing", "Order date is required");
    if (!values.deadline) return Alert.alert("Missing", "Deadline date is required");
    if (!values.total) return Alert.alert("Missing", "Total price is required");
    if (!values.advance) return Alert.alert("Missing", "Advance is required");
    if (!values.description.trim()) return Alert.alert("Missing", "Description is required");

    const payload = {
      customerName: values.customerName.trim(),
      mobileNo: values.mobileNo.trim(),
      address: values.address.trim(),
      platform: values.platform,
      orderDate: toYMD(values.orderDate),
      deadline: toYMD(values.deadline),
      total: String(values.total),
      advance: String(values.advance),
      description: values.description.trim(),
      notes: values.notes?.trim() || "",
      items: [{ name: values.productName.trim(), price: String(values.total) }],
    };

    try {
      setLoading(true);
      await createOrderApi(payload);
      Alert.alert("Success", "Order created!");
      router.back();
    } catch (e) {
      Alert.alert("Create failed", e.message);
      console.log("createOrderApi:", typeof createOrderApi);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Text style={styles.title}>Add Order</Text>
        <Text style={styles.sub}>Fill the form and save</Text>

        <OrderForm values={{ ...values, balance }} onChange={onChange} />

        <View style={{ height: 90 }} />
      </Screen>

      <View style={styles.sticky}>
        <AppButton title={loading ? "Saving..." : "Save Order"} onPress={onSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "900", color: "#111827", marginBottom: 4 },
  sub: { fontSize: 13, color: "#6B7280", marginBottom: 14 },
  sticky: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#EEF2F6",
    backgroundColor: "#FFFFFF",
  },
});

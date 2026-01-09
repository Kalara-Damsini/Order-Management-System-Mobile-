import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import OrderForm from "../../../features/orders/components/OrderForm";
import AppButton from "../../../shared/components/AppButton";
import Screen from "../../../shared/components/Screen";

export default function OrderCreateUI() {
  const router = useRouter();

  const [values, setValues] = useState({
  customerName: "",
  productName: "",
  orderDate: null,    
  deadline: null,      
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

  return (
    <View style={{ flex: 1 }}>
      <Screen>
        <Text style={styles.title}>Add Order</Text>
        <Text style={styles.sub}>Fill the form and save</Text>

        <OrderForm values={values} onChange={onChange} />

        <View style={{ height: 90 }} />
      </Screen>

      {/* Sticky bottom bar */}
      <View style={styles.sticky}>
        <AppButton title="Save Order" onPress={() => router.back()} />
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

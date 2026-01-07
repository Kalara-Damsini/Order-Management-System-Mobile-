import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AppInput from "../../../shared/components/AppInput";

function SelectBox({ label, value }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.select}>
        <Text style={styles.selectText}>{value}</Text>
        <Ionicons name="chevron-down" size={18} color="#6B7280" />
      </Pressable>
    </View>
  );
}

export default function OrderForm({ values, onChange }) {
  const set = (k) => (v) => onChange?.(k, v);

  return (
    <View style={styles.form}>
      <View style={styles.twoCol}>
        <View style={{ flex: 1 }}>
          <AppInput label="Customer Name" placeholder="Enter customer's full name" value={values.customerName} onChangeText={set("customerName")} />
        </View>
        <View style={{ flex: 1 }}>
          <AppInput label="Product / Service" placeholder="Enter product or service name" value={values.productName} onChangeText={set("productName")} />
        </View>
      </View>

      <View style={styles.twoCol}>
        <View style={{ flex: 1 }}>
          <AppInput label="Order Date" placeholder="yyyy-mm-dd" value={values.orderDate} onChangeText={set("orderDate")} />
        </View>
        <View style={{ flex: 1 }}>
          <AppInput label="Deadline Date" placeholder="yyyy-mm-dd" value={values.deadline} onChangeText={set("deadline")} />
        </View>
      </View>

      <SelectBox label="Platform" value={values.platformLabel || "Select a platform"} />

      <View style={styles.divider} />

      <View style={styles.threeCol}>
        <View style={{ flex: 1 }}>
          <AppInput label="Total Price" placeholder="e.g. 12500" keyboardType="number-pad" value={values.total} onChangeText={set("total")} />
        </View>
        <View style={{ flex: 1 }}>
          <AppInput label="Advance" placeholder="e.g. 5000" keyboardType="number-pad" value={values.advance} onChangeText={set("advance")} />
        </View>
        <View style={{ flex: 1 }}>
          <AppInput label="Balance Due" placeholder="Auto" value={values.balance} onChangeText={() => {}} />
        </View>
      </View>

      <View style={styles.divider} />

      <AppInput
        label="Order items / Description"
        placeholder="Add order items or description..."
        value={values.description}
        onChangeText={set("description")}
      />

      <AppInput
        label="Notes"
        placeholder="Add any additional details or instructions..."
        value={values.notes}
        onChangeText={set("notes")}
        multiline
        numberOfLines={4}
        styleOverride={{ height: 120, textAlignVertical: "top" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: { gap: 6 },
  field: { marginBottom: 10 },
  label: { fontSize: 13, fontWeight: "800", color: "#111827", marginBottom: 6 },

  select: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EEF2F6",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectText: { color: "#9CA3AF", fontWeight: "700" },

  divider: { height: 1, backgroundColor: "#EEF2F6", marginVertical: 10 },

  twoCol: { flexDirection: "row", gap: 12 },
  threeCol: { flexDirection: "row", gap: 12 },
});

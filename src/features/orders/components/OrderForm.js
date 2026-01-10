import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import AppInput from "../../../shared/components/AppInput";
import DateField from "../../../shared/components/DateField";

function SelectBox({ label, value, onPress, placeholder = "Select" }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.select} onPress={onPress}>
        <Text style={[styles.selectText, !value && styles.placeholder]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color="#6B7280" />
      </Pressable>
    </View>
  );
}

export default function OrderForm({ values, onChange, onPressPlatform }) {
  const set = (key) => (val) => onChange?.(key, val);

  return (
    <View style={styles.form}>
      {/* Row 1 */}
      <View style={styles.twoCol}>
        <View style={{ flex: 1 }}>
          <AppInput
            label="Customer Name"
            placeholder="Enter customer's full name"
            value={values.customerName}
            onChangeText={set("customerName")}
          />
        </View>

        <View style={{ flex: 1 }}>
          <AppInput
            label="Mobile No"
            placeholder="e.g. 0771234567"
            keyboardType="phone-pad"
            value={values.mobileNo}
            onChangeText={set("mobileNo")}
          />
        </View>
      </View>

      {/* Row 2 */}
      <View style={styles.twoCol}>
        <View style={{ flex: 1 }}>
          <AppInput
            label="Products"
            placeholder="Enter product or service name"
            value={values.productName}
            onChangeText={set("productName")}
          />
        </View>

        <View style={{ flex: 1 }}>
          <AppInput
            label="Address"
            placeholder="Enter delivery address"
            value={values.address}
            onChangeText={set("address")}
            multiline
            numberOfLines={3}
            styleOverride={{ height: 90, textAlignVertical: "top" }}
          />
        </View>
      </View>

      {/* Row 3 (Dates - real date picker) */}
      <View style={styles.twoCol}>
        <DateField
          label="Order Date"
          value={values.orderDate}
          onChange={set("orderDate")}
        />
        <DateField
          label="Deadline Date"
          value={values.deadline}
          onChange={set("deadline")}
        />
      </View>

      {/* Platform */}
      <SelectBox
        label="Platform"
        value={values.platformLabel}
        onPress={onPressPlatform}
        placeholder="Select a platform"
      />

      <View style={styles.divider} />

      {/* Money */}
      <View style={styles.threeCol}>
        <View style={{ flex: 1 }}>
          <AppInput
            label="Total Price"
            placeholder="e.g. 12500"
            keyboardType="number-pad"
            value={values.total}
            onChangeText={set("total")}
          />
        </View>

        <View style={{ flex: 1 }}>
          <AppInput
            label="Advance"
            placeholder="e.g. 5000"
            keyboardType="number-pad"
            value={values.advance}
            onChangeText={set("advance")}
          />
        </View>

        <View style={{ flex: 1 }}>
          <AppInput
            label="Balance Due"
            placeholder="Auto"
            value={values.balance}
            editable={false}
          />
        </View>
      </View>

      <View style={styles.divider} />

      {/* Description */}
      <AppInput
        label="Order items / Description"
        placeholder="Add order items or description..."
        value={values.description}
        onChangeText={set("description")}
      />

      {/* Notes */}
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
  label: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },

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
  selectText: { fontWeight: "800", color: "#111827" },
  placeholder: { color: "#9CA3AF" },

  divider: { height: 1, backgroundColor: "#EEF2F6", marginVertical: 10 },

  twoCol: { flexDirection: "row", gap: 12 },
  threeCol: { flexDirection: "row", gap: 12 },
});

import { StyleSheet, View } from "react-native";
import AppInput from "../../../shared/components/AppInput";
import DateField from "../../../shared/components/DateField";
import Dropdown from "../../../shared/components/Dropdown";

const PLATFORM_OPTIONS = [
  { label: "Instagram", value: "instagram" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Facebook", value: "facebook" },
  { label: "Website", value: "website" },
];

// Dropdown expects a list of strings
const PLATFORM_LABELS = PLATFORM_OPTIONS.map((p) => p.label);

export default function OrderForm({ values = {}, safeValues = {}, onChange }) {
  const set = (key) => (val) => onChange?.(key, val);

  const onPlatformChange = (selectedLabel) => {
    const selected = PLATFORM_OPTIONS.find((p) => p.label === selectedLabel);
    if (!selected) return;

    onChange?.("platformLabel", selected.label);
    onChange?.("platform", selected.value);
  };

  return (
    <View style={styles.form}>
      {/* Row 1 */}
      <View style={styles.twoCol}>
        <View style={{ flex: 1 }}>
          <AppInput
            label="Customer Name"
            placeholder="Enter customer's full name"
            value={safeValues.customerName}
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
            value={safeValues.productName}
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

      {/* Dates */}
      <View style={styles.twoCol}>
        <View style={{ flex: 1 }}>
          <DateField
            label="Order Date"
            value={values.orderDate}
            onChange={set("orderDate")}
          />
        </View>

        <View style={{ flex: 1 }}>
          <DateField
            label="Deadline Date"
            value={values.deadline}
            onChange={set("deadline")}
          />
        </View>
      </View>

      {/* ✅ Platform Dropdown (NOW WORKING) */}
      <Dropdown
        label="Platform"
        value={values.platformLabel}
        placeholder="Select a platform"
        options={PLATFORM_LABELS}
        onChange={onPlatformChange}
      />

      <View style={styles.divider} />

      {/* Money */}
      <View style={styles.threeCol}>
        <View style={{ flex: 1 }}>
          <AppInput
            label="Total Price"
            placeholder="e.g. 12500"
            keyboardType="number-pad"
            value={safeValues.total}
            onChangeText={set("total")}
          />
        </View>

        <View style={{ flex: 1 }}>
          <AppInput
            label="Advance"
            placeholder="e.g. 5000"
            keyboardType="number-pad"
            value={safeValues.advance}
            onChangeText={set("advance")}
          />
        </View>

        <View style={{ flex: 1 }}>
          <AppInput
            label="Balance Due"
            placeholder="Auto"
            value={safeValues.balance}
            editable={false}
          />
        </View>
      </View>

      <View style={styles.divider} />

      {/* Description */}
      <AppInput
        label="Order items / Description"
        placeholder="Add order items or description..."
        value={safeValues.description}
        onChangeText={set("description")}
      />

      {/* Notes */}
      <AppInput
        label="Notes"
        placeholder="Add any additional details or instructions..."
        value={safeValues.notes}
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
  divider: { height: 1, backgroundColor: "#EEF2F6", marginVertical: 10 },
  twoCol: { flexDirection: "row", gap: 12 },
  threeCol: { flexDirection: "row", gap: 12 },
});
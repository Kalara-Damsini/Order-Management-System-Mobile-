import { StyleSheet, View } from "react-native";
import DateField from "../../../shared/components/DateField";
import Dropdown from "../../../shared/components/Dropdown";

export default function OrdersFilterBar({
  status,
  platform,
  placedDate,
  onChangeStatus,
  onChangePlatform,
  onChangePlacedDate,
}) {
  return (
    <View style={styles.row}>
      <Dropdown
        label="Status"
        value={status}
        options={["All", "Pending", "In Progress", "Completed", "Cancelled"]}
        onChange={onChangeStatus}
      />

      <Dropdown
        label="Platform"
        value={platform}
        options={["All", "Instagram", "WhatsApp", "Facebook", "Website"]}
        onChange={onChangePlatform}
      />

      <DateField
        label="Order Placed Date"
        value={placedDate}
        onChange={onChangePlacedDate}
        placeholder="Any date"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
});

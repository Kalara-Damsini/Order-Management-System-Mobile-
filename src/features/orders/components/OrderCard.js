import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "../../../shared/theme/ThemeContext"; // ✅ adjust path if needed
import PlatformIcon from "./PlatformIcon";
import StatusTag from "./StatusTag";

export default function OrderCard({ order, onPress, rightAction }) {
  const { theme } = useTheme();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  const balance = useMemo(() => {
    const total = Number(order?.total ?? 0);
    const advance = Number(order?.advance ?? 0);
    return Math.max(0, total - advance);
  }, [order]);

  return (
    <View style={styles.card}>
      {/* press area for opening details */}
      <Pressable style={styles.pressArea} onPress={onPress}>
        <View style={styles.topRow}>
          <View style={styles.left}>
            <Text style={styles.customer}>{order?.customerName || "-"}</Text>

            <View style={styles.metaRow}>
              <PlatformIcon platform={order?.platform} />
              <Text style={styles.deadline}>
                Deadline: {order?.deadline || "-"}
              </Text>
            </View>
          </View>

          <View style={styles.right}>
            <StatusTag status={order?.status} />
            {balance > 0 ? (
              <Text style={styles.balance}>
                Balance: LKR {balance.toLocaleString()}
              </Text>
            ) : null}
          </View>
        </View>
      </Pressable>

      {/* delete icon visible here */}
      {rightAction ? <View style={styles.action}>{rightAction}</View> : null}
    </View>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    card: {
      position: "relative",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card, // ✅ dark card in dark mode (no white)
      borderRadius: 18,
      padding: 14,
    },

    // gives space so the delete icon doesn't cover right-side content
    pressArea: { paddingRight: 46 },

    topRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
    left: { flex: 1 },
    right: { alignItems: "flex-end", gap: 8 },

    customer: { fontSize: 16, fontWeight: "900", color: theme.text },
    metaRow: {
      marginTop: 8,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    deadline: { fontSize: 12, color: theme.subtext, fontWeight: "700" },
    balance: { fontSize: 12, color: theme.text, fontWeight: "900" },

    // bottom-right delete button position
    action: { position: "absolute", right: 10, bottom: 10 },
  });
}
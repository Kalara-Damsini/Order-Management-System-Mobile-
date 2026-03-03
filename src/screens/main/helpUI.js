import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Screen from "../../../src/shared/components/Screen";
import { useTheme } from "../../shared/theme/ThemeContext";

const HELP_DATA = [
    {
        title: "Getting Started",
        icon: "rocket-outline",
        items: [
            {
                q: "How do I create my first order?",
                a:
                    "Go to Orders → Add Order. Fill customer details, order date, deadline, total and advance, then Save.",
            },
            {
                q: "What is the Dashboard used for?",
                a:
                    "Dashboard shows your quick overview (tasks, customers, revenue). It helps you see what needs attention first.",
            },
            {
                q: "How do I change my shop name or avatar?",
                a:
                    "Open Settings → Profile. Expand Profile, update shop name or tap the avatar to change your profile picture.",
            },
        ],
    },

    {
        title: "Orders",
        icon: "cart-outline",
        items: [
            {
                q: "How do I edit an order?",
                a:
                    "Open Orders → tap the order card → edit fields and Save. (If edit is not added yet, we can implement it next.)",
            },
            {
                q: "Why is my order count not matching?",
                a:
                    "Order badge count can exclude Completed orders. If you want it to show only pending/in-progress, ensure status filtering is correct.",
            },
            {
                q: "How do I delete an order permanently?",
                a:
                    "Open Orders list → tap delete icon → confirm. This should call backend DELETE and then remove it from the UI.",
            },
        ],
    },

    {
        title: "Order Status & Tasks",
        icon: "time-outline",
        items: [
            {
                q: "What does Pending / In Progress / Completed mean?",
                a:
                    "Pending: not started yet. In Progress: working on it. Completed: done and delivered/closed. Cancelled: stopped or invalid.",
            },
            {
                q: "How do I see only Pending tasks?",
                a:
                    "Use the status filter bar in Orders. Select Pending to show only orders that still need action.",
            },
            {
                q: "How do deadlines work?",
                a:
                    "Deadline is the date you promised delivery. Sorting by deadline helps you complete urgent orders first.",
            },
        ],
    },

    {
        title: "Payments",
        icon: "cash-outline",
        items: [
            {
                q: "How is Balance calculated?",
                a:
                    "Balance = Total - Advance. The app should show Balance automatically and prevent negative values.",
            },
            {
                q: "Can I mark an order as Paid?",
                a:
                    "If your backend supports payment status, we can add a Paid toggle. For MVP, you can track using notes/status.",
            },
            {
                q: "What if customer pays extra advance?",
                a:
                    "Update the Advance amount. Balance will reduce automatically. If advance > total, balance should stay 0.",
            },
        ],
    },

    {
        title: "Troubleshooting",
        icon: "construct-outline",
        items: [
            {
                q: "I can’t login / it logs out immediately",
                a:
                    "This usually happens when token is missing/expired or profile API fails. Make sure accessToken is saved and /users/me works with Authorization header.",
            },
            {
                q: "ngrok shows ERR_NGROK_8012",
                a:
                    "That means ngrok cannot reach your local backend port. Ensure backend is running and ngrok targets the correct port (e.g., ngrok http 3000).",
            },
            {
                q: "Images are not showing",
                a:
                    "If backend returns a relative avatarUrl, convert it to a full URL using API base URL. Also ensure your server serves static uploads correctly.",
            },
        ],
    },

    {
        title: "Help & Contact",
        icon: "help-circle-outline",
        items: [
            {
                q: "How do I contact support?",
                a:
                    "Go to bottom of this screen and use WhatsApp, Email, or Call. Add your issue + screenshot for faster help.",
            },
            {
                q: "What details should I send to support?",
                a:
                    "Include error message, your action steps, device type, and (if possible) request logs (GET/POST status codes).",
            },
        ],
    },
];

export default function HelpScreen() {
    const { theme } = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);

    const [openCategory, setOpenCategory] = useState(null);
    const [openQA, setOpenQA] = useState({}); // key: "catIndex-qaIndex"

    const toggleQA = (key) => {
        setOpenQA((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <Screen>
            <Text style={styles.title}>Help & Support</Text>
            <Text style={styles.sub}>
                Find answers quickly. Tap a category to expand.
            </Text>

            {HELP_DATA.map((cat, ci) => {
                const catOpen = openCategory === ci;

                return (
                    <View key={cat.title} style={styles.card}>
                        {/* Category header */}
                        <Pressable
                            onPress={() => setOpenCategory(catOpen ? null : ci)}
                            style={styles.catHeader}
                        >
                            <View style={styles.catLeft}>
                                <View style={styles.iconWrap}>
                                    <Ionicons name={cat.icon} size={18} color={theme.primary} />
                                </View>
                                <Text style={styles.catTitle}>{cat.title}</Text>
                            </View>

                            <Ionicons
                                name={catOpen ? "chevron-up" : "chevron-down"}
                                size={20}
                                color={theme.subText || theme.subtext}
                            />
                        </Pressable>

                        {/* Category body */}
                        {catOpen ? (
                            <View style={styles.catBody}>
                                {cat.items.map((qa, qi) => {
                                    const key = `${ci}-${qi}`;
                                    const open = !!openQA[key];

                                    return (
                                        <View key={key} style={styles.qaWrap}>
                                            <Pressable
                                                onPress={() => toggleQA(key)}
                                                style={styles.qaHeader}
                                            >
                                                <Text style={styles.qText}>{qa.q}</Text>
                                                <Ionicons
                                                    name={open ? "remove" : "add"}
                                                    size={18}
                                                    color={theme.subText || theme.subtext}
                                                />
                                            </Pressable>

                                            {open ? <Text style={styles.aText}>{qa.a}</Text> : null}
                                        </View>
                                    );
                                })}
                            </View>
                        ) : null}
                    </View>
                );
            })}

            {/* Contact section (no popup) */}
            <View style={styles.contactCard}>
                <Text style={styles.contactTitle}>Contact Support</Text>
                <Text style={styles.contactSub}>
                    If you still need help, contact us with the issue + screenshot.
                </Text>

                <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>WhatsApp:</Text>
                    <Text style={styles.contactValue}>+94 XX XXX XXXX</Text>
                </View>

                <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>Email:</Text>
                    <Text style={styles.contactValue}>support@yourapp.com</Text>
                </View>

                <View style={styles.contactRow}>
                    <Text style={styles.contactLabel}>Working hours:</Text>
                    <Text style={styles.contactValue}>9:00 AM – 6:00 PM</Text>
                </View>
            </View>

            <View style={{ height: 20 }} />
        </Screen>
    );
}

function makeStyles(theme) {
    const text = theme.text || "#111827";
    const sub = theme.subText || theme.subtext || "#6B7280";
    const bg = theme.background || theme.bg || "#FFFFFF";
    const card = theme.card || "#FFFFFF";
    const border = theme.border || "#EEF2F6";
    const chipBg = theme.inputBg || (theme.mode === "dark" ? "#0F172A" : "#F8FAFC");

    return StyleSheet.create({
        title: { fontSize: 22, fontWeight: "900", color: text, marginBottom: 4 },
        sub: { fontSize: 13, color: sub, marginBottom: 14 },

        card: {
            backgroundColor: card,
            borderWidth: 1,
            borderColor: border,
            borderRadius: 18,
            padding: 12,
            marginBottom: 12,
        },

        catHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 6,
        },
        catLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
        iconWrap: {
            width: 34,
            height: 34,
            borderRadius: 12,
            backgroundColor: chipBg,
            borderWidth: 1,
            borderColor: border,
            alignItems: "center",
            justifyContent: "center",
        },
        catTitle: { fontSize: 14, fontWeight: "900", color: text },

        catBody: {
            marginTop: 10,
            borderTopWidth: 1,
            borderTopColor: border,
            paddingTop: 10,
            gap: 10,
        },

        qaWrap: {
            backgroundColor: chipBg,
            borderWidth: 1,
            borderColor: border,
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 10,
        },
        qaHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
        },
        qText: { flex: 1, color: text, fontWeight: "900", fontSize: 13 },
        aText: { marginTop: 8, color: sub, fontSize: 12, lineHeight: 18 },

        contactCard: {
            backgroundColor: card,
            borderWidth: 1,
            borderColor: border,
            borderRadius: 18,
            padding: 14,
            marginTop: 6,
        },
        contactTitle: { fontSize: 14, fontWeight: "900", color: text },
        contactSub: { fontSize: 12, color: sub, marginTop: 6, marginBottom: 10 },
        contactRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
        contactLabel: { fontSize: 12, color: sub, fontWeight: "800" },
        contactValue: { fontSize: 12, color: text, fontWeight: "900" },
    });
}
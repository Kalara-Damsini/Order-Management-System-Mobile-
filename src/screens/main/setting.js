import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
    Alert,
    DeviceEventEmitter,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";

import {
    getMyProfileApi,
    updateMyProfileApi,
    uploadAvatarApi,
} from "../../features/auth/api/auth.api.js";

import AppButton from "../../shared/components/AppButton.js";
import AppInput from "../../shared/components/AppInput.js";
import Screen from "../../shared/components/Screen.js";

function initialLetter(name) {
    const n = String(name || "").trim();
    return n ? n[0].toUpperCase() : "?";
}

export default function SettingsScreen() {
    const router = useRouter();
    const { mode, changeTheme, theme } = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);

    // ✅ only light/dark (no system)
    const isDark = mode === "dark";

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [profile, setProfile] = useState(null);
    const [shopName, setShopName] = useState("");

    // ✅ accordion state
    const [profileOpen, setProfileOpen] = useState(false);

    const loadAll = useCallback(async () => {
        try {
            setLoading(true);
            const me = await getMyProfileApi();
            setProfile(me);
            setShopName(me?.shopName || "");
        } catch (e) {
            Alert.alert("Settings error", e?.message || "Failed to load settings");
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadAll();
        }, [loadAll]),
    );

    const fullName = profile?.fullName || "User";
    const email = profile?.email || "";
    const avatarUrl = profile?.avatarFullUrl || "";

    const versionText = useMemo(() => {
        return Constants?.expoConfig?.version || Constants?.manifest?.version || "1.0.0";
    }, []);

    const onSaveProfile = async () => {
        const next = String(shopName || "").trim();
        if (!next) return Alert.alert("Missing", "Shop name cannot be empty");

        try {
            setSaving(true);
            const updated = await updateMyProfileApi({ shopName: next });
            setProfile(updated);
            DeviceEventEmitter.emit("profile.updated");
            Alert.alert("Saved", "Profile updated");
        } catch (e) {
            Alert.alert("Save failed", e?.message || "Could not update profile");
        } finally {
            setSaving(false);
        }
    };

    const onPickAvatar = async () => {
        try {
            const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!perm.granted) {
                return Alert.alert("Permission required", "Allow gallery access to upload avatar.");
            }

            const res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (res.canceled) return;
            const uri = res.assets?.[0]?.uri;
            if (!uri) return;

            setUploading(true);
            await uploadAvatarApi(uri);

            const me = await getMyProfileApi();
            setProfile(me);

            DeviceEventEmitter.emit("profile.updated");
            Alert.alert("Updated", "Profile picture updated");
        } catch (e) {
            Alert.alert("Upload failed", e?.message || "Could not upload avatar");
        } finally {
            setUploading(false);
        }
    };

    const onLogout = async () => {
        await AsyncStorage.removeItem("accessToken");
        DeviceEventEmitter.emit("profile.updated");

        // ✅ in expo-router, group name not needed
        router.replace("/login"); // change if your login route is different
    };

    return (
        <View style={[styles.root, { backgroundColor: theme.background || theme.bg }]}>
            <Screen>
                <Text style={styles.title}>Settings</Text>
                <Text style={styles.sub}>Profile and appearance</Text>

                {/* ✅ Appearance (2-side toggle) */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Appearance</Text>

                    <View style={styles.toggleRow}>
                        <Text style={styles.rowLabel}>Theme</Text>

                        {/* segmented toggle */}
                        <View style={styles.segment}>
                            <Pressable
                                onPress={() => changeTheme("light")}
                                style={[
                                    styles.segmentBtn,
                                    !isDark && styles.segmentBtnActive,
                                ]}
                            >
                                <Ionicons
                                    name="sunny-outline"
                                    size={16}
                                    color={!isDark ? styles._activeText.color : styles._inactiveText.color}
                                />
                                <Text style={!isDark ? styles._activeText : styles._inactiveText}>
                                    Light
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => changeTheme("dark")}
                                style={[
                                    styles.segmentBtn,
                                    isDark && styles.segmentBtnActive,
                                ]}
                            >
                                <Ionicons
                                    name="moon-outline"
                                    size={16}
                                    color={isDark ? styles._activeText.color : styles._inactiveText.color}
                                />
                                <Text style={isDark ? styles._activeText : styles._inactiveText}>
                                    Dark
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* ✅ Profile collapsible dropdown (accordion) */}
                <View style={styles.card}>
                    <Pressable
                        onPress={() => setProfileOpen((p) => !p)}
                        style={({ pressed }) => [
                            styles.accordionHeader,
                            pressed && { opacity: 0.9 },
                        ]}
                    >
                        <View style={styles.accordionLeft}>
                            <View style={styles.smallAvatarWrap}>
                                {avatarUrl ? (
                                    <Image source={{ uri: avatarUrl }} style={styles.smallAvatar} />
                                ) : (
                                    <View style={styles.smallAvatarFallback}>
                                        <Text style={styles.smallAvatarLetter}>{initialLetter(fullName)}</Text>
                                    </View>
                                )}
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={styles.profileName} numberOfLines={1}>
                                    {loading ? "Loading..." : fullName}
                                </Text>
                                {!!email && (
                                    <Text style={styles.profileEmail} numberOfLines={1}>
                                        {email}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <Ionicons
                            name={profileOpen ? "chevron-up" : "chevron-down"}
                            size={20}
                            color={theme.subText || theme.subtext}
                        />
                    </Pressable>

                    {/* Expanded content (NOT a popup) */}
                    {profileOpen ? (
                        <View style={styles.accordionBody}>
                            <View style={styles.bigProfileRow}>
                                <Pressable onPress={onPickAvatar} style={styles.bigAvatarWrap}>
                                    {avatarUrl ? (
                                        <Image source={{ uri: avatarUrl }} style={styles.bigAvatar} />
                                    ) : (
                                        <View style={styles.bigAvatarFallback}>
                                            <Text style={styles.bigAvatarLetter}>{initialLetter(fullName)}</Text>
                                        </View>
                                    )}

                                    <View style={styles.editDot}>
                                        <Text style={styles.editDotText}>✎</Text>
                                    </View>
                                </Pressable>

                                <View style={{ flex: 1 }}>
                                    <Text style={styles.bigName} numberOfLines={1}>
                                        {fullName}
                                    </Text>
                                    {!!email && (
                                        <Text style={styles.bigEmail} numberOfLines={1}>
                                            {email}
                                        </Text>
                                    )}
                                    <Text style={styles.profileHint}>
                                        Tap avatar to {uploading ? "uploading..." : "change photo"}
                                    </Text>
                                </View>
                            </View>

                            <AppInput
                                label="Shop Name"
                                placeholder="Enter your shop name"
                                value={shopName}
                                onChangeText={setShopName}
                            />

                            <AppButton
                                title={saving ? "Saving..." : "Save Profile"}
                                onPress={onSaveProfile}
                            />
                        </View>
                    ) : null}
                </View>

                {/* About */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>About</Text>
                    <View style={styles.aboutRow}>
                        <Text style={styles.aboutLabel}>Version</Text>
                        <Text style={styles.aboutValue}>{versionText}</Text>
                    </View>
                </View>

                {/* Logout */}
                <Pressable onPress={onLogout} style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Log out</Text>
                </Pressable>

                <View style={{ height: 20 }} />
            </Screen>
        </View>
    );
}

function makeStyles(theme) {
    const bg = theme.background || theme.bg || "#FFFFFF";
    const card = theme.card || "#FFFFFF";
    const border = theme.border || "#EEF2F6";
    const text = theme.text || "#111827";
    const sub = theme.subText || theme.subtext || "#6B7280";
    const muted = theme.mutedText || sub;
    const primary = theme.primary || "#1677FF";
    const danger = theme.danger || "#DC2626";

    // for segmented control
    const segmentBg = theme.mode === "dark" ? "#0F172A" : "#F3F4F6";
    const segmentBorder = border;
    const activeBg = theme.mode === "dark" ? "#111A2E" : "#FFFFFF";

    return StyleSheet.create({
        root: { flex: 1, backgroundColor: bg },

        title: { fontSize: 22, fontWeight: "900", color: text, marginBottom: 4 },
        sub: { fontSize: 13, color: sub, marginBottom: 14 },

        card: {
            backgroundColor: card,
            borderWidth: 1,
            borderColor: border,
            borderRadius: 18,
            padding: 14,
            marginBottom: 12,
            gap: 10,
        },
        cardTitle: { fontSize: 14, fontWeight: "900", color: text },

        hint: { fontSize: 12, color: muted, marginTop: -4 },

        /* --- Appearance Toggle --- */
        toggleRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginTop: 2,
        },
        rowLabel: { fontSize: 13, fontWeight: "800", color: text },

        segment: {
            flexDirection: "row",
            backgroundColor: segmentBg,
            borderWidth: 1,
            borderColor: segmentBorder,
            borderRadius: 999,
            overflow: "hidden",
        },
        segmentBtn: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 14,
            paddingVertical: 10,
        },
        segmentBtnActive: {
            backgroundColor: activeBg,
        },
        _activeText: { color: text, fontWeight: "900", fontSize: 13 },
        _inactiveText: { color: sub, fontWeight: "900", fontSize: 13 },

        /* --- Profile Accordion --- */
        accordionHeader: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        accordionLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },

        smallAvatarWrap: { width: 42, height: 42 },
        smallAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: border },
        smallAvatarFallback: {
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: theme.inputBg || (theme.mode === "dark" ? "#0F172A" : "#F8FAFC"),
            borderWidth: 1,
            borderColor: border,
            alignItems: "center",
            justifyContent: "center",
        },
        smallAvatarLetter: { color: text, fontWeight: "900" },

        profileName: { fontSize: 14, fontWeight: "900", color: text },
        profileEmail: { fontSize: 12, color: sub, marginTop: 2 },

        accordionBody: {
            marginTop: 10,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: border,
            gap: 10,
        },

        bigProfileRow: { flexDirection: "row", alignItems: "center", gap: 12 },

        bigAvatarWrap: { width: 62, height: 62 },
        bigAvatar: { width: 62, height: 62, borderRadius: 31, backgroundColor: border },
        bigAvatarFallback: {
            width: 62,
            height: 62,
            borderRadius: 31,
            backgroundColor: theme.inputBg || (theme.mode === "dark" ? "#0F172A" : "#F8FAFC"),
            borderWidth: 1,
            borderColor: border,
            alignItems: "center",
            justifyContent: "center",
        },
        bigAvatarLetter: { fontSize: 20, fontWeight: "900", color: text },

        editDot: {
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: primary,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: card,
        },
        editDotText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 },

        bigName: { fontSize: 16, fontWeight: "900", color: text },
        bigEmail: { fontSize: 12, color: sub, marginTop: 2 },
        profileHint: { fontSize: 11, color: muted, marginTop: 6 },

        /* --- About --- */
        aboutRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
        aboutLabel: { fontSize: 13, color: sub, fontWeight: "700" },
        aboutValue: { fontSize: 13, color: text, fontWeight: "900" },

        /* --- Logout --- */
        logoutBtn: {
            height: 48,
            borderRadius: 14,
            backgroundColor: theme.mode === "dark" ? "#2A0E12" : "#FEF2F2",
            borderWidth: 1,
            borderColor: theme.mode === "dark" ? "#5B1B22" : "#FECACA",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 6,
        },
        logoutText: { color: danger, fontWeight: "900", fontSize: 15 },
    });
}
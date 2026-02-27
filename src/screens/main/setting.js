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
    View
} from "react-native";
import { useTheme } from "../../shared/theme/ThemeContext.js";

import {
    getMyProfileApi,
    updateMyProfileApi,
    uploadAvatarApi,
} from "../../features/auth/api/auth.api.js";

import AppButton from "../../shared/components/AppButton.js";
import AppInput from "../../shared/components/AppInput.js";
import Dropdown from "../../shared/components/Dropdown.js";
import Screen from "../../shared/components/Screen.js";

function initialLetter(name) {
    const n = String(name || "").trim();
    return n ? n[0].toUpperCase() : "?";
}

export default function SettingsScreen() {
    const router = useRouter();
    const { mode, changeTheme, theme } = useTheme();
    const themeLabel = mode === "system" ? "System" : mode === "dark" ? "Dark" : "Light";

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [profile, setProfile] = useState(null);
    const [shopName, setShopName] = useState("");

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
        }, [loadAll])
    );

    const fullName = profile?.fullName || "User";
    const email = profile?.email || "";
    const avatarUrl = profile?.avatarFullUrl || "";

    const versionText = useMemo(() => {
        return (
            Constants?.expoConfig?.version ||
            Constants?.manifest?.version ||
            "1.0.0"
        );
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

            // refresh profile after upload
            const me = await getMyProfileApi();
            setProfile(me);

            DeviceEventEmitter.emit("profile.updated"); // refresh drawer
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
        router.replace("/(auth)/login");
    };

    return (
        <View style={{ flex: 1 }}>
            <Screen>
                <Text style={styles.title}>Settings</Text>
                <Text style={styles.sub}>Profile, defaults, and app info</Text>

                {/* Profile */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Profile</Text>

                    <View style={styles.profileRow}>
                        <Pressable onPress={onPickAvatar} style={styles.avatarWrap}>
                            {avatarUrl ? (
                                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarFallback}>
                                    <Text style={styles.avatarLetter}>
                                        {initialLetter(fullName)}
                                    </Text>
                                </View>
                            )}
                            <View style={styles.editDot}>
                                <Text style={styles.editDotText}>✎</Text>
                            </View>
                        </Pressable>

                        <View style={{ flex: 1 }}>
                            <Text style={styles.profileName} numberOfLines={1}>
                                {loading ? "Loading..." : fullName}
                            </Text>
                            {!!email && (
                                <Text style={styles.profileEmail} numberOfLines={1}>
                                    {email}
                                </Text>
                            )}
                            <Text style={styles.profileHint}>
                                Tap avatar to {uploading ? "uploading..." : "change photo"}
                            </Text>
                        </View>
                    </View>

                    {/* Appearance (Theme) */}
                    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <Text style={[styles.cardTitle, { color: theme.text }]}>Appearance</Text>

                        <Dropdown
                            label="Theme"
                            value={themeLabel}
                            options={["Light", "Dark", "System"]}
                            onChange={(val) => {
                                const map = { Light: "light", Dark: "dark", System: "system" };
                                changeTheme(map[val] || "system");
                            }}
                        />
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

const styles = StyleSheet.create({
    title: { fontSize: 22, fontWeight: "900", color: "#111827", marginBottom: 4 },
    sub: { fontSize: 13, color: "#6B7280", marginBottom: 14 },

    card: {
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "#EEF2F6",
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
        gap: 10,
    },
    cardTitle: { fontSize: 14, fontWeight: "900", color: "#111827" },
    cardDesc: { fontSize: 12, color: "#6B7280", marginTop: -6 },

    profileRow: { flexDirection: "row", alignItems: "center", gap: 12 },
    avatarWrap: { width: 62, height: 62 },
    avatar: { width: 62, height: 62, borderRadius: 31, backgroundColor: "#E5E7EB" },
    avatarFallback: {
        width: 62,
        height: 62,
        borderRadius: 31,
        backgroundColor: "#E5E7EB",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarLetter: { fontSize: 20, fontWeight: "900", color: "#111827" },
    editDot: {
        position: "absolute",
        right: 0,
        bottom: 0,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: "#1677FF",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    editDotText: { color: "#FFFFFF", fontWeight: "900", fontSize: 12 },

    profileName: { fontSize: 16, fontWeight: "900", color: "#111827" },
    profileEmail: { fontSize: 12, color: "#6B7280", marginTop: 2 },
    profileHint: { fontSize: 11, color: "#9CA3AF", marginTop: 6 },

    aboutRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
    aboutLabel: { fontSize: 13, color: "#6B7280", fontWeight: "700" },
    aboutValue: { fontSize: 13, color: "#111827", fontWeight: "900" },

    logoutBtn: {
        height: 48,
        borderRadius: 14,
        backgroundColor: "#FEF2F2",
        borderWidth: 1,
        borderColor: "#FECACA",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 6,
    },
    logoutText: { color: "#DC2626", fontWeight: "900", fontSize: 15 },
});
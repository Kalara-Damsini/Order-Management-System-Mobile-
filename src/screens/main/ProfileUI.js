import * as ImagePicker from "expo-image-picker";
import { useEffect, useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { getMyProfileApi, updateMyProfileApi, uploadAvatarApi } from "../../features/auth/api/auth.api";
import AppButton from "../../shared/components/AppButton";
import Screen from "../../shared/components/Screen";
import { resolveApiUrl } from "../../shared/config/env";
import { useTheme } from "../../shared/theme/ThemeContext";

export default function ProfileUI() {
    const { theme } = useTheme();
    const styles = useMemo(() => makeStyles(theme), [theme]);

    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [shopName, setShopName] = useState("");

    const load = async () => {
        try {
            const me = await getMyProfileApi();
            setProfile(me);
            setShopName(me?.shopName || "");
        } catch (e) {
            Alert.alert("Profile error", e?.message || "Failed to load profile");
        }
    };

    useEffect(() => {
        load();
    }, []);

    const pickAndUpload = async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) return Alert.alert("Permission", "Allow gallery access to upload photo");

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.85,
        });

        if (result.canceled) return;

        try {
            setLoading(true);
            const uri = result.assets?.[0]?.uri;
            const res = await uploadAvatarApi(uri);

            setProfile((p) => ({ ...(p || {}), avatarUrl: res.avatarUrl }));
            Alert.alert("Success", "Profile photo updated!");
        } catch (e) {
            Alert.alert("Upload failed", e?.message || "Could not upload avatar");
        } finally {
            setLoading(false);
        }
    };

    const saveShopName = async () => {
        if (!shopName.trim()) return Alert.alert("Missing", "Shop name is required");

        try {
            setLoading(true);
            const updated = await updateMyProfileApi({ shopName: shopName.trim() });
            setProfile(updated);
            Alert.alert("Saved", "Profile updated!");
        } catch (e) {
            Alert.alert("Save failed", e?.message || "Could not save");
        } finally {
            setLoading(false);
        }
    };

    const avatarFullUrl = profile?.avatarUrl ? resolveApiUrl(profile.avatarUrl) : "";
    const letter = String(profile?.fullName?.[0] || "?").toUpperCase();

    return (
        <Screen>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.sub}>Update shop details & profile photo</Text>

            <View style={styles.avatarBlock}>
                <Pressable onPress={pickAndUpload} disabled={loading} style={styles.avatarPress}>
                    {avatarFullUrl ? (
                        <Image source={{ uri: avatarFullUrl }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarFallback}>
                            <Text style={styles.avatarLetter}>{letter}</Text>
                        </View>
                    )}
                </Pressable>

                <Pressable onPress={pickAndUpload} disabled={loading}>
                    <Text style={styles.changeText}>{loading ? "Please wait..." : "Change photo"}</Text>
                </Pressable>
            </View>

            <Text style={styles.label}>Shop name</Text>
            <TextInput
                value={shopName}
                onChangeText={setShopName}
                placeholder="Enter your shop name"
                placeholderTextColor={theme.mutedText}
                style={styles.input}
            />

            <AppButton title={loading ? "Saving..." : "Save"} onPress={saveShopName} disabled={loading} />
        </Screen>
    );
}

function makeStyles(theme) {
    return StyleSheet.create({
        title: { fontSize: 22, fontWeight: "900", color: theme.text, marginBottom: 4 },
        sub: { fontSize: 13, color: theme.subtext, marginBottom: 18 },

        avatarBlock: { alignItems: "center", marginBottom: 22 },
        avatarPress: { borderRadius: 999, overflow: "hidden" },
        avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: theme.borderSoft },
        avatarFallback: {
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: theme.borderSoft,
            alignItems: "center",
            justifyContent: "center",
        },
        avatarLetter: { fontSize: 28, fontWeight: "900", color: theme.text },
        changeText: { marginTop: 10, color: theme.primary, fontWeight: "800" },

        label: { fontSize: 13, color: theme.subtext, marginBottom: 6 },
        input: {
            borderWidth: 1,
            borderColor: theme.border,
            borderRadius: 14,
            paddingHorizontal: 14,
            paddingVertical: 12,
            marginBottom: 16,
            backgroundColor: theme.inputBg,
            color: theme.text,
        },
    });
}
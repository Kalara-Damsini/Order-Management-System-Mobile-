import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appearance } from "react-native";

const STORAGE_KEY = "app.theme.mode"; // "light" | "dark" | "system"

const lightTheme = {
    mode: "light",
    bg: "#FFFFFF",
    text: "#111827",
    subtext: "#6B7280",
    mutedText: "#9CA3AF",

    card: "#FFFFFF",
    cardSoft: "#F8FAFC",
    border: "#EEF2F6",
    borderSoft: "#F3F4F6",

    primary: "#1677FF",
    danger: "#DC2626",
    dangerBg: "#FEF2F2",
    dangerBorder: "#FECACA",

    inputBg: "#FFFFFF",
};

const darkTheme = {
    mode: "dark",
    bg: "#0B1220",
    text: "#E5E7EB",
    subtext: "#A5B4FC",
    mutedText: "#9CA3AF",

    card: "#0F172A",
    cardSoft: "#0B1730",
    border: "#1F2A44",
    borderSoft: "#22304D",

    primary: "#5AA2FF",
    danger: "#F87171",
    dangerBg: "#2A1212",
    dangerBorder: "#5B1C1C",

    inputBg: "#0F172A",
};

const ThemeContext = createContext({
    mode: "system",
    theme: lightTheme,
    changeTheme: (_mode) => { },
});

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState("system"); // default
    const [systemScheme, setSystemScheme] = useState(Appearance.getColorScheme() || "light");

    // load saved
    useEffect(() => {
        (async () => {
            try {
                const saved = await AsyncStorage.getItem(STORAGE_KEY);
                if (saved === "light" || saved === "dark" || saved === "system") {
                    setMode(saved);
                }
            } catch { }
        })();
    }, []);

    // listen system change
    useEffect(() => {
        const sub = Appearance.addChangeListener(({ colorScheme }) => {
            setSystemScheme(colorScheme || "light");
        });
        return () => sub?.remove?.();
    }, []);

    const changeTheme = async (nextMode) => {
        const m = nextMode === "light" || nextMode === "dark" ? nextMode : "system";
        setMode(m);
        try {
            await AsyncStorage.setItem(STORAGE_KEY, m);
        } catch { }
    };

    const activeScheme = mode === "system" ? systemScheme : mode;

    const theme = useMemo(() => {
        return activeScheme === "dark" ? darkTheme : lightTheme;
    }, [activeScheme]);

    const value = useMemo(() => ({ mode, theme, changeTheme }), [mode, theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    return useContext(ThemeContext);
}
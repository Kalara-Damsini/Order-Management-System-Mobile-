// src/theme/ThemeContext.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Appearance } from "react-native";
import { DarkTheme, LightTheme } from "./colors";

const ThemeContext = createContext(null);

const STORAGE_KEY = "appThemeMode"; // "light" | "dark" | "system"

function resolveTheme(mode) {
    if (mode === "system") {
        const sys = Appearance.getColorScheme() || "light";
        return sys === "dark" ? DarkTheme : LightTheme;
    }
    return mode === "dark" ? DarkTheme : LightTheme;
}

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState("system"); // default
    const [systemScheme, setSystemScheme] = useState(Appearance.getColorScheme() || "light");

    // listen system theme changes (only matters if mode === "system")
    useEffect(() => {
        const sub = Appearance.addChangeListener(({ colorScheme }) => {
            setSystemScheme(colorScheme || "light");
        });
        return () => sub?.remove?.();
    }, []);

    // load saved mode
    useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved === "light" || saved === "dark" || saved === "system") {
                setMode(saved);
            }
        })();
    }, []);

    const theme = useMemo(() => {
        if (mode === "system") {
            return systemScheme === "dark" ? DarkTheme : LightTheme;
        }
        return resolveTheme(mode);
    }, [mode, systemScheme]);

    const changeTheme = async (nextMode) => {
        const m = nextMode === "light" || nextMode === "dark" || nextMode === "system" ? nextMode : "system";
        setMode(m);
        await AsyncStorage.setItem(STORAGE_KEY, m);
    };

    const value = useMemo(() => ({ theme, mode, changeTheme }), [theme, mode]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
    return ctx;
}
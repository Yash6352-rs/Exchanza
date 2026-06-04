import { colors } from "@/app/components/theme/colors";
import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { auth, db } from "@/app/services/firebase/firebase";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: any) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>("system");

    const systemTheme = Appearance.getColorScheme();

    const resolvedTheme: ResolvedTheme = 
        themeMode === "system" ? (systemTheme as ResolvedTheme) || "light" : themeMode;

    const theme = colors[resolvedTheme];

    // Load saved theme
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const user = auth.currentUser;

                if (user) {
                    const snap = await getDoc(doc(db, "users", user.uid));

                    const pref = snap.data()?.themePreference;
                    if (pref === "light" || pref === "dark" || pref === "system") {
                        setThemeMode(pref);
                        return;
                    }
                }

                // fallback → local
                const saved = await AsyncStorage.getItem("theme");
                if (saved) setThemeMode(saved as any);

            } catch (error) {
                console.log("Theme load error", error);
            }
        };

        loadTheme();
    }, []);

    useEffect(() => {
        let unsubscribeSnap: any;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            // cleanup previous listener
            if (unsubscribeSnap) unsubscribeSnap();

            if (!user) {
                setThemeMode("system");
                return;
            }

            const userRef = doc(db, "users", user.uid);

            unsubscribeSnap = onSnapshot(userRef, (snap) => {
                const pref = snap.data()?.themePreference;

                if (pref === "light" || pref === "dark" || pref === "system") {
                    setThemeMode(pref);
                }
            });
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeSnap) unsubscribeSnap();
        };
    }, []);

    // Save theme
    const updateTheme = async (mode: ThemeMode) => {
        setThemeMode(mode);

        // local (fast UI)
        await AsyncStorage.setItem("theme", mode);

        // remote (sync across devices)
        const user = auth.currentUser;
        if (user) {
            await updateDoc(doc(db, "users", user.uid), {
                themePreference: mode,
            })
        }
    };

    return (
        <ThemeContext.Provider
            value={{
                theme, 
                themeMode, 
                setTheme: updateTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used inside ThemeProvider");
    return context;
}

import { createContext } from "react";
import { colors } from "../components/constants/colors";

export type ThemeMode =
    | "light"
    | "dark"
    | "system";

export type ThemeContextType = {
    theme: typeof colors.light;
    themeMode: ThemeMode;
    setTheme: (
        mode: ThemeMode
    ) => Promise<void>;
};

export const ThemeContext = createContext<ThemeContextType | null>( null );
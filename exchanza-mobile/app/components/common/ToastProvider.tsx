import { createContext, useContext, useState } from "react";
import AppToast from "./AppToast";
import { lightColors } from "../theme/colors";
import { useTheme } from "@/context/ThemeContext";

type ToastContextType = {
    showToast: (message: string, icon?: any, color?: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const ToastProvider = ({ children }: any) => {

    const { theme } = useTheme();

    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [icon, setIcon] = useState<any>("checkmark-circle");
    const [color, setColor] = useState(theme?.primary || lightColors.primary);

    const showToast = (msg: string, icn?: any, col?: string) => {
        setMessage(msg);
        setIcon(icn || "checkmark-circle");
        setColor(col || (theme?.primary || lightColors.primary));
        setVisible(true);
    }

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <AppToast 
                visible={visible}
                message={message}
                icon={icon}
                onHide={() => setVisible(false)}
                color={color}
            />
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error("useToast must be used inside ToastProvider");
    return context;
};
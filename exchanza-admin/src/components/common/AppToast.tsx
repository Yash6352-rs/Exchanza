import { useEffect } from "react";
import { useTheme } from "../../hooks/useTheme";
import { lightColors } from "../constants/colors";
import { IoAlertCircle, IoCheckmarkCircle, IoClose, IoInformationCircle, IoWarning } from "react-icons/io5";

type Props = {
    visible: boolean;
    message: string;
    type?: "success" | "error" | "warning" | "info";
    onHide: () => void;
}

export default function AppToast({
    visible, message, type = "success", onHide
}: Props) {
    const { theme } = useTheme();

    useEffect(() => {
        if (!visible) return;

        const timer = setTimeout(() => {
            onHide();
        }, 2500);

        return () => clearTimeout(timer);
    }, [visible]);

    if (!visible) return null;

    const getToastStyles = () => {
        switch (type) {
            case "error":
                return {
                    color: theme?.error || lightColors.error,
                    icon: <IoAlertCircle size={22} />
                };
            case "warning":
                return {
                    color: theme?.secondary || lightColors.secondary,
                    icon: <IoWarning size={22} />
                };
            case "info":
                return {
                    color: theme?.blue || lightColors.blue,
                    icon: <IoInformationCircle size={22} />
                };
            default:
                return {
                    color: theme?.success || lightColors.success,
                    icon: <IoCheckmarkCircle size={22} />
                };
        }
    };

    const styles = getToastStyles();

    return (
        <div
            className="fixed top-5 right-5 z-50 min-w-[320px] max-w-[420px] rounded-2xl px-4 py-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2"
            style={{
                backgroundColor: theme?.card || lightColors.card,
                border: `1px solid ${theme?.border || lightColors.border}`,
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            }}
        >
            {/* ICON */}
            <div style={{ color: styles.color }}>
                {styles.icon}
            </div>

            {/* TEXT */}
            <div className="flex-1">
                <p
                    className="text-sm font-medium leading-6"
                    style={{ color: theme?.text || lightColors.text }}
                >
                    {message}
                </p>
            </div>

            {/* CLOSE */}
            <button onClick={onHide}>
                <IoClose size={18} color={theme?.subText || lightColors.subText} />
            </button>
        </div>
    );
}
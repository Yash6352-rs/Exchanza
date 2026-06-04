import { useTheme } from "../../hooks/useTheme";
import { lightColors } from "../constants/colors";

type Props = {
  title: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline" | "danger";
  opacity?: number;
  type?: "button" | "submit";
};

export default function AppButton({
    title, onClick, loading, disabled, variant = "primary", opacity, type = "button"
}: Props) {
    const { theme } = useTheme();

    const isDisabled = disabled || loading;

    const getStyles = () => {
        switch (variant) {
            case "outline":
                return {
                    backgroundColor: "transparent",
                    border: `1px solid ${theme?.border || lightColors.border}`,
                    color: theme?.text || lightColors.text,
                };

            case "danger":
                return {
                    backgroundColor: theme?.error || lightColors.error,
                    border: "none",
                    color: "#fff",
                };

            default:
                return {
                    backgroundColor: theme?.buttonPrimary || lightColors.buttonPrimary,
                    border: "none",
                    color: theme?.buttonText || lightColors.buttonText,
                };
        }
    };

    const styles = getStyles();

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isDisabled}
            className={`
                w-full h-14 rounded-2xl font-semibold tracking-wide transition-all duration-200
                ${isDisabled ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.01]"}    
            `}
            style={{
                backgroundColor: styles.backgroundColor,
                border: styles.border,
                color: styles.color,
                opacity,
                boxShadow: 
                    variant === "primary"
                        ? "0 4px 12px rgba(0,0,0,0.08)"
                        : "none", 
            }}
        >
            {loading ? "Loading..." : title}
        </button>
    );
}
import { IoAlertCircleOutline } from "react-icons/io5";
import { useTheme } from "../../hooks/useTheme";
import { lightColors } from "../constants/colors";
import AppButton from "./AppButton";

type Props = {
  visible: boolean;
  title: string;
  description?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  singleButton?: boolean;
  confirmText?: string;
  icon?: React.ReactNode;
  iconColor?: string;
  variant?: "primary" | "outline" | "danger";
};

export default function AppDialog({
    visible, title, description, onCancel, onConfirm, singleButton, confirmText = "Confirm", icon, iconColor, variant = "primary",
}: Props) {
    const { theme } = useTheme();

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px5 ">
            <div
                className="w-full max-w-md rounded-3xl p-6"
                style={{
                    backgroundColor: theme?.card || lightColors.card,
                }}
            >
                <div className="flex justify-center mb-4">
                    <div
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{
                            backgroundColor: (iconColor || theme?.error || lightColors.error) + "20",
                        }}
                    >
                        {icon ||(
                            <IoAlertCircleOutline size={32} color={iconColor || theme?.error || lightColors.error} />
                        )}
                    </div>
                </div>

                <h2 className="text-2xl font-semibold text-center" style={{ color: theme?.text || lightColors.text }}>
                    {title}
                </h2>

                {description && (
                    <p
                        className="text-sm text-center mt-2 leading-6"
                        style={{ color: theme?.subText || lightColors.subText }}
                    >
                        {description}
                    </p>
                )}

                <div className="mt-6">
                    {singleButton ? (
                        <AppButton 
                            title={confirmText}
                            onClick={onConfirm}
                        />
                    ) : (
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <AppButton
                                    title="Cancel"
                                    onClick={onCancel}
                                    variant="outline"
                                />
                            </div>

                            <div className="flex-1">
                                <AppButton 
                                    title={confirmText}
                                    onClick={onConfirm}
                                    variant={variant}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
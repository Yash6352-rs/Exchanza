import { useTheme } from "../../hooks/useTheme";
import { lightColors } from "../constants/colors";

type Props = {
  fullScreen?: boolean;
  size?: number;
  color?: string;
};

export default function Loader({
    fullScreen = false, size = 40, color,
}: Props) {
    const { theme } = useTheme();

    return (
        <div
            className={`
                flex items-center justify-center ${fullScreen ? "min-h-screen" : "py-10"}    
            `}
        >
            <div
                className="rounded-full border-4 border-t-transparent animate-spin"    
                style={{
                    width: size,
                    height: size,
                    borderColor: color || theme?.primary || lightColors.primary,
                    borderTopColor: "transparent,"
                }}
            />
        </div>
    );
}
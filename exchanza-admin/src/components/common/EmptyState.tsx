import { useTheme } from "../../hooks/useTheme";
import { lightColors } from "../constants/colors";

type Props = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
};

export default function EmptyState({
    title, description, icon, className = ""
}: Props) {
    const { theme } = useTheme();

    return (
        <div
            className={`
                flex flex-col items-center justify-center px-6 py-16 text-center ${className}    
            `}
        >
            {icon && <div className="mb-4"></div>}
            
            <h2 className="text-xl font-semibold" style={{ color: theme?.text || lightColors.text }}>
                {title}
            </h2>

            {description && (
                <p 
                    className="text-sm mt-2 max-w-sm leading-6"
                    style={{ color: theme?.subText || lightColors.subText }}
                >
                    {description}
                </p>
            )}
        </div>
    );
}
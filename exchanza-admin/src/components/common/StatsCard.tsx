import type { ReactNode } from "react";
import { useTheme } from "../../hooks/useTheme";
import { lightColors } from "../constants/colors";

type Props = {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
};

export default function StatsCard({ title, value, icon, color }: Props) {

    const { theme } = useTheme();

    return (
        <div className="rounded-[28px] p-6 border shadow-sm transition-all hover:scale-[1.01]"
            style={{ 
                backgroundColor: theme.card || lightColors.card ,
                borderColor: theme.border || lightColors.border
            }}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium" style={{ color: theme.subText }}>
                        {title}
                    </p>

                    <h2 className="text-3xl font-bold mt-3" style={{ color: theme.text }}>
                        {value}
                    </h2>
                </div>

                <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: color || theme.highlight }}
                >
                    {icon}
                </div>
            </div>

        </div>
    );
}
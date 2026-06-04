import { ChevronRight } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
type Props = { 
    icon: any; 
    label: string; 
    danger?: boolean; 
    onClick?: () => void; 
    right?: React.ReactNode; 
    theme: any; 
};

export default function SettingsItem({
    icon: Icon, label, danger, onClick, right, theme,
}: Props) {

    return (

        <button 
            onClick={onClick}
            className="w-full flex items-center justify-between px-5 py-4 border-b transition-all hover:bg-slate-50"
            style={{ borderColor: theme.border }}
        >
            <div className="flex items-center gap-4">

                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" 
                    style={{ backgroundColor: danger ? "#FEF2F2" : theme.highlight }} 
                > 
                    <Icon size={20} color={ danger ? theme.error : theme.text } /> 
                </div>

                <span className="text-[15px] font-medium" style={{ color: danger ? theme.error : theme.text }}>
                    {label} 
                </span>

            </div>

            {right || (
                <ChevronRight size={18} color={theme.subText} />
            )}
            
        </button>
    );
} 
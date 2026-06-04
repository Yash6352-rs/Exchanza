import { useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
    
    const navigate = useNavigate();
    const { theme } = useTheme();

    return (
        <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-105"
            style={{
                backgroundColor: theme.card,
                border: `1px solid ${theme.border}`
            }}
        >
            <ArrowLeft size={22} color={theme.text} />
        </button>
    );
}
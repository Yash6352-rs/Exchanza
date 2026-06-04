import { useState, type CSSProperties } from "react";
import { useTheme } from "../../hooks/useTheme";
import { lightColors } from "../constants/colors";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

type Props = {
  icon?: React.ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  inputClassName?: string
};

export default function AppInput({
    icon, placeholder, value, onChange, type = "text", disabled, className = "", style, inputClassName = ""
}: Props) {

    const { theme } = useTheme();
    const [hidden, setHidden] = useState(type === "password");

    return (
        <div
            className={`flex items-center gap-3 px-4 h-14 rounded-2xl border transition-all duration-200
                focus-within:scale-[1.01] ${className}`}
            style={{
                backgroundColor: theme?.card || lightColors.card,
                borderColor: theme?.border || lightColors.border,
                ...style
            }}
        >
            {icon && (
                <div className='flex items-center justify-center'
                    style={{color: theme?.subText || lightColors.subText }}
                >
                    {icon}
                </div>
            )}

            <input 
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={disabled}
                type={type === "password"
                        ? hidden
                            ? "password"
                            : "text"
                        : type
                }
                className={`flex-1 bg-transparent outline-none text-[15px] placeholder:opacity-70 ${inputClassName}`}
                style={{ color: theme?.text || lightColors.text }}
            />

            {type === "password" && (
                <button 
                    type="button"
                    onClick={() => setHidden(!hidden)}
                    className="transition-all hover:scale-110"
                >
                    {hidden ? (
                        <IoEyeOffOutline size={20} color={theme?.subText || lightColors.subText} />
                    ): (
                        <IoEyeOutline size={20} color={theme?.subText || lightColors.subText} />
                    )}
                </button>
            )}
        </div>
    );
}
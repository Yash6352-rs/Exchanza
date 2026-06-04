import { lightColors } from "@/app/components/theme/colors";
import { useTheme } from "@/context/ThemeContext";
import { Switch, Text, View } from "react-native"

export const SettingRow = ({ label, description, value, onChange, disabled }: any) => {
    const { theme } = useTheme();
    return (
        <View className="flex-row justify-between items-center py-3">
            <View>
                <Text className='text-base font-semibold' style={{ color: disabled ? "#9CA3AF" : theme?.text || lightColors.text }}>
                    {label}
                </Text>

                <Text className="text-sm" style={{ color: disabled ? "#9CA3AF" : "#111827" }}>
                    {description}
                </Text>
            </View>

            <Switch 
                value={value}
                onValueChange={onChange}
                disabled={disabled}
            />
        </View>
    );
}
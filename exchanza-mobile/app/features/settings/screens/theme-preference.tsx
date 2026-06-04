import { Appearance, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { lightColors } from '@/app/components/theme/colors';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

const OPTIONS = [
    {
        key: "system",
        title: "System Default",
        desc: "Automatically match your device theme",
        icon: "phone-portrait-outline"
    },
    {
        key: "light",
        title: "Light Mode",
        desc: "Always use light appearance",
        icon: "sunny-outline"
    },
    {
        key: "dark",
        title: "Dark Mode",
        desc: "Always use dark appearance",
        icon: "moon-outline"
    },
]
export default function ThemePreferenceScreen() {
    const { theme, themeMode, setTheme } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

    const selected = themeMode;

  return (
    <View className="flex-1 px-6 pt-12" style={{ backgroundColor: theme?.background || lightColors.background }}
    >
       <StatusBar style={isDark ? "light" : "dark"} />

        {/* Header */}
        <View className="flex-row items-center gap-5 mb-5">
            <Pressable onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color={theme?.text || lightColors.text} />
            </Pressable>
            <Text className="font-semibold text-xl" style={{ color: theme?.text || lightColors.text }}>
                Theme Preference
            </Text>
        </View>  

        <Text className='text-sm mb-4' style={{ color: theme?.subText || lightColors.subText }}>
            Choose how Exchanza looks on your device.
        </Text>

        {/* OPTIONS */}
        {OPTIONS.map((item) => {
            const isActive = selected === item.key;

            return (
                <TouchableOpacity
                    key={item.key}
                    onPress={() => setTheme(item.key)}
                    className='rounded-2xl p-4 mb-3'
                    style={{
                        backgroundColor: theme?.card || lightColors.card,
                        borderWidth: isActive ? 1.5 : 0,
                        borderColor: isActive ? theme?.primary || lightColors.primary : "transparent",
                    }}
                >
                    <View className='flex-row items-center justify-between'>

                        {/* LEFT */}
                        <View className='flex-row items-center gap-3 flex-1'>
                            <View
                                className='w-10 h-10 rounded-full items-center justify-center'
                                style={{ backgroundColor: theme?.lightGray || lightColors.lightGray }}
                            >
                                <Ionicons name={item.icon as any} size={20} color={theme?.primary || lightColors.primary} />
                            </View>

                            <View className='flex-1'>
                                <Text className='text-[15px] font-semibold' style={{ color: theme?.text || lightColors.text }}>
                                    {item.title}
                                </Text>

                                <Text className='text-sm mt-1' style={{ color: theme?.subText || lightColors.subText }}>
                                    {item.desc}
                                </Text>
                            </View>
                        </View>

                        {/* RIGHT */}
                        {isActive && (
                            <Ionicons name='checkmark-circle' size={22} color={theme?.primary || lightColors.primary}  />
                        )}
                    </View>
                </TouchableOpacity>
            );
        })}
    </View>
  )
}

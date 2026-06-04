import { Appearance, Platform, Pressable, Text, TextInput, UIManager, View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { lightColors } from '@/app/components/theme/colors';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Section } from './SettingsScreen';
import { SettingsItem } from '../components/SettingsItem';
import { FlatList } from 'react-native-gesture-handler';
import { useTheme } from '@/context/ThemeContext';

if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const SETTINGS = [
    {
        section: "Account Center",
        data: [
            { label: "About your account", icon: "person-outline", route: "/features/settings/screens/about-account"},
            { label: "Edit Profile", icon: "create-outline", route: "/features/profile/screens/edit-profile"},
            { label: "Change Password", icon: "lock-closed-outline", route: "/features/settings/screens/change-password"},
            { label: "Account Status", icon: "shield-checkmark-outline", route: "/features/settings/screens/account-status" },
        ]
    },{
        section: "Your Preferences",
        data: [
            { label: "Theme Preferences", icon: "moon-outline", route: "/features/settings/screens/theme-preference" },
            { label: "Notifications Settings", icon: "notifications-outline", route: "/features/notifications/screens/notifications-settings" },
            { label: "Language Settings", icon: "globe-outline", route: "/settings/language" },
        ],
    },
    {
        section: "More Info",
        data: [
            { label: "About App", icon: "information-circle-outline", route: "/features/settings/screens/about-app" },
            { label: "Why Am I Seeing This?", icon: "eye-outline", route: "/features/settings/screens/why-am-i-seeing-this" },
            { label: "AI Insights", icon: "sparkles-outline", route: "/features/settings/screens/ai-insights-info" },
            { label: "Privacy Policy", icon: "document-text-outline", route: "/features/settings/screens/privacy-policy" },
            { label: "FAQs", icon: "help-circle-outline", route: "/features/settings/screens/faqs" },
        ],
    },
    {
        section: "Support",
        data: [
            { label: "Help & Support", icon: "help-buoy-outline", route: "/app/features/settings/screens/help-support" },
            { label: "Report Problem", icon: "alert-circle-outline", route: "/app/features/settings/screens/report-problem", params: "system" },
            { label: "Contact Us", icon: "mail-outline", route: "/features/settings/screens/contact-us" },
        ],
    },
    {
        section: "Others",
        data: [
            { label: "Logout", icon: "log-out-outline", route: "/app/features/settings/screens/help-support" },
            { label: "Delete Account", icon: "trash-outline", route: "/app/features/settings/screens/report-problem" },
        ],
    },
]

const SUGGESTIONS = [
    { label: "Edit Profile", icon: "create-outline", route: "/features/profile/screens/edit-profile"},
    { label: "Change Password", icon: "lock-closed-outline", route: "/features/settings/screens/change-password"},
    { label: "Notifications Settings", icon: "notifications-outline", route: "/features/notifications/screens/notifications-settings"},
    { label: "Privacy Policy", icon: "document-outline", route: "/features/settings/screens/privacy-policy" },
    { label: "Help & Support", icon: "help-buoy-outline", route: "/features/settings/screens/help-support"},
    { label: "Report Problem", icon: "alert-circle-outline", route: "/features/settings/screens/report-problem", params: "system"},
];

export default function SettingsSearchScreen() {

    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        if (!query.trim()) return [];

        const lower = query.toLowerCase();

        return SETTINGS.map((section) => {
            const filteredItems = section.data.filter((item) => 
                item.label.toLowerCase().includes(lower)
            );

            return {...section, data: filteredItems};
        }).filter((section) => section.data.length > 0);
    }, [query]);

  return (
    <View className='flex-1 px-4 pt-12' style={{ backgroundColor: theme?.background || lightColors.background }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        
        {/* Header */}
        <View className="flex-row items-center mt-1 mb-5 gap-2">
            <Pressable onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color={theme?.text || lightColors.text} />
            </Pressable>

            {/* Search Bar */}
            <View
                className='flex-1 flex-row items-center px-4 rounded-xl border'
                style={{ 
                    backgroundColor: theme?.card || lightColors.card, 
                    borderColor: theme?.border || lightColors.border 
                }}
            >
                <Ionicons name="search-outline" size={18} color={theme?.subText || lightColors.subText} />
                <TextInput 
                    placeholder='Search settings...'
                    placeholderTextColor={theme?.subText || lightColors.subText}
                    value={query}
                    onChangeText={setQuery}
                    className='ml-3 flex-1 text-base'
                />
            </View>
        </View>

            {/* SUGGESTIONS */}
            {!query && (
                <Animated.View entering={FadeInDown.duration(300)}>
                    <Section title="Quick Access" theme={theme}>
                        {SUGGESTIONS.map((item, index) => (
                            <SettingsItem
                                key={index}
                                icon={item.icon}
                                label={item.label}
                                onPress={() => {
                                    if (item.params) {
                                        router.push({
                                            pathname: item.route as any,
                                            params: { type: item.params }
                                        });
                                    } else {
                                        router.push(item.route as any);
                                    }
                                }}
                                theme={theme}
                            />
                        ))}
                    </Section>
                </Animated.View>
            )}

            {/* SEARCH RESULTS  */}
            {query && (
                <FlatList 
                    data={filtered}
                    keyExtractor={(item) => item.section}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => (
                        <Animated.View entering={FadeInDown.delay(index * 80).duration(300)}>
                            <Section title={item.section} theme={theme}>
                                {item.data.map((setting: any, i: number) => (
                                    <SettingsItem 
                                        key={i}
                                        icon={setting.icon}
                                        label={setting.label}
                                        onPress={() => {
                                            if (setting.params) {
                                                router.push({
                                                    pathname: setting.route as any,
                                                    params: { type: setting.params },
                                                })
                                            } else {
                                                router.push(setting.route as any)
                                            }
                                        }}
                                        theme={theme}
                                    />
                                ))}
                            </Section>
                        </Animated.View>
                    )}
                    ListEmptyComponent={
                        <View className='mt-10 items-center'>
                            <Ionicons name="search-outline" size={40} color={theme?.subText || lightColors.subText} />
                            <Text className='mt-3 text-sm' style={{ color: theme?.subText || lightColors.subText }}>
                                No settings found
                            </Text>
                        </View>
                    }
                />
            )}
    </View>
  )
}

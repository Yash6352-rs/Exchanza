import { Appearance, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { lightColors } from '@/app/components/theme/colors'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { SettingsItem } from '../components/SettingsItem'
import LogoutBottomSheet from './LogoutBottomSheet'
import { AppDialog } from '@/app/components/common/AppDialog'
import { deleteAccount } from '../../auth/service/user'
import { useTheme } from '@/context/ThemeContext';

export default function SettingsScreen() {
    const [showLogout, setShowLogout] = useState(false);
    const [showDelete, setShowDelete] = useState(false);

    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

  return (
    <View
        className="flex-1 px-4 pt-12"
        style={{ backgroundColor: theme?.background || lightColors.background }}
    >
        <StatusBar style={isDark ? "light" : "dark"} />
        
        {/* Header */}
        <View className="flex-row items-center gap-5 mb-5">
            <Pressable onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color={theme?.text || lightColors.text} />
            </Pressable>
            <Text  className="font-semibold text-xl" style={{ color: theme?.text || lightColors.text }}>
                Settings and Activity
            </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
            <View className='mb-5'>
                <TouchableOpacity
                    onPress={() => router.push("/features/settings/screens/SettingsSearchScreen")}
                    className='flex-row items-center px-4 py-3 rounded-xl border'    
                    style={{ 
                        backgroundColor: theme?.card || lightColors.card, 
                        borderColor: theme?.border || lightColors.border 
                    }}
                >
                    <Ionicons name="search" size={18} color={theme?.subText || lightColors.subText}/>
                    <Text className="ml-3 text-base" style={{ color: theme?.subText || lightColors.subText }} >
                        Search
                    </Text>
                </TouchableOpacity>
            </View>

            <Section title="Account Center" theme={theme}>
                <SettingsItem theme={theme} icon="person-outline" label="About your account" onPress={() => router.push("/features/settings/screens/about-account")} />
                <SettingsItem theme={theme} icon="create-outline" label="Edit Profile" onPress={() => router.push("/features/profile/screens/edit-profile")} />
                <SettingsItem theme={theme} icon="lock-closed-outline" label="Change Password" onPress={() => router.push("/features/settings/screens/change-password")} />
                <SettingsItem theme={theme} icon="shield-checkmark-outline" label="Account Status" onPress={() => router.push("/features/settings/screens/account-status")} />
            </Section>

            <Section title="Your Preferences" theme={theme}>
                <SettingsItem theme={theme} icon="moon-outline" label="Theme Preferences" onPress={() => router.push("/features/settings/screens/theme-preference")} />
                <SettingsItem theme={theme} icon="notifications-outline" label="Notification Settings" onPress={() => router.push("/features/notifications/screens/notifications-settings")} />
                <SettingsItem theme={theme} icon="globe-outline" label="Language Settings" onPress={() => router.push("/features/settings/screens/language")} />
            </Section>

            <Section title="More Info" theme={theme}>
                <SettingsItem theme={theme} icon="information-circle-outline" label="About App" onPress={() => router.push("/features/settings/screens/about-app")} />
                <SettingsItem theme={theme} icon="eye-outline" label="Why Am I Seeing This?" onPress={() => router.push("/features/settings/screens/why-am-i-seeing-this")} />
                <SettingsItem theme={theme} icon="sparkles-outline" label="AI Insights" onPress={() => router.push("/features/settings/screens/ai-insights-info")} />
                <SettingsItem theme={theme} icon="document-text-outline" label="Privacy Policy" onPress={() => router.push("/features/settings/screens/privacy-policy")} />
                <SettingsItem theme={theme} icon="help-circle-outline" label="FAQs" onPress={() => router.push("/features/settings/screens/faqs")} />
            </Section>

            <Section title="Support" theme={theme}>
                <SettingsItem theme={theme} icon="help-buoy-outline" label="Help & Support" onPress={() => router.push("/features/settings/screens/help-support")} />
                
                <SettingsItem theme={theme} icon="alert-circle-outline" label="Report Problem" 
                    onPress={() => router.push({
                        pathname: "/features/settings/screens/report-problem",
                        params: { type: "system" }
                    })} 
                />

                <SettingsItem theme={theme} icon="mail-outline" label="Contact Us" onPress={() => router.push("/features/settings/screens/contact-us")}/>
            </Section>

            <Section title="Others" theme={theme}>
                <SettingsItem theme={theme} icon="log-out-outline" label="Logout" danger onPress={() => setShowLogout(true)}/>
                <SettingsItem theme={theme} icon="trash-outline" label="Delete Account" danger onPress={() => setShowDelete(true)}/>
            </Section>

            <LogoutBottomSheet 
                visible={showLogout}
                onClose={() => setShowLogout(false)}
            />

            <AppDialog 
                visible={showDelete}
                title="Delete Account"
                description="This action is permanent. Your account and all data will be deleted."
                confirmText="Delete"
                variant="danger"
                onCancel={() => setShowDelete(false)}
                onConfirm={async () => {
                    try {
                        await deleteAccount();
                        router.replace("/features/auth/screens/welcome");
                    } catch (error: any) {
                        console.log(error);

                        if (error.code === "auth/requires-recent-login") {
                            alert("Please login again to delete account")
                        }
                    }
                }}
            />
            <View className='h-20' />
        </ScrollView>
    </View>
  );
}

export const Section = ({ title, theme, children}: any) => (
    <View className="mb-6">
        <Text className='text-sm mb-2 px-2' style={{ color: theme?.subText || lightColors.subText }}>
            {title}
        </Text>
        <View
            className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: theme?.card || lightColors.card }}
        >
            {children}
        </View>
    </View>
);


      
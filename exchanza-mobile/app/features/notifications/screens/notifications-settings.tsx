import { Appearance, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { lightColors } from '@/app/components/theme/colors';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SettingRow } from '../components/SettingRow';
import { auth } from '@/app/services/firebase/firebase';
import { clearAllNotifications, markAllNotificationsAsRead } from '../services/notificationService';
import { useNotificationSettings } from '../services/NotificationSettingsContext';
import { useTheme } from '@/context/ThemeContext';

export default function NotificationSettingsScreen() {
    const { settings, updateSetting } = useNotificationSettings();
    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

    if (!settings) return null;

  return (
    <ScrollView
      className="flex-1 px-4 pt-14"
      style={{ backgroundColor: theme?.background || lightColors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
        <StatusBar style={isDark ? "light" : "dark"} />

        {/* HEADER */}
        <View className="flex-row items-center mb-6 gap-3">
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color={theme?.text || lightColors.text} />
            </TouchableOpacity>

            <Text className="text-xl font-semibold" style={{ color: theme?.text || lightColors.text }}>
                Notification Settings
            </Text>
        </View>

        {/* MASTER TOGGLE */}
        <View className="p-4 rounded-2xl mb-4" style={{ backgroundColor: theme?.card || lightColors.card }}>

            <View className='flex-row justify-between items-center'>
                <View>
                    <Text className='text-lg font-semibold' style={{ color: theme?.text || lightColors.text }}>
                        Show Notifications
                    </Text>
                    <Text className='text-sm' style={{ color: theme?.subText || lightColors.subText }}>
                        Receive alerts in your app
                    </Text>
                </View>

                <Switch 
                    value={settings?.enabled ?? true}
                    onValueChange={(val) => updateSetting("enabled", val)}
                />
            </View>
        </View>

        {/* GENERAL SETTINGS */}
        <View className='p-4 rounded-2xl mb-4' 
            style={{ backgroundColor: theme?.card || lightColors.card,
                opacity: settings.enabled ? 1 : 0.4,
            }}    
        >
            {/* TITLE */}
            <View className="flex-row items-center gap-2 mb-3">
                <View className='w-10 h-10 items-center justify-center rounded-full' style={{ backgroundColor: theme?.primary  + "30" || lightColors.primary + "30" }}>
                    <Ionicons name="settings" size={18} color={theme?.text || lightColors.text} />
                </View>
                <Text className="text-xl font-semibold" style={{ color: theme?.text || lightColors.text }}>
                    General Settings
                </Text>
            </View>

            {/* Badge */}
            <SettingRow 
                label="Notification Badges"
                description="Show small dots on notification icon"
                value={settings.badge}
                onChange={(val: any) => updateSetting("badge", val)}
                disabled={!settings.enabled}
            />

            {/* Vibrate */}
            <SettingRow 
                label="Vibrate on Notification"
                description="Haptic feedback for alerts"
                value={settings.vibrate}
                onChange={(val: any) => updateSetting("vibrate", val)}
                disabled={!settings.enabled}
            />

            {/* Sound */}
            <SettingRow 
                label="Notification Sound"
                description="Play sound on notifications"
                value={settings.sound}
                onChange={(val: any) => updateSetting("sound", val)}
                disabled={!settings.enabled}
            />
        </View>

        {/* QUIET HOURS */}
        <View className='p-4 rounded-2xl mb-5' 
            style={{ backgroundColor: theme?.card || lightColors.card,
                opacity: settings?.enabled ? 1 : 0.4,
            }}    
        >
            {/* TITLE */}
            <View className="flex-row items-center justify-between">

                <View className="flex-row items-center gap-2">
                    <View className='w-10 h-10 items-center justify-center rounded-full' style={{ backgroundColor: theme?.purple + "20" || lightColors.purple + "20"}}>
                        <Ionicons name="moon" size={18} color={theme?.purple || lightColors.purple} />
                    </View>
                    <Text className="text-lg font-semibold" style={{ color: theme?.text || lightColors.text }}>
                        Quiet Hours
                    </Text>
                </View>

                <Switch 
                    value={settings.quietHours}
                    onValueChange={(val) => updateSetting("quietHours", val)}
                    disabled={!settings.enabled}
                />
            </View>

            <View className='p-5 mt-5 mb-1 ml-2 mr-2 rounded-3xl' style={{ backgroundColor: theme?.border + "95" || lightColors.border + "95"}}>
                <Text className='text-sm font-semibold mb-1' style={{ color: theme?.subText || lightColors.subText }}>
                    SCHEDULE
                </Text>
                <Text className='text-lg font-bold mt-1' style={{ color: theme?.darkerTealLight || lightColors.darkerTealLight }}>
                    12:00 AM - 06:00 AM
                </Text>
                <Text className='text-sm mt-1' style={{ color: theme?.subText || lightColors.subText }}>
                    Active every day
                </Text>
            </View>

        </View>

        {/* GROUP 3 */}
        <View className="p-2 rounded-2xl mb-4"
            style={{
                backgroundColor: theme?.border + "95" || lightColors.border + "95",
                opacity: settings?.enabled ? 1 : 0.4,
            }}
        >
            <TouchableOpacity
                disabled={!settings.enabled}
                className='py-3'
                onPress={async () => {
                    const user = auth.currentUser;
                    if (!user) return;
                    
                    await markAllNotificationsAsRead(user.uid);
                }}
            >
                <View className='flex-row ml-3 gap-2'>
                    <Ionicons name='checkmark-done-outline' size={20} color={theme?.primary || lightColors.primary}/>
                    <Text className='font-medium'style={{ color: theme?.darkerTealLight || lightColors.darkerTealLight }}>
                        Mark All as Read
                    </Text>
                </View>
            </TouchableOpacity>
        </View>

        <View className='p-2 rounded-2xl mb-5'
            style={{ 
                backgroundColor: theme?.card || lightColors.card,
                opacity: settings?.enabled ? 1 : 0.4,
            }}
        >

            <TouchableOpacity
                disabled={!settings.enabled}
                className='py-3'
                onPress={async () => {
                    const user = auth.currentUser;
                    if (!user) return;
                    
                    await clearAllNotifications(user.uid);
                }}
                >
                <View className='flex-row ml-3 gap-2'>
                    <Ionicons name='trash-outline' size={20} color={theme?.error || lightColors.error} />
                    <Text className='font-medium' style={{ color: theme?.error || lightColors.error }}>
                        Clear All Notifications
                    </Text>
                </View>
            </TouchableOpacity>
        </View>

    </ScrollView>
  );
}

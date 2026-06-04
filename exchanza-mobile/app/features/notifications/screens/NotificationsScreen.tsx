import { Appearance, FlatList, Pressable, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { lightColors } from '@/app/components/theme/colors';
import { NotificationItem } from '../components/NotificationItem';
import { EmptyState } from '@/app/components/common/EmptyState';
import { Loader } from '@/app/components/common/Loader';
import { StatusBar } from 'expo-status-bar';
import { auth  } from '@/app/services/firebase/firebase';
import { getUserNotifications, markAsRead } from '../services/notificationService';
import { router } from 'expo-router';
import * as Haptics from "expo-haptics";
import { useNotifications } from '../services/NotificationContext';
import { useNotificationSettings } from '../services/NotificationSettingsContext';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

const getRouteFromNotification = (type: string) => {
    switch (type) {
        case "proposal":
            return "pending";

        case "accepted":
        case "chat":
            return "active";

        case "completed":
        case "invoice":
        case "review":
            return "completed";

        case "rejected":
            return "rejected";
        
        case "admin-report":
        case "announcement":
            return "";

        default:
            return "";
    }
};

export default function NotificationsScreen() {
    const { notifications, loading } = useNotifications(); 

    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");


    const { settings } = useNotificationSettings();

    const handlePress = async (item: any) => {
        try {
            if (settings.vibrate) {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }

            // Auto mark as read
            if (!item.isRead) {
                await markAsRead(item.id);
            }

            // ADMIN REPORT
            if (item.type === "admin-report" || item.type === "announcement") {
                return;
            }

            // NORMAL TRADE ROUTING
            const tab = getRouteFromNotification(item.type);
            if (!tab) {
                return;
            }

            router.replace({
                pathname: "/(tabs)/trades",
                params: {
                    tab,
                    tradeId: item.tradeId || "",
                },
            });
        } catch (error) {
            console.log("Navigation error", error);   
        }      
    }

    if (loading) {
        return <Loader fullScreen />
    }

  return (
    <View className="flex-1 px-4 pt-12" style={{ backgroundColor: theme?.background || lightColors.background }}>
        <StatusBar style={isDark ? "light" : "dark"} />

        {/* Header */}
        <View className="flex-row justify-between items-center px-1 mb-4">
            <Text className="text-2xl font-bold " style={{ color: theme?.primary || lightColors.primary}}>
                Notifications
            </Text>

            <Pressable
                onPress={() => router.push("/features/notifications/screens/notifications-settings")}
            >
                <Ionicons name="settings-outline" size={22} color={theme?.text || lightColors.text}/>
            </Pressable>
        </View>

        <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            renderItem={({ item }) => (
                <NotificationItem 
                    notification={item}  
                    onPress={() => handlePress(item)}
                />
            )}
            ListEmptyComponent={
                <EmptyState 
                    title="No notifications yet"
                    description="When you get updates, they will appear here"
                    icon="notifications-outline"
                />
            }
        />   
    </View>
  );
}

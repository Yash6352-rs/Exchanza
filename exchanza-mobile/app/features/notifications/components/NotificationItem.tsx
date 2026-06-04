import { Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { colors, lightColors } from '@/app/components/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { deleteNotification, markAsRead } from '../services/notificationService';
import * as Haptics from "expo-haptics";
import { getTimeAgo } from '@/app/utils/time';
import { useNotificationSettings } from '../services/NotificationSettingsContext';
import { useTheme } from '@/context/ThemeContext';

type Props = {
    notification: any;
    onPress?: () => void;
};

const getIcon = (theme: typeof colors.light, type: string) => {

    switch (type) {
        case "proposal":
            return { name: "mail-outline", color: theme?.red || lightColors.red };
        case "accepted":
            return { name: "checkmark-circle-outline", color: theme?.success || lightColors.success };
        case "rejected":
            return { name: "close-circle-outline", color: theme?.error || lightColors.error };
        case "completed":
            return { name: "trophy-outline", color: theme?.secondary || lightColors.secondary };
        case "invoice":
            return { name: "document-text-outline", color: theme?.purple || lightColors.purple };
        case "review":
            return { name: "star", color: "#F59E0B" };
        case "chat":
            return { name: "chatbubble-ellipses", color: theme?.primary || lightColors.primary };
        case "admin-message":
            return { name: "shield-checkmark-outline", color: theme?.blue || lightColors.blue };
        case "announcement":
            return { name: "megaphone-outline", color: theme?.yellow || lightColors.gold };
        default:
            return { name: "notifications-outline", color: theme?.darkGray || lightColors.darkGray };
    }
};

export const NotificationItem = ({ notification, onPress }: Props) => {
    const { theme } = useTheme();

    const icon = getIcon(theme, notification.type);
    const swipeRef = React.useRef<any>(null);
    const { settings } = useNotificationSettings();

    const [expanded, setExpanded] = useState(false);

    const onMarkAsRead = async (notification: any) => {
        if (!notification.isRead) {
            if (settings.vibrate) {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            await markAsRead(notification.id);
        }
    } 

    return (
        <Swipeable 
            ref={swipeRef}
            onSwipeableOpen={async () => {
                if (settings.vibrate) {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }

                await deleteNotification(notification.id);
            }}
            renderRightActions={() => <View style={{ width: "100%" }}/>}
            overshootRight={false}
            rightThreshold={40}
            renderLeftActions={() => <View style={{ width: "100%" }}/>}
            overshootLeft={false}
            leftThreshold={40}
            enableTrackpadTwoFingerGesture   
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                className="rounded-2xl mb-3 shadow-sm"
                style={{ 
                    backgroundColor: notification.isRead ? theme?.card || lightColors.card : theme?.highlight || lightColors.highlight //"#ECFEFF"
                }}
            >
                <View className="flex-row px-4 py-2 rounded-2xl">
                
                    {/* Icon */}
                    <View className="w-10 h-10 items-center justify-center mr-1">
                        <Ionicons name={icon.name as any} size={20} color={icon.color} />
                    </View>

                    {/* {/* RIGHT CONTENT */}
                    <View className="flex-1 justify-center">

                        {/* TOP ROW */}
                        <View className="flex-row items-center justify-between">

                            {/* TITLE + TIME */}
                            <View className="flex-row items-center gap-2">
                                <Text className="font-semibold text-[15px]" style={{ color: theme?.text || lightColors.text }}>
                                    {notification.title}
                                </Text>

                                <View 
                                    className="w-1 h-1 items-center rounded-full"
                                    style={{ backgroundColor: theme?.brown || lightColors.brown}}
                                />

                                <Text className="text-xs font-normal" style={{ color: theme?.subText || lightColors.subText }}>
                                    {getTimeAgo(notification.createdAt)}
                                </Text>
                            </View>

                            {/* CHEVRON */}    
                            <TouchableOpacity onPress={() => setExpanded(prev => !prev)}>
                                <Ionicons 
                                    name={expanded ? "chevron-up-circle-outline" : "chevron-down-circle-outline"}
                                    size={22} 
                                    color={theme?.primary || lightColors.primary}
                                    />
                            </TouchableOpacity>
                        </View>
                          
                    </View>             
                </View>

                <View className="px-5 rounded-2xl -mt-1 mb-3.5 ml-10 items-start">
                    {/* EXPANDED CONTENT */}
                    {expanded && (
                        <View>
                            <Text className="text-start text-sm" style={{ color: theme?.subText || lightColors.subText }}>
                                {notification.message}
                            </Text>

                            {!notification.isRead && (
                                <TouchableOpacity onPress={() => onMarkAsRead(notification)} className="mt-4 mb-1 flex-row items-center">
                                    <Text className="text-sm font-semibold" style={{ color: theme?.primary || lightColors.primary }}>
                                        Mark as read
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}      
                </View>
          
            </TouchableOpacity>
        </Swipeable>
    );
}

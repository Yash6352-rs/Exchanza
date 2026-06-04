import { Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useBlockedCheck } from '@/hooks/useBlockedCheck';
import { useTheme } from '@/context/ThemeContext';
import { lightColors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function BlockedBanner() {
    const [hidden, setHidden] = useState(false);

    const { isBlocked } = useBlockedCheck();
    const { theme } = useTheme();

    if (!isBlocked || hidden) return null;

  return (
    <View
        className="absolute top-14 left-4 right-4 z-50 px-4 py-3 border rounded-2xl flex-row items-start"
        style={{
            backgroundColor: theme?.card  || lightColors.error + "15",
            borderWidth: 1,
            borderColor: theme?.border || lightColors.error + "30",
        }}
    >
        <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: theme?.red + "20" }}
        >
            <Ionicons name="warning-outline" size={18} color={theme?.error || lightColors.error}/>
        </View>

        <View className="flex-1">
            <Text className="font-semibold text-[15px]" style={{ color: theme?.error || lightColors.error }}>
                Account Restricted
            </Text>

            <Text className="text-sm mt-1 leading-5" style={{ color: theme?.subText || lightColors.subText }}>
                Your account currently has limited access. Some features like
                creating posts, chatting, or trading are disabled.
            </Text>

            <TouchableOpacity className="mt-1 mb-1" onPress={() => router.push("/features/settings/screens/account-status")}>
                <Text style={{ color: theme.primary}}>Learn More</Text>
            </TouchableOpacity>
         </View>

         {/* CLOSE */}
         <TouchableOpacity className="ml-2" onPress={() => setHidden(true)}>
            <Ionicons name="close" size={18} color={theme?.subText} />
         </TouchableOpacity>
    </View>
  );
}

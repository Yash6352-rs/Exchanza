import { Text, View } from 'react-native'
import React from 'react'
import { useTheme } from '@/context/ThemeContext';
import { lightColors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function BlockedNotice({
    title = "Action Restricted", 
    message = " You cannot perfrom this action because your account has been blocked by the admin",
    className = ""
}: any) {

    const { theme } = useTheme();

  return (
    <View
      className={`p-4 rounded-2xl flex-row items-start ${className}`}
      style={{
        backgroundColor: (theme?.error || lightColors.error) + "15",
        borderWidth: 1,
        borderColor: (theme?.error || lightColors.error) + "25",
      }}
    >
        <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{
            backgroundColor: (theme?.error || lightColors.error) + "20",
            }}
        >
            <Ionicons name="warning-outline" size={18} color={theme?.error || lightColors.error} />
        </View>

        <View className="flex-1">
            <Text className="font-semibold text-[15px]" style={{ color: theme?.error || lightColors.error }}>
                {title}
            </Text>

            <Text className="text-sm mt-1 leading-5" style={{ color: theme?.subText || lightColors.subText }}>
                {message}
            </Text>
      </View>
    </View>
  )
}

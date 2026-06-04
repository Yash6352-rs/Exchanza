import {Image, Text, View } from 'react-native'
import React from 'react'
import { lightColors } from '@/app/components/theme/colors'
import { useTheme } from '@/context/ThemeContext';

export default function TradeHistoryItem({ trade }: { trade: any }) {
    const { theme } = useTheme();

  return (
    <View className="flex-row px-1 py-0.5 items-center gap-3">
        {/* Avatar */}
        {trade?.otherUser?.profileImage ? (
            <Image
                source={{ uri: trade?.otherUser?.profileImage || "https://i.pravatar.cc/150", }}
                className="w-12 h-12 rounded-full"
            />
        ) : (
            <View
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: theme?.primary + "20" || lightColors.primary + "20" }}
            >
                <Text className="font-bold" style={{ color: theme?.primary || lightColors.primary }}>
                    {trade?.otherUser?.name.charAt(0) || "U"}
                </Text>
            </View>
        )}

        {/* Info */}
        <View className="flex-1">
            <Text className="text-lg" style={{ color: theme?.text || lightColors.text }}>
                {trade?.otherUser?.name || "User"}
            </Text>

            <Text className="text-sm" style={{ color: theme?.subText || lightColors.subText }}>
                Trade completed
            </Text>
        </View>

        {/* Rating */}
        {trade.rating && (
            <Text style={{ color: theme?.subText || lightColors.subText }}>
            ⭐ {trade.rating}
            </Text>
        )}
    </View>
  );
};


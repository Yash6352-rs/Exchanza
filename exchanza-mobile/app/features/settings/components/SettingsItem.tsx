import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { lightColors } from '@/app/components/theme/colors';
import { Ionicons } from '@expo/vector-icons';

export const SettingsItem = ({ icon, label, right, onPress, danger = false, theme }: any) =>  (

    <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-between px-4 py-4 border-b"
        style={{ borderColor: theme?.border || lightColors.border }}
    >
        <View className="flex-row items-center gap-3">
            <Ionicons 
                name={icon} size={20}
                color={danger 
                        ? theme?.error || lightColors.error 
                        : theme?.text || lightColors.text
                    }
            />
            <Text className="text-[15px]" style={{ 
                color: danger 
                    ? theme?.error || lightColors.error 
                    : theme?.text || lightColors.text 
                }}
            >
                {label}
            </Text>
        </View>

        {right ? (
            right
        ) : (
            <Ionicons name="chevron-forward" size={18} color={theme?.subText || lightColors.subText} />
        )}

    </TouchableOpacity>
);
 
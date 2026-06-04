import { Modal, Text, View } from 'react-native'
import React from 'react'
import { lightColors } from '../theme/colors'
import { AppButton } from './AppButton'
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from '@/context/ThemeContext';

export const AppDialog = ({visible, title, description, onCancel, onConfirm, singleButton, confirmText, icon, iconColor, variant, loading }: any) => {
  const { theme } = useTheme();

    return (
    <Modal visible={visible} transparent animationType='fade'
        onRequestClose={() => {
            if (loading) {
                onCancel?.();
            }
        }}
    >
        <View className='flex-1 bg-black/40 items-center justify-center px-6'>
            <View className='w-full rounded-2xl p-6' 
                style={{ backgroundColor: theme?.card || lightColors.card }}>

                {/* Icon placeholder */}
                <View className='items-center mb-3'>
                    <View 
                        className='w-16 h-16 rounded-full items-center justify-center'
                        style={{ backgroundColor: (iconColor || (theme?.error || lightColors.error)) + "20" }}
                    >
                        <Ionicons name={icon || "alert-circle"} size={32} color={iconColor || (theme?.error || lightColors.error) }/>
                    </View>
                </View>

                {/* Title */}
                <Text 
                    className='text-xl font-semibold text-center' 
                    style={{ color: theme?.text || lightColors.text }}
                >
                    {title}
                </Text>

                {/* Description */}
                <Text 
                    className='text-sm text-center mt-2' 
                    style={{ color: theme?.subText || lightColors.subText }}
                >
                    {description}
                </Text>

                <View className='mt-6'>
                    {singleButton ? (
                        <AppButton title={confirmText} onPress={onConfirm} loading={loading}/>
                    ): (

                    <View className='flex-row gap-3'>
                        <View className='flex-1'>
                            <AppButton title="Cancel" onPress={onCancel} variant="outline" disabled={loading}/>
                        </View>
                        <View className='flex-1'>
                            <AppButton title={confirmText} onPress={onConfirm} variant={variant} loading={loading} disabled={loading}/>
                        </View>
                    </View>
                    )}
                </View>
            </View>
        </View>
    </Modal>
  )
}

import { Modal, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { lightColors } from '@/app/components/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { logoutUser } from '../../auth/service/user';
import { router } from 'expo-router';
import { AppButton } from '@/app/components/common/AppButton';
import { useTheme } from '@/context/ThemeContext';

export default function LogoutBottomSheet({visible, onClose}: any) {
    const { theme } = useTheme();

    const handleLogout = async () => {
        try {
            await logoutUser();
            onClose();
            router.replace("/features/auth/screens/login");
        } catch (error) {
            console.log("Logout error:", error);
        }
    };

  return (
    <Modal visible={visible} transparent animationType='fade'>
        <TouchableOpacity
            activeOpacity={1}
            onPress={onClose}
            className='flex-1 bg-black/40 justify-end mb-12'
        >
            <TouchableOpacity
                activeOpacity={1}
                className='rounded-t-3xl px-5 pt-4'
                style={{ backgroundColor: theme?.card || lightColors.card }}
            >
                {/* Handle */}
                <View className='items-center mb-5'>
                    <View className='w-10 h-1.5 rounded-full bg-gray-300' />
                </View>

                {/* Icon */}
                <View className="items-center mb-3">
                    <View className="w-16 h-16 rounded-full items-center justify-center bg-red-100">
                        <Ionicons
                            name="log-out-outline"
                            size={28}
                            color={theme?.error || lightColors.error}
                        />
                    </View>
                </View>

                {/* Title */}
                <Text className="text-center text-xl font-semibold mb-2" style={{ color: theme?.text || lightColors.text }}>
                    Logout
                </Text>

                {/* Description */}
                <Text className="text-center text-base mb-5" style={{ color: theme?.subText || lightColors.subText }}>
                    Are you sure you want to logout?
                </Text>

                {/* Buttons */}
                <View className="flex-row gap-3">
                    <View className='flex-1'>
                        <AppButton title="Cancel" onPress={onClose} variant="outline"/>
                    </View>
                    <View className='flex-1'>
                        <AppButton title="Logout" onPress={handleLogout} variant="danger" />
                    </View>
                </View>
                
            </TouchableOpacity>
        </TouchableOpacity>
    </Modal>
  );
}

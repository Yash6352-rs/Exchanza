import { Appearance, Pressable, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useToast } from '@/app/components/common/ToastProvider';
import { lightColors } from '@/app/components/theme/colors';
import { auth } from '@/app/services/firebase/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AppInput } from '@/app/components/common/AppInput';
import { AppButton } from '@/app/components/common/AppButton';
import { useTheme } from '@/context/ThemeContext';

export default function ChangePasswordScreen() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast("Fill all fields", "close-circle", theme?.error || lightColors.error);
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast("Passwords do not match", "close-circle", theme?.error || lightColors.error);
            return;
        }

        try {
            setLoading(true);

            const user = auth.currentUser;
            if (!user || !user.email) {
                showToast("User not found", "close-circle", theme?.error || lightColors.error);
                return;
            }
            
            // Re-authenticate user
            const credential = EmailAuthProvider.credential(
                user.email,
                currentPassword
            );
            await reauthenticateWithCredential(user, credential);
            
            // Update password
            await updatePassword(user, newPassword);

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            showToast("Password updated successfully", "checkmark-circle", theme?.success || lightColors.success);
            router.back();

        } catch (error: any) {
            if (error.code === "auth/wrong-password") {
                showToast("Incorrect Password", "close-circle", theme?.error || lightColors.error);                
            } else if (error.code === "auth/weak-password") {
                showToast("Password should be atleast 6 characters", "close-circle", theme?.error || lightColors.error);                
            } else {
                showToast("Something went wrong", "close-circle", theme?.error || lightColors.error);                
            }  
        } finally {
            setLoading(false);
        }
    }

  return (
    <View
        className="flex-1 px-6 pt-12"
        style={{ backgroundColor: theme?.background || lightColors.background }}
    >
        <StatusBar style={isDark ? "light" : "dark"} />
        
        {/* Header */}
        <View className="flex-row items-center gap-5 mb-5">
            <Pressable onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color={theme?.text || lightColors.text} />
            </Pressable>
            <Text  className="font-semibold text-xl" style={{ color: theme?.text || lightColors.text }}>
                Back
            </Text>
        </View>

        <View 
            className='p-5 rounded-2xl'
            style={{
                backgroundColor: theme?.card || lightColors.card,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 3,
            }}    
        >

            <Text className="text-2xl font-semibold mb-2" style={{ color: theme?.text || lightColors.text }}>
                Create new password
            </Text>

            <Text className="text-sm mb-6" style={{ color: theme?.subText || lightColors.subText }}>
                Its a good idea to update your password regularly for security.
            </Text>

            {/* Inputs */}
            <View className='mb-4'>
                <Text className="text-sm font-semibold ml-1 mb-1" style={{ color: theme?.subText || lightColors.subText }}>
                    Enter Current Password
                </Text>
                <AppInput 
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry
                />
            </View>

            <View className='mb-4'>
                <Text className="text-sm font-semibold ml-1 mb-1" style={{ color: theme?.subText || lightColors.subText }}>
                    Enter New Password
                </Text>
                <AppInput 
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />
            </View>

            <View className='mb-5'>
                <Text className="text-sm font-semibold ml-1 mb-1" style={{ color: theme?.subText || lightColors.subText }}>
                    Confirm New Password
                </Text>
                <AppInput 
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>

            <AppButton 
                title="Change Password"
                onPress={handleChangePassword}
                loading={loading}
            />
        </View>

    </View>
  );
}
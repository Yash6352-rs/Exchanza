import { Appearance, Pressable, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { lightColors } from '@/app/components/theme/colors';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { useToast } from '@/app/components/common/ToastProvider';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/app/services/firebase/firebase';
import { AppInput } from '@/app/components/common/AppInput';
import { AppButton } from '@/app/components/common/AppButton';
import { useTheme } from '@/context/ThemeContext';
import BlockedNotice from '@/app/components/common/BlockedNotice';
import { useBlockedCheck } from '@/hooks/useBlockedCheck';

export default function ReportProblemScreen() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const { showToast } = useToast();
    const { type, targetId} = useLocalSearchParams();

    const { canReport } = useBlockedCheck();

    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim()) {
            showToast("Please fill all fields", "close-circle", theme?.error || lightColors.error);
            return;
        }

        try {
            setLoading(true);

            const reportRef = await addDoc(collection(db, "reports"), {
                userId: auth.currentUser?.uid || null,
                type,
                targetId: targetId || null,
                title,
                description,
                status: "open",
                createdAt: serverTimestamp(),
            });

            await addDoc(collection(db, "adminNotifications"), {
                reportId: reportRef.id,
                userId: auth.currentUser?.uid || null,
                type,                              
                message: title,
                isRead: false,
                createdAt: serverTimestamp(),
            });

            setTitle("");
            setDescription("");

            showToast("Report submitted successfully", "checkmark-circle", theme?.success || lightColors.success);
        } catch (error) {
            console.log(error);
            showToast("Something went wrong", "close-circle", theme?.error || lightColors.error);      
        } finally {
            setLoading(false);
        }
    }

    const screenTitle = 
        type === "user"
            ? "Report User"
            : type === "post"
                ? "Report post"
                : type === "trade"
                    ? "Report Trade"
                    : "Report Problem";

  return (

    <View className="flex-1 px-6 pt-12" style={{ backgroundColor: theme?.background || lightColors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View className="flex-row items-center gap-5 mb-6">
        <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={theme?.text || lightColors.text} />
        </Pressable>
          <Text  className="font-semibold text-xl" style={{ color: theme?.text || lightColors.text }}>
              {screenTitle}
          </Text>
      </View>

      {!canReport && (
            <BlockedNotice
                className="px-4 pt-3 mb-5"
                title="Report Diabled"
                message="You cannot submit reports because your account has been blocked by the admin."
            />
       )}

      <View
        className='p-5 rounded-2xl'
        style={{
            backgroundColor: theme?.card || lightColors.card,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 4,
        }}
     >
            {/* Header */}
            <Text className="text-2xl font-semibold mb-3" style={{ color: theme?.text || lightColors.text }}>
                We are here to help
            </Text>

            <Text className="text-base mb-6" style={{ color: theme?.subText || lightColors.subText }}>
                Tell us what went wrong. Admin will review it.
            </Text>

            {/* Title */}
            <View className='mb-4'>
                <Text className='text-base font-semibold mb-2' style={{ color: theme?.subText || lightColors.subText }}>
                    Title
                </Text>
                <AppInput 
                    placeholder="Short summary"
                    value={title}
                    onChangeText={setTitle}
                    editable={canReport}
                />
            </View>

            {/* Description */}
            <View className='mb-6'>
                <Text className='text-base font-semibold mb-2' style={{ color: theme?.subText || lightColors.subText }}>
                    Description
                </Text>
                <AppInput 
                    placeholder="Explain your issue..."
                    value={description}
                    editable={canReport}
                    onChangeText={setDescription}
                    classname="h-32"
                />
            </View>

            {/* Submit */}
            <AppButton 
                title="Submit Report"
                onPress={handleSubmit}
                loading={loading}
                disabled={!canReport}
            />
        </View>

    </View> 
  );
}

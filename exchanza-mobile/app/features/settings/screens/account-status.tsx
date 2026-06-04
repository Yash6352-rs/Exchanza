import { Appearance, Image, Pressable, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/app/services/firebase/firebase';
import { lightColors } from '@/app/components/theme/colors';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/context/ThemeContext';

export default function AccountStatusScreen() {
    const [userData, setUserData] = useState<any>(null);

    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

    useEffect(() => {
        const ref = doc(db, "users", auth.currentUser?.uid!);
        const unsub = onSnapshot(ref, (snap) => {
            setUserData(snap.data());
        });

        return () => unsub();
    }, []);

    if (!userData) return null;

    const isBlocked = userData?.isBlocked ?? false;

    const permissions = [
        {
            icon: "person-outline",
            label: "Can login / logout",
            allowed: true,
        },
        {
            icon: "eye-outline",
            label: "Can see posts / trades",
            allowed: true,
        },
        {
            icon: "add-outline",
            label: "Can post new posts",
            allowed: !isBlocked,
        },
        {
            icon: "checkbox-outline",
            label: "Can accept trade",
            allowed: !isBlocked,
        },
        {
            icon: "close-outline",
            label: "Can reject trade",
            allowed: !isBlocked,
        },
        {
            icon: "chatbubble-outline",
            label: "Can chat with other user",
            allowed: !isBlocked,
        },
        {
            icon: "checkmark-done-outline",
            label: "Can complete trade",
            allowed: !isBlocked,
        },
        {
            icon: "document-outline",
            label: "Download invoice",
            allowed: !isBlocked,
        },
    ]

  return (
    <View
        className="flex-1 px-6 pt-12"
        style={{ backgroundColor: theme?.background || lightColors.background }}
    >
        <StatusBar style={isDark ? "light" : "dark"} />
        
        {/* Header */}
        <View className="flex-row items-center gap-5 mb-6">
            <Pressable onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color={theme?.text || lightColors.text} />
            </Pressable>
            <Text  className="font-semibold text-xl" style={{ color: theme?.text || lightColors.text }}>
                Account Status
            </Text>
        </View>

        <View className="items-center mb-6">
            <Image source={{ uri: userData.profileImage }} className="w-28 h-28 rounded-full mb-3"/>

            <Text className="text-xl font-semibold mb-1"style={{ color: theme?.text || lightColors.text }}>
                {userData.name}
            </Text>
            <View 
                className='px-3 py-2 mt-1 rounded-3xl' 
                style={{ backgroundColor: isBlocked 
                    ? theme?.error + "25" || lightColors.error + "25" 
                    : theme?.success + "25" || lightColors.success + "25"  
                }}
            >
                <Text
                    className='text-sm font-semibold'
                    style={{ color: isBlocked 
                        ? theme?.error || lightColors.error 
                        : theme?.success || lightColors.success 
                    }}
                    >
                    STATUS: {isBlocked ? "BLOCKED" : "ACTIVE"}
                </Text>
            </View>
        </View>

        {/* INFO TEXT */}
        <Text className='text-sm mb-6 text-center' style={{ color: theme?.subText || lightColors.subText}}>
            See any actions that Exchanza has taken when your account or content does not follow our standards.
        </Text>

        {/* PERMISSIONS  */}
        <View className="rounded-2xl overflow-hidden p-4" style={{ backgroundColor: theme?.card || lightColors.card }}>
            {permissions.map((item, index) => (
                <View key={index}>
                    <View
                        className='flex-row items-center justify-between px-1 py-3'
                        style={{ borderColor: theme?.border || lightColors.border }}
                    >
                        <View className='flex-row gap-4 items-center justify-center'>
                            <Ionicons 
                                name={item.icon as any}
                                size={20}
                                color={theme?.text || lightColors.text}
                                />
                            <Text className='font-medium' style={{ color: theme?.text || lightColors.text }}>{item.label}</Text>
                        </View>

                        <Ionicons 
                            name={item.allowed ? "checkmark-circle" : "close-circle"}
                            size={20}
                            color={item.allowed 
                                ? theme?.success || lightColors.success 
                                : theme?.error || lightColors.error
                            }
                            />
                    </View>

                    {index !== permissions.length - 1 && (
                        <View className='h-[1px]' style={{ backgroundColor: theme?.border || lightColors.border }}/>
                    )}

                </View>
            ))}
        </View>
    </View>
  );
}

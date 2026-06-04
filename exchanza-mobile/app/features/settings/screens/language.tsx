import {  Appearance, Pressable, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { lightColors } from '@/app/components/theme/colors'
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function LanguageScreen() {
    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

  return (
    <View className="flex-1 px-5 pt-12" style={{ backgroundColor: theme?.background || lightColors.background }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        
        {/* Header */}
        <View className="flex-row items-center gap-3 mb-4">
            <Pressable onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color={theme?.text || lightColors.text} />
            </Pressable>
            <Text className="font-semibold text-xl" style={{ color: theme?.text || lightColors.text }}>
                Language Settings
            </Text>
        </View>

        {/* HEADER  */}
        <View className='items-center mt-3 mb-6'>
            <View 
                className='w-24 h-24 rounded-full items-center justify-center mb-5'
                style={{ backgroundColor: theme?.darkerTealLight || lightColors.darkerTealLight }}    
            >
                <Ionicons name='globe-outline' size={50} color="#fff" />
            </View>

            <Text className='text-2xl font-semibold' style={{ color: theme?.darkerTealLight || lightColors.darkerTealLight }}>
                Choose your preferred language
            </Text>

            <View className='p-2.5 justify-center'>
                <Text className='text-base text-center font-medium' style={{ color: theme?.subText || lightColors.subText }}>
                    Select the language you want to use for the app interface.
                </Text>
            </View>
        </View>            

        {/* LANGUAGE CARD */}
        <View className="rounded-2xl overflow-hidden" 
            style={{ 
                backgroundColor: theme?.card || lightColors.card,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 3,
            }}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                className='flex-row items-center justify-between px-6 py-4'
            >
                <View className='flex-row items-center gap-4'>
                    <View className='w-12 h-12 rounded-full items-center justify-center' style={{ backgroundColor: theme?.border + "90" || lightColors.border + "90" }}>
                        <Ionicons name='language-outline' size={20} color={theme?.darkerTealLight || lightColors.darkerTealLight} />
                    </View>

                    <Text className='text-xl font-medium' style={{ color: theme?.darkerTealLight || lightColors.darkerTealLight }}>
                        English
                    </Text>
                </View>

                <Ionicons name='checkmark-circle' size={30} color={theme?.darkerTealLight || lightColors.darkerTealLight} />
            </TouchableOpacity>
        </View>

         {/* NOTE */}
         <View className='flex-row gap-4 px-4 py-5 mt-5 border rounded-2xl items-center justify-center' style={{ borderColor: theme?.border || lightColors.border }}>
            <Ionicons name='information-circle-outline' size={20} color={theme?.darkerTealLight || lightColors.darkerTealLight} />
            <Text className='text-sm flex-1' style={{ color: theme?.subText || lightColors.subText }}>
                Currently, only English is available. More languages will be added soon.
            </Text>
         </View>
    </View>
  );
}

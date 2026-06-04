import { Appearance, Linking, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { darkColors, lightColors } from '@/app/components/theme/colors';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { AppButton } from '@/app/components/common/AppButton';
import { useTheme } from '@/context/ThemeContext';

export default function ContactUsScreen() {
  const openLink = (url: string) => Linking.openURL(url);
  const { theme, themeMode } = useTheme();
  const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

  return (
    <View className="flex-1 px-6 pt-12" style={{ backgroundColor: theme?.background || lightColors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View className="flex-row items-center gap-3 mb-4">
        <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={theme?.text || lightColors.text} />
        </Pressable>
        <Text className="font-semibold text-xl" style={{ color: theme?.text || lightColors.text }}>
          Back
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}    >

        <Text className="font-bold text-center" style={{ fontSize: 32, color: theme?.primary || lightColors.primary }}>
          Contact Us
        </Text>
        
        <View className='p-4 mb-2'>
          <Text className='text-base text-center font-medium' style={{ color: theme?.subText || lightColors.subText }}>
            Our Exchanza team is here to ensure your exchange experience is smooth, seamless, and effortlessly reliable.
          </Text>
        </View>

        <View className='px-0.5'>

        <View className='items-center p-5 rounded-3xl mb-3'
          style={{ 
            backgroundColor: theme?.card || lightColors.card ,
            shadowColor: "000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          {/* Icon */}
          <View className="w-24 h-24 rounded-full items-center justify-center mb-3" 
            style={{ backgroundColor: theme?.primary + "15" || lightColors.primary + "15" }}
            >
            <Ionicons name="mail-outline" size={36} color={theme?.primary || lightColors.primary} />
          </View>

          {/* Title */}
          <Text className="text-xl font-semibold mb-2 text-center" style={{ color: theme?.text || lightColors.text }}>
            Want to Contact Us
          </Text>

          {/* Email */}
          <TouchableOpacity onPress={() => openLink("mailto:yashpanchal1422004@gmail.com")}>
            <Text className='text-base underline mb-6' style={{ color: theme?.purple || lightColors.purple }}>
              yashpanchal1422004@gmail.com
            </Text>
          </TouchableOpacity>

          <View className='w-64'>
            <AppButton title="  Send Email  " onPress={() => openLink("mailto:yashpanchal1422004@gmail.com")} />
          </View>

          <Text className="text-xs font-semibold mt-6 mb-1 text-center" style={{ color: theme?.subText || lightColors.subText }}>
            RESPONSE WITHIN 24 HOURS
          </Text>

        </View>

        <TouchableOpacity activeOpacity={0.95} onPress={() => router.push("/features/settings/screens/faqs")}>
          <View className='flex-row items-center gap-4 p-5 rounded-3xl mt-5 mb-5'
            style={{ 
              backgroundColor: theme?.lightGray || lightColors.lightGray,
              shadowColor: "000",
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
            }}
            >
            <View className='flex-row items-center gap-3'>

              <View
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: isDark ? lightColors.text : darkColors.text }}
                >
                <Ionicons name="help-circle-outline" size={24} color={theme?.primary || lightColors.primary} />
              </View>

              <View className='flex-1'>
                <Text className='font-medium' style={{ color: theme?.text || lightColors.text }}>
                  FAQs
                </Text>
              <Text className='text-sm mt-1' style={{ color: theme?.subText || lightColors.subText }}>
                Browse our FAQs to get quick answers, knowledge, and guidance.
              </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={theme?.subText || lightColors.subText} />
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.95} onPress={() => router.push("/features/settings/screens/help-support")}>
          <View className='flex-row items-center gap-4 p-5 rounded-3xl mb-4'
            style={{ 
              backgroundColor: theme?.lightGray || lightColors.lightGray,
              shadowColor: "000",
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
            }}
            >
            <View className='flex-row items-center gap-3'>

              <View
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: isDark ? lightColors.text : darkColors.text }}
                >
                <Ionicons name="help-buoy-outline" size={24} color={theme?.primary || lightColors.primary} />
              </View>

              <View className='flex-1'>
                <Text className='font-medium' style={{ color: theme?.text || lightColors.text }}>
                  Help & Support
                </Text>
              <Text className='text-sm mt-1' style={{ color: theme?.subText || lightColors.subText }}>
                Browse our help & support for guidance and support
              </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color={theme?.subText || lightColors.subText} />
            </View>
          </View>
        </TouchableOpacity>

        {/* BOTTOM SOCIAL */}
        <View className='items-center mt-8 mb-4'>
          <Text className="text-sm font-semibold mb-4" style={{ color:theme?.subText ||  lightColors.subText }}>CONNECT WITH US</Text>

          <View className='flex-row gap-6 mb-2'>

            <TouchableOpacity onPress={() => openLink("mailto:yashpanchal1422004@gamil.com")}>
              <Ionicons name='mail-outline' size={36} color={theme?.primary || lightColors.primary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openLink("https://github.com/Yash6352-rs")}>
              <Ionicons name="logo-github" size={36} color={theme?.primary || lightColors.primary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => openLink("https://in.linkedin.com/in/yash6352-rs")}>
              <Ionicons name="logo-linkedin" size={36} color={theme?.primary || lightColors.primary} />
            </TouchableOpacity>

          </View>
        </View>
        </View>
      </ScrollView>
    </View> 
  );
}

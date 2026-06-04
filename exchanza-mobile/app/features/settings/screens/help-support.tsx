import { Appearance, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { darkColors, lightColors } from '@/app/components/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/context/ThemeContext';

const HelpItem = ({ icon, iconColor, backgroundColor, title, desc, onPress, theme }: any) => (
    <View className="rounded-3xl mb-4 "
        style={{ 
            backgroundColor: theme?.card || lightColors.card,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
        }}  
    >
        <TouchableOpacity onPress={onPress}
            className="px-3 py-5 flex-row items-center justify-between"
        >
            <View className="flex-row items-center gap-3 flex-1">

                <View className='w-16 h-16 items-center justify-center rounded-full' 
                    style={{ backgroundColor: backgroundColor }}
                >
                    <Ionicons name={icon} size={24} color={iconColor} />
                </View>

                <View className="flex-1">
                    <Text className="text-[15px] font-semibold" style={{ color: theme?.text || lightColors.text }}>
                            {title}
                    </Text>

                    <Text className="text-base mt-2 leading-5" style={{ color: theme?.subText || lightColors.subText }}>
                        {desc}
                    </Text> 
                </View>
            </View>

            <View className='w-6 items-center justify-center'>
                <Ionicons name="chevron-forward" size={18} color={theme?.subText || lightColors.subText}/>
            </View>

        </TouchableOpacity>
    </View>
);


export default function HelpSupportScreen() {
    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");
    
  return (
    <View className="flex-1 px-5 pt-12" style={{ backgroundColor: theme?.background || lightColors.background }}>
        <StatusBar style={isDark ? "light" : "dark"} />

        {/* Header */}
        <View className="flex-row items-center gap-5 mb-5">
            <Pressable onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color={theme?.text || lightColors.text} />
            </Pressable>
            <Text  className="font-semibold text-xl" style={{ color: theme?.text || lightColors.text }}>
                Help & Support
            </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

            {/* HEADER  */}
            <View className="items-center mt-3 mb-6">
                <View
                    className="w-24 h-24 rounded-full items-center justify-center mb-5"
                    style={{ backgroundColor: theme?.darkerTealLight || lightColors.darkerTealLight }}
                >
                    <Ionicons name="help-buoy-outline" size={50} 
                        color={ isDark ? lightColors.text : darkColors.text } 
                    />
                </View>

                <Text className="text-2xl font-semibold"style={{ color: theme?.darkerTealLight || lightColors.darkerTealLight }}>
                    Get help with your account
                </Text>

                <View className='p-2.5 mb-2 justify-center'>
                    <Text className='text-base text-center font-medium' style={{ color: theme?.subText || lightColors.subText }}>
                        Search our knowledge base or get in touch with our team for personalized support.
                    </Text>
                </View>
            </View>

            {/* ITEMS  */}
            <View className='px-0.5'>
            <HelpItem 
                icon="shield-checkmark-outline"
                iconColor={theme?.purple || lightColors.purple}
                backgroundColor={theme?.purple + "20" || lightColors.purple + "20"}
                title="Account Status"
                desc="Review your account status and restrictions"
                onPress={() => router.push("/features/settings/screens/account-status")}
                theme={theme}
            />

            <HelpItem 
                icon="alert-circle-outline"
                iconColor={theme?.red || lightColors.red}
                backgroundColor={theme?.red + "20" || lightColors.red + "20"}
                title="Report a Problem"
                desc="Report technical issues or bugs in the app"
                onPress={() => router.push("/features/settings/screens/report-problem")}
                theme={theme}
            />

            <HelpItem 
                icon="help-circle-outline"
                iconColor={theme?.success || lightColors.success}
                backgroundColor={theme?.success + "20" || lightColors.success + "20"}
                title="FAQs"
                desc="Find answers to common questions"
                onPress={() => router.push("/features/settings/screens/faqs")}
                theme={theme}
            />

            <HelpItem 
                icon="mail-outline"
                iconColor={theme?.brown || lightColors.brown}
                backgroundColor={theme?.brown + "20" || lightColors.brown + "20"}
                title="Contact Us"
                desc="Reach out to our support team directly"
                onPress={() => router.push("/features/settings/screens/contact-us")}
                theme={theme}
            />

            <HelpItem 
                icon="document-text-outline"
                iconColor={theme?.blue || lightColors.blue}
                backgroundColor={theme?.blue + "20" || lightColors.blue + "20"}
                title="Privacy & Safety"
                desc="Learn how we protect your data and privacy"
                onPress={() => router.push("/features/settings/screens/privacy-policy")}
                theme={theme}
            />

            <HelpItem 
                icon="information-circle-outline"
                iconColor={theme?.secondary || lightColors.secondary}
                backgroundColor={theme?.secondary + "20" || lightColors.secondary + "20"}
                title="About Exchanza"
                desc="Learn more about our platform and mission"
                onPress={() => router.push("/features/settings/screens/about-app")}
                theme={theme}
            />
            </View>

        </ScrollView>

        <View className='h-10'/>
    </View>
  );
}

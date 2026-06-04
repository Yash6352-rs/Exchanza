import { ScrollView, Text, TouchableOpacity, View, Pressable, Appearance } from 'react-native';
import React, { useState } from 'react'
import { darkColors, lightColors } from '@/app/components/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';

const FAQS = [
    {
        q: "How to create an account on Exchanza?",
        a: "You can sign up using your name, email, and password or quickly continue using Google authentication."
    },
    {
        q: "How do I create post?",
        a: "Go to Add (+) button from the bottom tab and fill in your post details like title, skills, and description.",
    },
    {
        q: "How to accept or reject a trade?",
        a: "Open the trade request from the Trades screen and choose Accept or Reject based on your preference.",
    },
    {
        q: "How do I completed a trade?",
        a: "Once bother users finish the exchage, click on Complete in the active trade section to finalize it.",
    },
    {
        q: "When can I start chatting?",
        a: "Chat becomes available only after a trade is accepeted. Then you can communicate in real-time.",
    },
    {
        q: "How to download the invoice?",
        a: "After completing a trade, you can download or shre the invoice directly from the trade details.",
    },
    {
        q: "How to I update my profile?",
        a: "Go to your Profile screen and tap Edit Profile to update your bio, skills, profile imgage.",
    },
    {
        q: "How can I change my password?",
        a: "Go to Settings → Change Password and update it securely using your password.",
    },
    {
        q: "How do I manage notifications?",
        a: "Open Settings and toggle notifications preferences based on your needs.",
    },
    {
        q: "What happnes if my account is blocked?",
        a: "Some features like posting or chatting may be limited. You can check details in Account Status.",
    },
];

// FAQ ITEM
const FAQItems = ({ item, index, expanded, setExpanded }: any) => {
    const isOpen = expanded === index;
    const { theme } = useTheme();

    return (
        <View className="rounded-2xl mb-4 overflow-hidden"
            style={{ 
                backgroundColor: theme?.card || lightColors.card,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 2,
            }}  
        >
            <TouchableOpacity
                onPress={() => setExpanded(isOpen ? null : index)}
                className='px-5 py-5'
            >
                <View className="flex-row p-1 items-start gap-3">
                    {/* Question */}
                    <Text
                        className="flex-1 text-[15px] font-semibold leading-5"
                        style={{ color: theme?.darkerTealLight || lightColors.darkerTealLight }}
                    >
                    {item.q}
                    </Text>

                    {/* Chevron */}
                    <Ionicons
                        name={isOpen ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={theme?.subText || lightColors.subText}
                    />
                </View>
            </TouchableOpacity>

            {/* Answer */}
            {isOpen && (
                <View className='px-5 py-4 mb-1' style={{ borderTopWidth: 1, borderColor: theme?.border || lightColors.border }}>
                    <Text className='mt-2 text-base leading-6' style={{ color: theme?.subText || lightColors.subText }}>
                        {item.a}
                    </Text>
                </View>
            )}
        </View>
    );
}

export default function FAQScreen() {
    const [expanded, setExpanded]  = useState<number | null>(null);
    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

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
    
        <ScrollView showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}    
        >

            <Text className="font-bold text-center" style={{ fontSize: 30, color: theme?.primary || lightColors.primary }}>
                Frequently Asked Questions
            </Text>
                        
            <View className='p-2.5 mb-2 justify-center'>
                <Text className='text-base text-center font-medium' style={{ color: theme?.subText || lightColors.subText }}>
                    Find answers to common questions about using Exchanza, managing trades, and your account.
                </Text>
            </View>

            {/* FAQ LIST */}
            {FAQS.map((item, index) => (
                <FAQItems 
                    key={index}
                    item={item}
                    index={index}
                    expanded={expanded}
                    setExpanded={setExpanded}    
                />
            ))}

            <LinearGradient
                colors={[theme?.primary || lightColors.primary, theme?.deepTeal || lightColors.deepTeal]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className='mt-7 mb-3 rounded-2xl overflow-hidden'
            >
                <View className='p-5 items-center'>
                    <Text className='text-xl font-semibold' style={{ color: isDark ? darkColors.text : darkColors.text }}>
                        Still need help?
                    </Text>

                    <Text className='text-base text-center mt-3 mb-4' style={{ color: isDark ? lightColors.text : darkColors.text }}>
                        Our support team is here to assist you and resolve any issues within 24 hours.
                    </Text>

                    <TouchableOpacity 
                        onPress={() => router.push("/features/settings/screens/contact-us")}
                        className='px-6 py-2.5 rounded-full items-center'
                        style={{ backgroundColor: isDark ? lightColors.text : darkColors.text }}
                    >
                        <Text className='text-base font-semibold' style={{ color: theme?.text || lightColors.text }}>
                            Contact Us                            
                        </Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <View className='h-10' />

        </ScrollView>
    </View>
  );
}

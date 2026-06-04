import { Text, View, Pressable, TouchableOpacity, Appearance } from 'react-native';
import React from 'react'
import { darkColors, lightColors } from '@/app/components/theme/colors'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';

const PolicyCard = ({ icon, title, desc, theme, isDark }: any) => (
    <View className="flex-row gap-4 p-4 rounded-2xl mb-5" 
        style={{ 
            backgroundColor: theme?.card || lightColors.card,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 3,
        }}
    >

        <View className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: theme?.darkerTealLight || lightColors.darkerTealLight }}
        >
            <Ionicons name={icon} size={20} color={ isDark ? lightColors.text : darkColors.text } />
        </View>

        <View className="flex-1">
            <Text className="font-semibold" style={{ color: theme?.text || lightColors.text }}>
                {title}
            </Text>

            <Text className="text-sm mt-1 leading-5" style={{ color: theme?.subText || lightColors.subText }}>
                {desc}
            </Text>
        </View>
    </View>
);

export default function PrivacyPolicyScreen() {
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
              Back
            </Text>
        </View>

        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
        >

            <Text className="font-bold text-center" style={{ fontSize: 32, color: theme?.primary || lightColors.primary }}>
                Privacy Policy
            </Text>
            
            <View className='p-2.5 mb-2 justify-center'>
                <Text className='text-base text-center font-medium mb-3' style={{ color: theme?.subText || lightColors.subText }}>
                    Our Exchanza team is committed to protecting your data and ensuring your experience remains safe, secure, and trustworthy.
                </Text>

                <View className='self-center px-4 py-1 rounded-full mb-2' style={{ backgroundColor: theme?.lightPurple || lightColors.lightPurple}}>
                    <Text className="text-sm font-semibold tracking-wider" style={{ color: theme?.purple || lightColors.purple }}>
                        Last Update: 30 April 2026
                    </Text>
                </View>
            </View>

            <View className='px-0.5'>
            {/* POLICIES  */}
            <PolicyCard 
                icon="person-outline"
                title="User Information"
                desc="We collect basic details like your name, email, skills, and profile data to create and manage your account."
                theme={theme}
                isDark={isDark}
            />

            <PolicyCard 
                icon="lock-closed-outline"
                title="Data Security"
                desc="Your data is securely stored using Firebase infrasturcture and protect against unauthorized access."
                theme={theme}
                isDark={isDark}
            />

            <PolicyCard 
                icon="chatbubble-outline"
                title="Messages & Chats"
                desc="Messages exchanged during trade are stored to enable real-time communication between users."
                theme={theme}
                isDark={isDark}
            />

            <PolicyCard 
                icon="swap-horizontal-outline"
                title="Trades & Activity"
                desc=" We store trade activity, proposals, and interactions to ensure transparency and smooth exchanges."
                theme={theme}
            />

            <PolicyCard 
                icon="star-outline"
                title="Ratings & Reviews"
                desc="Your reviews and rating help build trust and improves the quality of the Exchanza community."
                theme={theme}
                isDark={isDark}
            />

            <PolicyCard 
                icon="notifications-outline"
                title="Notifications"
                desc="We send notifications related to trades, chats, and updates to enhance your experience."
                theme={theme}
                isDark={isDark}
            />

            <PolicyCard 
                icon="analytics-outline"
                title="Usage Analytics"
                desc="We may analyze usage trends to improve app perfromance and inroduce better features."
                theme={theme}
                isDark={isDark}
            />

            <PolicyCard 
                icon="share-social-outline"
                title="Data Sharing"
                desc="We do not sell your personal data. Information is only shared when necessary for app functionality."
                theme={theme}
                isDark={isDark}
            />

            <PolicyCard 
                icon="trash-outline"
                title="Account Deletion"
                desc="You can delete your account anytime. Your data will be removed from our system accordingly."
                theme={theme}
                isDark={isDark}
            />

            <PolicyCard 
                icon="refresh-outline"
                title="Policy Updates"
                desc="We may update this policy from time to time. Continued use means you accept the latest version."
                theme={theme}
                isDark={isDark}
            />
            </View>

            <LinearGradient 
                colors={[theme?.primary || lightColors.primary, theme?.deepTeal || lightColors.deepTeal]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="mt-7 mb-3 rounded-3xl overflow-hidden"
            >
                <View className="p-5">
                    
                    <Text className="text-xl font-semibold" style={{ color: isDark ? lightColors.text : darkColors.text }}>
                        Have questions about your data?
                    </Text>
                    
                    <Text
                        className="text-base mt-3 mb-4"
                        style={{ color: isDark ? lightColors.text : darkColors.text }}
                        >
                        Our privacy team is ready to help you understand how your information is handled and protected.
                    </Text>

                    <TouchableOpacity
                        onPress={() => router.push("/features/settings/screens/contact-us")}
                        className="px-6 py-2.5 rounded-full self-start"
                        style={{ backgroundColor: isDark ? lightColors.text : darkColors.text }}
                    >
                        <Text className="text-base font-semibold" style={{ color: theme?.primary || lightColors.primary }}>
                            Contact Us
                        </Text>
                    </TouchableOpacity>

                </View>
            </LinearGradient>

        </ScrollView>
    </View>
  );
}

 

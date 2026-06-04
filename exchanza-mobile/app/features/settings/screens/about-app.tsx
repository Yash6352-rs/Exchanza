import { darkColors, lightColors } from "@/app/components/theme/colors";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
    Appearance,
    Image,
    Pressable,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AboutApp() {
  const { theme, themeMode } = useTheme();
  const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");
  
  return (
    <View
      className="flex-1 px-6 pt-12"
      style={{ backgroundColor: theme?.background || lightColors.background }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />
      
      {/* Header */}
      <View className="flex-row items-center gap-5 mb-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={theme?.text || lightColors.text} />
        </Pressable>
        <Text
          className="font-semibold text-xl"
          style={{ color: theme?.text || lightColors.text }}
        >
          About App
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        className="px-1"
      >
        <View className="items-center mb-6">
          <View className="relative">
            <View className="items-center justify-center">
              <Image
                source={require("../../../../assets/images/exchanza_logo.png")}
                style={{ width: 120, height: 120, marginBottom: 12 }}
              />
            </View>

            <View
              className="absolute bottom-3 -right-3 px-3 py-1 rounded-full"
              style={{ backgroundColor: theme?.purple || lightColors.purple }}
            >
              <Text className="text-xs text-white">v 1.0.0</Text>
            </View>
          </View>

          <Text
            className="text-xl font-bold mt-2"
            style={{ color: theme?.primary || lightColors.primary }}
          >
            EXCHANZA
          </Text>

          <Text
            className="text-base text-center mt-1"
            style={{ color: theme?.text || lightColors.text }}
          >
            Your Skills, Your Currency.
          </Text>
        </View>

        <View
          className="rounded-3xl p-7 mb-8"
          style={{
            backgroundColor: theme?.card || lightColors.card,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          <View className="flex-row justify-between items-center mb-4">
            <Text
              className="text-2xl font-semibold"
              style={{ color: theme?.darkerTeal || lightColors.darkerTeal }}
            >
              Our Mission
            </Text>
            <Ionicons
              name="sparkles-outline"
              size={20}
              color={theme?.purple || lightColors.purple}
            />
          </View>

          <Text
            className="text-lg font-medium"
            style={{ color: theme?.subText || lightColors.subText, lineHeight: 23 }}
          >
            We are building a platform where skills arent just share, but{" "}
            <Text style={{ color: theme?.primary || lightColors.primary }}>
              exchanged with purpose.{" "}
            </Text>
            {"  "}
            Exchanza connects people through real value, enabling learning,
            collaboration, and growth in a trusted community.
          </Text>

          {/* Divider */}
          <View
            className="h-[1px] my-4"
            style={{ backgroundColor: theme?.border || lightColors.border }}
          />

          {/* Bottom Row */}
          <View className="flex-row items-center gap-3">
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: theme?.lightGray || lightColors.lightGray }}
            >
              <Ionicons
                name="people-circle-outline"
                size={24}
                color={theme?.primary || lightColors.primary}
              />
            </View>

            <View>
              <Text className="font-medium" style={{ color: theme?.text || lightColors.text }}>
                Trusted Community
              </Text>
              <Text
                className="text-xs mt-0.5"
                style={{ color: theme?.subText || lightColors.subText }}
              >
                Verified users building meaningfull skill{"\n"}
                exchanges
              </Text>
            </View>
          </View>
        </View>

        {/* WHAT YOU CAN DO */}
        <Text
          className="text-lg font-semibold mb-5"
          style={{ color: theme?.text || lightColors.text }}
        >
          What you can do
        </Text>

        {[
          {
            icon: "analytics-outline",
            iconColor: theme?.purple || lightColors.purple,
            backgroundColor: theme?.purple + "20" || lightColors.purple + "20",
            title: "Discover Skills",
            desc: "Explore posts based on your interests.\nFind skills using tags and smart search.",
          },
          {
            icon: "add-circle-outline",
            iconColor: theme?.red || lightColors.red,
            backgroundColor: theme?.red + "20" || lightColors.red + "20",
            title: "Create Offers & Requests",
            desc: "Post what you can offer or need.\nConnect with the right people instantly.",
          },
          {
            icon: "sync-outline",
            iconColor: theme?.success || lightColors.success,
            backgroundColor: theme?.success + "20" || lightColors.success + "20",
            title: "Mutual Growth",
            desc: "Exchange your skills with others.\nLearn through real collaborations.",
          },
          {
            icon: "git-network-outline",
            iconColor: theme?.brown || lightColors.brown,
            backgroundColor: theme?.brown + " 0" || lightColors.brown + "20",
            title: "Build Networks",
            desc: "Connect with skilled people worldwide.\nGrow through meaningful exchanges.",
          },
          {
            icon: "chatbubble-ellipses-outline",
            iconColor: theme?.blue || lightColors.blue,
            backgroundColor: theme?.blue + "20" || lightColors.blue + "20",
            title: "Real-Time Chat",
            desc: "Chat after trade acceptance.\nCollaborate and finalize details easily.",
          },
          {
            icon: "ribbon-outline",
            iconColor: theme?.secondary || lightColors.secondary,
            backgroundColor: theme?.blsecondaryue + "20" || lightColors.secondary + "20",
            title: "Verified Ratings",
            desc: "Earn ratings after each trade.\nBuild trust and credibility.",
          },
        ].map((item, index) => (
          <View
            key={index}
            className="flex-row items-center gap-4 p-5 rounded-3xl mb-4"
            style={{
              backgroundColor: theme?.card || lightColors.card,
              shadowColor: "000",
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 3,
            }}
          >
            <View
              className="w-12 h-14 rounded-full items-center justify-center"
              style={{ backgroundColor: item.backgroundColor }}
            >
              <Ionicons
                name={item.icon as any}
                size={22}
                color={item.iconColor}
              />
            </View>

            <View className="flex-1">
              <Text className="font-medium" style={{ color: theme?.subText || lightColors.text }}>
                {item.title}
              </Text>
              <Text
                className="text-sm mt-1"
                style={{ color: theme?.subText || lightColors.subText }}
              >
                {item.desc}
              </Text>
            </View>
          </View>
        ))}

        {/* COMMUNITY CARD */}
        <View
          className="rounded-3xl p-6 mt-4 mb-16"
          style={{ backgroundColor: theme?.primary || lightColors.primary }}
        >
          <Text className="text-lg font-bold text-center mb-2" style={{ color: isDark ? lightColors.text : darkColors.text }}>
            COMMUNITY NETWORK
          </Text>
          <Text className="text-center italic" style={{ color: isDark ? lightColors.text : darkColors.text}}>
            Connecting minds, one exchange at a time.
          </Text>
        </View>

        {/* LINK */}
        <View className="items-center gap-3 mb-8">
          <View className="flex-row items-center gap-6">
            <TouchableOpacity
              onPress={() =>
                router.push("/features/settings/screens/privacy-policy")
              }
            >
              <Text className="text-sm" style={{ color: theme?.primary || lightColors.primary }}>
                Privacy Policy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                router.push("/features/settings/screens/help-support")
              }
            >
              <Text className="text-sm" style={{ color: theme?.primary || lightColors.primary }}>
                Help & Support
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/features/settings/screens/contact-us")}
          >
            <Text className="text-sm" style={{ color: theme?.primary || lightColors.primary }}>
              Contact Us
            </Text>
          </TouchableOpacity>
        </View>

        {/* IMAGE PREVIEW */}
        {/* <View className='items-center'>
                <Image 
                    source={require("../../../../assets/images/exchanza_get_started_1.png")}
                    style={{ width: 325, height: 450 }}
                />
            </View> */}

        {/* FOOTER  */}
        <Text
          className="text-center text-xs"
          style={{ color: theme?.subText || lightColors.subText }}
        >
          © 2026 Exchanza
        </Text>

        <View className="h-16" />
      </ScrollView>
    </View>
  );
}

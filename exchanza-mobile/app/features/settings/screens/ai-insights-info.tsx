import React from "react";
import { Appearance, Pressable, ScrollView, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { darkColors, lightColors } from "@/app/components/theme/colors";
import { useTheme } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const InfoCard = ({
    icon, iconBg, iconColor, title, description, theme,
}: any) => (

  <View className="rounded-[28px] p-6 mb-4"
    style={{ backgroundColor: theme?.card || lightColors.card }}
  >
    <View className="flex-row">
      <View
        className="w-14 h-14 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: iconBg }}
      >
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>

      <View className="flex-1">
        <Text className="text-xl font-bold mb-2" style={{ color: theme?.text || lightColors.text }}>
          {title}
        </Text>

        <Text className="text-base leading-7" style={{ color: theme?.subText || lightColors.subText }}>
          {description}
        </Text>
      </View>
    </View>
  </View>
);

const helpfulItems = [
    {
        icon: "git-compare-outline",
        text: "Comparing multiple trade proposals",
    },
    {
        icon: "document-text-outline",
        text: "Reviewing long trade descriptions",
    },
    {
        icon: "compass-outline",
        text: "Evaluating unfamiliar offers",
    },
    {
        icon: "people-outline",
        text: "Choosing between several users",
    },
    {
        icon: "shield-checkmark-outline",
        text: "Getting a quick second opinion",
    },
];

export default function AIInsightsScreen() {

    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

    return (

        <View className="flex-1 px-6 pt-12" style={{ backgroundColor: theme?.background || lightColors.background }}>
            <StatusBar style={isDark ? "light" : "dark"} />

            {/* Header */}
            <View className="flex-row items-center gap-5 mb-5">
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color={theme?.text || lightColors.text} />
                </Pressable>
                <Text  className="font-semibold text-xl" style={{ color: theme?.text || lightColors.text }}>
                    AI Insights
                </Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ paddingBottom: 20}}
            >

                {/* Intro */}
                <LinearGradient
                    colors={[theme?.primary || lightColors.primary, theme?.deepTeal || lightColors.deepTeal]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        borderRadius: 28,
                        padding: 20,
                        marginBottom: 20,
                        overflow: "hidden",
                    }}
                >
                    <Text style={{ color: "#fff", fontSize: 30, fontWeight: "800", marginBottom: 12 }}>
                        AI Trade Insights
                    </Text>

                    <Text
                        style={{color: "rgba(255,255,255,0.85)",
                            fontSize: 15,
                            lineHeight: 28,
                            maxWidth: "85%",
                        }}
                    >
                        AI Insights help you evaluate trade proposals before accepting or rejecting
                        them. Analysis is generated from the trade offer, request, and post
                        information.
                    </Text>

                    <Ionicons
                        name="sparkles-outline"
                        size={120}
                        color={"rgba(255,255,255,0.08)"}
                        style={{ position: "absolute", right: -10, bottom: -10, }}
                    />
                </LinearGradient>

                <InfoCard
                    theme={theme}
                    icon="scale-outline"
                    iconBg={theme.purple + "20" || lightColors.purple + "20"}
                    iconColor={theme.purple || lightColors.purple + "20"}
                    title="Fairness Analysis"
                    description="AI compares what is being offered and requested to estimate whether the trade appears balanced, reasonable, or potentially one-sided."
                />

                <InfoCard
                    theme={theme}
                    icon="shield-outline"
                    iconBg={theme.red + "20" || lightColors.red + "20"}
                    iconColor={theme.red || lightColors.red + "20"}
                    title="Risk Analysis"
                    description="AI looks for unclear requests, unrealistic expectations, missing details, or possible concerns that may affect the trade."
                />

                <InfoCard
                    theme={theme}
                    icon="sparkles-outline"
                    iconBg={theme.yellow + "20" || lightColors.yellow + "20"}
                    iconColor={theme.yellow || lightColors.yellow + "20"}
                    title="Additional Insights"
                    description="AI may provide extra suggestions, observations, or considerations that could help you make a better trade decision."
                />

            
                <View className="rounded-[28px] p-5 mb-5"
                    style={{ backgroundColor: theme?.card || lightColors.card }}
                >
                    <View className="flex-row items-center mb-5">
                        <Ionicons
                            name="help-circle-outline"
                            size={22}
                            color={theme?.primary || lightColors.primary}
                        />

                        <Text
                            className="text-xl font-bold ml-2"
                            style={{ color: theme?.primary || lightColors.primary }}
                        >
                            When Is It Most Helpful?
                        </Text>
                    </View>

                    {helpfulItems.map((item, index) => (
                    <View
                        key={index}
                        className="flex-row items-center px-4 py-4 rounded-full mb-3"
                        style={{
                            backgroundColor: theme?.background || lightColors.background,
                        }}
                    >
                        <Ionicons
                            name={item.icon as any}
                            size={18}
                            color="#4F46E5"
                        />

                        <Text
                            className="ml-4 flex-1 text-sm"
                            style={{ color: theme?.text || lightColors.text }}
                        >
                            {item.text}
                        </Text>
                    </View>
                ))}
                </View>

                <View
                    className="rounded-[28px] p-5 mb-5"
                    style={{
                        backgroundColor: theme?.card || lightColors.card,
                        borderLeftWidth: 4,
                        borderLeftColor: theme.darkerTealLight || lightColors.primary,
                    }}
                >
                    <View className="flex-row items-center mb-3">
                        <Ionicons
                            name="information-circle-outline"
                            size={22}
                            color={theme?.text || lightColors.text}
                        />

                        <Text
                            className="ml-2 text-xl font-semibold"
                            style={{ color: theme?.text || lightColors.text }}
                        >
                        Important Notice
                        </Text>
                    </View>

                    <Text
                        style={{
                            color: theme?.subText || lightColors.subText,
                            fontSize: 15,
                            lineHeight: 28,
                            fontStyle: "italic",
                        }}
                    >
                        AI Insights are informational only. They should not be treated as the
                        final decision. Always review trade details carefully and communicate
                        with the other user when necessary.
                    </Text>
                </View>

                <LinearGradient
                    colors={["#6366F1", "#4F46E5"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        borderRadius: 28,
                        padding: 20,
                        marginBottom: 30,
                    }}
                >
                <View className="flex-row items-center">
                    <View
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            backgroundColor: "rgba(255,255,255,0.15)",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Ionicons name="bulb-outline" size={24} color="#fff"/>
                    </View>

                    <View className="flex-1 ml-4">
                        <Text
                            style={{
                                color: darkColors.text || lightColors.text,
                                fontWeight: "700",
                                fontSize: 12,
                                letterSpacing: 1,
                                marginBottom: 5,
                            }}
                        >
                            PRO TIP
                        </Text>

                    <Text
                        style={{
                            color: darkColors.text,
                            fontSize: 16,
                            fontWeight: "600",
                            lineHeight: 24,
                        }}
                    >
                        Use AI Insights as a second opinion, not as the final decision maker.
                    </Text>
                    </View>
                </View>
                </LinearGradient>

            </ScrollView>
            
        </View>
    );
}

// style={{ color: isDark ? lightColors.text : darkColors.text }}

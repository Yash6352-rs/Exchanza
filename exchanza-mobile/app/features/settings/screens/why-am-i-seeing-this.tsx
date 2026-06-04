import { darkColors, lightColors } from "@/app/components/theme/colors";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Appearance, Pressable, ScrollView, Text, View } from "react-native";

export default function WhyAmISeeingThisScreen() {

    const { type } = useLocalSearchParams();
    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

    const title = type === "trade"
        ? "Why Am I Seeing This Trade?"
        : type === "post"
            ? "Why Am I seeing This Post?"
            : "Why Am I Seeing This?"

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
                    Why Am I Seeing This?
                </Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            >
                {/* HERO */}
                <View
                    className="rounded-[32px] overflow-hidden p-7 mb-6"
                    style={{
                        backgroundColor: theme?.darkerTeal || lightColors.primary,
                        minHeight: 220,
                    }}
                >
                    <View
                        className="w-16 h-16 rounded-2xl items-center justify-center mb-6"
                        style={{backgroundColor: theme?.primary + "20" || lightColors.primary + "20" }}
                    >
                        <Ionicons
                            name="eye-outline"
                            size={30}
                            color="white"
                        />
                    </View>

                    <Text className="text-3xl font-bold mb-4" style={{ color: "white" }}>
                        Transparency first.
                    </Text>

                    <Text
                        className="text-lg leading-8"
                        style={{
                            color: "rgba(255,255,255,0.92)",
                        }}
                    >
                        Exchanza helps you discover exchange opportunities,
                        connect with community members, and make informed
                        trading decisions.
                    </Text>
                </View>

                {/* CARD 1 */}
                <InfoCard
                    icon="phone-portrait-outline"
                    title="You Are Using Exchanza"
                    description="You downloaded and signed in to Exchanza. As a member of the community, you can browse posts, discover opportunities, connect with users, and participate in trades."
                />

                {/* CARD 2 */}
                <InfoCard
                    icon="people-outline"
                    title="Community Marketplace"
                    description="Public posts and trade activities are visible to community members so users can find relevant exchange opportunities and interact safely."
                />

                {/* CARD 3 */}
                <InfoCard
                    icon="compass-outline"
                    title="Why This Content?"
                    description="This content may appear because it is active, publicly available, related to your activity, part of marketplace listings, or useful for exploring opportunities."
                />

                {/* CARD 4 */}
                <InfoCard
                    icon="swap-horizontal-outline"
                    title="How It Helps"
                    description="Viewing different posts and trades allows you to compare offers, discover better opportunities, connect with users, and make smarter trading decisions."
                />

                {/* CARD 5 */}
                <InfoCard
                    icon="shield-checkmark-outline"
                    title="Privacy & Transparency"
                    description="Exchanza does not sell your personal information. Content visibility depends on marketplace settings, user activity, and community participation."
                />

                {/* CARD 6 */}
                <InfoCard
                    icon="earth-outline"
                    title="Community Driven"
                    description="Exchanza is powered by users who create posts, send trade proposals, and participate in exchanges. The more active the community becomes, the more opportunities become available for everyone."
                />

                {/* GOOD TO KNOW */}
                <View
                    className="rounded-[28px] p-6 mt-2 mb-6"
                    style={{
                        backgroundColor: theme?.card || lightColors.card,
                        borderLeftWidth: 4,
                        borderLeftColor: theme?.primary || lightColors.primary,
                    }}
                >
                    <View className="flex-row items-center mb-4">
                        <Ionicons
                            name="bulb-outline"
                            size={24}
                            color={theme?.text || lightColors.text}
                        />

                        <Text
                            className="text-2xl font-bold ml-3"
                            style={{ color: theme?.text || lightColors.text }}
                        >
                            Good To Know
                        </Text>
                    </View>

                    <Text
                        className="text-lg italic leading-8"
                        style={{ color: theme?.subText || lightColors.subText }}
                    >
                        Seeing content does not mean you are required
                        to interact with it. Explore freely, compare
                        options, and choose opportunities that are
                        right for you.
                    </Text>
                </View>

                {/* PRO TIP */}
                <View
                    className="rounded-[28px] p-6"
                    style={{
                        backgroundColor: "#5B52F7",
                    }}
                >
                    <View className="flex-row items-center mb-3">
                        <View
                            className="w-12 h-12 rounded-full items-center justify-center"
                            style={{
                                backgroundColor: "rgba(255,255,255,0.15)",
                            }}
                        >
                            <Ionicons
                                name="bulb-outline"
                                size={22}
                                color="white"
                            />
                        </View>

                        <Text
                            className="text-xl font-bold ml-3"
                            style={{ color: "white" }}
                        >
                            PRO TIP
                        </Text>
                    </View>

                    <Text
                        className="text-lg leading-7"
                        style={{
                            color: "rgba(255,255,255,0.95)",
                        }}
                    >
                        Explore multiple posts and trade proposals
                        before making a final decision. Comparing
                        options often leads to better exchanges.
                    </Text>
                </View>

            </ScrollView>
        </View>
    );

    function InfoCard({
        icon,
        title,
        description,
    }: {
        icon: any;
        title: string;
        description: string;
    }) {
        return (
            <View
                className="rounded-[28px] p-5 mb-5"
                style={{ backgroundColor: theme?.card || lightColors.card }}
            >
                <View className="flex-row">
                    <View
                        className="w-14 h-14 rounded-full items-center justify-center"
                        style={{
                            backgroundColor: theme?.primary || lightColors.primary + "15",
                        }}
                    >
                        <Ionicons
                            name={icon}
                            size={24}
                            color={isDark ? lightColors.text : darkColors.text }
                        />
                    </View>

                    <View className="flex-1 ml-4">
                        <Text
                            className="text-xl font-bold mb-2"
                            style={{ color: theme?.text || lightColors.text }}
                        >
                            {title}
                        </Text>

                        <Text
                            className="text-base leading-7"
                            style={{ color: theme?.subText || lightColors.subText }}
                        >
                            {description}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}
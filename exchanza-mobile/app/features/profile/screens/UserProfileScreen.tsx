
import { EmptyState } from "@/app/components/common/EmptyState";
import { lightColors } from "@/app/components/theme/colors";
import { db } from "@/app/services/firebase/firebase";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Appearance, Image, LayoutAnimation, Platform, Pressable, ScrollView, Text, TouchableOpacity, UIManager, View } from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import PostCard from "../../posts/components/PostCard";
import TradeHistoryItem from "../components/tradeHistoryItem";
import { subscribeToUserPosts, subscribeToUserTrades } from "../services/profileService";
import ProfileSkeleton from "../components/ProfileSkeleton";
import { useTheme } from "@/context/ThemeContext";
import BlockedNotice from "@/app/components/common/BlockedNotice";
import AppActionMenu from "../../posts/components/AppActionMenu";
import { useBlockedCheck } from "@/hooks/useBlockedCheck";
import { useToast } from "@/app/components/common/ToastProvider";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showAllTrades, setShowAllTrades] = useState(false);

  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [completedTrades, setCompletedTrades] = useState<any[]>([]);
  const [stats, setStats] = useState({ posts: 0, trades: 0 });

  const scale = useSharedValue(1);
  const { showToast } = useToast();
  const { canReport } = useBlockedCheck();

  const { theme, themeMode } = useTheme();
  const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

  const animatedAvatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const visibleTrades = showAllTrades
    ? completedTrades
    : completedTrades.slice(0, 5);

  const getMenuOptions = () => {
    if (!user) return [];

    return [
        {
          label: "Why am I seeing this?",
          onPress: () => alert("Based on your interests")
        },
        {
          label: "Report User",
          onPress: () => {
            if (!canReport) {
              showToast("Your account cannot report user", "alert-circle", theme?.error || lightColors.error);
              return;
            }
            router.push({
              pathname: "/features/settings/screens/report-problem",
              params: { type: "user", targetId: user.id }
            });
          },
          danger: true,
        },
    ];
  }

  useEffect(() => {
    if (!userId) return;
    setLoading(true);

    let unsubUser: any;
    let unsubPosts: any;
    let unsubTrades: any;

    const init = async () => {
      try {
        // USER
        unsubUser = onSnapshot(doc(db, "users", userId as string), (snap) => {
          if (snap.exists()) {
            setUser({ id: snap.id, ...snap.data() });

            setTimeout(() => {
              setShowSkeleton(false);
            }, 1000);
          }
        });

        // POSTS
        unsubPosts = subscribeToUserPosts(userId as string, (posts) => {
          const active = posts.filter(
            (p: any) => p.status === "open" || p.status === "in-progress",
          );
          setUserPosts(active);

          setStats((prev) => ({
            ...prev,
            posts: posts.length,
          }));
        });

        // TRADES
        unsubTrades = subscribeToUserTrades(userId as string, (trades) => {
          const completed = trades.filter((t: any) => t.status === "completed");
          setCompletedTrades(completed);

          setStats((prev) => ({
            ...prev,
            trades: completed.length,
          }));

          setLoading(false);
        });
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    init();

    return () => {
      unsubUser && unsubUser();
      unsubPosts && unsubPosts();
      unsubTrades && unsubTrades();
    };
  }, [userId]);

  if (showSkeleton) return <ProfileSkeleton />;

  return (
    <ScrollView
      className="flex-1 px-4 pt-12"
      style={{ backgroundColor: theme?.background || lightColors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 180 }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* HEADER */}
      <View className="flex-row justify-between items-center mb-4">

        <View className="flex-row items-center gap-3">
          {/*Back Button */}
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20}  color={theme?.text || lightColors.text} />
          </Pressable>
          <Text className="text-xl font-semibold text-text">User Details</Text>
        </View>

        <View>
          <Ionicons name="ellipsis-vertical" size={20} color={theme?.text || lightColors.text}
            onPress={() => setMenuVisible(true)}
            />
        </View>
      </View>

      {/* HERO PROFILE CARD */}
      <Animated.View
        entering={FadeInDown.duration(400)}
        className="rounded-xl p-5"
        style={{ backgroundColor: theme?.card || lightColors.card }}
      >
        <View className="flex-row pl-1 gap-4">
          {/* Avatar */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPressIn={() => (scale.value = withSpring(0.95))}
            onPressOut={() => (scale.value = withSpring(1))}
          >
            <Animated.View style={animatedAvatarStyle}>
              <Image
                source={{ uri: user?.profileImage }}
                className="w-28 h-28 rounded-full"
              />
            </Animated.View>
          </TouchableOpacity>

          <View className="mt-8 ml-1">
            {/* Name */}
            <Text
              className="text-xl font-semibold"
              style={{ color: theme?.text || lightColors.text }}
            >
              {user?.name}
            </Text>

            {/* Rating (CORRECT POSITION) */}
            <Text className="mt-1" style={{ color: theme?.subText || lightColors.subText }}>
              ⭐ {user?.rating} ({user?.totalReviews} reviews)
            </Text>
          </View>
        </View>

        {/* Bio */}
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text
            className="text-start mt-3 ml-2"
            style={{ color: theme?.subtext || lightColors.subText }}
            numberOfLines={expanded ? 4 : 1}
          >
            {user?.bio}
          </Text>
          {user?.bio?.length > 100 && (
            <Text
              style={{
                color: theme?.primary || lightColors.primary,
                marginLeft: 4,
                marginTop: 4,
              }}
            >
              {expanded ? "Show less" : "Read more"}
            </Text>
          )}
        </TouchableOpacity>

        {/* ACCOUNT RESTRICTED */}
        {user?.isBlocked && (
          <BlockedNotice 
            className="mt-4"
            title="Account Restricted"
            message="This account has been blocked by the admin. So dont trade with this user"
          />
        )}

      </Animated.View>

      {/* SKILLS SECTION */}
      <Animated.View
        entering={FadeInDown.delay(100)}
        className="mt-4 rounded-xl p-4"
        style={{ backgroundColor: theme?.card || lightColors.card }}
      >
        {/* Title */}
        <Text
          className="text-lg font-semibold mb-3"
          style={{ color: theme?.text || lightColors.text }}
        >
          Skills
        </Text>

        {/* Skills OR Empty State */}
        {user?.skills && user?.skills?.length > 0 ? (
          <View className="flex-row flex-wrap gap-2 mb-1">
            {user.skills.map((skill: string, index: number) => (
              <View
                key={index}
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: theme?.lightGray || lightColors.lightGray }}
              >
                <Text
                  className="text-sm font-medium"
                  style={{ color: theme?.darkGray || lightColors.darkGray }}
                >
                  #{skill}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            title="No skills added"
            description="Add your skills to attract better trades"
          />
        )}
      </Animated.View>

      {/* STATS ROW */}
      <Animated.View
        entering={FadeInDown.delay(200)}
        className="mt-4 rounded-xl p-4"
        style={{ backgroundColor: theme?.background || lightColors.card }}
      >
        <Text className="text-lg font-semibold mb-3" style={{ color: theme?.text || lightColors.text }}>
          Stats
        </Text>
        <View className="flex-row justify-between">
          <StatItem label="Posts" value={stats.posts} />
          <StatItem label="Trades" value={stats.trades} />
          <StatItem label="Rating" value={user?.rating || 0} /> 
        </View>
      </Animated.View>

      {/* Active Post */}
      <Animated.View
        entering={FadeInDown.delay(300)}
        className="mt-4 rounded-xl p-4"
        style={{ backgroundColor: theme?.card || lightColors.card }}
      >
        <View className="flex-row items-center mb-4 gap-3">
          {/* Title */}
          <Text  className="text-lg font-semibold" style={{ color: theme?.text || lightColors.text }}>
            Active Posts 
          </Text>
          <Ionicons name="arrow-forward-outline" size={18} />
        </View>

        {userPosts && userPosts.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 8,
              marginTop: 2,
              marginLeft: 3,
              marginRight: 3,
            }}
          >
            {userPosts.map((post: any) => (
              <View key={post.id} style={{ width: 290, marginRight: 5 }}>
                <View className="border rounded-3xl" style={{ borderRadius: 20, height: 213, borderColor: lightColors.subText + "50" || theme?.subText + "50" }}>
                  <PostCard post={post} />
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <EmptyState
            title="No active posts"
            description="Start by creating a post to trade skills"
          />
        )}
      </Animated.View>
      
      {/* COMPLETED TRADES */}
      <Animated.View
        entering={FadeInDown.delay(400)}
        className="mt-4 rounded-xl p-4"
        style={{ backgroundColor: theme?.card || lightColors.card }}
      >
        {/* Title */}
        <Text className="text-lg font-semibold mb-4" style={{ color: theme?.text || lightColors.text }}>
          Completed Trades
        </Text>

        <View key={showAllTrades ? "all" : "less"}>
          {completedTrades && completedTrades.length > 0 ? (
            <View className="gap-3">
              {visibleTrades.map((trade: any) => (
                <TradeHistoryItem key={trade.id} trade={trade} />
              ))}
              
            </View>
          ) : (
            <EmptyState
            title="No completed trades"
            subtitle="Complete trades to build trust"
            />
          )}
          
          {completedTrades.length > 5 && (
            <TouchableOpacity
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setShowAllTrades(!showAllTrades)
              }}
              className="mt-3 items-center"
              >
                <View className="flex-row justify-center items-center gap-1">
                  <Text style={{ color: theme?.primary || lightColors.primary, fontWeight: "600" }}>
                    {showAllTrades ? "Show Less" : "Show More"}
                  </Text>
                  <Ionicons 
                    className="mt-1" 
                    name={showAllTrades ? "chevron-up" : "chevron-down"} 
                    size={18} color={theme?.primary || lightColors.primary} 
                  />

                </View>

            </TouchableOpacity>
          )}
      </View>
      </Animated.View>

      <AppActionMenu 
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        options={getMenuOptions()}
      />

    </ScrollView>
  );
}

const StatItem = ({ label, value }: { label: string; value: number }) => {
  const { theme } = useTheme();
  return (
    <View className="flex-1 items-center mb-2">
      <View
        className="w-20 h-20 rounded-3xl justify-center items-center"
        style={{ backgroundColor: theme?.lightPurple || lightColors.lightPurple}}
      >
        <Text
          className="text-lg font-semibold"
          style={{ color: theme?.text || lightColors.text }}
        >
          {value}
        </Text>

        <Text className="text-sm" style={{ color: theme?.text || lightColors.text }}>
          {label}
        </Text>
      </View>
    </View>
  );
};

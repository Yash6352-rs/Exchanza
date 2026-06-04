import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { lightColors } from "@/app/components/theme/colors";
import { auth } from "@/app/services/firebase/firebase";
import { useTheme } from "@/context/ThemeContext";

type Post = {
  id: string;
  title: string;
  userId: string;
  type: "offer" | "request";
  tags: string[];
  userName?: string;
  userAvatar?: string;
  rating?: number;
  totalReviews?: number;
};

export default function PostCard({ post }: { post: Post }) {
  const { theme } = useTheme();
  const isOffer = post.type === "offer";
  const router = useRouter();

  return (
    <TouchableOpacity
      activeOpacity={0.97}
      onPress={() => router.push({
        pathname: "/features/posts/[id]",
        params: { 
          id: post.id,
          name: post.userName,
          avatar: post.userAvatar,
          rating: post.rating
        }
      })}
    >
      <View
        className="mb-6 p-6 rounded-3xl"
        style={{
          backgroundColor: theme?.card || lightColors.card,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 4,
        }}
        >
        {/* HEADER */}
        <View className="flex-row items-center justify-between mb-3">
          {/* LEFT SIDE */}

          <View className="flex-row items-center gap-3">
            <Pressable
              className="flex-row items-center gap-3"
              onPress={() => {
                if (post.userId === auth.currentUser?.uid) {
                  router.push("/(tabs)/profile");
                } else {
                  router.push({
                    pathname:"/features/profile/screens/UserProfileScreen",
                    params: { userId: post.userId }
                  });
                }
              }}
            >
              {/* Avatar */}
              {post.userAvatar ? (
                <Image
                source={{ uri: post.userAvatar}}
                className="w-14 h-14 rounded-full"
                />
              ) : (
                <View
                className="w-14 h-14 rounded-full items-center justify-center"
                style={{ backgroundColor: theme?.primary + "20" || lightColors.primary + "20" }}
                >  <Text className="font-bold" style={{ color: theme?.primary || lightColors.primary }}>
                    {post.userName?.charAt(0) || "U"}
                
                  </Text>
                </View>
              )}

              {/* Name + Rating + Subtitle */}
              <View>
                {/* Row 1 */}
                <View className="flex-row items-center gap-2">
                  <Text
                    className="font-semibold text-xl"
                    style={{ color: theme?.text || lightColors.text }}
                    >
                    {post.userName || "User"}
                  </Text>

                  <View
                    className="w-1.5 h-1.5 items-center rounded-full"
                    style={{ backgroundColor: theme?.brown || lightColors.brown }}
                  />

                  <View className="flex-row justify-center items-center gap-2">
                    
                    {/* Stars */}
                    {/* <RatingStars rating={post.rating || 0} size={18}/> */}
                    <Ionicons name="star" size={18} color={theme?.brown || lightColors.brown} />

                    {/* Number */}
                    <Text
                      className="text-xl font-semibold"
                      style={{ color: theme?.brown || lightColors.brown }}
                    >
                      {post.rating ? post.rating.toFixed(1) : "0.0"}
                    </Text>

                    {/* Reviews count */}
                    {(post.totalReviews ?? 0) > 0 && (
                      <Text
                      className="text-xs"
                      style={{ color: theme?.subText || lightColors.subText }}
                      >
                        ({post.totalReviews})
                      </Text>
                    )}
                  </View>
                </View>

                {/* Row 2 */}
                <Text
                  className="text-sm mt-1"
                  style={{ color: theme?.subText || lightColors.subText }}
                >
                  Exchanza User
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* TITLE */}
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-xl font-semibold mb-4"
          style={{ color: theme?.tagText || lightColors.tagText }}
        >
          {post.title}
        </Text>

        {/* TAGS */}
        <View className="flex-row flex-wrap mb-4">
          {post.tags.map((tag, index) => (
            <View
            key={index}
            className="px-3 py-1 rounded-full mr-2 mb-2"
            style={{ backgroundColor: theme?.lightGray || lightColors.lightGray }}
            >
              <Text className="text-xs font-medium" style={{ color: "#6B7280" }}>
                #{tag}
              </Text>
            </View>
          ))}
        </View>

        {/* FOOTER */}
        <View className="flex-row items-center justify-between">
          <View
            className="px-4 py-2 rounded-full"
            style={{
              backgroundColor: theme?.lightBrown || lightColors.lightBrown 
              //backgroundColor: isOffer ? theme?.lightBrown || lightColors.lightBrown : "#F5ECE6",
            }}
            >
            <Text
              className="text-xs font-semibold"
              style={{ color: theme?.brown || lightColors.brown }}
              //style={{ color: isOffer ? theme?.brown || lightColors.brown : "#8B5E3C" }}
              >
              {isOffer ? "OFFER" : "REQUEST"}
            </Text>
          </View>

          <View className="flex-row justify-center items-center gap-1">
            <Text className="font-semibold" style={{ color: theme?.purple || lightColors.purple }}>
              View Details
            </Text>
            <Ionicons className="mt-1" name="arrow-forward" size={18} color={theme?.purple || lightColors.purple}  />

          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

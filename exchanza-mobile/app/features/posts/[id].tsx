import { Pressable, ScrollView, Image, Text, View, Appearance } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "@/app/services/firebase/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Loader } from "@/app/components/common/Loader";
import { EmptyState } from "@/app/components/common/EmptyState";
import { AppButton } from "@/app/components/common/AppButton";
import { getTimeAgo } from "@/app/utils/time";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { lightColors } from "@/app/components/theme/colors";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import TradeProposalModal from "../trades/components/TradeProposalModal";
import { getAuth } from "firebase/auth";
import { createTrade } from "../trades/services/tradeService";
import AppActionMenu from "./components/AppActionMenu";
import { AppDialog } from "@/app/components/common/AppDialog";
import { deletePost } from "./services/postService";
import { useToast } from "@/app/components/common/ToastProvider";
import { createNotification } from "../notifications/services/notificationService";
import { useTheme } from "@/context/ThemeContext";
import { useBlockedCheck } from "@/hooks/useBlockedCheck";
import BlockedNotice from "@/app/components/common/BlockedNotice";

export default function PostDetailsScreen() {
  const { id, name, avatar, rating } = useLocalSearchParams();
  const postId = Array.isArray(id) ? id[0] : id;

  const [user, setUser] = useState({ name, profileImage: avatar, rating })
  const [tradeLoading, setTradeLoading] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();

  const auth = getAuth();
  const currentUser = auth.currentUser;

  const { canProposeTrade, canReport, isBlocked } = useBlockedCheck(); 

  const { theme, themeMode } = useTheme();
  const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const isOwner = post?.userId === currentUser?.uid;
  const isOffer = post?.type === "offer";

  const tradeClosed = post?.status === "in-progress" || post?.status === "completed";

  const userName = Array.isArray(user?.name)
    ? user.name[0]
    : user.name;

  const userAvatar = Array.isArray(user?.profileImage)
    ? user.profileImage[0]
    : user.profileImage;

  useEffect(() => {
    if (!postId) return;

      const postRef = doc(db, "posts", postId as string);
      
      const unsubscribe = onSnapshot(postRef, async (postSnap) => {
        if (!postSnap.exists()) {
          setLoading(false);
          return;
        }

        const postData = { id: postSnap.id, ...postSnap.data() as any};
        setPost(postData);

        setLoading(false);
      });

      return () => unsubscribe();
  }, [postId]);

  const getMenuOptions = () => {
    if (!post) return [];

    if (isOwner) {
      return [
        {
          label: "Why am I seeing this?",
          onPress: () =>
            router.push({
              pathname: "/features/settings/screens/why-am-i-seeing-this",
              params: {
                type: "post",
              },
            })
        },
        {
          label: "Edit Post?",
          onPress: () => router.push({
            pathname: "/features/posts/screens/edit-post/[id]",
            params: { id: post.id},
          } as any)
        },
        {
          label: "Delete Post",
          onPress: () => setDeleteModalVisible(true),
          danger: true
        },
      ];
    }

    return [
        {
          label: "Why am I seeing this?",
          onPress: () =>
            router.push({
              pathname: "/features/settings/screens/why-am-i-seeing-this",
              params: {
                type: "post",
              },
            })
        },
        {
          label: "Report Post",
          onPress: () => {
            if (!canReport) {
              showToast("Your account cannot report post", "alert-circle", theme?.error || lightColors.error);
              return;
            }
            router.push({
              pathname: "/features/settings/screens/report-problem",
              params: { type: "post", targetId: post.id }
            });
          },
          danger: true,
        },
    ];
  }

  if (!postId) return <EmptyState title="Invalid post ID" />;
  if (loading) return <Loader fullScreen />;
  if (!post) return <EmptyState title="Post not found" />;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme?.background || lightColors.background}}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <ScrollView className="flex-1 px-4 pt-4" style={{ backgroundColor: theme?.background ||lightColors.background }}>

        <View className="flex-row justify-between items-center mb-4">
          
          <View className="flex-row items-center gap-3">
            {/*Back Button */}
            <Pressable onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color={theme?.text || lightColors.text} />
            </Pressable>

            <Text className="text-xl font-semibold" style={{ color: theme?.text || lightColors.text }}>
              Post Details
            </Text>
          </View>

          <View>
            <Ionicons name="ellipsis-vertical" size={20} color={theme?.text || lightColors.text}
              onPress={() => setMenuVisible(true)}
            />
          </View>
  
        </View>

        {/*  USER INFO (Clickable) */}
        <Pressable 
          onPress={() => {
            if (post.userId === currentUser?.uid) {
              router.push("/(tabs)/profile");
            } else {
              router.push({
                pathname: "/features/profile/screens/UserProfileScreen",
                params: { userId: post.userId }
              });
            }
          }}
          className="flex-row items-center p-4 rounded-2xl mb-4 border border-border"
          style={{ backgroundColor: theme?.card || lightColors.card }}
        >
            
          {/* Avatar */}
          {userAvatar ? (
            <Image source={{ uri: userAvatar }} className='w-10 h-10 rounded-full'/>           
          ) : (
            <View
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: theme?.primary + "20" || lightColors.primary + "20" }}
            >
              <Text className="font-bold" style={{ color: theme?.primary || lightColors.primary }}>
                {userName.charAt(0) || "U"}
              </Text>
            </View>
          )}

          <Text className="text-base ml-3 font-semibold" style={{ color: theme?.text || lightColors.text }}>
            {user?.name || "User"}
          </Text>

          <View className="flex-1 items-end mr-2">
            <Text className="text-sm mt-1" style={{ color: theme?.subText || lightColors.subText }}>
              ⭐ {user?.rating || "0.0"}
            </Text>
          </View>
        </Pressable>

        {/* POST INFO */}
        <View className="p-4 rounded-2xl border mb-5" 
          style={{ 
            backgroundColor: theme?.card || lightColors.card,
            borderColor: theme?.border || lightColors.border 
          }}
        >

          {/* Title */}
          <Text className="text-xl font-bold text-text mb-2" style={{ color: theme?.text || lightColors.text }}>{
            post.title}
          </Text>

          {/* Description */}
          <Text className="text-base leading-5 mb-5" style={{ color: theme?.subText || lightColors.subText }}>
            {post.description}
          </Text>

          {/* TAGS */}
            <View className='flex-row flex-wrap mb-3'>
                {post.tags.map((tag: any, index: any) => (
                  <View
                  key={index}
                  className='px-3 rounded-full mr-2 mb-3'
                  style={{ backgroundColor: theme?.border || lightColors.border }}
                    >
                        <Text className='text-sm' style={{ color: theme?.subText || lightColors.subText }}>
                            #{tag}
                        </Text>
                    </View>
                ))}
            </View>

            <View className="flex-row justify-between items-center">
              <View
                className="px-4 py-2 rounded-full"
                style={{
                  backgroundColor: theme?.lightBrown || lightColors.lightBrown
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{ color: theme?.brown || lightColors.brown }}
                >
                  {isOffer ? "OFFER" : "REQUEST"}
                </Text>
              </View>

              {/* Time */}
              <Text className="text-xs mt-2" style={{ color: theme?.subText || lightColors.subText }}>
                {getTimeAgo(post.createdAt)}
              </Text>
            </View>
        </View>

        {isBlocked && (
          <BlockedNotice 
            className="mb-5"
            title="Trade Proposal Disabled"
            message="Your account has been blocked by the admin. You cannot propose new trades."
          />
        )}

        {/* ACTION */}
        {tradeClosed ? (
          <Text>This post is no longer accepting proposals.</Text>
        ) :( 
          <AppButton 
            opacity={canProposeTrade === false ? 0.6 : 1 || tradeLoading ? 1 : 0.6}
            title="Propose Trade" 
            loading={tradeLoading}
            onPress={() => {
              if (!canProposeTrade) {
                showToast("Your account cannot propose trades", "alert-circle", theme?.error || lightColors.error);
                return;
              } 
              setModalVisible(true)
            }}
          />
        )}

        <TradeProposalModal
            visible={modalVisible}
            loading={tradeLoading}
            onClose={() => setModalVisible(false)}
            onSubmit={async (data) => {
              if (!canProposeTrade) {
                showToast("Your account cannot propose trades", "alert-circle", theme?.error || lightColors.error);
                return;
              }
                try {
                    setTradeLoading(true);
                    if (!currentUser) return;

                    // CREATE TRADE + GET ID
                    const tradeId = await createTrade({
                      postId: postId as string,
                      fromUserId: currentUser.uid,
                      toUserId: post.userId,
                      offerText: data.offer,
                      requestText: data.want,
                    });

                    // CREATE NOTIFICATION
                    await createNotification({
                      userId: post.userId, // post owner
                      type: "proposal",
                      title: "New trade Request",
                      message: "You received a new trade proposal",
                      tradeId: tradeId,
                      postId: postId,
                    });
                   
                  } catch (error: any) {
                    console.log("Trade Error:", error.message);
                  } finally {
                    setTradeLoading(false);
                  }

                  if (currentUser) {
                    showToast("Trade proposal sent!", "checkmark-circle", theme?.success || lightColors.success);
                  }
            }}      
        />

        <AppActionMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)} 
          options={getMenuOptions()}
        />

        <AppDialog
          visible={deleteModalVisible}
          title="Delete Post?"
          description="Are you sure you want to delete this post?"
          onCancel={() => setDeleteModalVisible(false)}
          onConfirm={async () => {
            try {
              if (!isOwner) {
                throw new Error("Unauthorized");
              }
              setDeleting(true);
              await deletePost(post.id);
              setDeleteModalVisible(false);
              router.back();
              showToast("Post deleted successfully", "trash", theme?.error || lightColors.error);
          
            } catch (error: any) {
              alert(error.message);
            } finally {
              setDeleting(false);
            }
          }}
          icon="trash"
          iconColor={theme?.error || lightColors.error}
          loading={deleting}
        />
      </ScrollView>
    </SafeAreaView>
  );
}



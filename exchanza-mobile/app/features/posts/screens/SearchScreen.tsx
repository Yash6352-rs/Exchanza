import { Appearance, Image, Pressable, ScrollView, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/app/services/firebase/firebase';
import { lightColors } from '@/app/components/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { FlatList, TextInput } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import PostCard from '../components/PostCard';
import { StatusBar } from 'expo-status-bar';
import { subscribeToPosts } from '../services/postService';
import { EmptyState } from '@/app/components/common/EmptyState';
import { useTheme } from '@/context/ThemeContext';

export const unstable_settings = {
    presentation: "modal",
};

export default function SearchScreen() {
    const [query, setQuery] = useState("");
    const [posts, setPosts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

    useEffect(() => {
        const unsubPosts = subscribeToPosts(setPosts);
        const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
            setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        });

        return () => {
            unsubPosts();
            unsubUsers();
        }
    }, []);

    // FILTER LOGIC
    const filteredPost = posts.filter((p) => 
        p.title?.toLowerCase().includes(query.toLowerCase()) || 
        p.tags?.some((t: string) => t.toLowerCase().includes(query.toLowerCase())
    ));

    const filteredUsers = users.filter((u) => 
        u.name?.toLowerCase().includes(query.toLowerCase()) ||
        u.skills?.some((s: string) => s.toLowerCase().includes(query.toLowerCase())
    ));

  return (
    <View className="flex-1 px-4 pt-12" style={{ backgroundColor: theme?.background || lightColors.background }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        
        {/* HEADER SEARCH */}
        <View className="flex-row items-center mt-1 mb-4">
            {/* Back Button  */}
            <Pressable onPress={() => router.back()} className="mr-3">
                <Ionicons name="arrow-back" size={22}  color={theme?.text || lightColors.text} />
            </Pressable>

            {/* Search Bar */}
            <View 
                className="flex-1 flex-row items-center px-4 rounded-3xl border" 
                style={{ 
                    backgroundColor: theme?.card || lightColors.card, 
                    borderColor: theme?.border || lightColors.border 
                }}
                >
                <Ionicons name="search-outline" size={20} color={theme?.subText || lightColors.subText} />
                <TextInput 
                    placeholder="Search trades, users..."            
                    value={query}    
                    onChangeText={setQuery}
                    className="ml-2 flex-1"
                />
            </View>
        </View>

        <ScrollView
            className="px-1"
            showsVerticalScrollIndicator={false}
        >
            {query.length === 0 ? (
                <EmptyState 
                    classname="mt-64"
                    icon="search-outline"
                    title="Search anything"
                    description="  Find users by name or skills.
Search trades by title or tags."
                />
            ) : (
                <>
                    {/* USERS */}
                    {filteredUsers.length > 0 && (
                        <>
                            <Text className="text-lg font-semibold mb-2" style={{ color: theme?.text || lightColors.text }}>
                                Users
                            </Text>

                            {filteredUsers.slice(0, 5).map((user) => (
                                <Pressable
                                    key={user.id}
                                    onPress={() => {
                                        if (user.id === auth.currentUser?.uid) {
                                            router.push("/(tabs)/profile");
                                        } else {
                                            router.push({
                                                pathname: "/features/profile/screens/UserProfileScreen",
                                                params: { userId: user.id }
                                            });
                                        }
                                    }}
                                    className="flex-row items-center p-4 mb-3 rounded-2xl"
                                    style={{ 
                                        backgroundColor: theme?.card || lightColors.card,
                                        shadowColor: "#000",
                                        shadowOpacity: 0.05,
                                        shadowRadius: 8,
                                        elevation: 2
                                    }}
                                >
                                    {user.profileImage ? (
                                        <Image source={{ uri: user.profileImage}}
                                        className="w-12 h-12 rounded-full mr-3"
                                        />
                                    ) : (
                                        <View
                                        className="w-12 h-12 rounded-full items-center justify-center mr-3"
                                        style={{ backgroundColor: theme?.primary + "20" || lightColors.primary + "20" }}
                                        >
                                            <Text style={{ color: theme?.primary || lightColors.primary }}>
                                                {user.name?.charAt(0)}
                                            </Text>
                                        </View>
                                    )}

                                    {/* Info */}
                                    <View className="flex-1">
                                        <Text className="font-semibold text-base" style={{ color: theme?.text || lightColors.text }}>
                                            {user.name}
                                        </Text>      

                                        <Text 
                                            className="text-sm mt-1" 
                                            style={{ color: theme?.subText || lightColors.subText }}
                                            >
                                            {user.skills?.join(", ") || "No skills added"}
                                        </Text>           
                                    </View>

                                    <View className="flex-row gap-2 mr-1">
                                        <Ionicons name="star" size={18} color="#F59E0B" />
                                        <Text>{user.rating}</Text>
                                    </View>

                                </Pressable>
                            ))}
                        </>
                    )}

                    {/* POSTS */}
                    {filteredPost.length > 0 && (
                        <>
                            <Text className="text-lg font-semibold mt-4 mb-2" style={{ color: theme?.text || lightColors.text }}>
                                Trades
                            </Text>

                            <FlatList 
                                data={filteredPost}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => <PostCard post={item} />}
                            />
                        </>
                    )}
                </>
            )}
        </ScrollView>
    </View> 
  );
}

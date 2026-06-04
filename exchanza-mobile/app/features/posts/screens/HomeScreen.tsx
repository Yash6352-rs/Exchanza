import { Appearance, FlatList, Pressable, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { lightColors } from '@/app/components/theme/colors';
import { EmptyState } from '@/app/components/common/EmptyState';
import PostCard from '../components/PostCard';
import TagFilterBar from '../components/TagFilterBar';
import { Loader } from '@/app/components/common/Loader';
import { subscribeToPosts, subscribeToTags } from '../services/postService';
import { StatusBar } from "expo-status-bar";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
type Post = {
  id: string;
  title: string;
  userId: string;
  type: "offer" | "request";
  tags: string[];
  description?: string;

  userName?: string;
  userAvatar?: string;
  rating?: number;
};

export default function HomeScreen() {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [search, setSearch] = useState("");
    const [selectedTag, setSelectedTag] = useState("All");
    const [tags, setTags] = useState<string[]>([]);

    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

    useEffect(() => {
        setLoading(true);

        const unsubscribePosts = subscribeToPosts((data) => {
            setPosts(data);
            setLoading(false);
        });

        const unsubscribeTags = subscribeToTags((data) => {
            setTags(data.map((t) => t.name));
        });

        return () => {
            unsubscribePosts();
            unsubscribeTags();
        }
    }, []);

    const filteredPosts = posts.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
        const matchesTag = selectedTag === "All" || p.tags.some(
            (tag) => tag.toLowerCase() === selectedTag.toLowerCase()
        );

        return matchesSearch && matchesTag;
    });

    if (loading) return <Loader fullScreen />;

  return (
    <View className='flex-1 px-4 pt-12' style={{ backgroundColor: theme?.background || lightColors.background }}>
        <StatusBar style={isDark ? "light" : "dark"} />

        <View className='ml-2 mb-4'>
            <Text className='font-bold text-2xl' style={{ color: theme?.primary || lightColors.primary }}>
                Home
            </Text>
        </View>

        {/* Search */}
        <Pressable
            onPress={() => router.push("/features/posts/screens/SearchScreen")}
            className="flex-row items-center px-4 py-3 mb-5 rounded-3xl border"
            style={{ 
                backgroundColor: theme?.card || lightColors.card, 
                borderColor: theme?.borderColor || lightColors.border }}
        >
            <Ionicons name="search-outline" size={20} color={theme?.subText || lightColors.subText} />
            <Text className="ml-2 text-base" style={{ color: theme?.subText || lightColors.subText }}>
                Search trade, users...
            </Text>
        </Pressable>

        {/* Filter Tags */}
        <View className='mb-1'>
            <TagFilterBar selected={selectedTag} onSelect={setSelectedTag} tags={tags}/>
        </View>

        {/* POSTS */}        
        {filteredPosts.length === 0 ? (
            <EmptyState title="No posts found"/>
        ) : (
            <FlatList 
                data={filteredPosts}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120, padding: 4 }}
                renderItem={({ item }) => <PostCard post={item}/>}
            />
        )}

    </View>
  )
}

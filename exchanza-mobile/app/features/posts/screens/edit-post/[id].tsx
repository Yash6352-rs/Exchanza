import { Appearance, Pressable, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { EmptyState } from '@/app/components/common/EmptyState';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/services/firebase/firebase';
import { Loader } from '@/app/components/common/Loader';
import { lightColors } from '@/app/components/theme/colors';
import { AppInput } from '@/app/components/common/AppInput';
import { AppButton } from '@/app/components/common/AppButton';
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { updatePost } from '../../services/postService';

export default function EditPostScreen() {
    const { id } = useLocalSearchParams();
    const postId = Array.isArray(id) ? id[0] : id;

    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [type, setType] = useState<"offer" | "request">("offer");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");

    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

    useEffect(() => {
        if (!postId) return; 
        
        const fetchPost = async () => {
            try {
                const snap = await getDoc(doc(db, "posts", postId));

                if (!snap.exists()) return;

                const data = snap.data();

                setType(data?.type);
                setTitle(data?.title);
                setDescription(data?.description);
                setTags((data?.tags || []).join(", "));

            } catch (e) {
                console.log("Fetch error", e);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);
    
    if (!postId) return <EmptyState title="Invalid post ID" />
    if (loading) return <Loader />;
    
  return (
    <View className="flex-1 px-4 pt-12" style={{ backgroundColor: theme?.background || lightColors.background }}>
        <StatusBar style={isDark ? "light" : "dark"} />

        {/* HEADER */}
        <View className="flex-row items-center gap-3 mb-6">
            {/*Back Button */}
            <Pressable onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color={theme?.text || lightColors.text} />
            </Pressable>

            <Text className="text-xl font-semibold" style={{ color: theme?.text || lightColors.text }}>
                Edit Post
            </Text>
          </View>

        {/* CARD */}
        <View
            className="p-5 rounded-2xl"
            style={{
                backgroundColor: theme?.card || lightColors.card,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 4,
            }}
        >
            {/* TYPE */}
            <Text className="mb-2" style={{ color: theme?.text || lightColors.text }}>
                Type
            </Text>

            <View className="flex-row mb-4">
                {["offer", "request"].map((item) => {
                    const active = type === item;
                    
                    return (
                        <TouchableOpacity
                            key={item}
                            onPress={() => setType(item as any)}
                            className="flex-1 py-2 rounded-xl mr-2"
                            style={{
                                backgroundColor: active 
                                    ? theme?.primary || lightColors.primary 
                                    : theme?.background || lightColors.background,

                                borderWidth: 1,
                                borderColor: theme?.border || lightColors.border,
                            }}
                        >
                            <Text
                                className="text-center font-medium"
                                style={{ color: active ? "#fff" : theme?.text || lightColors.text}}
                            >
                                {item.toUpperCase()}
                            </Text>
                            
                        </TouchableOpacity>
                    )
                })}
            </View>

            {/* TITLE */}
            <Text className="mb-2" style={{ color: theme?.text || lightColors.text }}>
                Title
            </Text>
            <AppInput value={title} onChangeText={setTitle} />

            {/* DESCRIPTION */}
            <Text className="mt-6 mb-2" style={{ color: theme?.text || lightColors.text }}>
                Description
            </Text>
            <AppInput
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                style={{ height: 100, textAlignVertical: "top" }}
            />

            {/* TAGS */}
            <Text className="mt-6 mb-2" style={{ color: theme?.text || lightColors.text }}>
                Tags
            </Text>
            <AppInput value={tags} onChangeText={setTags} />

             {/* BUTTON */}
            <View className="mt-6">
                <AppButton
                loading={saving}
                title="UPDATE POST"
                onPress={async () => {
                    try {
                        if (!title.trim() || !description.trim()) {
                            alert("Please fill all details");
                            return;
                        }

                        setSaving(true);

                        const parsedTags = tags.split(", ").map(t => t.trim().toLowerCase()).filter(Boolean);

                        await updatePost({
                            postId,
                            type,
                            title,
                            description,
                            tags: parsedTags,
                        });

                        router.back();

                    } catch (error: any) {
                        alert(error.message);
                    } finally {
                        setSaving(false);
                    }
                }}
                />
            </View>
        </View>
    </View>
  );
}

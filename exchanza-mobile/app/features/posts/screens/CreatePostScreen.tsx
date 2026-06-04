import React, { useContext, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { AppButton } from "@/app/components/common/AppButton";
import { AppInput } from "@/app/components/common/AppInput";
import { useToast } from "@/app/components/common/ToastProvider";
import { lightColors } from "@/app/components/theme/colors";
import { AuthContext } from "@/context/AuthProvider";
import { useRouter } from "expo-router";
import { createPost } from "../services/postService";
import { useTheme } from "@/context/ThemeContext";
import { useBlockedCheck } from "@/hooks/useBlockedCheck";
import BlockedNotice from "@/app/components/common/BlockedNotice";

export default function CreatePostScreen() {
  const [type, setType] = useState<"offer" | "request">("offer");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);
  const router = useRouter();
  
  const { showToast } = useToast();
  const { theme } = useTheme();
  const { canCreatePost, isBlocked } = useBlockedCheck();

  const handleSubmit = async () => {
    if (!title || !description || !tags) {
      showToast("Please fill all fields", "alert-circle", theme?.error || lightColors.error);
      return;
    }

    if (!canCreatePost) {
      showToast("Your account is restricted from creating posts", "alert-circle", theme.error);
      return;
    }
    try {
      setLoading(true);

      // Convert tags string → array
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      await createPost({
        userId: user!.uid,
        type,
        title,
        description,
        tags: tagsArray,
      });

      showToast("Post Created", "checkmark-circle", theme?.success || lightColors.success);
      router.back();
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
      setType("offer");
      setTitle("");
      setDescription("");
      setTags("");
    }
  };

  return (
    <View
      className="flex-1 px-4 pt-12"
      style={{ backgroundColor: theme?.background || lightColors.background }}
    >
      <View className="ml-2 mb-7">
        <Text
          className="font-bold text-2xl"
          style={{ color: theme?.primary || lightColors.primary }}
        >
          Create Post
        </Text>
      </View>

      {isBlocked && (
        <BlockedNotice 
          className="mb-5"
          title="Cannot Create Post"
          message="Your account has been restricted from creating posts by the admin."
        />
      )}

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
        {/* TYPE TOGGLE */}
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
                  style={{ color: active ? "#fff" : theme?.text || lightColors.text }}
                >
                  {item.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* TITLE */}
        <Text className="mb-2" style={{ color: theme?.text || lightColors.text }}>
          Title
        </Text>
        <AppInput
          placeholder="e.g. I will teach React"
          value={title}
          onChangeText={setTitle}
        />

        {/* DESCRIPTION */}
        <Text className="mt-6 mb-2" style={{ color: theme?.text || lightColors.text }}>
          Description
        </Text>
        <AppInput
          placeholder="Describe your offer/request..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          style={{ height: 100, textAlignVertical: "top" }}
        />

        {/* TAGS */}
        <Text className="mt-6 mb-2" style={{ color: theme?.text || lightColors.text }}>
          Tags (comma separated)
        </Text>
        <AppInput
          placeholder="react, coding, ui"
          value={tags}
          onChangeText={setTags}
        />

        {/* STICKY BUTTON */}
        <View className="mt-6">
          <AppButton
            loading={loading}
            title="CREATE POST"
            onPress={handleSubmit}
            disabled={!canCreatePost}
          />
        </View>

      </View>
      
    </View>
  );
}

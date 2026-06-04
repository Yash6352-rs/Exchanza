import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useToast } from "@/app/components/common/ToastProvider";
import { auth, db } from "@/app/services/firebase/firebase";
import { lightColors } from "@/app/components/theme/colors";
import { uploadToCloudinary } from "@/app/utils/uploadToCloudinary";
import { Loader } from "@/app/components/common/Loader";
import { AppInput } from "@/app/components/common/AppInput";
import { AppButton } from "@/app/components/common/AppButton";
import { useTheme } from "@/context/ThemeContext";

export default function EditProfileScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const currentUser = auth.currentUser;

  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [image, setImage] = useState<string | null>(null);

  // 🔥 FETCH USER DATA
  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser?.uid) return;

      try {
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          setName(data.name || "");
          setEmail(data.email || "");
          setBio(data.bio || "");
          setSkills(data.skills || []);
          setImage(data.profileImage || null);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // IMAGE PICKER
  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      showToast("Permission required","alert-circle", theme?.error || lightColors.error);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // SKILLS
  const addSkill = () => {
    if (!skillInput.trim()) return;

    if (!skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
    }

    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  // SAVE
  const handleUpdate = async () => {
    if (!currentUser) return;

    try {
      setSaving(true);

      let imageUrl = image;

      // Upload only if new local image
      if (image && image.startsWith("file")) {
        imageUrl = await uploadToCloudinary(image);
      }

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          name,
          email,
          bio,
          skills,
          profileImage: imageUrl,
        },
        { merge: true }
      );

      showToast("Profile updated!", "checkmark-circle", theme?.success || lightColors.success);

      router.back();
    } catch (error) {
      console.log(error);
      showToast("Update failed", "alert-circle", theme?.error || lightColors.error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <ScrollView
      className="flex-1 px-6 pt-12"
      style={{ backgroundColor: theme?.background || lightColors.background }}
    >
      {/* Header */}
      <View className="flex-row items-center gap-5 mb-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22}  color={theme?.text || lightColors.text} />
        </Pressable>
      
        <Text className="font-semibold text-2xl" style={{ color: theme?.text || lightColors.text }}>
          Edit Details
        </Text>
      </View>

      {/* Card */}
      <View
        className="rounded-2xl p-5"
        style={{ 
          backgroundColor: theme?.card || lightColors.card,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 20,
          elevation: 4,
       }}
      >

        {/* Avatar */}
        <Text className="mb-4" style={{ color: theme?.text || lightColors.text }}>Profile Image</Text>
        <View className="items-center mb-5">
          <TouchableOpacity onPress={pickImage}>
            <View>
              <Image
                source={{
                  uri:
                    image || "https://i.pravatar.cc/300",
                  }}
                className="w-32 h-32 rounded-full"
              />

              {/* Edit Icon */}
              <View
                className="absolute bottom-0 right-2 p-2 rounded-full"
                style={{ backgroundColor: theme?.primary || lightColors.primary }}
              >
                <Ionicons name="pencil" size={18} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Name */}
        <Text className="mb-2" style={{ color: theme?.text || lightColors.text }}>Name</Text>
        <AppInput
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />

        {/* Email */}
        <Text className="mt-2 mb-2" style={{ color: theme?.text || lightColors.text }}>Email</Text>
        <AppInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        {/* Bio */}
        <Text className="mt-2 mb-2" style={{ color: theme?.text || lightColors.text }}>Bio</Text>
          <AppInput
            placeholder="Bio"
            value={bio}
            onChangeText={setBio}
          />

        {/* Skills */}
        <Text className="mt-2 mb-2" style={{ color: theme?.text || lightColors.text }}>Skills</Text>
        <View className="flex-row gap-2">
          <View className="flex-1">
            <AppInput
              placeholder="Add skill or remove skill"
              value={skillInput}
              onChangeText={setSkillInput}
            />
          </View>

          <TouchableOpacity
            onPress={addSkill}
            className="px-4 justify-center rounded-xl"
            style={{ backgroundColor: theme?.primary || lightColors.primary }}
          >
            <Text style={{ color: "white", fontSize: 18 }}>+</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap gap-2 mt-3">
          {skills.map((skill) => (
            <TouchableOpacity
              key={skill}
              onPress={() => removeSkill(skill)}
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: theme?.tagBg || lightColors.tagBg }}
            >
              <Text className="text-sm" style={{ color: theme?.tagText || lightColors.tagText }}>
                {skill} ✕
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Save */}
        <View className="mt-6">
          <AppButton
            title={saving ? "Updating..." : "Save Changes"}
            onPress={handleUpdate}
            disabled={saving}
          />
        </View>
      </View>
    </ScrollView>
  );
}
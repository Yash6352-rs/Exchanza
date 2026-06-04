import { Text, Image, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import { lightColors } from '@/app/components/theme/colors';
import { AppInput } from '@/app/components/common/AppInput';
import { AppButton } from '@/app/components/common/AppButton';
import { auth, db } from '@/app/services/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/app/components/common/ToastProvider';
import { uploadToCloudinary } from '@/app/utils/uploadToCloudinary';
import { Loader } from '@/app/components/common/Loader';
import { useTheme } from '@/context/ThemeContext';

export default function OnboardingScreen() {
    const router = useRouter();
    const user = auth.currentUser;
    const { showToast } = useToast  ();

    const { theme } = useTheme();

    const [bio, setBio] = useState("");
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills] = useState<string[]>([]);
    const [image, setImage] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    
    const addSkill = () => {
        if (!skillInput.trim()) return;

        if (!skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()]);
        }
        setSkillInput("");
    }

    const removeSkill = (skill: string) => {
        setSkills(skills.filter((s) => s !== skill));
    };

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            showToast("Permission required", "alert-circle", theme?.error || lightColors.error);
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
    
    const handleSaveProfile = async () => {
        const user = auth.currentUser;
        if (!user) return;

        // if (skills.length === 0 && !bio) {
        //     Alert.alert("Please add at least one skill or bio");
        //     return;
        // }

        try {
            setSaving(true);

            let imageUrl = "";

            // Upload image if exists
            if (image) {
                imageUrl = await uploadToCloudinary(image);
            }

            await setDoc(doc(db, "users", user.uid), {
                bio,
                skills: skills,
                profileImage: imageUrl || user.photoURL || "",
                profileCompleted: true,
            }, { merge: true });

            showToast("Profile updated!", "checkmark-circle", theme?.success || lightColors.success);

            router.replace("/(tabs)" as any);
        } catch (error) {
            console.log(error);
            showToast("Something went wrong", "alert-circle-outline", theme?.error || lightColors.error);
        } finally {
            setSaving(false);
        }
    }

    if (saving) return <Loader />;
  return (
    <View
        className='flex-1 px-6 py-10'
        style={{ backgroundColor: theme?.background || lightColors.background }}
    >
        {/* Skip Button */}
        <View className='items-end mt-2 mb-4'>
            <TouchableOpacity 
                onPress={async () => {
                    if (!user) return;

                    await setDoc(doc(db, "users", user!.uid), {
                        profileCompleted: false,
                    }, { merge: true });

                    router.replace("/(tabs)")
            }}>
                <Text style={{ color: theme?.subText || lightColors.subText }}>SKIP</Text>
            </TouchableOpacity>
        </View>
        
        {/* Header */}
        <View className='mb-8'>
            <Text className='text-2xl font-bold' style={{ color: theme?.text || lightColors.text }}>
                Complete Your Profile
            </Text>
            <Text className='mt-2 mb-2' style={{ color: theme?.subText || lightColors.subText }}>
                Tell others who are you, what are your skills
            </Text>
        </View>

        {/* Profile Image */}
        <View className='items-center mb-8'>
            <TouchableOpacity onPress={pickImage}>
                {image ? (
                    <Image 
                        source={{ uri: image}}
                        className='w-32 h-32 rounded-full'
                    />
                ) : (          
                    <View
                        className='w-32 h-32 rounded-full items-center justify-center'
                        style={{ backgroundColor: theme?.border || lightColors.border }}               
                    >
                        <Text style={{ color: theme?.subText || lightColors.subText }}>Add Photo</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>

        {/* Card */}
        <View
            className='rounded-2xl p-5'
            style={{
                backgroundColor: theme?.card || lightColors.card,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 10,
                elevation: 3,
            }}
        >
            <View className='mb-5 px-2'>
                <Text className='font-semibold'>Fill other Details</Text>
            </View>

            {/* Bio */}
            <View className='mb-5'>
                <AppInput 
                    placeholder="Write a short bio"
                    value={bio}
                    onChangeText={setBio}
                />
            </View>

            {/* Skills */}
            <View className="mb-4 flex-row gap-2">
                <View className="flex-1">
                    <AppInput
                        placeholder="Add a skill (e.g. Design)"
                        value={skillInput}
                        onChangeText={setSkillInput}
                    />
                </View>

                <TouchableOpacity
                    onPress={addSkill}
                    className="px-4 justify-center items-center rounded-2xl"
                    style={{ backgroundColor: theme?.primary || lightColors.primary }}
                >
                    <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>+</Text>
                </TouchableOpacity>
            </View>

            <View className='flex-row flex-wrap gap-2 mb-4'>
                {skills.map((skill: string) => (
                    <TouchableOpacity
                        key={skill}
                        onPress={() => removeSkill(skill)}
                        className='px-3 py-2 rounded-full flex-row items-center'
                        style={{ backgroundColor: theme?.tagBg || lightColors.tagBg }}
                    >
                        <Text style={{ color: theme?.tagText || lightColors.tagText }}>{skill} ✕ </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Button */}
            <AppButton 
                title={saving ? "Saving..." : "Save & Continue"}
                onPress={handleSaveProfile}
                disabled={saving}
            />
            
        </View>
    </View>
  )
}


// Device Image → Firestore ❌
// Device Image → Cloudinary → URL → Firestore ✅
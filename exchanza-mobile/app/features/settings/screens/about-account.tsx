import { Appearance, Image, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/app/services/firebase/firebase';
import { StatusBar } from 'expo-status-bar';
import { lightColors } from '@/app/components/theme/colors';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '@/app/components/common/EmptyState';
import { useTheme } from '@/context/ThemeContext';

export default function AboutAccountScreen() {
    const [userData, setUserData] = useState<any>(null);
    const [expanded, setExpanded] = useState(false);

    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

    useEffect(() => {
        const ref = doc(db, "users", auth.currentUser?.uid!);
        const unsub = onSnapshot(ref, (snap) => {
            setUserData(snap.data());
        });
        
        return () => unsub();
    }, []);

    if(!userData) return null;

    const fields = [
        userData.bio,
        userData.skills?.length > 0,
        userData.profileImage,
    ];

    const completedCount = fields.filter(Boolean).length;
    const progress = Math.round((completedCount / fields.length) * 100);
    const isComplete = progress === 100;

    const joinDate = userData.createdAt?.toDate?.().toDateString?.() || "—";

  return (
    <View className="flex-1 px-6 pt-12" style={{ backgroundColor: theme?.background || lightColors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View className="flex-row items-center gap-5 mb-5">
        <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={theme?.text || lightColors.text} />
        </Pressable>
          <Text  className="font-semibold text-xl" style={{ color: theme?.text || lightColors.text }}>
              About Account
          </Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
    >

        <View className="rounded-3xl p-5 items-center mb-5" style={{ backgroundColor: theme?.card || lightColors.card }}>

            <View className="w-28 h-28 rounded-full items-center justify-center mb-3"
                style={{ borderWidth: 3, borderColor: theme?.primary || lightColors.primary }}
            >     
                <Image source={{ uri: userData.profileImage }} className="w-24 h-24 rounded-full"/>  
            </View>
            <Text className="text-2xl font-semibold" style={{ color: theme?.primary || lightColors.primary }}>
                {userData.name}
            </Text>

            <View className='flex-row items-center gap-1'>
                <Text className="text-base mt-1 font-semibold" style={{ color: theme?.text || lightColors.text }}>
                    ⭐ {userData.rating || 0}
                </Text>  
                <Text className="text-sm mt-1" style={{ color: theme?.subText || lightColors.subText }}>
                    ({userData.totalReviews || 0} reviews)
                </Text>
            </View>

           {/* Bio */}
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text
                    className='text-center mt-3 ml-2'
                    style={{ color: theme?.subText || lightColors.subText }}
                    numberOfLines={expanded ? 4 : 1}
                >
                    {userData?.bio}
                </Text>
                {userData?.bio?.length > 100 && (
                    <Text style={{ color: theme?.purple || lightColors.purple, textAlign: "center", marginLeft: 4, marginTop: 4}}>
                        {expanded ? "Show less" : "Show more"}
                    </Text>
                )}
            </TouchableOpacity>
        </View>


        {/* PROFILE PROGRESS CARD */}
        <View className="rounded-3xl p-4 mb-5" style={{ backgroundColor: theme?.primary || theme?.tagText }}>
            <Text className='text-sm font-semibold' style={{ color: theme?.tagBg || lightColors.tagBg }}>
                PROFILE PROGRESS
            </Text>

            <View className="flex-row items-center mt-2 mb-1 justify-between">
                <View>
                    <Text className='text-xl font-semibold' style={{ color: lightColors.text || theme?.text }}>
                        {progress}% Completed
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push("/features/profile/screens/edit-profile")}
                        className='w-24 mt-4 px-3 py-2 rounded-full'
                        style={{ 
                            backgroundColor: themeMode === "dark"
                                ? "rgba(255,255,255,0.2)"   
                                : "rgba(0,0,0,0.05)",
                        }}
                    >
                        <Text className='text-xs text-center' style={{ color: theme?.tagBg || lightColors.tagBg }}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
                
                {/* Circle Icon */}
                <View className='w-20 h-20 rounded-full border items-center justify-center mr-2 mb-1'
                     style={{ borderWidth: 4, borderColor: theme?.border || lightColors.border }}
                >
                    <Ionicons 
                        name={isComplete ? "checkmark-circle-outline" : "time-outline"}
                        size={24}
                        color={lightColors.text || theme?.text}
                    />
                </View> 
            </View>

            {!isComplete && (
                <TouchableOpacity
                    onPress={() => router.push("/features/auth/screens/onboarding")}
                    className='mt-2 px-3 py-1'
                >
                    <Text className='text-xs text-white'>Completed Your Profile</Text>
                </TouchableOpacity>
            )}
        </View>

        {/* SKILLS SECTION */}
        <View
            className="rounded-3xl p-4 mb-5"
            style={{ backgroundColor: theme?.card || lightColors.card }}
        >
            {/* Title */}
            <Text className="text-lg font-semibold mb-4" style={{ color: theme?.primary || lightColors.primary }}>
                Skills
            </Text>

            {/* Skills OR Empty State */}
            {userData?.skills && userData?.skills?.length > 0 ? (
            <View className="flex-row flex-wrap gap-2 mb-1">
                {userData.skills.map((skill: string, index: number) => (
                <View
                    key={index}
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: theme?.lightGray || lightColors.lightGray }}
                >
                    <Text className="text-sm font-medium" style={{ color: theme?.primary || lightColors.darkGray }}>
                    {skill}
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
        </View>

        {/* PERSONAL DETAILS */}
        <View className="rounded-3xl p-4 mb-5" style={{ backgroundColor: theme?.card || lightColors.card }}>

            {/* Title */}
            <Text className="text-lg font-semibold mb-4" style={{ color: theme?.primary || lightColors.primary }}>
                Personal Details
            </Text>

            <View className='gap-3 mb-1 px-1'>
                <View className='flex-row justify-between items-center'>
                    <View>
                        <Text className='text-sm mb-1 font-semibold' style={{ color: theme?.subText || lightColors.subText }}>
                            USER ID
                        </Text>
                        <Text style={{ color: theme?.text || lightColors.text}}>{auth.currentUser?.uid}</Text>
                    </View>
                    <Ionicons name='person-outline' size={18} color={theme?.subText || lightColors.subText} />
                </View>

                <View style={{ height: 1, backgroundColor: theme?.border || lightColors.border }} />
                
                <View className='flex-row justify-between items-center'>
                    <View>
                        <Text className='text-sm mb-1 font-semibold' style={{ color: theme?.subText || lightColors.subText }}>
                            EMAIL
                        </Text>
                        <Text style={{ color: theme?.text || lightColors.text }}>{userData.email}</Text>
                    </View>
                    <Ionicons name='mail-outline' size={20} color={theme?.subText || lightColors.subText} />
                </View>

                <View style={{ height: 1, backgroundColor: theme?.border || lightColors.border }} />
                
                
                <View className='flex-row justify-between items-center'>
                    <View>
                        <Text className='text-sm mb-1 font-semibold' style={{ color: theme?.subText || lightColors.subText }}>
                            JOINED
                        </Text>
                        <Text style={{ color: theme?.text || lightColors.text }}>{joinDate}</Text>                 
                    </View>
                    <Ionicons name='calendar-clear-outline' size={18} color={theme?.subText || lightColors.subText} />
                </View>
            </View>
        </View>
    
      </ScrollView>
    </View>
  );
}
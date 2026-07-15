import { FlatList, Image, Text, TouchableOpacity, View, Pressable, Appearance } from 'react-native';
import React, { useEffect, useState, useRef } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { darkColors, lightColors } from '@/app/components/theme/colors';
import { AppInput } from '@/app/components/common/AppInput';
import { getAuth } from 'firebase/auth';
import {  listenToMessages, sendMessage } from '../services/chatService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { getTimeAgo } from '@/app/utils/time';
import { useTheme } from '@/context/ThemeContext';
import { useBlockedCheck } from '@/hooks/useBlockedCheck';
import BlockedNotice from '@/app/components/common/BlockedNotice';

export default function ChatScreen() {
    const { tradeId, name, avatar, userId } = useLocalSearchParams();
    const chatId = Array.isArray(tradeId) ? tradeId[0] : tradeId;
    const flatListRef = useRef<FlatList>(null);

    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

    const [otherUser, setOtherUser] = useState({ name, avatar });

    const userName = Array.isArray(otherUser?.name)
        ? otherUser.name[0]
        : otherUser?.name;

    const userAvatar = Array.isArray(otherUser?.avatar)
        ? otherUser.avatar[0]
        : otherUser?.avatar;

    const auth = getAuth();
    const user = auth.currentUser;

    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState("");

    const { canChat } = useBlockedCheck();

    useEffect(() => {
        if (!chatId) return;

        const unsubscibe = listenToMessages(chatId as string, setMessages);

        return () => unsubscibe();
    }, [chatId]);

    useEffect(() => {
        if (messages.length > 0) {
            flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }
    }, [messages]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme?.background || lightColors.background }}>
        <StatusBar style={isDark ? "light" : "dark"} />

            <View 
                className="px-4 py-3 border-b flex-row items-center gap-3"
                style={{ borderColor: theme?.border || lightColors.border }}
            >
                {/*Back Button */}
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name='arrow-back' size={22} color={theme?.text || lightColors.text} />
                </TouchableOpacity>

                {/* User Info */}
                <Pressable 
                    className="flex-row items-center gap-3"
                    onPress={() => {
                        if (userId === user?.uid) {
                            router.push("/(tabs)/profile");
                        } else {
                            router.push({
                                pathname: "/features/profile/screens/UserProfileScreen",
                                params: { userId },
                            });
                        }
                    }}  
                >
                    {/* Avatar */}
                    {otherUser?.avatar ? (
                        <Image source={{ uri: userAvatar}} className="w-10 h-10 rounded-full"/>
                
                    ) : (
                        <View
                            className="w-10 h-10 rounded-full items-center justify-center"
                            style={{ backgroundColor: theme?.primary || lightColors.primary + "20" }}
                        >
                            <Text className="font-bold" style={{ color: theme?.primary || lightColors.primary }}>
                                {userName?.charAt(0) || "U"}
                            </Text>
                        </View>
                    )}

                    {/* Name */}
                    <Text className="font-semibold text-base" style={{ color: theme?.text || lightColors.text }}>
                        {otherUser?.name || "User"}
                    </Text>
                </Pressable>

            </View>

            {!canChat && (
                <BlockedNotice 
                    className=""px-4 pt-3
                    title="Chat Disabled"
                    message="You cannot send messages because your account has been blocked by the admin. "
                />
            )}

            {messages.length === 0 && (
                <Text
                    className="text-center mt-4"
                    style={{ color: theme?.subText || lightColors.subText }}
                >
                    No messages yet. Start the conversation.
                </Text>
            )}

            {/* Messages */}
            <FlatList 
                className='flex-1'
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                inverted
                contentContainerStyle={{ padding: 16 }}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => {
                    const isMe = item.senderId === user?.uid;

                    return (
                        <View 
                            className={`mb-3 max-w-[75%] px-4 py-2 rounded-2xl ${
                                isMe? "self-end rounded-br-sm" : "self-start rounded-bl-sm"
                            }`} 
                            style={{ backgroundColor: isMe ? theme?.primary || lightColors.primary : theme?.secondary || lightColors.secondary }}
                        >
                            <Text className="text-sm" style={{color: darkColors.text || lightColors.text}}>
                                {item.text}
                            </Text>

                            {/* Timestamp */}
                            <Text className="text-[10px] mt-1 text-right" style={{ color: isMe ? "#e0f2f1" : "#e0f2f1" }}>
                                {getTimeAgo(item.timestamp)}
                            </Text>
                        </View>
                    )
                }}
            />

            <View className="pb-2" style={{ backgroundColor:  theme?.background || lightColors.background }}>
                <View
                    className="flex-row items-center gap-2 px-3 py-2 border-t"
                    style={{ borderColor: theme?.border || lightColors.border }}
                >
                    <View className='flex-1 mt-2'>
                        <AppInput 
                            className="h-12 px-3 rounded-xl"
                            placeholder="Type a message..."
                            value={input}
                            onChangeText={setInput}
                            editable={canChat}
                        />
                    </View>

                    <TouchableOpacity 
                        className="w-12 h-12 rounded-2xl py-4 mt-2 items-center justify-center"
                        style={{ marginRight: 6, backgroundColor: theme?.primary || lightColors.primary }}
                        disabled={!canChat}
                        onPress={async () => {
                            if (!canChat) return;
                            if (!input.trim()) return;

                            await sendMessage(chatId as string, {
                                text: input,
                                senderId: user?.uid || "",
                            });

                            setInput("");
                        }}
                    >
                        <Ionicons name="send" size={15} color={theme?.buttonText || lightColors.buttonText}/>
                    </TouchableOpacity>
                </View>
            </View>
    </SafeAreaView>
  );
}

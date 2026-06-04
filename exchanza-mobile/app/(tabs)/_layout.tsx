import { Tabs } from "expo-router";
import { Appearance, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { darkColors, lightColors } from "../components/theme/colors";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNotifications } from "../features/notifications/services/NotificationContext";
import { useNotificationSettings } from "../features/notifications/services/NotificationSettingsContext";
import { useTheme } from "@/context/ThemeContext";

export default function TabLayout() {

    const { unreadCount } = useNotifications();
    const { settings } = useNotificationSettings();
    const { theme, themeMode } = useTheme();
    const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

  return (
    <Tabs
        screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                position: "absolute",
                bottom: 0,
                left: 16,
                right: 16,
                height: 82,
                borderRadius: 20,
                backgroundColor: theme?.card || lightColors.card,
                elevation: 10,
                shadowColor: "#000",
                shadowOpacity: 0.08,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 4 },
                borderTopWidth: 0,
            }
        }}
    >
        <Tabs.Screen
            name="index"
            options={{
                tabBarIcon: ({ focused }) => (
                    <Ionicons 
                        name="home" 
                        size={24} 
                        color={focused 
                            ? theme?.primary || lightColors.primary 
                            : theme?.subText || lightColors.subText}
                    />
                )
            }}
        />

        <Tabs.Screen
            name="trades"
            options={{
                tabBarIcon: ({ focused }) => (
                    <Feather 
                        name="refresh-cw" 
                        size={24} 
                        color={focused 
                            ? theme?.primary || lightColors.primary 
                            : theme?.subText || lightColors.subText
                        }
                    />
                )
            }}
        />

        <Tabs.Screen
            name="create"
            options={{
            tabBarIcon: () => null,
            tabBarButton: (props) => (
                <TouchableOpacity
                    activeOpacity={0.85}
                    {...(props as any)}
                    className="items-center justify-center"
                    style={{ top: -22 }}
                    >
                    <View
                        style={{
                            backgroundColor: theme?.primary || lightColors.primary,
                            width: 50,
                            height: 50,
                            borderRadius: 30,
                            alignItems: "center",
                            justifyContent: "center",
                            elevation: 6,
                            shadowColor: "#000",
                            shadowOpacity: 0.2,
                            shadowRadius: 6,
                            shadowOffset: { width: 0, height: 3},
                        }}
                    >
                        <Ionicons name="add" size={28} color={ isDark ? lightColors.text : darkColors.text }/>
                    </View>
                </TouchableOpacity>
            ),
            }}
        />

        <Tabs.Screen
            name="notifications"
            options={{
                tabBarIcon: ({ focused }) => (
                    <View>
                        <Ionicons 
                            name="notifications" size={24} 
                            color={focused 
                                ? theme?.primary || lightColors.primary 
                                : theme?.subText || lightColors.subText
                            }
                        />

                        {/* BADGE */}
                        {settings?.badge && unreadCount > 0 && (
                            <View
                                style={{
                                    position: "absolute",
                                    top: -3,
                                    right: -5,
                                    backgroundColor: "red",
                                    borderRadius: 10,
                                    minWidth: 14,
                                    height: 14,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    paddingHorizontal: 4,
                                }}
                            >
                                <Text style={{ color: "#fff" , fontSize: 10 }}>
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </Text>
                            </View>    
                        )}
                    </View>
                ),
            }}
        />

        <Tabs.Screen
            name="profile"
            options={{
                tabBarIcon: ({ focused }) => (
                    <Ionicons 
                        name="person" size={24} 
                        color={focused 
                            ? theme?.primary || lightColors.primary 
                            : theme?.subText || lightColors.subText
                        }
                    />
                )
            }}
        />
        
    </Tabs>
  );
}

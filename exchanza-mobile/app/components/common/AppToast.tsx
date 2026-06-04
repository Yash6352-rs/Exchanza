import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, PanResponder, Text, View } from "react-native";
import { lightColors } from "../theme/colors";
import { useTheme } from "@/context/ThemeContext";

type Props = {
    visible: boolean;
    message: string;
    icon?: keyof typeof Ionicons.glyphMap;
    color: string;
    onHide: () => void;
}

export default function AppToast({ visible, message, icon = "checkmark-circle", onHide, color}: Props) {
    const translateY = useRef(new Animated.Value(-100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const { theme } = useTheme();

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide after 2 sec
            const timer = setTimeout(() => {
                handleHide();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    // Hide animation
    const handleHide = () => {
        Animated.parallel([
            Animated.timing(translateY, {
                toValue: -100,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start(onHide);
    };

    // Swipe to dismiss
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gesture) => 
                Math.abs(gesture.dx) > 20,

            onPanResponderRelease: (_, gesture) => {
                if (Math.abs(gesture.dx) > 50) {
                    handleHide();
                }
            },
        })
    ).current;

    if (!visible) return null;
    
  return (
    <Animated.View
        {...panResponder.panHandlers}
        style={{ 
            transform: [{ translateY }], 
            opacity,
            width: "100%",
        }}
        className="absolute top-20 left-2 z-50"
        >
        <View
            className="flex-row items-center px-4 py-3"
            style={{ 
            flex: 1,
            backgroundColor: theme?.card || lightColors.card,
            borderLeftWidth: 4,
            borderLeftColor: color,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
            }}
        >
            <Ionicons name={icon} size={20} color={color} style={{ marginRight: 10 }}/>

            <Text
            style={{ 
                flex: 1,
                color: theme?.text || lightColors.text,
                fontSize: 14,
                fontWeight: "500",
            }}
            numberOfLines={2}
            >
            {message}
            </Text>
        </View>
    </Animated.View>
  );
}
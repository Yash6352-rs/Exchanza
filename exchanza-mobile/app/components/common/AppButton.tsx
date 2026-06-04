import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { lightColors } from '../theme/colors'
import { useTheme } from '@/context/ThemeContext';

export const AppButton = ({title, onPress, loading, disabled, variant, opacity}: any) => {
    const isDisabled = disabled || loading;

    const { theme } =  useTheme();

    const getStyles = () => {
    switch (variant) {
      case "outline":
        return {
          container: "border",
          style: {
            borderColor: theme?.border || lightColors.border,
            backgroundColor: "transparent",
          },
          text: {
            color: theme?.text || lightColors.text,
          },
        };

      case "danger":
        return {
          container: "",
          style: {
            backgroundColor: theme?.error || lightColors.error,
          },
          text: {
            color: "#fff",
          },
        };

      default:
        return {
          container: "",
          style: {
            backgroundColor: theme?.buttonPrimary || lightColors.buttonPrimary,
          },
          text: {
            color: theme?.buttonText || lightColors.buttonText,
          },
        };
    }
  };

  const styles = getStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isDisabled}
      className={`w-full h-14 rounded-2xl py-4 items-center justify-center 
        ${isDisabled ? "opacity-60" : ""} ${styles.container}`}
      style={[ styles.style,
        {
          opacity: opacity ?? 1,
          shadowColor: "#000",
          shadowOpacity: variant === "primary" ? 0.08 : 0,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: variant === "primary" ? 3 : 0,
        },
      ]}
    >
      <View className="items-center justify-center">
    
        {/* TEXT */}
        <Text
          className={`text-[16px] font-semibold tracking-wide ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          style={styles.text}
        >
          {title}
        </Text>

        {/* LOADER */}
        {loading && (
          <View className="absolute">
            <ActivityIndicator color={styles.text.color} />
          </View>
        )}

      </View>
    </TouchableOpacity>
  );
};
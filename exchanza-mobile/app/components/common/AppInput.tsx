// components/AppInput.tsx

import { View, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { lightColors } from "../theme/colors";
import { useTheme } from "@/context/ThemeContext";

export const AppInput = ({
  icon,
  placeholder,
  value,
  onChangeText,
  editable,
  secureTextEntry,
  classname = "",
}: any) => {
  const [hidden, setHidden] = useState(secureTextEntry);
  const { theme } = useTheme();

  return (
    <View
      className={`flex-row items-center px-4 py-0.5 rounded-2xl border ${classname}`}
      style={{
        backgroundColor: theme?.card || lightColors.card,
        borderColor: theme?.border || lightColors.border,
      }}
    >
      <Ionicons className='mr-2' name={icon} size={19} color={theme?.subText || lightColors.subText}/>

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme?.subText || lightColors.subText}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        secureTextEntry={hidden}
        className="flex-1 text-base"
        style={{ color: theme?.text || lightColors.text }}
      />

      {secureTextEntry && (
        <TouchableOpacity onPress={() => setHidden(!hidden)}>
          <Ionicons
            name={hidden ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={theme?.subText || lightColors.subText}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
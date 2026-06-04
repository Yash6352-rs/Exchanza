import { lightColors } from "@/app/components/theme/colors";
import { useTheme } from "@/context/ThemeContext";
import { View, Text, TouchableOpacity, Modal } from "react-native";

type Option = {
  label: string;
  onPress: () => void;
  danger?: boolean;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  options: Option[];
};

export default function AppActionMenu({ visible, onClose, options }: Props) {
  const { theme } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade">
      
      {/* Overlay */}
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 justify-end bg-black/30"
      >
        {/* Dropdown Menu */}
        <View className="absolute top-24 right-4 w-52 p-1 rounded-xl shadow-lg"
          style={{ backgroundColor: theme?.card || lightColors.card }}
        >
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                onClose();
                option.onPress();
              }}
              className="px-4 py-3"
            >
              <Text
                className="text-base"
                style={{ 
                  color: option.danger 
                    ? theme?.error || lightColors.error 
                    : theme?.text || lightColors.text 
                  }}
              >
                {option.label}    
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
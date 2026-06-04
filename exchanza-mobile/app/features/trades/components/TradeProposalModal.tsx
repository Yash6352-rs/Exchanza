import { AppButton } from "@/app/components/common/AppButton";
import { AppInput } from "@/app/components/common/AppInput";
import { lightColors } from "@/app/components/theme/colors";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable,Text, TouchableOpacity, View } from "react-native";

interface Props {
    visible: boolean;
    loading: any,
    onClose: () => void;
    onSubmit: (data: { offer: string; want: string }) => void;
}

export default function TradeProposalModal({ visible, loading, onClose, onSubmit}: Props) {
    const [offer, setOffer] = useState("");
    const [want, setWant] = useState("");

    const { theme } = useTheme();
    
    const handleSubmit = () => {
        if (!offer || !want) return;

        onSubmit({ offer, want });

        setOffer("");
        setWant("");
        onClose();  
    };

  return (
    <Modal visible={visible} animationType="fade" transparent>
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding": undefined}
            className="flex-1 justify-center items-center bg-black/40 px-5"
        >
            {/* CARD */}
            <View className="w-full p-6 rounded-3xl border border-border"
                style={{ backgroundColor: theme?.card || lightColors.card }}
            
            >
                {/* HEADER */}
                <View className="flex-row items-center justify-between mb-2 mt-1">
                    <Text className="text-3xl font-semibold" style={{ color: theme?.primary || lightColors.primary }}>
                        Propose Trade
                    </Text>

                    <Pressable onPress={onClose}>
                        <Ionicons name="close" size={24} color={theme?.text || lightColors.text} />
                    </Pressable>
                </View>

                <Text className="text-base font-semibold mb-8" style={{ color: theme?.subText || lightColors.subText }}>
                    Craft a thoughtful exchange to build a connection.
                </Text>

                {/* INPUTS */}
                <View className="mb-4">
                    <Text className="text-sm font-semibold mb-2" style={{ color: theme.text || lightColors.text }}>
                        WHAT YOU ARE OFFERING
                    </Text>
                    <AppInput
                        placeholder="e.g. I can design your UI screens"
                        value={offer}
                        onChangeText={setOffer}
                        multiline
                    />
                </View>

                <View className="mb-5">
                    <Text className="text-sm font-semibold mb-2" style={{ color: theme.text || lightColors.text }}>
                        WHAT YOU WANT
                    </Text>
                    <AppInput
                        placeholder="e.g. Need help with backend APIs"
                        value={want}
                        onChangeText={setWant}
                        multiline
                    />
                </View>

                {/* ACTION */}
                <AppButton title="Send Proposal" onPress={handleSubmit} loading={loading}/>

                <TouchableOpacity onPress={onClose}>
                    <Text className="text-base text-center mt-4" style={{ color: theme?.subText || lightColors.subText }}>
                        Cancel
                    </Text>
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
    </Modal>
  );
}

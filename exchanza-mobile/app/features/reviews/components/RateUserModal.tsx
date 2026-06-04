import { lightColors } from "@/app/components/theme/colors";
import { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import RatingStars from "./RatingStars";
import { AppInput } from "@/app/components/common/AppInput";
import { AppButton } from "@/app/components/common/AppButton";
import WaveHeader from "./WaveHeader";
import { useTheme } from "@/context/ThemeContext";
import { Loader } from "@/app/components/common/Loader";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string }) => void;
  user: {
    name: string;
    avatar?: string;
  };
  loading?: boolean;
};

const getRatingLabel = (rating: number) => {
  if (rating <= 2) return "Poor";
  if (rating <= 3) return "Okay";
  if (rating <= 4) return "Good";
  return "Excellent";
};

export default function RateUserModal({ visible, onClose, onSubmit, user, loading }: Props) {
    
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { theme } = useTheme();

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit({ rating, comment });
  };


  return (
    <Modal visible={visible} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center px-7">

            {/* CARD */}
            <View
                className="w-full rounded-3xl overflow-hidden"
                style={{ backgroundColor: theme?.card || lightColors.card }}
            >

                {/* Wave Header */}
                <WaveHeader />

                {/* Avatar */}
                <View className="items-center -mt-32 mb-2">
                    <View className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white shadow-md">
                    {user.avatar ? (
                        <Image source={{ uri: user.avatar }} className="w-full h-full" />
                    ) : (
                        <View className="w-full h-full bg-gray-200" />
                    )}
                    </View>
                </View>

                {/* CONTENT */}
                <View className="px-6 pb-6 items-center">

                    <Text className="text-lg font-semibold mb-3">{user.name}</Text>

                    <Text
                        className="text-center text-base mb-5"
                        style={{ color: theme?.subText || lightColors.subText }}
                    >
                        How Would You Rate Our Trade Experience?
                    </Text>

                    <View className="items-center mb-5">
                        <RatingStars rating={rating} onChange={setRating} size={34} />

                        {rating > 0 && (
                            <Text className="mt-2 text-sm" style={{ color: theme?.subText || lightColors.subText }}>
                            {getRatingLabel(rating)}
                            </Text>
                        )}
                    </View>

                    <AppInput
                        placeholder="Write a comment (optional)"
                        value={comment}
                        onChangeText={setComment}
                        classname="w-full mb-5"
                    />

                    <View className="w-full mb-5">
                        <AppButton
                            title="Submit"
                            onPress={handleSubmit}
                            loading={loading}
                            disabled={rating === 0}
                        />
                    </View>

                    <TouchableOpacity onPress={onClose}>
                        <Text className="text-sm" style={{ color: theme?.subText || lightColors.subText }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    </Modal>
  );
}

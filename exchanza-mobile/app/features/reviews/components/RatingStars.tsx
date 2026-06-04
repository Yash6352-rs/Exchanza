import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";

type Props = {
    rating: number;
    onChange?: (value: number) => void;
    size?: number;
};

export default function RatingStars({ rating, onChange, size = 28}: Props) {
    const isEditable = !!onChange;

    const handlePress = (index: number, isHalf: boolean) => {
        if (!isEditable) return;

        const value = isHalf ? index + 0.5 : index + 1;
        onChange?.(value);
    };

    const renderStar = (index: number) => {
        const full = index + 1 <= rating;
        const half = index + 0.5 === rating;

        let iconName: any = "star-outline";

        if (full) iconName = "star";
        else if (half) iconName = "star-half";

        return (
            <View key={index} className="flex-row">
                <TouchableOpacity activeOpacity={0.7} onPress={() => handlePress(index, false)}>
                    <Ionicons name={iconName} size={size} color="#FFD700" />
                </TouchableOpacity>

            </View>
        )
    }

  return (
    <View className="flex-row">
        {[0, 1, 2, 3, 4].map((i) => renderStar(i))}
    </View>
  );
}

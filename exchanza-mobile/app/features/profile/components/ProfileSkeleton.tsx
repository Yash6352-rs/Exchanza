import { View } from "react-native";
import { Skeleton } from "moti/skeleton";
import { lightColors } from "@/app/components/theme/colors";
import { useTheme } from "@/context/ThemeContext";

export default function ProfileSkeleton() {
    const { theme } = useTheme();

  return (
        <View
            className="flex-1 px-4 pt-12"
            style={{ backgroundColor: theme?.background || lightColors.background }}
        >

             {/* HEADER */}
            <View className="flex-row justify-between items-center mb-4">
                <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={24} width={120} />
                <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={24} width={24} radius="round" />
            </View>

            {/* HERO CARD */}
            <View className="rounded-xl p-5" style={{ backgroundColor: theme?.card || lightColors.card }}>

                <View className="flex-row gap-4">
                    {/* Avatar */}
                    <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={112} width={112} radius="round" />

                    {/* Name + Rating */}
                    <View className="mt-8 gap-2">
                        <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={20} width={140} />
                        <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={14} width={120} />
                    </View>
                </View>

                {/* Bio */}
                <View className="mt-4 gap-2">
                    <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={12} width={"100%"} />
                    <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={12} width={"80%"} />
                </View>

                {/* Button */}
                <View className="mt-4">
                    <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={48} width={"100%"} radius={12} />
                </View>
            </View>

            {/* SKILLS */}
            <View className="mt-4 rounded-xl p-4" style={{ backgroundColor: theme?.card || lightColors.card }}>
                <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={20} width={100} />

                <View className="flex-row flex-wrap mt-3 gap-2">
                    {[1, 2, 3, 4].map((_, i) => (
                        <View key={i}>
                            <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={30} width={70} radius={20} />
                        </View>
                    ))}
                </View>
            </View>

            {/* STATS */}
            <View className="mt-4 rounded-xl p-4" style={{ backgroundColor: theme?.card || lightColors.card }}>
                <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={20} width={80} />

                <View className="flex-row justify-between mt-4">
                    {[1, 2, 3].map((_, i) => (
                        <View key={i} className="items-center">
                            <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={80} width={80} radius={24} />
                        </View>
                    ))}
                </View>
            </View>

            {/* ACTIVE POSTS */}
            <View className="mt-4 rounded-xl p-4" style={{ backgroundColor: theme?.card || lightColors.card }}>
                <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={20} width={120} />

                <View className="flex-row mt-4">
                    {[1, 2].map((_, i) => (
                        <View key={i} className="mr-3">
                            <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={250} width={300} radius={12} />
                        </View>
                    ))}
                </View>
            </View>

            {/* COMPLETED TRADES */}
            <View className="mt-4 rounded-xl p-4" style={{ backgroundColor: lightColors.card }}>
                <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={20} width={150} />

                <View className="mt-4 gap-4">
                    {[1, 2, 3].map((_, i) => (
                        <View key={i} className="flex-row items-center gap-3">
                            <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={48} width={48} radius="round" />
                            <View className="flex-1 gap-2">
                                <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={14} width={"60%"} />
                                <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={12} width={"40%"} />
                            </View>
                            <Skeleton colors={[theme?.lightGray || lightColors.lightGray, theme?.border || lightColors.border]}height={12} width={40} />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}



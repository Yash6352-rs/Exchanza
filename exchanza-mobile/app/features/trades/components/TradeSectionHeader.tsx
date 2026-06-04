import { lightColors } from "@/app/components/theme/colors";
import { useTheme } from "@/context/ThemeContext";
import { Text, View } from "react-native";

type Props = {
    status: "pending" | "accepted" | "completed" | "rejected";
    isSender: boolean;
};

export default function TradeSectionHeader({
    status, isSender
}: Props) {
    const { theme } = useTheme();

    let title = "";
    let heading = "";
    let description = "";

    if (status === "pending") {
        title = "Pending";

        if (isSender) {
            heading = "Send Requests";
            description = "Trades you have proposed - waiting for approval.";
        } else {
            heading = "Incoming Requests";
            description = "Review and accept trade proposals sent to you.";
        }
    }

    if (status === "accepted") {
        title = "Active";
        heading = "In Progress";
        description = "Your trades are underway - stay connected and complete them smoothly.";
    }

    if (status === "completed") {
        title = "Completed";
        heading = "Past Transactions";
        description = "Review adn rate recenlty completed peer-to-peer exchanges.";
    }

    if (status === "rejected") {
        title = "Rejected";

        if (isSender) {
            heading = "Declined by Others";
            description = "Trades you proposed that were declined.";
        } else {
            heading = "You Declined";
            description = "Trades you chose not to accept.";
        }
    }

    return (

        <View className="mb-5">
            {/* Tab Name */}
            <Text className="text-xl font-bold"
                style={{ color: theme?.primary || lightColors.primary }}
            >
                {title}
            </Text>

            <View className="h-[2px] w-16 mt-1 mb-4 rounded-full"/>

            {/* Section Heading */}
            <Text className="text-2xl font-semibold mb-2"
                style={{ color: theme?.text || lightColors.text }}
            >
                {heading}
            </Text>

            <Text className="text-sm" style={{ color: theme?.subText || lightColors.subText }}>
                {description}
            </Text>

        </View>
    )
}


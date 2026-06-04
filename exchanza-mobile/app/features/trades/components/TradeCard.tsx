import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native'
import { lightColors } from '@/app/components/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
interface Props {
    trade: any;
    currentUserId: string;
    onAccept?: () => void;
    onReject?:() => void;
    onComplete?: () => void;
    onRate?: () => void;
    onChat?: () => void;
    review?: {
        rating: number;
    };
    onInvoice?: () => void;
    invoice?: any;

    acceptLoading?: boolean;
    rejectLoading?: boolean;
    completeLoading?: boolean;
    reviewLoading?: boolean;

    canAcceptTrade?: boolean;
    canRejectTrade?: boolean;
    canCompleteTrade?: boolean;
    canRateTrade?: boolean;
    canDownloadInvoice?: boolean;
};

export default function TradeCard({
    trade, currentUserId, onAccept, onReject, onComplete, onRate, onChat, review, onInvoice, invoice, 
    acceptLoading, rejectLoading, completeLoading, reviewLoading,
    canAcceptTrade, canRejectTrade, canCompleteTrade, canRateTrade, }: Props) {

    const isSender = trade.fromUserId === currentUserId;

    const firstAvatar = isSender ? trade.fromUserAvatar : trade.toUserAvatar;
    const secondAvatar = isSender ? trade.toUserAvatar : trade.fromUserAvatar;

    const firstUserId = isSender ? trade.fromUserId : trade.toUserId;
    const secondUserId = isSender ? trade.toUserId : trade.fromUserId;

    const { theme } = useTheme();

    const getStatusColor = () => {
        if (trade.status === "pending") return theme?.brown || lightColors.brown;
        if (trade.status === "rejected") return theme?.error || lightColors.error;
        if (trade.status === "accepted") return theme?.secondary || lightColors.secondary;
        if (trade.status === "completed") return theme?.success || lightColors.success;
    }
    const statusColor = getStatusColor();

    const getDetailsMessage = () => {
        switch (trade.status) {
            case "pending":
                return "Open details to review this trade request."
            case "accepted":
                return "Open details to manage this active trade.";
            case "completed":
                return "Open trade details for more information and actions.";
            case "rejected":
                return "Open details to view trade information.";
            default:
                return "Open details to review and manage this trade";
        }
    }
    
  return (
    <TouchableOpacity
        activeOpacity={0.97}
        onPress={() => router.push({
            pathname: "/features/trades/[id]",
            params: {
                id: trade.id,
                currentUserId: currentUserId,
            }
        })}
    > 
        <View className="px-5 py-4 rounded-2xl border border-border mb-4"
            style={{
                backgroundColor: theme?.card || lightColors.card,
                shadowColor: "#000",
                shadowOpacity: 0.04,
                shadowRadius: 10,
                elevation: 3,
            }}
        >
            {/* TOP ROW */}
            <View className='flex-row justify-between items-center'>
                {/* TRADE ID */}
                <Text className="text-sm font-bold" style={{ color: theme?.primary || lightColors.primary }}>
                    TRADE #{trade.id.slice(0, 6)}
                </Text>

                <View className="flex-row items-center">
                    
                    {/* Second Avatar (behind) */}
                    <TouchableOpacity
                        onPress={() => {
                            if (secondUserId === currentUserId) {
                                router.push("/(tabs)/profile");
                            } else {
                                router.push({
                                    pathname: "/features/profile/screens/UserProfileScreen",
                                    params: { userId: secondUserId }
                                });
                            }
                        }}
                    >
                        <Image
                            source={{ uri: secondAvatar }}
                            style={{width: 35, height: 35, borderRadius: 16, borderWidth: 2, borderColor: "#fff"}}
                        />
                    </TouchableOpacity>

                    {/* First Avatar (front) */}
                    <TouchableOpacity
                        onPress={() => {
                            if ( firstUserId === currentUserId) {
                                router.push("/(tabs)/profile");
                            } else {
                                router.push({
                                    pathname: "/features/profile/screens/UserProfileScreen",
                                    params: { userId: firstUserId }
                                });
                            }
                        }}
                    >
                        <Image 
                            source={{ uri: firstAvatar }}
                            style={{ width: 35, height: 35, borderRadius: 16, marginLeft: -10, borderWidth: 2, borderColor: "#fff"}}
                        />
                    </TouchableOpacity>
                </View>

            </View>

            <View className='flex-row mb-4 gap-2 items-center'>
                {/* USERS */}
                <Text className="text-xl px-2 py-1 font-semibold" style={{ color: theme?.text || lightColors.text }}>
                    {trade.fromUserId === currentUserId ? "You" : trade.fromUserName || "User"}
                    {" "}↔{" "}
                    {trade.toUserId === currentUserId ? "You" : trade.toUserName || "User"}
                </Text>

                {/* STATUS BADGE */}
                <View className='px-3 py-1 mt-1 rounded-full' 
                    style={{ backgroundColor: 
                        trade.status === "pending"
                            ? theme?.lightBrown || lightColors.lightBrown
                            : trade.status === "accepted"
                                ? theme?.secondary + "20" || lightColors.secondary + "20"
                                : trade.status === "completed"
                                    ? theme?.success + "20" || lightColors.success + "20"
                                    : theme?.error + "20" || lightColors.error + "20",
                    }}
                >
                    <Text className="text-xs font-semibold" style={{ color: statusColor }}>
                        {trade.status.toUpperCase()}
                    </Text>
                </View>
            </View>

            {/* MESSAGE BOX */}
            <View className="rounded-2xl p-5 flex-row items-center mb-5"
                style={{ backgroundColor: theme?.border + "90" || lightColors.border + "90" }}
            >
                <View
                    className='w-12 h-12 rounded-xl items-center justify-center mr-3'
                    style={{ backgroundColor: theme?.background || lightColors.background }}
                >
                    <Ionicons size={20} color={theme?.primary || lightColors.primary}
                        name={
                            trade.status === "pending" 
                            ? "time-outline"
                            : trade.status === "accepted" 
                                ? "swap-horizontal-outline"
                                : trade.status === "completed"
                                    ? "checkmark-done-outline"
                                    : "close-circle-outline"
                        }              
                    />
                </View>

                <View className='flex-1'>
                    <Text className="text-xs font-semibold" style={{ color: theme?.subText || lightColors.subText }}>STATUS</Text>
                    <Text className="text-sm font-medium" style={{ color: theme?.text || lightColors.text }}>
                        {/* PENDING */}
                        {trade.status === "pending" && trade.fromUserId === currentUserId && "Waiting for acceptance..."}
                        {trade.status === "pending" && trade.toUserId === currentUserId &&  "Accept this trade to continue"}

                        {/* ACCEPTED */}
                        {trade.status === "accepted" && trade.fromUserId === currentUserId && "Your trade has been accepted"}
                        {trade.status === "accepted" && trade.toUserId === currentUserId && "You accepted the trade"}

                        {/* COMPLETED */}
                        {trade.status === "completed" && "Trade completed successfully"}
                        
                        {/* REJECTED */}
                        {trade.status === "rejected" && trade.fromUserId === currentUserId && "Your trade request was rejected"}
                        {trade.status === "rejected" && trade.toUserId === currentUserId && "You rejected this trade"}
                    </Text>
                </View>

                <View className="items-center">
                    <Ionicons 
                        className="mt-1"
                        name="chevron-forward"
                        size={20} 
                        color={ theme?.primary || lightColors.primary } 
                    />
                    <Text className="mt-1 text-[9px]">Details</Text>
                </View>
                
            </View>

            {/* AI INSIGHT BOX */}
            {trade.status === "pending" && trade.toUserId === currentUserId && trade.aiInsight && (
                <>
                    <View className="rounded-2xl p-5 flex-row items-center mb-6"
                        style={{ backgroundColor: theme?.border + "90" || lightColors.border + "90"}}
                    >
                        <View
                            className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                            style={{ backgroundColor: theme?.background || lightColors.background }}
                        >
                            <Ionicons name="sparkles-outline" size={20} color={theme?.purple || lightColors.purple}/>
                        </View>

                        <View className="flex-1">
                            <Text className="text-xs font-semibold" style={{ color: theme?.subText || lightColors.subText }}>
                                AI INSIGHT
                            </Text>

                            <Text className="text-sm font-medium" style={{ color: theme?.text || lightColors.text }}>
                                {trade.aiInsight}
                            </Text>
                        </View>

                        <View className="items-center">
                            <Ionicons
                                className="mt-1"
                                name="chevron-forward"
                                size={20}
                                color={theme?.purple || lightColors.purple}
                            />
                            <Text className="mt-1 text-[9px]">Details</Text>
                        </View>
                    </View>
                </>
            )}

            {/* ACTIONS */}
            <View className="flex-row justify-between gap-4 mb-1">

                {/* Open Chat */}
                {(trade.status === "accepted" || trade.status === "completed") && (
                    <TouchableOpacity 
                        activeOpacity={0.8}
                        className="flex-1 h-14 border rounded-2xl py-4 items-center justify-center"
                        style={{ backgroundColor: theme?.background || lightColors.background }}
                        onPress={onChat || (() => {})}
                    >
                        <Text className="text-base font-semibold" style={{ color: theme?.primary || lightColors.primary }}>
                            Open Chat
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Pending */}
                {trade.status === "pending" && !isSender && (
                    <View className="flex-row flex-1 gap-2">

                        {/* Reject */}
                        <TouchableOpacity
                            disabled={rejectLoading}
                            activeOpacity={0.8}
                            className="flex-1 h-14 border rounded-2xl py-4 items-center justify-center"
                            style={{ 
                                backgroundColor:theme?.background || lightColors.background,
                                opacity: canRejectTrade === false ? 0.6 : 1,
                            }}
                            onPress={onReject || (() => {})}
                        >
                            {rejectLoading ? (
                                <ActivityIndicator color={theme?.buttonText || lightColors.buttonText} />
                            ) : (
                                <Text className='text-base font-semibold' style={{ color: theme?.error || lightColors.error }}>
                                    Reject Trade
                                </Text>
                            )}
                        </TouchableOpacity>

                        {/* Accept */}
                        <TouchableOpacity 
                            disabled={acceptLoading}    
                            activeOpacity={0.8}
                            className="flex-1 h-14 rounded-2xl py-4 items-center justify-center"
                            style={{ 
                                backgroundColor: theme?.primary || lightColors.primary,
                                opacity: canAcceptTrade === false ? 0.6 : 1,
                            }}
                            onPress={onAccept || (() => {})}
                        >
                            {acceptLoading ? (
                                <ActivityIndicator color={theme?.buttonText || lightColors.buttonText} />
                            ) : (
                                <Text className='text-base font-semibold' style={{ color: theme?.buttonText || lightColors.buttonText }}>
                                    Accept Trade
                                </Text>
                            )}
                        </TouchableOpacity>

                    </View>    
                )}

                {/* Accepted */}
                {trade.status === "accepted" && (
                    <TouchableOpacity 
                        disabled={completeLoading}
                        activeOpacity={0.8}
                        className="flex-1 h-14 rounded-2xl py-4 items-center justify-center"
                        style={{ 
                            marginRight: 6, 
                            backgroundColor: theme?.primary || lightColors.primary,
                            opacity: canCompleteTrade === false ? 0.6 : 1,
                        }}
                        onPress={onComplete || (() => {})}
                    >
                        {completeLoading ? (
                            <ActivityIndicator color={theme?.buttonText || lightColors.buttonText} />
                        ) : (
                            <Text className='text-base font-semibold' style={{ color: theme?.buttonText || lightColors.buttonText }}>
                                Complete Trade
                            </Text>
                        )}
                    </TouchableOpacity>
                )}

                {/* Completed */}
                {trade.status === "completed" && (
                    <View className="flex-1">

                        {/* Rating */}
                        {review ? (
                            <View 
                                className="flex-1 h-14 rounded-2xl items-center justify-center"
                                style={{ 
                                    backgroundColor: theme?.border || lightColors.border,
                                    opacity: canRateTrade === false ? 0.6 : 1
                                }}
                            >
                                <Text className="text-base font-semibold" style={{ color: theme?.subText || lightColors.subText }}>
                                    You Rated ⭐ {review.rating}
                                </Text>
                            </View>

                        ) : (
                            <TouchableOpacity 
                                disabled={reviewLoading}
                                activeOpacity={0.8}
                                className="flex-1 h-14 rounded-2xl py-4 items-center justify-center"
                                style={{
                                    marginRight: 6, 
                                    backgroundColor: theme?.primary || lightColors.primary,
                                    opacity: canRateTrade === false ? 0.6 : 1,
                                }}
                                onPress={onRate || (() => {})}
                            >
                                {reviewLoading ? (
                                    <ActivityIndicator color={theme?.buttonText || lightColors.buttonText} />
                                ) : (
                                    <Text className='text-base font-semibold' style={{ color: theme?.buttonText || lightColors.buttonText }}>
                                        Rate Trade
                                    </Text>
                                )}
                            </TouchableOpacity>
                        )}   
                    </View>
                )}
            </View>

            {/* NOTE */}
            <View className="mt-2">
                <Text className="text-xs text-center mt-2"
                    style={{ color: theme?.subText || lightColors.subText }}
                >
                   {getDetailsMessage()}
                </Text>
            </View>

        </View>
    </TouchableOpacity>
  );
}


// If you sent trade → other user = toUser
// If you received trade → other user = fromUser
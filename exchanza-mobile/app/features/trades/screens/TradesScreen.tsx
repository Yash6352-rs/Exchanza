import { AppDialog } from "@/app/components/common/AppDialog";
import { EmptyState } from "@/app/components/common/EmptyState";
import { Loader } from "@/app/components/common/Loader";
import { useToast } from "@/app/components/common/ToastProvider";
import { lightColors } from "@/app/components/theme/colors";
import { db } from "@/app/services/firebase/firebase";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { getAuth } from "firebase/auth";
import { collection, doc, getDoc ,onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Appearance, Pressable, ScrollView, Text, useWindowDimensions, View} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TabView } from "react-native-tab-view";
import RateUserModal from "../../reviews/components/RateUserModal";
import TradeCard from "../components/TradeCard";
import { subscribeToTrades } from "../services/tradeService";
import { useTheme } from "@/context/ThemeContext";
import { useBlockedCheck } from "@/hooks/useBlockedCheck";
import BlockedNotice from "@/app/components/common/BlockedNotice";
import { acceptTradeAction, completeTradeAction, openTradeChatAction, rejectTradeAction, submitTradeReviewAction } from "../services/tradeActions";

export default function TradesScreen() {
  const layout = useWindowDimensions();
  const user = getAuth().currentUser;
  const { tab } = useLocalSearchParams();

  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [pendingTrades, setPendingTrades] = useState<any[]>([]);
  const [activeTrades, setActiveTrades] = useState<any[]>([]);
  const [completedTrades, setCompletedTrades] = useState<any[]>([]);
  const [rejectedTrades, setRejectedTrades] = useState<any[]>([]);

  const [otherUser, setOtherUser] = useState<any>(null);

  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [reviewsMap, setReviewsMap] = useState<any>({});
  const [invoicesMap, setInvoicesMap] = useState<any>({});

  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [acceptTradeId, setAcceptTradeId] = useState<string | null>(null);
  const [acceptLoadingTradeId, setAcceptLoadingTradeId] = useState<string | null>(null);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectTradeId, setRejectTradeId] = useState<string | null>(null);
  const [rejectLoadingTradeId, setRejectLoadingTradeId] = useState<string | null>(null);

  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [completeTradeId, setCompleteTradeId] = useState<string | null>(null);
  const [completeLoadingTradeId, setCompleteLoadingTradeId] = useState<string | null>(null);

  const [reviewLoadingTradeId, setReviewLoadingTradeId] = useState<string | null>(null);

  const { theme, themeMode } = useTheme();
  const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

  const { isBlocked, canAcceptTrade, canRejectTrade, canCompleteTrade, canRateTrade,  } = useBlockedCheck();

  const { showToast } = useToast();

  const PendingRoute = () => {
    if (!user) return null;

    const incoming = pendingTrades.filter((t) => t.toUserId === user.uid);
    const sent = pendingTrades.filter((t) => t.fromUserId === user.uid);

    if (incoming.length === 0 && sent.length === 0) {
      return <EmptyState title="No pending requests" />;
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
        {/* INCOMING */}
        <Text className="text-2xl font-semibold mb-2" style={{ color: theme?.text || lightColors.text }}>
          Incoming Requests
        </Text>

        <Text className="text-sm mb-4" style={{ color: theme?.backgrotextund || lightColors.text }}>
          Review and accept trade proposals sent to you.
        </Text>

        {incoming.length === 0 ? (
          <Text className="text-base text-center font-semibold mt-8 mb-8"style={{ color: theme?.text || lightColors.text }}>
            No incoming requests
          </Text>
        ) : (
          incoming.map((item) => (
            <TradeCard
              key={item.id}
              trade={item}
              currentUserId={user.uid}
              onAccept={() => handleAccept(item.id)}
              onReject={() => handleReject(item.id)}
              canAcceptTrade={canAcceptTrade}
              canRejectTrade={canRejectTrade}

              acceptLoading={acceptLoadingTradeId === item.id}
              rejectLoading={rejectLoadingTradeId === item.id}
            />
          ))
        )}

        {/* SENT */}
        <Text className="text-2xl font-semibold mt-4 mb-2"style={{ color: theme?.text || lightColors.text }} >
          Sent Requests
        </Text>

        <Text className="text-sm mb-4" style={{ color: theme?.text || lightColors.text }}>
          Trades you have proposed — waiting for approval.
        </Text>

        {sent.length === 0 ? (
          <Text
            className="text-base text-center font-semibold mt-8 mb-8"
            style={{ color: theme?.text || lightColors.text }}
          >
            No sent requests.
          </Text>
        ) : (
          sent.map((item) => (
            <TradeCard key={item.id} trade={item} currentUserId={user.uid} />
          ))
        )}
      </ScrollView>
    );
  };

  const ActiveRoute = () => {
    if (!user) return null;

    if (activeTrades.length === 0) {
      return <EmptyState title="No active trades" />;
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Active Trades */}
        {activeTrades.length > 0 && (
          <>
            <Text
              className="text-2xl font-semibold mb-2"
              style={{ color: theme?.text || lightColors.text }}
            >
              In Progress
            </Text>
            <Text className="text-sm mb-5" style={{ color: theme?.text || lightColors.text }}>
              Your trades are underway — stay connected and complete them
              smoothly.
            </Text>

            {activeTrades.map((item) => (
              <TradeCard
                key={item.id}
                trade={item}
                currentUserId={user.uid}
                onChat={() => handleOpenChat(item)}
                onComplete={() => handleComplete(item.id)}
                canCompleteTrade={canCompleteTrade}
                completeLoading={completeLoadingTradeId === item.id}
              />
            ))}
          </>
        )}
      </ScrollView>
    );
  };

  const CompletedRoute = () => {
    if (!user) return null;

    if (completedTrades.length === 0) {
      return <EmptyState title="No completed trades" />;
    }

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        {/* Active Trades */}
        {completedTrades.length > 0 && (
          <>
            <Text
              className="text-2xl font-semibold mb-2"
              style={{ color: theme?.text || lightColors.text }}
            >
              Past Transactions
            </Text>
            <Text className="text-sm mb-5" style={{ color: theme?.text || lightColors.text }}>
              Review and rate recently completed peer-to-peer exchanges.
            </Text>

            {completedTrades.map((item) => (
              <TradeCard
                key={item.id}
                trade={item}
                reviewLoading={reviewLoadingTradeId === item.id}
                currentUserId={user.uid}
                onRate={async () => {
                  setSelectedTrade(item);
                  setRatingModalOpen(true);
                  
                  const isSender = item.fromUserId === user.uid;

                  const otherUserId = isSender
                    ? item.toUserId
                    : item.fromUserId;

                  // fetch User
                  const userRef = doc(db, "users", otherUserId);
                  const userSnap = await getDoc(userRef);

                  if (userSnap.exists()) {
                    setOtherUser(userSnap.data());
                  }
                }} 
                
                review={reviewsMap[item.id]}
                onChat={() => handleOpenChat(item)}
                invoice={invoicesMap[item.id]}
                canRateTrade={canRateTrade}
              />
            ))}
          </>
        )}
      </ScrollView>
    );
  };

  const RejectedRoute = () => {
    if (!user) return null;

    const rejectedSent = rejectedTrades.filter(
      (t) => t.fromUserId === user.uid,
    );
    const rejectedIncoming = rejectedTrades.filter(
      (t) => t.toUserId === user.uid,
    );

    if (rejectedSent.length === 0 && rejectedIncoming.length === 0) {
      return <EmptyState title="No rejected trades" />;
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}contentContainerStyle={{ padding: 16 }}>

        {/* YOU REJECTED */}
        <Text className="text-2xl font-semibold mb-2" style={{ color: theme?.text || lightColors.text }}>
          You Declined
        </Text>

        <Text className="text-sm mb-4" style={{ color: theme?.text || lightColors.text }}>
          Trades you chose not to accept.
        </Text>

        {rejectedIncoming.length === 0 ? (
          <Text
            className="text-base text-center font-semibold mt-8 mb-8"
            style={{ color: theme?.subText || lightColors.subText }}
          >
            No rejected incoming trades.
          </Text>
        ) : (
          rejectedIncoming.map((item) => (
            <TradeCard key={item.id} trade={item} currentUserId={user.uid} />
          ))
        )}

        {/* YOUR PROPOSALS REJECTED */}
        <Text className="text-2xl font-semibold mt-4 mb-2"style={{ color: theme?.text || lightColors.text }}>
          Declined by Others
        </Text>

        <Text className="text-sm mb-4" style={{ color: theme?.text || lightColors.text }}>
          Trades you proposed that were declined.
        </Text>

        {rejectedSent.length === 0 ? (
          <Text
            className="text-base text-center font-semibold mt-8 mb-8"
            style={{ color: theme?.text || lightColors.text }}
          >
            No rejected proposals
          </Text>
        ) : (
          rejectedSent.map((item) => (
            <TradeCard key={item.id} trade={item} currentUserId={user.uid} />
          ))
        )}

      </ScrollView>
    );
  };

  const handleAccept = async (tradeId: string) => {
    if (!canAcceptTrade) {
      showToast("Your account cannot accept trades", "alert-circle", theme?.error || lightColors.error);
      return
    }

    setAcceptTradeId(tradeId);
    setAcceptModalVisible(true);
  };

  const confirmAccept = async () => {
    if (!acceptTradeId) return;

    try {
      setAcceptLoadingTradeId(acceptTradeId);
      
      setAcceptModalVisible(false);
      await acceptTradeAction(acceptTradeId);
      
      showToast("Trade accepted","checkmark-circle", theme?.success || lightColors.success);
      setAcceptTradeId(null);

    } catch (error) {
      console.log(error);
      showToast("Failed to accept trade","close-circle", theme?.error || lightColors.error);

    } finally {
      setAcceptLoadingTradeId(null);
    }
  };

  const handleComplete = async (tradeId: string) => {
    if (!canCompleteTrade) {
      showToast("Your account cannot complete trades", "alert-circle", theme?.error || lightColors.error);
      return;
    }

    setCompleteTradeId(tradeId);
    setCompleteModalVisible(true);
  };

  const confirmComplete = async () => {
    if (!completeTradeId) return;

    try {
      setCompleteLoadingTradeId(completeTradeId);
      
      setCompleteModalVisible(false);
      await completeTradeAction(completeTradeId);

      showToast("Trade completed", "checkmark-circle-outline",theme?.success || lightColors.success);
      setCompleteTradeId(null);

    } catch (error) {
        console.log(error);
        showToast("Failed to complete trade", "close-circle", theme?.error || lightColors.error);
    } finally {
        setCompleteLoadingTradeId(null);
    }
  };
  
  const handleReject = async (tradeId: any) => {
    if (!canRejectTrade) {
      showToast("Your account cannot reject trades", "alert-circle", theme?.error || lightColors.error);
      return;
    }
    setRejectTradeId(tradeId);
    setRejectModalVisible(true);
  };

  const confirmReject = async () => {
    if (!rejectTradeId) return;

    try {
      setRejectLoadingTradeId(rejectTradeId);

      setRejectModalVisible(false);
      await rejectTradeAction(rejectTradeId);

      showToast("Trade rejected", "close-circle",theme?.error || lightColors.error);
      setRejectTradeId(null);

    } catch (error) {
      console.log(error);
      showToast("Failed to reject trade", "close-circle",theme?.error || lightColors.error );
    } finally {
      setRejectLoadingTradeId(null);
    }
  };

  const handleSubmitReview = async ({ rating, comment }: any) => {
    if (!canRateTrade) {
      showToast("Your account cannot rate the completed trades", "alert-circle", theme?.error || lightColors.error);
      return;
    } 
    try {
      if (!selectedTrade || !user) return;
      setReviewLoadingTradeId(selectedTrade.id);

      setRatingModalOpen(false);
      await submitTradeReviewAction({trade: selectedTrade, currentUserId: user!.uid, rating, comment});

      showToast("Review submitted successfully", "checkmark-circle", theme?.primary || lightColors.primary);
      setSelectedTrade(null);

    } catch (error) {
      console.log(error);
      showToast("Error while Review", "close-circle", theme?.error || lightColors.error);
    } finally {
      setReviewLoadingTradeId(null);
    }
  };

  const handleOpenChat = async (trade: any) => {

    try {
      await openTradeChatAction(trade, user!.uid, router)
    } catch (error) {
      console.log(error);
    }
  };

  const [routes] = useState([
    { key: "pending", title: "Pending" },
    { key: "active", title: "Active" },
    { key: "completed", title: "Completed" },
    { key: "rejected", title: "Rejected" },
  ]);

  const renderScene = ({ route }: any) => {
    switch (route.key) {
      case "pending":
        return <PendingRoute />;
      case "active":
        return <ActiveRoute />;
      case "completed":
        return <CompletedRoute />;
      case "rejected":
        return <RejectedRoute />;
      default:
        return null;
    }
  };

  useEffect(() => {
  const map: any = {
    pending: 0,
    active: 1,
    completed: 2,
    rejected: 3,
  };

  if (tab && map[tab as string] !== undefined) {
    setIndex(map[tab as string]);
  }
}, [tab]);

  useEffect(() => {
    const user = getAuth().currentUser;
    if (!user) return;

    const unsubscribe = subscribeToTrades(user.uid, (trades) => {
      const pending: any[] = [];
      const active: any[] = [];
      const completed: any[] = [];
      const rejected: any[] = [];

      trades.forEach((trade) => {
        if (trade.status === "pending") pending.push(trade);
        else if (trade.status === "accepted") active.push(trade);
        else if (trade.status === "completed") completed.push(trade);
        else if (trade.status === "rejected") rejected.push(trade);
      });

      setPendingTrades(pending.sort((a,b)=>b.createdAtLocal-a.createdAtLocal));
      setActiveTrades(active.sort((a,b)=>b.createdAtLocal-a.createdAtLocal));
      setCompletedTrades(completed.sort((a,b)=>b.createdAtLocal-a.createdAtLocal));
      setRejectedTrades(rejected.sort((a,b)=>b.createdAtLocal-a.createdAtLocal));

      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "reviews"),
      where("reviewerId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const map: any = {};

      snapshot.forEach((doc) => {
        const data = doc.data();

        map[data.tradeId] = {
          rating: data.rating,
        };
      });

      setReviewsMap(map);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "invoices"),
      where("fromUserId", "==", user.uid),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const map: any = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        map[data.tradeId] = true;
      });

      setInvoicesMap(map);
    });

    return unsubscribe;
  }, [user]);

  const renderTabBar = ({ navigationState, jumpTo }: any) => {
    return (
      <View
        className="flex-row px-4 pt-3 mb-1 border-b"
        style={{
          backgroundColor: theme?.background || lightColors.background,
          borderColor: theme?.border || lightColors.border,
        }}
      >

        {navigationState.routes.map((route: any, i: number) => {
          const isActive = index === i;

          return (
            <Pressable
              key={route.key}
              onPress={() => jumpTo(route.key)}
              className="mr-6 pb-2"
            >
              <Text className="text-[15px] font-semibold"
                style={{
                  color: isActive 
                    ? theme?.primary || lightColors.primary 
                    : theme?.subText || lightColors.subText,
                }}
              >
                {route.title}
              </Text>

              {isActive && (
                <View
                  className="mt-2 h-[2px] rounded-full"
                  style={{ backgroundColor: theme?.primary || lightColors.primary }}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1"
        style={{ backgroundColor: theme?.background || lightColors.background }}
      >
        <StatusBar style={isDark ? "light" : "dark"}/>

        <View className="px-5 pt-3 mb-2">
          <Text className="font-bold text-2xl"
            style={{ color: theme.primary || lightColors.primary }}
          >
            Trade
          </Text>
        </View>

        <Loader fullScreen />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView
      className="flex-1 mb-16"
      style={{ backgroundColor: theme?.background || lightColors.background }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View className="px-5 pt-3 mb-2">
        <Text
          className="font-bold text-2xl"
          style={{ color: theme?.primary || lightColors.primary }}
        >
          Trade
        </Text>
      </View>

      {isBlocked && (
        <BlockedNotice 
          className="px-4 mt-3"
          title="Trading Restricted"
          message="Your account has been restricted by the admin. Trade action are currently disabled."
        />
      )}

      {/* Tabs */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderTabBar}
      />

      <RateUserModal
        visible={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        onSubmit={handleSubmitReview}
        user={{
          name: otherUser?.name || "User",
          avatar: otherUser?.profileImage,
        }}
        loading={reviewLoadingTradeId !== null}
      />

      <AppDialog
        visible={acceptModalVisible}
        title="Accept Trade"
        description="Are you sure you want to accept this trade?"
        onCancel={() => {
          setAcceptModalVisible(false);
          setAcceptTradeId(null);
        }}
        onConfirm={confirmAccept}
        confirmText="Accept"
        icon="checkmark-circle"
        iconColor={theme?.success || lightColors.success}
      />

      <AppDialog
        visible={rejectModalVisible}
        title="Reject Trade"
        description="Are you sure you want to reject this trade? This action cannot be undone."
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectTradeId(null);
        }}
        onConfirm={confirmReject}
        confirmText="Reject"
        icon="close-circle"
        iconColor={theme?.error || lightColors.error}
      />

      <AppDialog
        visible={completeModalVisible}
        title="Complete Trade"
        description="Are you sure you want to complete this trade? This action cannot be undone."
        onCancel={() => {
          setCompleteModalVisible(false);
          setCompleteTradeId(null);
        }}
        onConfirm={confirmComplete}
        confirmText="Complete"
        icon="checkmark-circle-outline"
        iconColor={theme?.success || lightColors.success}
      />
    </SafeAreaView>
  );
}

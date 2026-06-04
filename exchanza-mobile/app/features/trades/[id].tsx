import { router, useLocalSearchParams } from 'expo-router'
import { getTradeById } from './services/tradeService'
import { useTheme } from '@/context/ThemeContext'
import { useToast } from '@/app/components/common/ToastProvider'
import { useBlockedCheck } from '@/hooks/useBlockedCheck'
import { useEffect, useState } from 'react'
import { lightColors } from '@/app/components/theme/colors'
import {ActivityIndicator, Appearance,Image,LayoutAnimation,Pressable,ScrollView,Text,TouchableOpacity,View} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { getTimeAgo } from '@/app/utils/time'
import { Loader } from '@/app/components/common/Loader'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { getAuth } from 'firebase/auth';
import { acceptTradeAction, completeTradeAction, generateInvoiceAction, openTradeChatAction, rejectTradeAction, submitTradeReviewAction } from './services/tradeActions';
import { AppDialog } from '@/app/components/common/AppDialog';
import RateUserModal from '../reviews/components/RateUserModal';
import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/app/services/firebase/firebase';
import BlockedNotice from '@/app/components/common/BlockedNotice';
import TradeSectionHeader from './components/TradeSectionHeader';

export default function TradeDetailsScreen () {

  const { id } = useLocalSearchParams()
  const tradeId = id as string;

  
  const user = getAuth().currentUser;
  const currentUserId = getAuth().currentUser?.uid || "";
  
  const { theme, themeMode } = useTheme()
  const isDark = themeMode === 'dark' ||(themeMode === 'system' && Appearance.getColorScheme() === 'dark')

  const { isBlocked, canAcceptTrade, canReport, canRejectTrade, canCompleteTrade, canRateTrade, canDownloadInvoice } = useBlockedCheck();

  const { showToast } = useToast()

  const [selectedTrade, setSelectedTrade] = useState<any>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [reviewsMap, setReviewsMap] = useState<any>({});
  const [invoicesMap, setInvoicesMap] = useState<any>({});
  const [otherUser, setOtherUser] = useState<any>(null);

  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [acceptTradeId, setAcceptTradeId] = useState<string | null>(null);
  const [acceptLoading, setAcceptLoading] = useState(false);

  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectTradeId, setRejectTradeId] = useState<string | null>(null);
  const [rejectLoading, setRejectLoading] = useState(false);

  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [completeTradeId, setCompleteTradeId] = useState<string | null>(null);
  const [completeLoading, setCompleteLoading] = useState(false);

  const [reviewLoading, setReviewLoading] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const [expanded, setExpanded] = useState(false)
  const [aiExpanded, setAiExpanded] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const [trade, setTrade] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tradeId) return;
    setLoading(true);

    const tradeRef = doc(db, "trades", tradeId);

    const unsubscribe = onSnapshot(tradeRef, async (snap) => {
      try {
        if (!snap.exists()) {
          setTrade(null);
          setLoading(false);
          return;
        };
  
        const data = await getTradeById(tradeId);
        setTrade(data);
        
      } catch (error) {
        console.log("LOAD TRADE ERROR:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [tradeId])

  useEffect(() => {
  if (!user || !tradeId) return;

  const q = query(
    collection(db, "reviews"),
    where("reviewerId", "==", user.uid)
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
}, [user, tradeId]);


useEffect(() => {
  if (!user) return;

  const q = query(
    collection(db, "invoices"),
    where("fromUserId", "==", user.uid)
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

  const review = reviewsMap[tradeId];
  const invoice = invoicesMap[tradeId];

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
      setAcceptLoading(true);
      
      setAcceptModalVisible(false);
      await acceptTradeAction(acceptTradeId);

      showToast("Trade accepted","checkmark-circle",theme?.success || lightColors.success);
      setAcceptTradeId(null);

    } catch (error) {
      console.log(error);
      showToast("Failed to accept trade","close-circle", theme?.error || lightColors.error);

    } finally {
      setAcceptLoading(false);
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
      setCompleteLoading(true);

      setCompleteModalVisible(false);
      await completeTradeAction(completeTradeId);

      showToast("Trade completed", "checkmark-circle-outline",theme?.success || lightColors.success);
      setCompleteTradeId(null);

    } catch (error) {
      console.log(error);
      showToast("Failed to complete trade", "close-circle", theme?.error || lightColors.error);
    } finally {
      setCompleteLoading(false);
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
      setRejectLoading(true);

      setRejectModalVisible(false);
      await rejectTradeAction(rejectTradeId);

      showToast("Trade rejected", "close-circle",theme?.error || lightColors.error);
      setRejectTradeId(null);
      
    } catch (error) {
      console.log(error);
      showToast("Failed to reject trade", "close-circle",theme?.error || lightColors.error );
    } finally {
      setRejectLoading(false);
    }
  };

  const handleSubmitReview = async ({ rating, comment }: any) => {
    if (!canRateTrade) {
      showToast("Your account cannot rate the completed trades", "alert-circle", theme?.error || lightColors.error);
      return;
    } 
    try {
      if (!selectedTrade || !user) return;
      setReviewLoading(true);

      setRatingModalOpen(false);
      await submitTradeReviewAction({trade: selectedTrade, currentUserId: user!.uid, rating, comment});

      showToast("Review submitted successfully", "checkmark-circle", theme?.primary || lightColors.primary);
      setSelectedTrade(null);

    } catch (error) {
      console.log(error);
      showToast("Error while Review", "close-circle", theme?.error || lightColors.error);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleInvoice = async (trade: any) => {
    if (!canDownloadInvoice) {
      showToast("Invoice downloads are disabled for your account", "alert-circle", theme?.error || lightColors.error);
      return;
    }
    try {
      setInvoiceLoading(true);
      await generateInvoiceAction(trade);

      if (invoicesMap[trade.id]) {
        showToast("Invoice generated", "document-text", theme?.primary || lightColors.primary);
      } else {
        showToast("Invoice downloaded", "checkmark-circle", theme?.primary || lightColors.primary);
      }

    } catch (error) {
      console.log(error);
      showToast("Failed to generate invoice", "close-circle", theme?.error || lightColors.error,);
    } finally {
      setInvoiceLoading(false);
    }
  };

  const handleOpenChat = async (trade: any) => {

    try {
      await openTradeChatAction(trade, user!.uid, router)
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Loader size='large' />
        <Text className='mt-3 font-semibold'>Loading Details...</Text>
      </View>
    )
  }

  if (!trade) {
    return (
      <View className='flex-1 items-center justify-center'>
        <Ionicons name='alert-circle-outline' size={50} color='gray' />
        <Text className='mt-3 text-base'>Trade not found</Text>
      </View>
    )
  }

  const getStatusColor = () => {
    switch (trade?.status) {
      case 'pending':
        return theme?.brown || lightColors.brown

      case 'accepted':
        return theme?.secondary || lightColors.secondary

      case 'completed':
        return theme?.success || lightColors.success

      case 'rejected':
        return theme?.error || lightColors.error

      default:
        return theme?.subText || lightColors.subText
    }
  }

  const statusColor = getStatusColor()

  const isSender = trade.fromUserId === currentUserId
  const otherUsername = isSender ? trade.toUserName : trade.fromUserName

  const firstUserId = isSender ? trade.fromUserId : trade.toUserId
  const secondUserId = isSender ? trade.toUserId : trade.fromUserId

  const firstAvatar = isSender ? trade.fromUserAvatar : trade.toUserAvatar
  const secondAvatar = isSender ? trade.toUserAvatar : trade?.fromUserAvatar

  return (
    <SafeAreaView
      className='flex-1'
      style={{ backgroundColor: theme?.background || lightColors.background }}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView className='flex-1 px-4 pt-4'
        style={{ backgroundColor: theme?.background || lightColors.background }}
      >
        <View className='flex-row justify-between items-center mb-4'>
          <View className='flex-row items-center gap-3'>
            {/*Back Button */}
            <Pressable onPress={() => router.back()}>
              <Ionicons name='arrow-back' size={20} color={theme?.text || lightColors.text}/>
            </Pressable>

            <Text className='text-xl font-semibold' style={{ color: theme?.text || lightColors.text }}>
              Trade Details
            </Text>
          </View>

          <View>
            <Ionicons name='ellipsis-vertical' size={20}color={theme?.text || lightColors.text}
              onPress={() => setShowMenu(!showMenu)}
            />
          </View>

          {showMenu && (
            <View
              className='absolute top-10 right-2 rounded-xl border p-2 z-50'
              style={{
                backgroundColor: theme?.card || lightColors.card,
                borderColor: theme?.border || lightColors.border,
                opacity: canDownloadInvoice === false ? 0.6 : 1
              }}
            >
              {trade.status === 'completed' && (
                <TouchableOpacity className='py-2 px-3'
                  onPress={() => {
                    setShowMenu(false)
                    handleInvoice(trade)
                  }}
                >
                  <Text style={{ color: theme?.text || lightColors.text }}>
                    {invoice ? 'View Invoice' : 'Download Invoice'}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity className='py-2 px-3' style={{ opacity: canReport === false ? 0.6 : 1 }}
                onPress={() => {
                  setShowMenu(false)

                  router.push({
                    pathname: '/features/settings/screens/why-am-i-seeing-this',
                    params: { type: 'trade' }
                  })
                }}
              >
                <Text style={{ color: theme?.text || lightColors.text }}>
                  Why am i seeing this trade?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity className='py-2 px-3'
                style={{ opacity: canReport === false ? 0.6 : 1 }}
                onPress={() => {
                  setShowMenu(false)

                  if (!canReport) {
                    showToast(
                      'Your account cannot report trades',
                      'alert-circle',
                      theme?.error || lightColors.error
                    )
                    return
                  }

                  router.push({
                    pathname: '/features/settings/screens/report-problem',
                    params: {
                      type: 'trade',
                      targetId: tradeId
                    }
                  })
                }}
              >
                <Text style={{ color: theme?.error || lightColors.error }}>
                  Report Trade
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {isBlocked && (
          <BlockedNotice 
            className="px-4 mt-3"
            title="Trading Restricted"
            message="Your account has been restricted by the admin. Trade action are currently disabled."
          />
        )}

        <TradeSectionHeader 
          status={trade.status}
          isSender={isSender}
        />

        <View
          className='px-5 py-4 rounded-2xl border border-border mb-4'
          style={{
            backgroundColor: theme?.card || lightColors.card,
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 10,
            elevation: 3
          }}
        >

            {/* TOP ROW */}
            <View className='flex-row justify-between items-center mb-1'>
              {/* TRADE ID */}
              <Text
                className='text-[14px] font-bold -mt-1'
                style={{ color: theme?.primary || lightColors.primary }}
              >
                TRADE #{tradeId.slice(0, 6)}
              </Text>

              <View className='flex-row items-center'>
                {/* Second Avatar (behind) */}
                <TouchableOpacity
                  onPress={() => {
                    if (secondUserId === currentUserId) {
                      router.push('/(tabs)/profile')
                    } else {
                      router.push({
                        pathname: '/features/profile/screens/UserProfileScreen',
                        params: { userId: secondUserId }
                      })
                    }
                  }}
                >
                  <Image source={{ uri: secondAvatar }}
                    style={{ width: 40, height: 40, borderRadius: 16, borderWidth: 2, borderColor: '#fff'}}
                  />
                </TouchableOpacity>

                {/* First Avatar (front) */}
                <TouchableOpacity
                  onPress={() => {
                    if (firstUserId === currentUserId) {
                      router.push('/(tabs)/profile')
                    } else {
                      router.push({
                        pathname: '/features/profile/screens/UserProfileScreen',
                        params: { userId: firstUserId }
                      })
                    }
                  }}
                >
                  <Image source={{ uri: firstAvatar }}
                    style={{ width: 40, height: 40, borderRadius: 16, marginLeft: -10, borderWidth: 2,borderColor: '#fff'}}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className='flex-row mb-3 gap-2 items-center'>

              {/* USERS */}
              <Text className='text-xl px-2 py-1 font-semibold'
                style={{ color: theme?.text || lightColors.text }}
              >
                {trade.fromUserId === currentUserId ? 'You': trade.fromUserName || 'User'}{' '}
                ↔{' '}
                {trade.toUserId === currentUserId ? 'You': trade.toUserName || 'User'}
              </Text>

              {/* STATUS BADGE */}
              <View className='px-3 py-1 mt-1 rounded-full'
                style={{
                  backgroundColor:
                    trade.status === 'pending'
                      ? theme?.lightBrown || lightColors.lightBrown
                      : trade.status === 'accepted'
                        ? theme?.secondary + '20' || lightColors.secondary + '20'
                        : trade.status === 'completed'
                          ? theme?.success + '20' || lightColors.success + '20'
                          : theme?.error + '20' || lightColors.error + '20'
                }}
              >
                <Text className='text-xs font-semibold' style={{ color: statusColor }} >
                  {trade.status.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* MESSAGE BOX */}
            <View className='rounded-2xl p-5 flex-row items-center mb-5'
              style={{backgroundColor: theme?.border + '90' || lightColors.border + '90' }}
            >
              <View className='w-12 h-12 rounded-xl items-center justify-center mr-3'
                style={{ backgroundColor: theme?.background || lightColors.background}}
              >
                <Ionicons size={20} color={theme?.primary || lightColors.primary}
                  name={
                    trade.status === 'pending'
                      ? 'time-outline'
                      : trade.status === 'accepted'
                        ? 'swap-horizontal-outline'
                        : trade.status === 'completed'
                          ? 'checkmark-done-outline'
                          : 'close-circle-outline'
                  }
                />
              </View>

              <View className='flex-1'>
                <Text className='text-xs font-semibold' style={{ color: theme?.subText || lightColors.subText }}>
                  STATUS
                </Text>

                <Text className='text-sm font-medium' style={{ color: theme?.text || lightColors.text }}>

                  {/* PENDING */}
                  {trade?.status === 'pending' && trade.fromUserId === currentUserId && 'Waiting for acceptance...'}
                  {trade.status === 'pending' && trade.toUserId === currentUserId && 'Accept this trade to continue'}

                  {/* ACCEPTED */}
                  {trade.status === 'accepted' && trade.fromUserId === currentUserId &&'Your trade has been accepted'}
                  {trade.status === 'accepted' &&trade.toUserId === currentUserId &&'You accepted the trade'}

                  {/* COMPLETED */}
                  {trade.status === 'completed' &&'Trade completed successfully'}

                  {/* REJECTED */}
                  {trade.status === 'rejected' && trade.fromUserId === currentUserId &&'Your trade request was rejected'}
                  {trade.status === 'rejected' && trade.toUserId === currentUserId &&'You rejected this trade'}

                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext( LayoutAnimation.Presets.easeInEaseOut )
                  setExpanded(prev => !prev)
                }}
              >
                <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'}
                  size={20} color={theme?.primary || lightColors.primary}
                />
              </TouchableOpacity>
            </View>

            {expanded && (
              <View className='p-4 border rounded-2xl mt-1 mb-5'
                style={{
                  backgroundColor: theme?.border + '90' || lightColors.border + '90',
                  borderColor: theme?.border || lightColors.border
                }}
              >
                <Text className='text-base font-semibold mb-4'
                  style={{ color: theme?.text || lightColors.text }}
                >
                  Exhange Between{' '}
                  {trade.fromUserId === currentUserId ? 'You' : trade.fromUserName || 'User'}{' '}
                  ↔{' '}
                  {trade.toUserId === currentUserId ? 'You' : trade.toUserName || 'User'}
                </Text>

                {trade.postTitle && (
                  <>
                    <Text className='text-sm font-semibold mb-1'
                      style={{ color: theme?.subText || lightColors.subText }}
                    >
                      📌 Post Title
                    </Text>
                    <Text className='text-sm'style={{ color: theme?.text || lightColors.text }}>
                      {trade.postTitle}
                    </Text>
                  </>
                )}
                <View className='h-[1px] my-3'
                  style={{ backgroundColor: theme?.subText + '20' || lightColors.subText + '20' }}
                />

                {/* OFFER */}
                <Text className='text-sm font-semibold mb-1'
                  style={{ color: theme?.subText || lightColors.subText }}
                >
                  📦 What {otherUsername || 'User'} is offering
                </Text>
                <Text className='text-sm'style={{ color: theme?.text || lightColors.text }}>
                  {trade.offerText}
                </Text>
                <View
                  className='h-[1px] my-3'
                  style={{ backgroundColor:theme?.subText + '20' || lightColors.subText + '20' }}
                />

                {/* REQUEST */}
                <Text className='text-sm font-semibold mb-1'
                  style={{ color: theme?.subText || lightColors.subText }}
                >
                  🎯 What {otherUsername || 'User'} is requesting
                </Text>
                <Text className='text-sm'style={{ color: theme?.text || lightColors.text }}>
                  {trade.requestText}
                </Text>
                <View className='h-[1px] my-3'
                  style={{ backgroundColor:theme?.subText + '20' || lightColors.subText + '20'}}
                />

                <View className='flex-row mt-1 justify-between items-center'>
                  <Text
                    className='text-xs'
                    style={{ color: theme?.subText || lightColors.subText }}
                  >
                    Created {getTimeAgo(trade.createdAt)}
                  </Text>

                  <TouchableOpacity
                    onPress={async () => {
                      router.push({
                        pathname: '/features/posts/[id]',
                        params: {
                          id: trade.postId,
                          name: trade.postUserName,
                          avatar: trade.postUserAvatar,
                          rating: trade.postRating
                        }
                      })
                    }}
                  >
                    <View className='flex-row items-center'>
                      <Text className='text-xs mr-1' style={{ color: theme?.primary || lightColors.primary }}>
                        View Post
                      </Text>
                      <Ionicons name='arrow-forward' size={12} color={theme?.primary || lightColors.primary}/>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* AI INSIGHT BOX */}
            {trade.status === 'pending' && trade.toUserId === currentUserId && trade.aiInsight && (
                <>
                  <View className='rounded-2xl p-5 flex-row items-center mb-6'
                    style={{
                      backgroundColor:
                        theme?.border + '90' || lightColors.border + '90'
                    }}
                  >
                    <View
                      className='w-12 h-12 rounded-xl items-center justify-center mr-3'
                      style={{
                        backgroundColor:
                          theme?.background || lightColors.background
                      }}
                    >
                      <Ionicons
                        name='sparkles-outline'
                        size={20}
                        color={theme?.purple || lightColors.purple}
                      />
                    </View>

                    <View className='flex-1'>
                      <Text
                        className='text-xs font-semibold'
                        style={{ color: theme?.subText || lightColors.subText }}
                      >
                        AI INSIGHT
                      </Text>

                      <Text
                        className='text-sm font-medium'
                        style={{ color: theme?.text || lightColors.text }}
                      >
                        {trade.aiInsight}
                      </Text>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        LayoutAnimation.configureNext(
                          LayoutAnimation.Presets.easeInEaseOut
                        )
                        setAiExpanded(prev => !prev)
                      }}
                    >
                      <Ionicons
                        name={aiExpanded ? 'chevron-up' : 'chevron-down'}
                        size={20}
                        color={theme?.purple || lightColors.purple}
                      />
                    </TouchableOpacity>
                  </View>

                  {aiExpanded && (
                    <View
                      className='p-4 border rounded-2xl mt-[-10px] mb-5'
                      style={{
                        backgroundColor: theme?.border + '90' || lightColors.border + '90',
                        borderColor: theme?.border || lightColors.border
                      }}
                    >
                      {/* FAIRNESS */}
                      <Text className='text-sm font-semibold mb-1'
                        style={{ color: theme?.subText || lightColors.subText }}
                      >
                        ⚖️ Fairness
                      </Text>

                      <Text className='text-sm'style={{ color: theme?.text || lightColors.text }}>
                        {trade.aiFairness}
                      </Text>

                      <View className='h-[1px] my-3'
                        style={{ backgroundColor: theme?.subText + '20' || lightColors.subText + '20'}}
                      />

                      {/* RISK */}
                      <Text className='text-sm font-semibold mb-1' style={{ color: theme?.subText || lightColors.subText }}>
                        🛡️ Risk Analysis
                      </Text>

                      <Text className='text-sm'style={{ color: theme?.text || lightColors.text }}>
                        {trade.aiRisk}
                      </Text>

                      <View className='h-[1px] my-3'
                        style={{ backgroundColor:theme?.subText + '20' || lightColors.subText + '20'}}
                      />

                      {/* NOTE */}
                      <Text className='text-sm font-semibold mb-1'style={{ color: theme?.subText || lightColors.subText }}>
                        🤖 Additional Insight
                      </Text>

                      <Text className='text-sm'style={{ color: theme?.text || lightColors.text }}>
                        {trade.aiNote}
                      </Text>

                      <View className='h-[1px] my-3'
                        style={{ backgroundColor:theme?.subText + '20' || lightColors.subText + '20'}}
                      />

                      <TouchableOpacity className='flex-row justify-end items-center'
                        onPress={() => router.push( '/features/settings/screens/ai-insights-info')}
                      >
                        <Text className='text-sm font-semibold mr-2' style={{ color: theme?.purple || lightColors.purple }}>
                          Learn About AI Insights
                        </Text>

                        <Ionicons name='arrow-forward' size={14} color={theme?.purple || lightColors.purple}/>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}

            {/* ACTIONS */}
            <View className='flex-row justify-between gap-4 mb-1'>
              {/* Open Chat */}
              {(trade.status === 'accepted' || trade.status === 'completed') && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  className='flex-1 h-14 border rounded-2xl py-4 items-center justify-center'
                  style={{ backgroundColor: theme?.background || lightColors.background }}
                  onPress={() => handleOpenChat(trade)}
                >
                  <Text  className='text-base font-semibold' style={{ color: theme?.primary || lightColors.primary }}>
                    Open Chat
                  </Text>
                </TouchableOpacity>
              )}

              {/* Pending */}
              {trade.status === 'pending' && !isSender && (
                <View className='flex-row flex-1 gap-2'>
                  {/* Reject */}
                  <TouchableOpacity
                    disabled={rejectLoading}
                    activeOpacity={0.8}
                    className='flex-1 h-14 border rounded-2xl py-4 items-center justify-center'
                    style={{ backgroundColor: theme?.background || lightColors.background,
                      opacity: canRejectTrade === false ? 0.6 : 1
                    }}
                    onPress={() => handleReject(trade.id)}
                  >
                    {rejectLoading ? (
                      <ActivityIndicator color={theme?.error || lightColors.error} />
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
                    className='flex-1 h-14 rounded-2xl py-4 items-center justify-center'
                    style={{
                      backgroundColor: theme?.primary || lightColors.primary,
                      opacity: canAcceptTrade === false ? 0.6 : 1
                    }}
                    onPress={() => handleAccept(trade.id)}
                  >
                    {acceptLoading  ? (
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
              {trade.status === 'accepted' && (
                <TouchableOpacity
                  disabled={completeLoading}
                  activeOpacity={0.8}
                  className='flex-1 h-14 rounded-2xl py-4 items-center justify-center'
                  style={{
                    marginRight: 6,
                    backgroundColor: theme?.primary || lightColors.primary,
                    opacity: canCompleteTrade === false ? 0.6 : 1
                  }}
                  onPress={() => handleComplete(trade.id)}
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
              {trade.status === 'completed' && (
                <View className='flex-1'>
                  {/* Rating */}
                  {review ? (
                    <View
                      className='flex-1 h-14 rounded-2xl items-center justify-center'
                      style={{
                        backgroundColor: theme?.border || lightColors.border,
                        opacity: canRateTrade === false ? 0.6 : 1
                      }}
                    >
                      <Text className='text-base font-semibold'
                        style={{ color: theme?.subText || lightColors.subText }}
                      >
                        You Rated ⭐ {review.rating}
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      className='flex-1 h-14 rounded-2xl py-4 items-center justify-center'
                      style={{
                        marginRight: 6,
                        backgroundColor: theme?.primary || lightColors.primary,
                        opacity: canRateTrade === false ? 0.6 : 1
                      }}
                      onPress={async () => {
                        setSelectedTrade(trade);

                        const isSender = trade.fromUserId === user?.uid;

                        const otherUserId = isSender
                          ? trade.toUserId
                          : trade.fromUserId;

                        const userRef = doc(db, "users", otherUserId);
                        const userSnap = await getDoc(userRef);

                        if (userSnap.exists()) {
                          setOtherUser(userSnap.data());
                        }

                        setRatingModalOpen(true);
                      }}
                    >
                      {reviewLoading ? (
                          <ActivityIndicator color={theme?.buttonText || lightColors.buttonText} />
                      ) : (
                        <Text className='text-base font-semibold' style={{ color: theme?.buttonText || lightColors.buttonText }}>
                          Rate User
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
        </View>

        {invoiceLoading && (
          <View className="mt-4 p-3">
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color={ theme?.primary || lightColors.primary }/>
              <Text className="ml-3 font-semibold" style={{ color: theme?.primary || lightColors.primary }}>
                Generating Invoice...
              </Text>
            </View>
          </View>
        )}

      </ScrollView>

      <RateUserModal
        visible={ratingModalOpen}
        onClose={() => setRatingModalOpen(false)}
        onSubmit={handleSubmitReview}
        user={{
          name: otherUser?.name || "User",
          avatar: otherUser?.profileImage,
        }}
      />

      <AppDialog
        visible={acceptModalVisible}
        title="Accept Trade"
        description="Are you sure you want to accept this trade? Other pending proposals for this post will be automatically rejected."
        onCancel={() => {
          setAcceptModalVisible(false);
          setAcceptTradeId(null);
        }}
        onConfirm={confirmAccept}
        confirmText="Accept"
        loading={acceptLoading}
        icon="checkmark-circle"
        iconColor={theme?.success || lightColors.success}
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
        loading={completeLoading}
        icon="checkmark-circle-outline"
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
        variant="danger"
        loading={rejectLoading}
        icon="close-circle"
        iconColor={theme?.error || lightColors.error}
      />
      
    </SafeAreaView>
  )
}

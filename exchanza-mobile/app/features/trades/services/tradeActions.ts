import { doc, getDoc } from "firebase/firestore";
import { acceptTrade, completeTrade, rejectTrade } from "./tradeService";
import { db, rtdb } from "@/app/services/firebase/firebase";
import { createNotification } from "../../notifications/services/notificationService";
import { createChatRoom } from "../../chat/services/chatService";
import { createReview } from "../../reviews/services/reviewService";
import { generateInvoice } from "../../invoice/services/invoiceService";
import { get, ref } from "firebase/database";
import * as Sharing from "expo-sharing";

// Accept
export const acceptTradeAction = async (tradeId: string) => {
  await acceptTrade(tradeId);

  const tradeRef = doc(db, "trades", tradeId);
  const tradeSnap = await getDoc(tradeRef);

  if (!tradeSnap.exists()) return;

  const trade = {
    id: tradeSnap.id,
    ...tradeSnap.data(),
  } as any;

  await createNotification({
    userId: trade.fromUserId,
    type: "accepted",
    title: "Trade Accepted",
    message: "Your trade request was accepted",
    tradeId: trade.id,
  });

  await createChatRoom(trade);
};


// Complete
export const completeTradeAction = async (tradeId: string) => {
  await completeTrade(tradeId);

  const tradeRef = doc(db, "trades", tradeId);
  const tradeSnap = await getDoc(tradeRef);

  if (!tradeSnap.exists()) return;

  const trade = {
    id: tradeSnap.id,
    ...tradeSnap.data(),
  } as any;

  await createNotification({
    userId: trade.fromUserId,
    type: "completed",
    title: "Trade Completed",
    message: "Your trade has been completed 🎉",
    tradeId: trade.id,
  });

  await createNotification({
    userId: trade.toUserId,
    type: "completed",
    title: "Trade Completed",
    message: "Your trade has been completed 🎉",
    tradeId: trade.id,
  });
};

// Reject
export const rejectTradeAction = async (tradeId: string,) => {
  await rejectTrade(tradeId);

  const tradeRef = doc(db, "trades", tradeId);
  const tradeSnap = await getDoc(tradeRef);

  if (!tradeSnap.exists()) return;

  const trade = {
    id: tradeSnap.id,
    ...tradeSnap.data(),
  } as any;

  await createNotification({
    userId: trade.fromUserId,
    type: "rejected",
    title: "Trade Rejected",
    message: "Your trade request was rejected",
    tradeId: trade.id,
  });
};

// Submit Review Rating
export const submitTradeReviewAction = async ({
  trade, currentUserId, rating, comment,
}: {
  trade: any;
  currentUserId: string;
  rating: any;
  comment: string | undefined;
}) => {
  const isSender = trade.fromUserId === currentUserId;

  const reviewedUserId = isSender ? trade.toUserId : trade.fromUserId;

  await createReview({
    tradeId: trade.id,
    reviewerId: currentUserId,
    reviewedUserId,
    rating,
    comment,
  });

  await createNotification({
    userId: reviewedUserId,
    type: "review",
    title: "New Review",
    message: "You received a new rating and review ⭐",
    tradeId: trade.id,
  });
};

// Download/View Invoice
export const generateInvoiceAction = async (trade: any) => {
  const fileUri = await generateInvoice(trade);

  if (!fileUri) {
    throw new Error("No file generated");
  }

  await createNotification({
    userId: trade.toUserId,
    type: "invoice",
    title: "Invoice Downloaded",
    message: "Invoice has been generated successfully",
    tradeId: trade.id,
  });

  // Open share sheet (BEST UX)
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }

  return fileUri;
};


// Open Chat
export const openTradeChatAction = async (
  trade: any,
  currentUserId: string,
  router: any,
) => {

  const isSender = trade.fromUserId === currentUserId;

  const name = isSender? trade.toUserName : trade.fromUserName;
  const avatar = isSender? trade.toUserAvatar : trade.fromUserAvatar;

  // Check if chat already exists
  const chatRef = ref(rtdb, `chats/${trade.id}`);
  const snapshot = await get(chatRef);

  // OPTINAL FLAG (prevent duplicate notifications)
  if (!snapshot.exists()) {
    await createNotification({
      userId: trade.fromUserId,
      type: "chat",
      title: "Chat Started",
      message: "Chat room created for your trade 💬",
      tradeId: trade.id,
    });

    await createNotification({
      userId: trade.toUserId,
      type: "chat",
      title: "Chat Started",
      message: "Chat room created for your trade 💬",
      tradeId: trade.id,
    });
  }

  router.push({
    pathname: "/features/chat/screens/[tradeId]",
    params: {
      tradeId: trade.id,
      name,
      avatar,
      userId: isSender ? trade.toUserId: trade.fromUserId,
    },
  });
};
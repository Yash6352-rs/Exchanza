import { db } from "@/app/services/firebase/firebase";
import { generateTradeInsight } from "@/backend/services/aiService";
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";

export const createTrade = async ({postId, fromUserId, toUserId, offerText, requestText}: {
  postId: string;
  fromUserId: string;
  toUserId: string;
  offerText: string;
  requestText: string;
}) => {
    if (fromUserId === toUserId ) {
        throw new Error("You cannot trade with yourself");
    }

    // GET POST
    const postSnap = await getDoc(doc(db, "posts", postId));
    const post = postSnap.exists() ? postSnap.data() : null;

    if (post?.status !== "open") {
      throw new Error("this post is no longer accepting trades");
    }

    // GENERATE AI INSIGHT
    let ai = {
      summary: "Trade proposal generated",
      fairness: "Unknow",
      risk: "Low",
      note: "AI analysis unavailable",
    };

    try {
      ai = await generateTradeInsight({
        postTitle: post?.title || "",
        offerText,
        requestText,
      });
    } catch (error) {
      console.log("AI FAILED:", error);
    }

    const docRef = await addDoc(collection(db, "trades"), {
        postId,
        fromUserId,
        toUserId,
        offerText,
        requestText,

        postOwnerId: toUserId,
        participants: [fromUserId, toUserId],
        
        status: "pending",
        createdAt: serverTimestamp(),
        createdAtLocal: Date.now(),

        // AI
        aiInsight: ai.summary,
        aiFairness: ai.fairness,
        aiRisk: ai.risk,
        aiNote: ai.note,
    });

    return docRef.id;
}

export const subscribeToTrades = (userId: string, callback: (trades: any[]) => void) => {
  const q = query(
    collection(db, "trades"),
    where("participants", "array-contains", userId),
    orderBy("createdAtLocal", "desc")
  );

  const unsubscibe = onSnapshot(q, async (snapshot) => {
    const trades = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        
        // Fetch both users
        const fromSnap = await getDoc(doc(db, "users", data.fromUserId));
        const toSnap = await getDoc(doc(db, "users", data.toUserId));
        
        const fromUser = fromSnap.exists() ? fromSnap.data() : null;
        const toUser = toSnap.exists() ? toSnap.data() : null;
        
        const postSnap = await getDoc(doc(db, "posts", data.postId));
        const post = postSnap.exists() ? postSnap.data() : null;
        
        let postUser = null;

        if (post?.userId) {
          const userSnap = await getDoc(doc(db, "users", post.userId));
          postUser = userSnap.exists() ? userSnap.data() : null;
        }

        return {
          id: docSnap.id,
          ...data,

          fromUserName: fromUser?.name || "User",
          fromUserAvatar: fromUser?.profileImage || "",

          toUserName: toUser?.name || "User",
          toUserAvatar: toUser?.profileImage || "",

          postId: docSnap.data().postId,
          postTitle: post?.title || "",

          postUserName: postUser?.name || "User",
          postUserAvatar: postUser?.profileImage || "",
          postRating: postUser?.rating || 0,
        }
      })
    )
    callback(trades);
  });
  return unsubscibe;
};

export const acceptTrade = async (tradeId: string) => {
  try {
    console.log("ACCEPTING TRADE:", tradeId);
    // 1 Get trade data
    const tradeRef = doc(db, "trades", tradeId);
    const tradeSnap = await getDoc(tradeRef);

    if (!tradeSnap.exists()) {
      throw new Error("Trade not found");
    }

    const trade = tradeSnap.data();

    // 2 Get post
    const postRef = doc(db, "posts", trade.postId);
    const postSnap = await getDoc(postRef);

    if (!postSnap.exists()) {
      throw new Error("Post not found");
    }

    const post = postSnap.data();

    console.log("POST DATA:", {
      acceptedTradeId: post.acceptedTradeId,
      status: post.status,
      currentTradeId: tradeId,
    });
    
    // Prevent double accept
    if (
      post.acceptedTradeId &&
      post.status !== "completed" &&
      post.acceptedTradeId !== tradeId
    ) {
      throw new Error("This post already has an accepted trade");
    }

    // 3 Accept selected trade
    await updateDoc(tradeRef, {status: "accepted"});

    console.log("UPDATED TO ACCEPTED");
    
    // 4 Update post
    await updateDoc(postRef, {
      acceptedTradeId: tradeId,
      status: "in-progress",
    });

    // 5 Reject ALL other trades for same post
    const q = query(
      collection(db, "trades"),
      where("postId", "==", trade.postId)
    );

    const snapshot = await getDocs(q);

    const batchUpdates: Promise<any>[] = [];

    snapshot.forEach((docSnap) => {
      const otherTradeId = docSnap.id;

      if (otherTradeId !== tradeId) {
        const ref = doc(db, "trades", otherTradeId);

        batchUpdates.push(
          updateDoc(ref, {status: "rejected"})
        );
      }
    });

    await Promise.all(batchUpdates);

  } catch (error) {
    console.log("Accept Trade Error:", error);
    throw error;
  }
};

export const completeTrade = async (tradeId: string) => {
  try {
    const tradeRef = doc(db, "trades", tradeId);
    const tradeSnap = await getDoc(tradeRef);

    if (!tradeSnap.exists()) {
      throw new Error("Trade not found");
    }

    const trade = tradeSnap.data();

    await updateDoc(tradeRef, { 
      status: "completed",
      completedAt: serverTimestamp(),
    });

    if (trade.postId) {
      const postRef = doc(db, "posts", trade.postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        const post = postSnap.data();

        if (post.acceptedTradeId !== tradeId) {
          throw new Error("This trade is not the accepted one");
        }

        await updateDoc(postRef, {
          status: "completed",
          acceptedTradeId: null,
        });
      } else {
        console.log("Post not found, skipping update");
      }
    }
  } catch (error) {
    console.log("Complete Trade Error:", error);
    throw error;
  }
};

export const rejectTrade = async (tradeId: string) => {
  try {
    const tradeRef = doc(db, "trades", tradeId);

    await updateDoc(tradeRef, {
      status: "rejected",
    });
  } catch (error) {
    console.log("Reject Trade Error:", error);
    throw error;
  }
}

export const getTradeById = async (tradeId: string) => {
  const tradeSnap = await getDoc(doc(db, "trades", tradeId));

  if (!tradeSnap.exists()) {
    throw new Error("Trade not found");
  }

  const data = tradeSnap.data();

  const fromSnap = await getDoc(doc(db, "users", data.fromUserId));
  const toSnap = await getDoc(doc(db, "users", data.toUserId));

  const fromUser = fromSnap.exists() ? fromSnap.data() : null;
  const toUser = toSnap.exists() ? toSnap.data() : null;

  const postSnap = await getDoc(doc(db, "posts", data.postId));
  const post = postSnap.exists() ? postSnap.data() : null;

  let postUser = null;

  if (post?.userId) {
    const userSnap = await getDoc(doc(db, "users", post.userId));
    postUser = userSnap.exists() ? userSnap.data() : null;
  }

  return {
    id: tradeSnap.id,
    ...data,

    fromUserName: fromUser?.name || "User",
    fromUserAvatar: fromUser?.profileImage || "",

    toUserName: toUser?.name || "User",
    toUserAvatar: toUser?.profileImage || "",

    postTitle: post?.title || "",

    postUserName: postUser?.name || "User",
    postUserAvatar: postUser?.profileImage || "",
    postRating: postUser?.rating || 0,
  };
};
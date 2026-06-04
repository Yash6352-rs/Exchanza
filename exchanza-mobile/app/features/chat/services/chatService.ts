import { db, rtdb } from "@/app/services/firebase/firebase"
import { get, onValue, push, ref, set } from "firebase/database";
import { doc, getDoc } from "firebase/firestore"

export const validateChatAccess = async (
    tradeId: string,
    currentUserId: string    
) => {
    try {
        const tradeRef = doc(db, "trades", tradeId);
        const tradeSnap = await getDoc(tradeRef);
        if (!tradeSnap.exists()) {
            throw new Error("Trade no found");
        }
        
        const trade = tradeSnap.data();
        if (trade.status === "pending") {
            throw new Error("Chat is only available after trade is accepted or completed.");
        }

        const isParticipant = trade.fromUserId === currentUserId || trade.toUserId === currentUserId;
        if (!isParticipant) {
            throw new Error("You are not allowed to acess this chat");
        }

        return {
            id: tradeId,
            ...trade,
        };
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const getOtherUser = async (trade: any, currentUserId: string) => {
    const otherUserId = 
        trade.fromUserId === currentUserId
            ? trade.toUserId
            : trade.fromUserId;
    
    const userSnap = await getDoc(doc(db, "users", otherUserId));

    if (!userSnap.exists()) return null;

    const user = userSnap.data();

    return {
        name: user.name,
        avatar: user.profileImage,
    };
};


export const createChatRoom = async (trade: any) => {
    try {
        const chatRef = ref(rtdb, `chats/${trade.id}`);

        //  Check if chat already exists (avoid overwrite)
        const snapShot = await get(chatRef);
        if (snapShot.exists()) {
            return;
        }

        // Create chat room
        await set(chatRef, {
            participants: {
                [trade.fromUserId]: true,
                [trade.toUserId]: true,
            },
            createdAt: Date.now(),
        });
    } catch (error: any) {
        console.log("Create Chat Error", error.message);
        throw new Error("Failed to create chat room") 
    }
};

export const sendMessage = async (
    tradeId: string,
    message: { 
        text: string; 
        senderId: string; 
    }
) => {
    try {
        const messagesRef = ref(rtdb, `chats/${tradeId}/messages`);

        await push(messagesRef, {
        text: message.text,
        senderId: message.senderId,
        timestamp: Date.now(),
        });
        console.log(message);

    } catch (error: any) {
        console.log("Send Message Error", error.message);
    }
};

export const listenToMessages = (
  tradeId: string,
  callback: (messages: any[]) => void
) => {
  const messagesRef = ref(rtdb, `chats/${tradeId}/messages`);

  const unsubscribe = onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      callback([]);
      return;
    }

    // Convert to array WITH IDs
    const messagesArray = Object.entries(data).map(([id, value]: any) => ({
        id, ...value,
    }));

    // Sort latest first (for inverted list)
    messagesArray.sort((a, b) => b.timestamp - a.timestamp);
    callback(messagesArray);
  });

  return unsubscribe;
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import { query, collection, orderBy, onSnapshot, getDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../services/firebase/firebase";

// ALL POSTS
export const subscribeToAllPosts = ( callback : (posts: any[]) => void ) => {

    const q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, async (snapshot) => {
        const posts = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();

                const userSnap = await getDoc(
                    doc(db, "users", data.userId)
                );

                const userData = userSnap.exists() ? userSnap.data() : null;

                return {
                    id: docSnap.id,
                    ...data,

                    userName: userData?.name || "User",
                    userAvatar: userData?.profileImage || "",
                    userRating: userData?.rating || 0,
                    totalReviews: userData?.totalReviews || 0,
                };
            })
        );

        callback(posts);
    });
};

// ALL TRADES
export const subscribeToAllTrades = ( callback : (trades: any[]) => void ) => {
    
    const q = query(
        collection(db, "trades"),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, async (snapshot) => {

        const trades = await Promise.all(
            snapshot.docs.map(async (docSnap) => {

                const data = docSnap.data();

                // FROM USER
                const fromUserSnap = await getDoc(
                    doc(db, "users", data.fromUserId)
                );
                const fromUser = fromUserSnap.exists() ? fromUserSnap.data() : null;

                // TO USER
                const toUserSnap = await getDoc(
                    doc(db, "users", data.toUserId)
                );
                const toUser = toUserSnap.exists() ? toUserSnap.data() : null;  

                // POST
                let postData: any = null;

                if (data.postId) {
                    const postSnap = await getDoc(
                        doc(db, "posts", data.postId)
                    );

                    if (postSnap.exists()) {
                        postData = postSnap.data();
                    }
                }

                return {
                    id: docSnap.id,
                    ...data,

                    fromUserName: fromUser?.name || "User",
                    fromUserAvatar: fromUser?.profileImage || "",

                    toUserName: toUser?.name || "User",
                    toUserAvatar: toUser?.profileImage || "",

                    postTitle: postData?.title || "",
                };
            })
        );

        callback(trades);
    });
};

// DELETE POST
export const deletePostAdmin = async ( postId: string ) => {
    await deleteDoc(
        doc(db, "posts", postId)
    );
};

// DELETE TRADE
export const deleteTradeAdmin = async ( tradeId: string ) => {
    await deleteDoc(
        doc(db, "trades", tradeId)
    );
};

export const getGlobalStats = async () => {
    try {
        const statsRef = doc(db, "stats", "global");
        const statsSnap = await getDoc(statsRef);

        if (!statsSnap.exists()) {
            return null;
        }
        return statsSnap.data();
        
    } catch (error) {
        console.log(error);
        throw error
    }
}

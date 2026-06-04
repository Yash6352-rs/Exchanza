import { db } from "@/app/services/firebase/firebase"
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore"

export const subscribeToUserPosts = (
    userId: string, callback: (posts: any[]) => void
) => {
    const q = query(
        collection(db, "posts"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );  

    return onSnapshot(q, async (snapshot) => {
        const posts = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();

                // Fetch user data
                const userSnap = await getDoc(doc(db, "users", data.userId));
                const userData = userSnap.exists() ? userSnap.data() : null;

                return { 
                    id: docSnap.id, 
                    ...data,

                    // attach user data
                    userName: userData?.name || "User",
                    userAvatar: userData?.profileImage || "",
                    rating: userData?.rating || 0.0,
                    totalReviews: userData?.totalReviews || 0,
                };
            })
        );
        
        callback(posts);
    });
};

export const subscribeToUserTrades = (
    userId: string, callback: (trades: any[]) => void
) => {
    const q = query(
        collection(db, "trades"),
        where("participants", "array-contains", userId),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, async (snapshot) => {
        const trades = await Promise.all(
            snapshot.docs.map(async (docSnap) => {
                const data = docSnap.data();

                const otherUserId = data.fromUserId === userId  
                    ? data.toUserId : data.fromUserId;

                const userSnap = await getDoc(doc(db, "users", otherUserId));
                const userData = userSnap.exists() ? userSnap.data() : null;

                const reviewSnap = await getDocs(
                    query(
                        collection(db, "reviews"),
                        where("tradeId", "==", docSnap.id)
                    )
                );
                const review = !reviewSnap.empty ? reviewSnap.docs[0].data() : null;

                return { 
                    id: docSnap.id, 
                    ...data,
                    otherUser: {
                        name: userData?.name || "User",
                        profileImage: userData?.profileImage || "",
                    },
                    rating: review?.rating || null,
                };
            })
        );

        callback(trades);
    })
};

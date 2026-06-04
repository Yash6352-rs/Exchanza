/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, query, doc, onSnapshot, orderBy, updateDoc, deleteDoc, getDocs, getDoc, where } from "firebase/firestore";
import { db } from "../../../services/firebase/firebase";

export const subscribeToUsers = (callback: (users: any[]) => void) => {

    const q = query(
        collection(db, "users"),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        
        const users = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
        }));

        callback(users);
    });
};

export const toggleBlockUser = async ( userId: string, isBlocked: boolean ) => {

    await updateDoc(
        doc(db, "users", userId), {
        isBlocked: !isBlocked,
        }
    );
}

export const deleteUserAccount = async ( userId: string ) => {
    await deleteDoc(
        doc(db, "users", userId)
    );
};

export const getUserPosts = async ( userId: string ) => {
    const q = query(
        collection(db, "posts")
    );

    const snapshot = await getDocs(q);

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
                userRating: userData?.rating || 0.0,
                totalReviews: userData?.totalReviews || 0,
            };
        })
    ); 

    return posts.filter((post: any) => post.userId === userId)
};

export const getUserTrades = async ( userId: string ) => {
    const q = query(
        collection(db, "trades")
    );

    const snapshot = await getDocs(q);

    const trades = await Promise.all(
        snapshot.docs.map(async (docSnap) => {

            const data = docSnap.data();

            const otherUserId = data.fromUserId === userId 
                ? data.toUserId
                : data.fromUserId;
            
            const userSnap = await getDoc(
                doc(db, "users", otherUserId)
            );

            const userData = userSnap.exists() ? userSnap.data() : null;

            const reviewSnap = await getDocs(query(
                collection(db, "reviews"),
                where("tradeId", "==", docSnap.id)
            ));

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

    return trades.filter((trade: any) =>
        trade.participants?.includes(userId)
    );   
};

export const getUserReports = async ( userId: string ) => {
    const q = query(
        collection(db, "reports")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })).filter((report: any) => 
        report.userId === userId
    );
};
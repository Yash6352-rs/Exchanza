import { collection, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, setDoc, where } from "firebase/firestore";
import { db } from "../../../services/firebase/firebase";

export const syncDashboardStats = async () => {

    const usersSnap = await getCountFromServer(collection(db, "users"));

    const postsSnap = await getCountFromServer(collection(db, "posts"));

    const requestPostsSnap = await getCountFromServer(
        query(collection(db, "posts"),
        where("type", "==", "request")
    ));

    const offerPostsSnap = await getCountFromServer(
        query(collection(db, "posts"),
        where("type", "==", "offer")
    ));

    const tradesSnap = await getCountFromServer(collection(db, "trades"));

    const pendingTradesSnap = await getCountFromServer(
        query(collection(db, "trades"),
        where("status", "==", "pending")
    ));
    
    const activeTradesSnap = await getCountFromServer( 
        query(collection(db, "trades"),
        where("status", "==", "accepted")
    ));
    
    const rejectedTradesSnap = await getCountFromServer(
        query(collection(db, "trades"),
        where("status", "==", "rejected")
    ));
   
    
    const completedTradeSnap = await getCountFromServer(
        query(collection(db, "trades"),
        where("status", "==", "completed")
    ));

    const tagsSnap = await getCountFromServer(collection(db, "tags"));

    const reportsSnap = await getCountFromServer(collection(db, "reports"));

    const statsData = {
        
        totalUsers: usersSnap.data().count,

        totalPosts: postsSnap.data().count,
        requestPosts: requestPostsSnap.data().count,
        offerPosts: offerPostsSnap.data().count,

        totalTrades: tradesSnap.data().count,
        pendingTrades: pendingTradesSnap.data().count,
        activeTrades: activeTradesSnap.data().count,
        rejectedTrades: rejectedTradesSnap.data().count,
        completedTrades: completedTradeSnap.data().count,
        
        totalTags: tagsSnap.data().count,
        reportsCount: reportsSnap.data().count,

        updatedAt: Date.now(),
    };

    await setDoc(
        doc(db, "stats", "global"),
        statsData,
        { merge: true }
    );

    return statsData;
};

export const getDashboardStats = async () => {

    const statsRef = doc(db, "stats", "global");

    const statsSnap = await getDoc(statsRef);

    if (!statsSnap.exists()) {
        return null;
    }

    return statsSnap.data();
}

export const getRecentReports = async () => {

    const reportsQuery = query(
        collection(db, "reports"),
        orderBy("createdAt", "desc"),
        limit(5)
    );

    const snapshot = await getDocs(reportsQuery);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
}


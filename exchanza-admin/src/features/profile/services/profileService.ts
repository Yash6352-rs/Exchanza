import { collection, doc, getCountFromServer, getDoc, query, where } from "firebase/firestore";
import { db } from "../../../services/firebase/firebase";

export const getAdminProfile = async (adminId: string) => {

    // ADMIN USER
    const adminRef = doc(db, "users", adminId);

    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
        throw new Error("Admin not found");
    }

    const adminData = {
        id: adminSnap.id,
        ...adminSnap.data(),
    }

    // PLATFORM STATS
    const usersSnap = await getCountFromServer(collection(db, "users"));
    const postsSnap = await getCountFromServer(collection(db, "posts"));
    const tradesSnap = await getCountFromServer(collection(db, "trades"));

    const completedTradesSnap = await getCountFromServer(
        query(collection(db, "trades"),
        where("status", "==", "completed")
    ));

    const reportsSnap = await getCountFromServer(collection(db, "reports"));

    const blockedUsersSnap = await getCountFromServer(
        query(collection(db, "users"),
        where("isBlocked", "==", "true")
    ));

    const totalTrades = tradesSnap.data().count;
    const completedTrades = completedTradesSnap.data().count;

    const completionRate = totalTrades > 0 
        ? ( (completedTrades / totalTrades) * 100 ).toFixed(1) 
        : "0";

    return {

        user: adminData,

        stats: {
            totalUsers: usersSnap.data().count,
            totalPosts: postsSnap.data().count,
            totalTrades,
            completedTrades,
            reportCount: reportsSnap.data().count,
            blockedUsers: blockedUsersSnap.data().count,
            completionRate,
        }
    }
}
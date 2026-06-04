import { addDoc, collection, getDocs, limit, query, serverTimestamp, where } from "firebase/firestore";
import { getAnalyticsOverview } from "./analyticsService";
import { db } from "../../../services/firebase/firebase";

export const createAnalyticsSnapshot = async() => {
    try {
        
        const overview = await getAnalyticsOverview();
        const now = new Date;

        const dateKey = now.toISOString().split("T")[0];

        const startOfYear = new Date(now.getFullYear(), 0, 1);

        const pastDays = Math.floor(
            (now.getTime() - startOfYear.getTime()) / 86400000
        );

        const weekKey = Math.ceil((pastDays + startOfYear.getDay() + 1) / 7)

        // prevent  duplicate daily snapshot
        const snapshotQuery = query(
            collection(db, "analyticsSnapshots"),
            where("dateKey", "==", dateKey),
            limit(1),
        );

        const snapshotSnap = await getDocs(snapshotQuery);

        if (!snapshotSnap.empty) {
            return;
        }

        await addDoc(collection(db, "analyticsSnapshots"), {

            totalUsers: overview?.totalUsers,
            totalPosts: overview?.totalPosts,
            totalTrades: overview?.totalTrades,
            completedTrades: overview?.completedTrades,
            reportsCount: overview?.reportsCount,
            totalTags: overview?.totalTags,

            createdAt: serverTimestamp(),

            dateKey,
            weekKey,
        })

    } catch (error) {
        console.log("Snapshot Error:", error);
    }
}
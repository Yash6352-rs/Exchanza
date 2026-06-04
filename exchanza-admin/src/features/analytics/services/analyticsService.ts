/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, doc, getCountFromServer, getDoc, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { db } from "../../../services/firebase/firebase";

export const getAnalyticsOverview = async () => {

    const statsRef = doc(db, "stats", "global");

    const statsSnap = await getDoc(statsRef);

    if (!statsSnap.exists()) {
        return null
    }

    const stats: any = statsSnap.data();

    const totalTrades = stats.totalTrades || 0;
    const completedTrades = stats.completedTrades || 0;
    const totalUsers = stats.totalUsers || 0;
    const totalPosts = stats.totalPosts || 0;
    const reportsCount = stats.reportsCount || 0;
    const totalTags = stats.totalTags || 0;

    const blockedUsersSnap = await getCountFromServer(
        query(collection(db, "users"),where("isBlocked", "==", true))
    );

    const completionRate = totalTrades
        ? ((completedTrades / totalTrades) * 100).toFixed(1)
        : 0;

    return {
        totalUsers: totalUsers,
        totalPosts: totalPosts,
        totalTrades,
        completedTrades,
        reportsCount: reportsCount,
        totalTags: totalTags,
        blockedUsers: blockedUsersSnap.data().count,
        completionRate
    };
};

export const getTopUsers = async () => {

    const usersQuery = query(
        collection(db, "users"),
        orderBy("rating", "desc"),
        limit(5)
    );

    const snapshot = await getDocs(usersQuery);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))

    // REMOVE ADMINS
    .filter((user: any) => user.role !== "admin")

    // TAKE TOP 5
    .slice(0, 5);
}

export const getTopTags = async () => {

    const tagsQuery = query(
        collection(db, "tags"),
        orderBy("usageCount", "desc"),
        limit(7)
    );

    const snapshot = await getDocs(tagsQuery);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
}

export const getTradeAnalytics = async () => {

    const statsRef = doc(db, "stats", "global");
    const statsSnap = await getDoc(statsRef);
    if (!statsSnap.exists()) return[];

    const stats: any = statsSnap.data();

    return [
        {
            name: "Pending",
            value: stats.pendingTrades || 0,
        },
        {
            name: "Active",
            value: stats.activeTrades || 0,
        },
        {
            name: "Rejected",
            value: stats.rejectedTrades || 0,
        },
        {
            name: "Completed",
            value: stats.completedTrades || 0,
        }
    ];

};

export const getGrowthAnalytics = async ( range: string = "30d" ) => {

    const snapshotsQuery = query(
        collection(db, "analyticsSnapshots"),
        orderBy("createdAt", "desc"),
        limit(30)
    );

    const snapshotSnap = await getDocs(snapshotsQuery);

    const now = new Date();

    let daysLimit = 30;

    if (range === "7d") {
        daysLimit = 7;
    }
    if (range === "30d") {
        daysLimit = 30;
    }
    if (range === "6m") {
        daysLimit = 180;
    }
    if (range === "1y") {
        daysLimit = 365;
    }

    const filtered = snapshotSnap.docs.filter((doc) => {

        const data: any = doc.data();
        if (!data.createdAt) return false;

        const snapshotDate = data.createdAt.toDate();
        const diff = (now.getTime() - snapshotDate.getTime()) / 86400000;

        return diff <= daysLimit;
    });

    return filtered.map((doc) => {

        const data: any = doc.data();

        return {
            day: data.dateKey,
            week: data.weekKey ? `Week ${data.weekKey}` : "Week 1",
            users: data.totalUsers || 0,
            posts: data.totalPosts || 0,
            trades: data.totalTrades || 0,
        };
    });
};

export const getAverageCompletionTime = async () => {

    const completedQuery = query(
        collection(db, "trades"),
        where("status", "==", "completed")
    );

    const snapshot = await getDocs(completedQuery);

    let totalHours = 0;
    let totalTrades = 0;

    snapshot.docs.forEach((doc) => {

        const data: any = doc.data();

        if (!data.createdAt || !data.completedAt) return;

        const created = data.createdAt.toDate().getTime();
        const completed = data.completedAt.toDate().getTime();

        const diffHours = (completed - created) / (1000 * 60 * 60);

        totalHours += diffHours;
        totalTrades += 1 ;
    });

    if (!totalTrades) {
        return "0h";
    }

    const avgHours = totalHours / totalTrades;

    if (avgHours >= 24) {
        return `${(avgHours / 24).toFixed(1)} days`;
    }

    return `${avgHours.toFixed(1)} hrs`;
}

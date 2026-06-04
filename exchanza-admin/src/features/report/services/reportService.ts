/* eslint-disable no-useless-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../../services/firebase/firebase";

// SUBSCRIBE REPORTS
export const subscribeToReports = ( callback: (reports: any[]) => void) => {
    const q = query(
        collection(db, "reports"),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, async (snapshot) => {

        const reports = await Promise.all(
            snapshot.docs.map(async (docSnap) => {

                const data = docSnap.data();

                let reporterData: any = null;
                let reportsCount = 0;

                // GET USER
                if (data.userId) {
                    const userSnap = await getDoc(
                        doc(db, "users", data.userId)
                    );

                    if (userSnap.exists()) {
                        reporterData = userSnap.data();
                    }
                }

                // USER REPORTS COUNT
                const reportsQuery = query(
                    collection(db, "reports"),
                    where("userId", "==", data.userId)
                );
                const reportsSnap = await getDocs(reportsQuery);
                reportsCount = reportsSnap.size;

                return {
                    id: docSnap.id,
                    ...data,

                    reporterId: data.userId || "Unknown User",
                    reporterName: reporterData?.name || "Unknown User",
                    reporterAvatar: reporterData?.profileImage || "",
                    reporterRating: reporterData?.rating || "",
                    reporterCreatedAt: reporterData?.createdAt || "",
                    reporterReportsCount: reportsCount || "",
                };
            })
        );

        callback(reports);
    });
};

// MARK RESOLVED
export const markReportResolved = async ( reportId: string ) => {

    await updateDoc(
        doc(db, "reports", reportId), {
            status: "resolved",
        }
    );
};

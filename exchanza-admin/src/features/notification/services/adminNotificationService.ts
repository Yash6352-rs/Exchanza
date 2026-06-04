import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../../services/firebase/firebase";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const subscribeToAdminNotifications = ( 
    callback: (notifications: any[]) => void) => {

        const q = query(
            collection(db, "adminNotifications"),
            orderBy("createdAt", "desc")
        );

        return onSnapshot(q, (snapshot) => {

            const notifications = snapshot.docs.map((docSnap) => ({
                id: docSnap.id,
                ...docSnap.data(),
            }));

            callback(notifications);
        });
};

// MARK AS READ
export const markNotificationAsRead = async (notificationId: string) => {
    try {
        await updateDoc(
            doc(db, "adminNotifications", notificationId), {
                isRead: true,
            }
        );
    } catch (error) {
        console.log("Mark Read Error:", error);
    }
}

// DELETE
export const deleteAdminNotification = async (notificationId: string) => {
    try {
        await deleteDoc(
            doc(db, "adminNotifications", notificationId)
        );
    } catch (error) {
        console.log("Delete Notification Error", error);
    }
}

export const markAllNotificationsAsRead = async (userId: string) => {

    try {
        const q = query(
            collection(db, "adminNotifications"),
            where("userId", "==", userId),
            where("isRead", "==", false),
        );

        const snapshot = await getDocs(q);

        const updates = snapshot.docs.map((d) => 
            updateDoc(doc(db, "adminNotifications", d.id),{
                isRead: true,
            })    
        );
    
        await Promise.all(updates);

    } catch (error) {
        console.log("Mark all read error:", error);
    }
}

export const clearAllNotifications = async (userId: string) => {
    try {
        const q = query(
            collection(db, "adminNotifications", userId),
            where("userId", "==", userId)
        );

        const snapshot = await getDocs(q);

        const deletes = snapshot.docs.map((d) => 
            deleteDoc(doc(db, "adminNotifications", d.id))    
        );

        await Promise.all(deletes);

    } catch (error) {
        console.log("Clear all error:", error);
    }
}
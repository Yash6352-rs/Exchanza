import { db } from "@/app/services/firebase/firebase"
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore"

// Create Notification
export const createNotification = async (data: any) => {
    try {
        const ref = doc(db, "notficationSettings", data.userId);
        const snap = await getDoc(ref);

        const settings = snap.exists() ? snap.data() : null;

        // Notifications OFF
        if (settings && settings.enabled === false) return;

        // Quiet hours (12AM-6AM)
        const hour = new Date().getHours();
        if (settings?.quietHours && hour >= 0 && hour > 6) return;

        await addDoc(collection(db, "notifications"), {
            ...data,
            isRead: false,
            createdAt: serverTimestamp(),
        });
        
    } catch (error) {
        console.log("Create Nofications Error:", error);
    }
};

// Real-time Notifications Listener
export const getUserNotifications = (userId: string, callback: any) => {
    const q = query(
        collection(db, "notifications"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const notifications: any[] = [];

        snapshot.forEach((docSnap) => {
            notifications.push({
                id: docSnap.id,
                ...docSnap.data(),
            });
        });

        callback(notifications);
    });
};

// Mark as Read
export const markAsRead = async (notificationId: string) => {
    try {
        await updateDoc(doc(db, "notifications", notificationId), {
            isRead: true,
        });
    } catch (error) {
        console.log("Mark Read Error:", error);    
    }
}

// Delete Notification
export const deleteNotification = async (notificationId: string) => {
    try {
        await deleteDoc(doc(db, "notifications", notificationId));
    } catch (error) {
        console.log("Delete Notification Error:" , error);
    }
}

// Mark All Notifications As Read
export const markAllNotificationsAsRead = async (userId: string) => {
    try {
        const q = query(
            collection(db, "notifications"),
            where("userId", "==", userId),
            where("isRead", "==", false)
        );

        const snapshot = await getDocs(q);

        const updates = snapshot.docs.map((d) => 
            updateDoc(doc(db, "notifications", d.id), { isRead: true})    
        );

        await Promise.all(updates);
    } catch (error) {
        console.log("Mark all read error:", error);
    }
}

// Clear All Notifications
export const clearAllNotifications = async (userId: string) => {
    try {
        const q = query(
            collection(db, "notifications"),
            where("userId", "==", userId)
        );

        const snapshot = await getDocs(q);

        const deletes = snapshot.docs.map((d) =>
            deleteDoc(doc(db, "notifications", d.id))
        );

        await Promise.all(deletes);
    } catch (error) {
        console.log("Clear all error:", error)
    }
};




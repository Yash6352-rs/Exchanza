import { auth } from "@/app/services/firebase/firebase";
import { createContext, useContext, useEffect, useState } from "react";
import { getUserNotifications } from "./notificationService";

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: any) => {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            if (!user) return;

            return getUserNotifications(user.uid, (data: any) => {
                setNotifications(data);
                setLoading(false);
            });
        });

        return unsub;
    }, []);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <NotificationContext.Provider
            value={{ notifications, setNotifications, unreadCount, loading }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error("useNotifications must be used inside NotificationsProvider");
    }

    return context;
} 


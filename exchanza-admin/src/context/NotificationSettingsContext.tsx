/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const NotificationSettingsContext = createContext<any>(null);

export const NotificationSettingsProvider = ({ children }: any) => {

    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {

        if (!auth.currentUser?.uid) return;

        const ref = doc(db, "notificationSettings", auth.currentUser.uid);
        const unsub = onSnapshot(ref, async (snap) => {

            if (snap.exists()) {
                setSettings(snap.data());
            } else {
                const defaults = {
                    enabled: true,
                    badge: true,
                    sound: true,
                    quietHours: false,
                };

                await setDoc(ref, defaults);
                setSettings(defaults);
            }
        });
        return () => unsub();
    }, []);

    const updateSetting = async (key: string, value: boolean) => {

        if (!auth.currentUser?.uid) return;

        const updated = {
            ...settings,
            [key]: value,
        };
        setSettings(updated);

        await setDoc(doc(db, "notificationSettings", auth.currentUser.uid),
            updated, {
                merge: true 
        });
    };

    return (
        <NotificationSettingsContext.Provider value={{ settings, updateSetting }}>
            {children}
        </NotificationSettingsContext.Provider>
    );
}

export const useNotificationSettings = () => {
    const ctx = useContext(NotificationSettingsContext);

    if (!ctx) {
        throw new Error("useNotificationSettings must be used inside provider");
    }
    return ctx;
}
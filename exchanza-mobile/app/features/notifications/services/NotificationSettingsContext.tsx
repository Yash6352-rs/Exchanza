import { auth, db } from '@/app/services/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';

const NotificationSettingsContext = createContext<any>(null);

export const NotificationSettingsProvider = ({ children }: any) => {
    const [settings, setSettings] = useState<any>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            setUser(u);
        });
        return () => unsub();
    }, []);

    useEffect(() => {      
        if (!user) return;

        const ref = doc(db, "notificationSettings", user.uid);

        const unsub = onSnapshot(ref, async (snap) => {
            if (snap.exists()) {
                const data = snap.data();

                setSettings((prev: any) => {
                    if (JSON.stringify(prev) !== JSON.stringify(data)) {
                        return data;
                    }
                    return prev;
                });
            } else {
                const defaultSettings = {
                    enabled: true,
                    badge: true,
                    vibrate: true,
                    sound: true,
                    quietHours: false,
                };

                await setDoc(ref, defaultSettings);
                setSettings(defaultSettings);
            }
        });

        return () => unsub();
    }, [user]);

    const updateSetting = async (key: string, value: boolean) => {
        if (!user) return;

        setSettings((prev: any) => {
        const updated = { ...prev, [key]: value };

        setDoc(doc(db, "notificationSettings", user.uid), updated, {
            merge: true,
        });

        return updated;
        });
    };

  return (
    <NotificationSettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </NotificationSettingsContext.Provider>
  );
};

export const useNotificationSettings = () => {
    const ctx = useContext(NotificationSettingsContext);
    if (!ctx) {
        throw new Error("useNotificationSettings must be used inside NotificationSettingsProvider")
    }
    return ctx;
}
import { auth, db } from "@/app/services/firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { createContext, ReactNode, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  userData: Record<string, any> | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "users", user.uid);

    const unsub = onSnapshot(ref, (snap) => {
      setUserData(snap.data() || null);
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

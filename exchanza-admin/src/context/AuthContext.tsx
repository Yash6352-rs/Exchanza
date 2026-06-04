/* eslint-disable react-refresh/only-export-components */
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { createContext, type ReactNode , useContext, useEffect, useState} from "react";
import { auth, db } from "../services/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

type AuthUser = User & {
    profileImage?: string;
    role?: string;
    name?: string;
};

type AuthContextType = {
    user: AuthUser | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

type Props = {
    children: ReactNode;
};

export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

            if (!firebaseUser) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const userRef = doc(db, "users", firebaseUser.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    await signOut(auth);
                    setUser(null);
                    setLoading(false);
                    return;
                }

                const userData = userSnap.data();

                if (userData.role !== "admin") {
                    await signOut(auth);
                    setUser(null);
                    setLoading(false);
                    return;
                }

                setUser({
                    ...firebaseUser,
                    ...userData,
                });
            
            } catch (error) {
                console.log(error);
                await signOut(auth);
                setUser(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
import { AuthContext } from "@/context/AuthProvider";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect } from "react";
import "../global.css";
import { Loader } from "./components/common/Loader";
import { db } from "./services/firebase/firebase";

export default function Index() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      if (loading) return;

      try {
        if (!user) {
          router.replace("/features/auth/screens/welcome");
          return;
        }

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (!isMounted) return;

        if (docSnap.exists() && docSnap.data().profileCompleted) {
          router.replace("/(tabs)" as any);
        } else {
          router.replace("/features/auth/screens/onboarding");
        }
      } catch (error) {
        console.log("Auth check error:", error)
        router.replace("/features/auth/screens/welcome");
    
      }
    };

    checkUser();

    return () => {
      isMounted = false;
    };
  }, [user, loading]);

  return <Loader fullScreen />;
}

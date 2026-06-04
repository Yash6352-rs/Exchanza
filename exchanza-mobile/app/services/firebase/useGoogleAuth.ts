import { auth } from "@/app/services/firebase/firebase";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect } from "react";
import { createUserIfNotExists } from "../../features/auth/service/user";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "285434732061-45i77h3e36pb19p951os175esctqc7mo.apps.googleusercontent.com",
  });

  useEffect(() => {
    const handleGoogleAuth = async () => {
      if (response?.type === "success") {
        const idToken = response.authentication?.idToken;

        if (!idToken) return;
        try {
          const credential = GoogleAuthProvider.credential(idToken);
          const userCredential = await signInWithCredential(auth, credential);

          await createUserIfNotExists(userCredential.user);
          router.replace("/");
        } catch (error) {
          console.log("Google Auth Error", error);
        }
      }
    };
    handleGoogleAuth();
  }, [response]);
  return { promptAsync, request };
};

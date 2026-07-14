// import { auth } from "@/app/services/firebase/firebase";
// import * as Google from "expo-auth-session/providers/google";
// import { useRouter } from "expo-router";
// import * as WebBrowser from "expo-web-browser";
// import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import { useEffect } from "react";
// import { createUserIfNotExists } from "../../features/auth/service/user";

// WebBrowser.maybeCompleteAuthSession();

// export const useGoogleAuth = () => {
//   const router = useRouter();

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     androidClientId: "949037840576-adumav3f2nro4bkf8nkcgb38mckfbfna.apps.googleusercontent.com",
//     webClientId: "949037840576-aicibf01i0hk42ensu5k4ptudvbjlq7r.apps.googleusercontent.com",
//   });
//   console.log("Redirect URI:", request?.redirectUri);

//   useEffect(() => {
//     const handleGoogleAuth = async () => {
//       if (response?.type === "success") {
//         const idToken = response.authentication?.idToken;

//         if (!idToken) return;
//         try {
//           const credential = GoogleAuthProvider.credential(idToken);
//           const userCredential = await signInWithCredential(auth, credential);

//           await createUserIfNotExists(userCredential.user);
//           router.replace("/");
//         } catch (error) {
//           console.log("Google Auth Error", error);
//         }
//       }
//     };
//     handleGoogleAuth();
//   }, [response]);
//   return { promptAsync, request };
// };

import { auth } from "@/app/services/firebase/firebase";
import { useRouter } from "expo-router";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { createUserIfNotExists } from "../../features/auth/service/user";

GoogleSignin.configure({
  webClientId:
    "949037840576-aicibf01i0hk42ensu5k4ptudvbjlq7r.apps.googleusercontent.com",
    offlineAccess: true,
});

export const useGoogleAuth = () => {
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      const credential = GoogleAuthProvider.credential(
        userInfo.data?.idToken
      );

      const userCredential = await signInWithCredential(auth, credential);

      await createUserIfNotExists(userCredential.user);

      router.replace("/");
    } catch (error) {
      console.log("Google Sign In Error:", error);
    }
  };

  return { signInWithGoogle };
};


import { useGoogleAuth } from "@/app/services/firebase/useGoogleAuth";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../../services/firebase/firebase";

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Appearance, Image, Text, TouchableOpacity, View } from "react-native";

import { AppDialog } from "@/app/components/common/AppDialog";
import { AppButton } from "../../../components/common/AppButton";
import { lightColors } from "../../../components/theme/colors";
import { createUserIfNotExists } from "../service/user";
import { AppInput } from "@/app/components/common/AppInput";
import { useTheme } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { doc, getDoc } from "firebase/firestore";

export default function LoginScreen() {
  const { promptAsync } = useGoogleAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { theme, themeMode } = useTheme();
  const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      
      // Firebase Login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const firebaseUsers = userCredential.user;

      // Fetch user document
      const userRef = doc(db, "users", firebaseUsers.uid);
      const userSnap = await getDoc(userRef);

      // Check if user exists
      if (!userSnap.exists()) {
        await signOut(auth);

        setError("Account not found");
        return;
      }

      const userData = userSnap.data();

      // BLOCK ADMINS FROM MOBILE APP
      if (userData.role === 'admin') {
        await signOut(auth);
        setError("Admin accounts are not allowed in the mobile app.")
      }

      // Create user if needed
      await createUserIfNotExists(userCredential.user);
      
      router.replace("/");

    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      className="flex-1 px-6 py-10"
      style={{ backgroundColor: theme?.background || lightColors.background }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Top Logo */}
      <View className="items-center mb-6 mt-12">
        <Image
          source={require("../../../../assets/images/exchanza_logo.png")}
          style={{ width: 130, height: 130 }}
        />

        <Text className="text-[38px] -mt-2 font-bold" style={{ color: theme?.primary || lightColors.primary }}>
          Exchanza
        </Text>

        {/* Tagline */}
        <Text className="text-base mt-2 text-center" style={{ color: theme?.subText || lightColors.subText }}>
          Your Skills, Your Currency.
        </Text>
      </View>

      {/* Card */}
      <View
        className="rounded-3xl p-5"
        style={{
          backgroundColor: theme?.card || lightColors.card,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 3,
        }}
      >
        <Text className="text-2xl font-semibold" style={{ color: theme?.text || lightColors.text }}>
          Welcome Back !
        </Text>

        {/* Email */}
        <View className="mt-6 mb-4">
          <Text className="text-xs font-semibold mb-2" style={{ color: theme?.subText || lightColors.subText }}>EMAIL ADDRESS</Text>
          <AppInput icon="mail-outline" placeholder="example@gmail.com" value={email} onChangeText={setEmail} />
        </View>

        {/* Password */}
        <View className="mb-4">
          <Text className="text-xs font-semibold mb-2" style={{ color: theme?.subText || lightColors.subText }}>PASSWORD</Text>
          <AppInput
            icon="lock-closed-outline"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Login Button */}
        <AppButton title="Login" onPress={handleLogin} loading={loading} />

        {/* Divider */}
        <View className="flex-row items-center my-6">
          <View
            className="flex-1 h-[1px]"
            style={{ backgroundColor: theme?.border || lightColors.border }}
          />
          <Text className="mx-3 text-sm" style={{ color: theme?.subText || lightColors.subText }}>
            OR
          </Text>

          <View
            className="flex-1 h-[1px]"
            style={{ backgroundColor: theme?.border || lightColors.border }}
          />
        </View>

        {/* Google Button */}
        <TouchableOpacity
          onPress={() => promptAsync()}
          className="w-full rounded-3xl py-4 items-center justify-center border"
          style={{
            borderColor: theme?.border || lightColors.border,
            backgroundColor: "transparent",
            shadowColor: "#000",
            shadowOpacity: 0,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 0,
          }}
        >
          <View className="flex-row justify-center items-center gap-2">
            <Image
              source={require("../../../../assets/images/google.png")} // replace with your logo
              className="w-5 h-5"
              resizeMode="contain"
            />
            <Text
              className="text-base font-semibold tracking-wide"
              style={{ color: theme?.text || lightColors.text }}
            >
              Continue with Google
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Bottom Signup */}
      <View className="flex-row mt-6 items-center justify-center gap-1 mb-2">
        <Text style={{ color: theme?.subText || lightColors.subText }}>
          Dont have an account?
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/features/auth/screens/register")}
        >
          <Text
            className="font-semibold"
            style={{ color: theme?.primary || lightColors.primary }}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>

      <AppDialog
        visible={!!error}
        title="Login Error"
        description={error}
        singleButton
        confirmText="Got it"
        onConfirm={() => setError("")}
      />
    </View>
  );
}

// When user taps Google:
// Google popup opens
// User selects account
// Firebase logs them in
// If new → auto signup
// If existing → login

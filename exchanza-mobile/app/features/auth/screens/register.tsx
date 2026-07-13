import { useGoogleAuth } from "@/app/services/firebase/useGoogleAuth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../services/firebase/firebase";

import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { AppDialog } from "@/app/components/common/AppDialog";
import { AppButton } from "../../../components/common/AppButton";
import { AppInput } from "../../../components/common/AppInput";
import { lightColors } from "../../../components/theme/colors";
import { createUserIfNotExists } from "../service/user";
import { useTheme } from "@/context/ThemeContext";

export default function RegisterScreen() {
  const { promptAsync } = useGoogleAuth();
  const router = useRouter();
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

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
      {/* Top Logo */}
      <View className="items-center justify-center mt-5 mb-4 gap-2">
        <Image
           source={require("../../../../assets/images/exchanza_logo.png")}
            style={{ width:110, height:110 }}
        />

        <Text className="text-[35px] -mt-4 font-bold" style={{ color: theme?.primary || lightColors.primary }}>
          Exchanza
        </Text>

        {/* Tagline */}
        <Text className="text-base text-center" style={{ color: theme?.subText || lightColors.subText }}>
           Your Skills, Your Currency.
        </Text>
        </View>
    
      {/* Card */}
      <View
        className="rounded-3xl p-6"
        style={{
          backgroundColor: theme?.card || lightColors.card,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 3,
        }}
      >
        <Text className="text-2xl font-semibold" style={{ color: theme?.text || lightColors.text }}>
          Create Account
        </Text>

        {/* Name */}
        <View className="mt-5 mb-4">
          <Text className="text-xs font-semibold mb-2" style={{ color: theme?.subText || lightColors.subText }}>NAME</Text>
          <AppInput icon="person-outline" placeholder="abc" value={name} onChangeText={setName} />
        </View>

        {/* Email */}
        <View className="mb-3">
          <Text className="text-xs font-semibold mb-2" style={{ color: theme?.subText || lightColors.subText }}>EMAIL</Text>
          <AppInput icon="mail-outline" placeholder="example@gmail.com" value={email} onChangeText={setEmail} />
        </View>

        {/* Password */}
        <View className="mb-4">
          <Text className="text-xs font-semibold mb-2" style={{ color: theme?.subText || lightColors.subText }}>PASSWORD</Text>
          <AppInput
            icon="lock-closed-outline"
            placeholder="******"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {/* Signup Button */}
        <AppButton
          title="Create Account"
          onPress={handleSignup}
          loading={loading}
        />

        {/* Divider */}
        <View className="flex-row items-center my-5">
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

        {/* Google Signup */}
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

      {/* Bottom Login */}
      <View className="flex-row mt-6 items-center justify-center gap-1">
        <Text style={{ color: theme?.subText || lightColors.subText }}>
          Already have an account?
        </Text>

        <TouchableOpacity onPress={() => router.push("/features/auth/screens/login")}>
          <Text
            className="font-semibold"
            style={{ color: theme?.primary || lightColors.primary }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>

      <AppDialog
        visible={!!error}
        title="Signup Error"
        description={error}
        singleButton
        confirmText="Got it"
        onConfirm={() => setError("")}
      />
    </View>
  );
}

import { Text, View, Image, Appearance } from 'react-native';
import { useRouter } from 'expo-router';
import { lightColors } from '../../../components/theme/colors';
import { AppButton } from '../../../components/common/AppButton';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/context/ThemeContext';

export default function Welcome() {
  const router = useRouter();
  const { theme, themeMode } = useTheme();
  const isDark = themeMode === "dark" || (themeMode === "system" && Appearance.getColorScheme() === "dark");

  return (
    <View
      className="flex-1 items-center justify-between px-6 py-12 mb-3"
      style={{ backgroundColor: theme?.background || lightColors.background }}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Center Content */}
      <View className="items-center">

        {/* Logo */}
        <View className="mt-16">
          <Image
            source={isDark ? require("../../../../assets/images/exchanza_dark_bg_1.png") : require("../../../../assets/images/exchanza_light_1.png")}
            style={{ width: 360, height: 530 }}       
          />
        </View>

        {/* App Name */}
        <Text className="text-[40px] font-bold" style={{ color: theme?.primary || lightColors.primary }}>
          Exchanza
        </Text>

        {/* Tagline */}
        <Text className="text-base mt-2 text-center" style={{ color: theme?.subText || lightColors.subText }}>
          Your Skills, Your Currency.
        </Text>
        
      </View>

      {/* Bottom Button */}
      <View className="w-full">
        <AppButton
          className="rounded-3xl -mt-3"
          title="Get Started"
          onPress={() => router.push("/features/auth/screens/login")}
        />
      </View>

    </View>
  );
}

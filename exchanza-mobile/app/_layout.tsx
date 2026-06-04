import { AuthProvider } from "@/context/AuthProvider";
import { SplashScreen, Stack } from "expo-router";
import { ToastProvider } from "./components/common/ToastProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NotificationProvider } from "./features/notifications/services/NotificationContext";
import { NotificationSettingsProvider } from "./features/notifications/services/NotificationSettingsContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { View } from "react-native";
import BlockedBanner from "./components/common/BlockedBanner";
import { useEffect } from "react"

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(() => {
    async function prepare() {
      await new Promise(resolve => setTimeout(resolve, 3000));
      await SplashScreen.hideAsync();
    }

    prepare();
  }, []);

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NotificationSettingsProvider>
            <NotificationProvider>
              <ToastProvider>
                <AuthProvider>

                  <View style={{ flex: 1 }}>

                    {/* GLOBAL BLOCKED BANNER */}
                    <BlockedBanner />                            

                      <Stack screenOptions={{ headerShown: false}} >        

                        <Stack.Screen
                          name="features/posts/[id]"
                          options={{
                            animation: "fade_from_bottom",
                            animationDuration: 300
                          }}
                        />

                        <Stack.Screen
                          name="features/trades/[id]"
                          options={{
                            animation: "fade_from_bottom",
                            animationDuration: 300
                          }}
                        />

                        <Stack.Screen 
                            name="features/posts/screens/SearchScreen"
                            options={{
                              presentation: "modal",
                              animation: "fade_from_bottom"
                            }}
                        />
                          
                        <Stack.Screen 
                          name="features/settings/screens/SettingsSearchScreen"
                          options={{
                            presentation: "modal",
                            animation: "fade_from_bottom"
                          }}
                        />

                      </Stack>
                      
                    </View>

                </AuthProvider>
              </ToastProvider>
            </NotificationProvider>
        </NotificationSettingsProvider>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}

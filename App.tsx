"use client"

import { useEffect } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import { ThemeProvider } from "./src/context/ThemeContext"
import { AuthProvider, useAuth } from "./src/context/AuthContext"
import RootNavigator from "./src/navigation/RootNavigator"
import AuthNavigator from "./src/navigation/AuthNavigator"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { ToastProvider } from "./src/context/ToastContext"
import Toast from "./src/components/ui/Toast"
import * as SplashScreen from "expo-splash-screen"
import { useFonts } from "expo-font"
import { LogBox } from "react-native"

// Ignore specific warnings
LogBox.ignoreLogs(["ViewPropTypes will be removed", "ColorPropType will be removed"])

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

const App = () => {
  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <AppContent />
              <Toast />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const AppContent = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null // Or a loading screen
  }

  return (
    <NavigationContainer>
      <BottomSheetModalProvider>
        <StatusBar style="auto" />
        {user ? <RootNavigator /> : <AuthNavigator />}
      </BottomSheetModalProvider>
    </NavigationContainer>
  )
}

export default App


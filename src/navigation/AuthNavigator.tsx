"use client"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useTheme } from "../context/ThemeContext"

import LoginScreen from "../screens/auth/LoginScreen"
import SignupScreen from "../screens/auth/SignupScreen"
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen"
import RoleSelectionScreen from "../screens/auth/RoleSelectionScreen"
import OnboardingScreen from "../screens/auth/OnboardingScreen"

const Stack = createNativeStackNavigator()

const AuthNavigator = () => {
  const { colors } = useTheme()

  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Sign In" }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ title: "Create Account" }} />
      <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ title: "Select Your Role" }} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: "Reset Password" }} />
    </Stack.Navigator>
  )
}

export default AuthNavigator


"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useTheme } from "../../context/ThemeContext"
import TextInput from "../../components/ui/TextInput"
import Button from "../../components/ui/Button"
import { Mail, Lock, User } from "lucide-react-native"

type AuthStackParamList = {
  Login: undefined
  Signup: undefined
  RoleSelection: { email: string; password: string; displayName: string }
}

type SignupScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, "Signup">

const SignupScreen = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>()
  const { colors } = useTheme()

  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<{
    displayName?: string
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: {
      displayName?: string
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

    if (!displayName) {
      newErrors.displayName = "Name is required"
    }

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = () => {
    if (!validateForm()) return

    setIsLoading(true)

    // Navigate to role selection with user data
    setTimeout(() => {
      setIsLoading(false)
      navigation.navigate("RoleSelection", {
        email,
        password,
        displayName,
      })
    }, 500)
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require("../../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Sign up to get started with AI Study App
          </Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            value={displayName}
            onChangeText={setDisplayName}
            leftIcon={<User size={20} color={colors.mutedForeground} />}
            error={errors.displayName}
          />

          <TextInput
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={colors.mutedForeground} />}
            error={errors.email}
          />

          <TextInput
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color={colors.mutedForeground} />}
            error={errors.password}
          />

          <TextInput
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color={colors.mutedForeground} />}
            error={errors.confirmPassword}
          />

          <Button onPress={handleSignup} isLoading={isLoading} style={styles.signupButton}>
            Continue
          </Button>
        </View>

        <View style={styles.footerContainer}>
          <Text style={[styles.footerText, { color: colors.mutedForeground }]}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={[styles.loginText, { color: colors.primary }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
  formContainer: {
    marginBottom: 24,
  },
  signupButton: {
    marginTop: 8,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
  },
  loginText: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
  },
})

export default SignupScreen


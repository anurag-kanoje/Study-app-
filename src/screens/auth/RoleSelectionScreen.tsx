"use client"

import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native"
import { useNavigation, useRoute, type RouteProp } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import { useTheme } from "../../context/ThemeContext"
import { useAuth, type UserRole } from "../../context/AuthContext"
import Button from "../../components/ui/Button"
import { BookOpen, Users, User } from "lucide-react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSequence } from "react-native-reanimated"

type AuthStackParamList = {
  RoleSelection: { email: string; password: string; displayName: string }
}

type RoleSelectionRouteProp = RouteProp<AuthStackParamList, "RoleSelection">
type RoleSelectionNavigationProp = NativeStackNavigationProp<AuthStackParamList, "RoleSelection">

const { width } = Dimensions.get("window")

const RoleSelectionScreen = () => {
  const route = useRoute<RoleSelectionRouteProp>()
  const navigation = useNavigation<RoleSelectionNavigationProp>()
  const { colors } = useTheme()
  const { signUp } = useAuth()

  const { email, password, displayName } = route.params
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Animation values
  const studentScale = useSharedValue(1)
  const teacherScale = useSharedValue(1)
  const parentScale = useSharedValue(1)

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role)

    // Animate the selected role
    switch (role) {
      case "student":
        studentScale.value = withSequence(withTiming(1.05, { duration: 150 }), withTiming(1, { duration: 150 }))
        teacherScale.value = withTiming(0.95, { duration: 200 })
        parentScale.value = withTiming(0.95, { duration: 200 })
        break
      case "teacher":
        teacherScale.value = withSequence(withTiming(1.05, { duration: 150 }), withTiming(1, { duration: 150 }))
        studentScale.value = withTiming(0.95, { duration: 200 })
        parentScale.value = withTiming(0.95, { duration: 200 })
        break
      case "parent":
        parentScale.value = withSequence(withTiming(1.05, { duration: 150 }), withTiming(1, { duration: 150 }))
        studentScale.value = withTiming(0.95, { duration: 200 })
        teacherScale.value = withTiming(0.95, { duration: 200 })
        break
    }
  }

  const studentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: studentScale.value }],
    }
  })

  const teacherAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: teacherScale.value }],
    }
  })

  const parentAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: parentScale.value }],
    }
  })

  const handleSignup = async () => {
    if (!selectedRole) return

    setIsLoading(true)
    try {
      await signUp(email, password, selectedRole, displayName)
      // Navigation is handled by the AuthContext
    } catch (error) {
      // Error handling is done in AuthContext
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: colors.text }]}>I am a...</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Select your role to personalize your experience
        </Text>
      </View>

      <View style={styles.rolesContainer}>
        <Animated.View style={[studentAnimatedStyle]}>
          <TouchableOpacity
            style={[
              styles.roleCard,
              {
                backgroundColor:
                  selectedRole === "student"
                    ? colors.primary + "15" // 15% opacity
                    : colors.card,
                borderColor: selectedRole === "student" ? colors.primary : colors.border,
              },
            ]}
            onPress={() => handleRoleSelect("student")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + "15" }]}>
              <BookOpen size={32} color={colors.primary} />
            </View>
            <Text style={[styles.roleTitle, { color: colors.text }]}>Student</Text>
            <Text style={[styles.roleDescription, { color: colors.mutedForeground }]}>
              Access AI study tools, quizzes, and personalized learning resources
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[teacherAnimatedStyle]}>
          <TouchableOpacity
            style={[
              styles.roleCard,
              {
                backgroundColor: selectedRole === "teacher" ? colors.primary + "15" : colors.card,
                borderColor: selectedRole === "teacher" ? colors.primary : colors.border,
              },
            ]}
            onPress={() => handleRoleSelect("teacher")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + "15" }]}>
              <Users size={32} color={colors.primary} />
            </View>
            <Text style={[styles.roleTitle, { color: colors.text }]}>Teacher</Text>
            <Text style={[styles.roleDescription, { color: colors.mutedForeground }]}>
              Track student progress, create assignments, and manage classes
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[parentAnimatedStyle]}>
          <TouchableOpacity
            style={[
              styles.roleCard,
              {
                backgroundColor: selectedRole === "parent" ? colors.primary + "15" : colors.card,
                borderColor: selectedRole === "parent" ? colors.primary : colors.border,
              },
            ]}
            onPress={() => handleRoleSelect("parent")}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: colors.primary + "15" }]}>
              <User size={32} color={colors.primary} />
            </View>
            <Text style={[styles.roleTitle, { color: colors.text }]}>Parent</Text>
            <Text style={[styles.roleDescription, { color: colors.mutedForeground }]}>
              Monitor screen time, set study limits, and view progress reports
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <Button onPress={handleSignup} isLoading={isLoading} disabled={!selectedRole} style={styles.continueButton}>
        Create Account
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter-Bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
  rolesContainer: {
    marginBottom: 32,
    gap: 16,
  },
  roleCard: {
    borderRadius: 12,
    borderWidth: 2,
    padding: 20,
    alignItems: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    marginBottom: 8,
  },
  roleDescription: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    textAlign: "center",
  },
  continueButton: {
    marginTop: 16,
  },
})

export default RoleSelectionScreen


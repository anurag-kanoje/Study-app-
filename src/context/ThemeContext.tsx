"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

type ThemeMode = "light" | "dark" | "system"

interface ThemeContextType {
  theme: "light" | "dark"
  themeMode: ThemeMode
  setThemeMode: (mode: ThemeMode) => void
  colors: typeof lightColors
}

const lightColors = {
  background: "#FFFFFF",
  card: "#F9FAFB",
  text: "#111827",
  border: "#E5E7EB",
  primary: "#6366F1",
  primaryForeground: "#FFFFFF",
  secondary: "#F3F4F6",
  secondaryForeground: "#111827",
  accent: "#F9FAFB",
  accentForeground: "#111827",
  muted: "#F3F4F6",
  mutedForeground: "#6B7280",
  destructive: "#EF4444",
  destructiveForeground: "#FFFFFF",
  success: "#10B981",
  successForeground: "#FFFFFF",
  warning: "#F59E0B",
  warningForeground: "#FFFFFF",
  info: "#3B82F6",
  infoForeground: "#FFFFFF",
}

const darkColors = {
  background: "#111827",
  card: "#1F2937",
  text: "#F9FAFB",
  border: "#374151",
  primary: "#6366F1",
  primaryForeground: "#FFFFFF",
  secondary: "#1F2937",
  secondaryForeground: "#F9FAFB",
  accent: "#1F2937",
  accentForeground: "#F9FAFB",
  muted: "#374151",
  mutedForeground: "#9CA3AF",
  destructive: "#EF4444",
  destructiveForeground: "#FFFFFF",
  success: "#10B981",
  successForeground: "#FFFFFF",
  warning: "#F59E0B",
  warningForeground: "#FFFFFF",
  info: "#3B82F6",
  infoForeground: "#FFFFFF",
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme()
  const [themeMode, setThemeMode] = useState<ThemeMode>("system")

  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedThemeMode = await AsyncStorage.getItem("themeMode")
        if (savedThemeMode) {
          setThemeMode(savedThemeMode as ThemeMode)
        }
      } catch (error) {
        console.error("Failed to load theme mode:", error)
      }
    }

    loadThemeMode()
  }, [])

  const handleSetThemeMode = async (mode: ThemeMode) => {
    setThemeMode(mode)
    try {
      await AsyncStorage.setItem("themeMode", mode)
    } catch (error) {
      console.error("Failed to save theme mode:", error)
    }
  }

  const theme = themeMode === "system" ? systemColorScheme || "light" : themeMode

  const colors = theme === "dark" ? darkColors : lightColors

  const value = {
    theme,
    themeMode,
    setThemeMode: handleSetThemeMode,
    colors,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}


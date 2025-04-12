"use client"

import { useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    // Get theme from localStorage or default to system
    const savedTheme = localStorage.getItem("theme") as Theme | null
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    } else {
      // Check system preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark")
        applyTheme("dark")
      } else {
        setTheme("light")
        applyTheme("light")
      }
    }
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.remove("light", "dark")
      root.classList.add(systemTheme)
    } else {
      root.classList.remove("light", "dark")
      root.classList.add(newTheme)
    }
  }

  const changeTheme = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme)
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  return { theme, changeTheme }
}


"use client"

import type React from "react"

import { useEffect, useState } from "react"
import MobileLayout from "./MobileLayout"
import DesktopLayout from "./DesktopLayout"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 1024px)")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Show nothing during SSR to prevent hydration mismatch
  if (!isMounted) {
    return <div className="min-h-screen bg-background" />
  }

  return isDesktop ? <DesktopLayout>{children}</DesktopLayout> : <MobileLayout>{children}</MobileLayout>
}


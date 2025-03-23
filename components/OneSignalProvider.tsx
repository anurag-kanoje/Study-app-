"use client"

import type React from "react"

import { useEffect } from "react"
import OneSignal from "react-onesignal"

export function OneSignalProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) {
      OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
        safari_web_id: process.env.NEXT_PUBLIC_ONESIGNAL_SAFARI_WEB_ID,
        notifyButton: {
          enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
      })
    }
  }, [])

  return <>{children}</>
}


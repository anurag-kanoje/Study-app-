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
          prenotify: true,
          showCredit: false,
          text: {
            'tip.state.unsubscribed': 'Subscribe to notifications',
            'tip.state.subscribed': "You're subscribed to notifications",
            'tip.state.blocked': "You've blocked notifications",
            'message.prenotify': 'Click to subscribe to notifications',
            'message.action.subscribed': "Thanks for subscribing!",
            'message.action.resubscribed': "You've resubscribed to notifications",
            'message.action.unsubscribed': "You won't receive notifications again",
            'dialog.main.title': 'Manage Site Notifications',
            'dialog.main.button.subscribe': 'SUBSCRIBE',
            'dialog.main.button.unsubscribe': 'UNSUBSCRIBE',
            'dialog.main.message.subscribed': "You're subscribed to notifications.",
            'dialog.main.message.unsubscribed': "You're unsubscribed from notifications.",
            'dialog.main.message.prenotify': 'Subscribe to receive notifications.',
          },
        },
        allowLocalhostAsSecureOrigin: true,
      })
      console.log("OneSignal initialized successfully")
    } else {
      console.warn("OneSignal App ID is missing. Notifications will not be initialized.")
    }
  }, [])

  return <>{children}</>
}


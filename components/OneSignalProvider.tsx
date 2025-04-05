"use client"

import { useEffect } from "react"
import OneSignal from "react-onesignal"

export function OneSignalProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const initOneSignal = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID) {
          console.warn("OneSignal App ID not found")
          return
        }

        await OneSignal.init({
          appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID,
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: true,
            size: "medium",
            position: "bottom-right",
            offset: {
              bottom: "20px",
              left: "20px",
              right: "20px"
            },
            prenotify: true,
            showCredit: false,
            text: {
              "tip.state.unsubscribed": "Subscribe to notifications",
              "tip.state.subscribed": "You're subscribed to notifications",
              "tip.state.blocked": "You've blocked notifications",
              "message.prenotify": "Click to subscribe to notifications",
              "message.action.subscribed": "Thanks for subscribing!",
              "message.action.resubscribed": "You're subscribed to notifications",
              "message.action.unsubscribed": "You won't receive notifications again",
              "message.action.subscribing": "Subscribing you to notifications...",
              "dialog.main.title": "Manage Site Notifications",
              "dialog.main.button.subscribe": "SUBSCRIBE",
              "dialog.main.button.unsubscribe": "UNSUBSCRIBE",
              "dialog.blocked.title": "Unblock Notifications",
              "dialog.blocked.message": "Follow these instructions to allow notifications:"
            }
          }
        })

        console.log("OneSignal initialized successfully")
      } catch (error) {
        console.error("Error initializing OneSignal:", error)
      }
    }

    initOneSignal()
  }, [])

  return children;
}


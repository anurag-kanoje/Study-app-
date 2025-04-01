"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Bell, BellOff, Check, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window === "undefined" || !window.OneSignal) return

    const checkSubscription = async () => {
      try {
        const state = await window.OneSignal.getNotificationPermission()
        setIsSubscribed(state === "granted")
      } catch (error) {
        console.error("Error checking notification permission:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSubscription()
  }, [])

  const toggleNotifications = async () => {
    if (typeof window === "undefined" || !window.OneSignal) return

    setIsUpdating(true)

    try {
      if (isSubscribed) {
        // Unsubscribe from notifications
        await window.OneSignal.setSubscription(false)
        setIsSubscribed(false)
        toast({
          title: "Notifications disabled",
          description: "You will no longer receive push notifications.",
        })
      } else {
        // Subscribe to notifications
        await window.OneSignal.setSubscription(true)
        const state = await window.OneSignal.getNotificationPermission()
        setIsSubscribed(state === "granted")

        if (state === "granted") {
          toast({
            title: "Notifications enabled",
            description: "You will now receive push notifications.",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Permission denied",
            description: "Please enable notifications in your browser settings.",
          })
        }
      }
    } catch (error) {
      console.error("Error toggling notifications:", error)
      toast({
        variant: "destructive",
        title: "Error updating notification settings",
        description: "Please try again later.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const sendTestNotification = async () => {
    if (typeof window === "undefined" || !window.OneSignal || !isSubscribed) return

    try {
      await window.OneSignal.sendSelfNotification(
        "Test Notification",
        "This is a test notification from StudyBuddy.",
        `${window.location.origin}/notifications`,
        "/favicon.ico",
        { test: true },
      )

      toast({
        title: "Test notification sent",
        description: "Check your notifications to see the test message.",
      })
    } catch (error) {
      console.error("Error sending test notification:", error)
      toast({
        variant: "destructive",
        title: "Error sending test notification",
        description: "Please try again later.",
      })
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          Push notifications allow you to receive updates even when you're not using the app. You'll be notified about
          new notes, file uploads, and other important events.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Push Notifications</CardTitle>
            <CardDescription>Manage your browser push notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="notifications" className="flex items-center space-x-2">
                {isSubscribed ? (
                  <Bell className="h-4 w-4 text-primary" />
                ) : (
                  <BellOff className="h-4 w-4 text-muted-foreground" />
                )}
                <span>Enable push notifications</span>
              </Label>
              <Switch
                id="notifications"
                checked={isSubscribed}
                onCheckedChange={toggleNotifications}
                disabled={isLoading || isUpdating}
              />
            </div>

            <div className="rounded-md bg-muted p-4">
              <div className="flex items-start">
                {isSubscribed ? (
                  <Check className="mt-0.5 h-4 w-4 text-green-500 mr-2" />
                ) : (
                  <Info className="mt-0.5 h-4 w-4 text-amber-500 mr-2" />
                )}
                <div>
                  <p className="font-medium">
                    {isSubscribed ? "Notifications are enabled" : "Notifications are disabled"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {isSubscribed
                      ? "You will receive notifications about new notes, file uploads, and other important events."
                      : "Enable notifications to stay updated about new notes, file uploads, and other important events."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={sendTestNotification} disabled={!isSubscribed || isLoading || isUpdating}>
              Send Test Notification
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose which notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="note-notifications" className="flex-1">
                New note reminders
              </Label>
              <Switch id="note-notifications" defaultChecked={true} disabled={!isSubscribed} />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="file-notifications" className="flex-1">
                File upload notifications
              </Label>
              <Switch id="file-notifications" defaultChecked={true} disabled={!isSubscribed} />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="study-notifications" className="flex-1">
                Study reminders
              </Label>
              <Switch id="study-notifications" defaultChecked={true} disabled={!isSubscribed} />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="summary-notifications" className="flex-1">
                AI summary notifications
              </Label>
              <Switch id="summary-notifications" defaultChecked={true} disabled={!isSubscribed} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


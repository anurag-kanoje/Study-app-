"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useTheme } from "@/lib/hooks/useTheme"
import { useParentalControls } from "@/lib/hooks/useParentalControls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, Moon, Sun, Monitor, Shield, Clock, Eye, BookOpen } from "lucide-react"
import Navbar from "@/components/navbar"

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth()
  const { theme, changeTheme } = useTheme()
  const { controls, loading: controlsLoading, updateParentalControls } = useParentalControls()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [screenTimeLimit, setScreenTimeLimit] = useState(60) // Default 60 minutes
  const [studyTracking, setStudyTracking] = useState(false)
  const [contentRestrictions, setContentRestrictions] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    if (user) {
      setName(user.user_metadata?.name || "")
      setEmail(user.email || "")
    }
  }, [user])

  useEffect(() => {
    if (controls) {
      setScreenTimeLimit(controls.screen_time_limit)
      setStudyTracking(controls.study_tracking)
      setContentRestrictions(controls.content_restrictions)
    }
  }, [controls])

  const handleParentalControlsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    setMessage(null)

    try {
      const { error } = await updateParentalControls(screenTimeLimit, contentRestrictions, studyTracking)

      if (error) {
        setMessage({ text: error, type: "error" })
      } else {
        setMessage({ text: "Parental controls updated successfully", type: "success" })
      }
    } catch (err: any) {
      setMessage({ text: err.message || "An error occurred", type: "error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContentRestrictionChange = (value: string, checked: boolean) => {
    if (checked) {
      setContentRestrictions([...contentRestrictions, value])
    } else {
      setContentRestrictions(contentRestrictions.filter((item) => item !== value))
    }
  }

  if (authLoading || controlsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access settings</h1>
        <Button asChild>
          <a href="/auth/login">Sign In</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue="account" className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="parental">Parental Controls</TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Manage your account details and preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled>Update Account</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the appearance of the application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex gap-4">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => changeTheme("light")}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => changeTheme("dark")}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => changeTheme("system")}
                    >
                      <Monitor className="mr-2 h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="parental">
            <Card>
              <CardHeader>
                <CardTitle>Parental Controls</CardTitle>
                <CardDescription>Set up parental controls and monitoring for study activities.</CardDescription>
              </CardHeader>
              <form onSubmit={handleParentalControlsSubmit}>
                <CardContent className="space-y-6">
                  {message && (
                    <div
                      className={`p-3 rounded ${
                        message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="screen-time" className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Screen Time Limit
                      </Label>
                      <span className="text-sm text-muted-foreground">{screenTimeLimit} minutes</span>
                    </div>
                    <Slider
                      id="screen-time"
                      min={15}
                      max={240}
                      step={15}
                      value={[screenTimeLimit]}
                      onValueChange={(value) => setScreenTimeLimit(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      Content Restrictions
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="social-media"
                          checked={contentRestrictions.includes("social_media")}
                          onCheckedChange={(checked) =>
                            handleContentRestrictionChange("social_media", checked as boolean)
                          }
                        />
                        <label
                          htmlFor="social-media"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Social Media
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="games"
                          checked={contentRestrictions.includes("games")}
                          onCheckedChange={(checked) => handleContentRestrictionChange("games", checked as boolean)}
                        />
                        <label
                          htmlFor="games"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Games
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="streaming"
                          checked={contentRestrictions.includes("streaming")}
                          onCheckedChange={(checked) => handleContentRestrictionChange("streaming", checked as boolean)}
                        />
                        <label
                          htmlFor="streaming"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Streaming Services
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="shopping"
                          checked={contentRestrictions.includes("shopping")}
                          onCheckedChange={(checked) => handleContentRestrictionChange("shopping", checked as boolean)}
                        />
                        <label
                          htmlFor="shopping"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Shopping Sites
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="study-tracking" checked={studyTracking} onCheckedChange={setStudyTracking} />
                    <Label htmlFor="study-tracking" className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Enable Study Tracking
                    </Label>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Save Parental Controls
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}


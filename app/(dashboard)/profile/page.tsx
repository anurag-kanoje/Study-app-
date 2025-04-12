"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/Card"
import { Label } from "@/app/components/ui/label"
import { useToast } from "@/app/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { User, Mail, Calendar, Save } from "lucide-react"
import { format } from "date-fns"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  updated_at?: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [fullName, setFullName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    async function fetchProfile() {
      try {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error && error.code !== "PGRST116") {
          throw error
        }

        if (data) {
          setProfile(data)
          setFullName(data.full_name || "")
        } else {
          // Create a profile if it doesn't exist
          const newProfile = {
            id: user.id,
            email: user.email,
            full_name: "",
          }

          const { error: insertError } = await supabase.from("profiles").insert([newProfile])

          if (insertError) throw insertError

          setProfile(newProfile)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          variant: "destructive",
          title: "Error fetching profile",
          description: "Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user, toast])

  const updateProfile = async () => {
    if (!user || !profile) return

    setIsSaving(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      setProfile({
        ...profile,
        full_name: fullName,
      })

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        variant: "destructive",
        title: "Error updating profile",
        description: "Please try again later.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <Card>
          <CardHeader>
            <div className="h-6 w-24 bg-muted rounded animate-pulse"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="text-lg">
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">
                  {fullName || user?.email?.split('@')[0] || 'User'}
                </h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={updateProfile} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Member since</p>
                <p className="text-sm text-muted-foreground">
                  {user?.created_at ? format(new Date(user.created_at), 'MMMM yyyy') : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


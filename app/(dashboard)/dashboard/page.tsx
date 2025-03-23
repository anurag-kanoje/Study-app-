"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import type { Note } from "@/lib/supabase"
import { FileText, Plus, BarChart, Clock, Brain } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()
  const [recentNotes, setRecentNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentNotes() {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3)

        if (error) throw error
        setRecentNotes(data || [])
      } catch (error) {
        console.error("Error fetching recent notes:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentNotes()
  }, [user])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/notes/new">
            <Plus className="mr-2 h-4 w-4" /> New Note
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "..." : recentNotes.length}</div>
            <p className="text-xs text-muted-foreground">+2 added this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5.2h</div>
            <p className="text-xs text-muted-foreground">+1.2h from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Summaries</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+3 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
            <CardDescription>Your recently created or updated notes</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              </div>
            ) : recentNotes.length > 0 ? (
              <div className="space-y-4">
                {recentNotes.map((note) => (
                  <div key={note.id} className="flex items-center space-x-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{note.title || "Untitled Note"}</p>
                      <p className="text-sm text-muted-foreground">{new Date(note.created_at).toLocaleDateString()}</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/notes/${note.id}`}>View</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No notes yet</h3>
                <p className="text-sm text-muted-foreground mb-4">Create your first note to get started</p>
                <Button asChild>
                  <Link href="/notes/new">
                    <Plus className="mr-2 h-4 w-4" /> Create Note
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Study Tips</CardTitle>
            <CardDescription>AI-powered study recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg bg-primary/10 p-4">
                <h3 className="font-medium mb-1">Spaced Repetition</h3>
                <p className="text-sm text-muted-foreground">
                  Review your notes at increasing intervals to improve long-term retention.
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-4">
                <h3 className="font-medium mb-1">Active Recall</h3>
                <p className="text-sm text-muted-foreground">
                  Test yourself on the material instead of simply re-reading your notes.
                </p>
              </div>

              <div className="rounded-lg bg-primary/10 p-4">
                <h3 className="font-medium mb-1">Pomodoro Technique</h3>
                <p className="text-sm text-muted-foreground">
                  Study in focused 25-minute intervals with 5-minute breaks in between.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


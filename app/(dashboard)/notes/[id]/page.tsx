"use client"

import React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import type { Note } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { ImageAnalysis } from '@/components/notes/ImageAnalysis'
import { VoiceTranscription } from '@/components/notes/VoiceTranscription'
import { OfflineIndicator } from '@/components/common/OfflineIndicator'
import { Editor } from '@/components/notes/Editor'

export default function NotePage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [note, setNote] = useState<Note | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [summary, setSummary] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const isMobile = useMediaQuery('(max-width: 768px)')

  useEffect(() => {
    if (!user) return

    const fetchNote = async () => {
      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("id", params.id)
          .single()

        if (error) throw error

        if (!data) {
          router.push("/notes")
          return
        }

        setNote(data)
      } catch (error) {
        console.error("Error fetching note:", error)
        toast({
          title: "Error",
          description: "Failed to fetch note",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNote()
  }, [user, params.id, router, toast])

  const handleDelete = async () => {
    if (!note) return

    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", note.id)

      if (error) throw error

      router.push("/notes")
      toast({
        title: "Success",
        description: "Note deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      })
    }
  }

  const summarizeNote = async () => {
    if (!note) return

    setIsSummarizing(true)
    try {
      // Here you would typically make an API call to your AI service
      // For now, we'll just simulate a delay and return a mock summary
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setSummary("This is a mock summary of the note...")
      toast({
        title: "Success",
        description: "Note summarized successfully",
      })
    } catch (error) {
      console.error("Error summarizing note:", error)
      toast({
        title: "Error",
        description: "Failed to summarize note",
        variant: "destructive",
      })
    } finally {
      setIsSummarizing(false)
    }
  }

  const downloadForOffline = async (note: Note) => {
    try {
      const noteData = JSON.stringify(note)
      const blob = new Blob([noteData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `note-${note.id}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast({
        title: "Success",
        description: "Note downloaded for offline use",
      })
    } catch (error) {
      console.error("Error downloading note:", error)
      toast({
        title: "Error",
        description: "Failed to download note",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded-md bg-muted" />
          <div className="h-10 w-24 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="h-[600px] animate-pulse rounded-md bg-muted" />
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <p className="text-lg text-muted-foreground">Note not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <a href="/notes">Back</a>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{note.title}</h1>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Note</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {isOffline && <OfflineIndicator />}

      <Card>
        <CardHeader>
          <CardTitle>Note Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="content">
            <TabsList>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="summary" disabled={!summary}>
                Summary
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <div className="space-y-4">
                <Editor
                  content={note.content}
                  isEditing={isEditing}
                  onSave={(content) => {
                    // Handle save
                  }}
                />
              </div>
            </TabsContent>
            <TabsContent value="summary">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{summary}</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end border-t p-4">
          <Button variant="outline" onClick={summarizeNote} disabled={isSummarizing}>
            {isSummarizing ? "Summarizing..." : "Generate Summary"}
          </Button>
        </CardFooter>
      </Card>

      {!isMobile && (
        <>
          <ImageAnalysis noteId={note.id} />
          <VoiceTranscription noteId={note.id} />
        </>
      )}
    </div>
  )
}


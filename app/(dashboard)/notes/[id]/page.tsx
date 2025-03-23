"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import type { Note } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Trash2, Sparkles } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
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

    async function fetchNote() {
      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("id", params.id)
          .eq("user_id", user.id)
          .single()

        if (error) throw error
        setNote(data)
      } catch (error) {
        console.error("Error fetching note:", error)
        toast({
          variant: "destructive",
          title: "Error fetching note",
          description: "Please try again later.",
        })
        router.push("/notes")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNote()
  }, [user, params.id, toast, router])

  const deleteNote = async () => {
    if (!note) return

    try {
      const { error } = await supabase.from("notes").delete().eq("id", note.id)

      if (error) throw error

      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      })

      router.push("/notes")
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        variant: "destructive",
        title: "Error deleting note",
        description: "Please try again later.",
      })
    }
  }

  const summarizeNote = async () => {
    if (!note) return

    setIsSummarizing(true)
    setSummary("")

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: note.content }),
      })

      if (!response.ok) {
        throw new Error("Failed to summarize note")
      }

      const data = await response.json()
      setSummary(data.summary)

      toast({
        title: "Summary generated",
        description: "Your note has been summarized successfully.",
      })
    } catch (error) {
      console.error("Error summarizing note:", error)
      toast({
        variant: "destructive",
        title: "Error generating summary",
        description: "Please try again later.",
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
        title: 'Note Downloaded',
        description: 'Your note is now available offline.',
      })
    } catch (error) {
      console.error('Error downloading note:', error)
      toast({
        variant: 'destructive',
        title: 'Download Failed',
        description: 'Failed to download note for offline use.',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="mr-2">
            <Link href="/notes">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Link>
          </Button>
          <div className="h-9 w-48 bg-muted rounded animate-pulse"></div>
        </div>

        <Card>
          <CardHeader>
            <div className="h-8 w-3/4 bg-muted rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-xl font-semibold mb-2">Note not found</h2>
        <p className="text-muted-foreground mb-6">
          The note you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <Button asChild>
          <Link href="/notes">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Notes
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-8">
      {isOffline && <OfflineIndicator />}
      
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="w-full md:w-2/3">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{note.title}</h1>
          
          {/* Mobile-optimized editor */}
          <div className="prose prose-sm md:prose-base max-w-none">
            <Editor 
              content={note.content}
              readOnly={!isEditing}
              mobileOptimized={isMobile}
            />
          </div>
        </div>

        <div className="w-full md:w-1/3 space-y-4">
          {/* AI Features Panel */}
          <div className="bg-white rounded-lg shadow p-4">
            <ImageAnalysis noteId={params.id} />
            <VoiceTranscription noteId={params.id} />
            
            {/* Offline Support */}
            <button 
              onClick={() => downloadForOffline(note)}
              className="w-full mt-4 btn btn-secondary"
            >
              Download for Offline
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import type { Note } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Sparkles } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function EditNotePage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const [note, setNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [summary, setSummary] = useState("")
  const { toast } = useToast()
  const router = useRouter()

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
        setTitle(data.title || "")
        setContent(data.content || "")
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

  const saveNote = async () => {
    if (!note) return
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Content required",
        description: "Please enter some content for your note.",
      })
      return
    }

    setIsSaving(true)

    try {
      const { error } = await supabase
        .from("notes")
        .update({
          title: title.trim() || "Untitled Note",
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", note.id)

      if (error) throw error

      toast({
        title: "Note updated",
        description: "Your note has been saved successfully.",
      })

      router.push(`/notes/${note.id}`)
    } catch (error) {
      console.error("Error updating note:", error)
      toast({
        variant: "destructive",
        title: "Error updating note",
        description: "Please try again later.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const summarizeNote = async () => {
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Content required",
        description: "Please enter some content to summarize.",
      })
      return
    }

    setIsSummarizing(true)
    setSummary("")

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: content }),
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
            <div className="h-64 w-full bg-muted rounded animate-pulse"></div>
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
          The note you're looking for doesn't exist or you don't have permission to edit it.
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
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href={`/notes/${note.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Note</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <Input
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-bold border-none px-0 focus-visible:ring-0"
            />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="edit">
            <TabsList className="mb-4">
              <TabsTrigger value="edit">Edit</TabsTrigger>
              <TabsTrigger value="preview" disabled={!content.trim()}>
                Preview
              </TabsTrigger>
              <TabsTrigger value="summary" disabled={!summary}>
                AI Summary
              </TabsTrigger>
            </TabsList>

            <TabsContent value="edit">
              <Textarea
                placeholder="Write your note content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] resize-none"
              />
            </TabsContent>

            <TabsContent value="preview">
              <div className="prose dark:prose-invert max-w-none min-h-[300px] p-4 border rounded-md">
                {content.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="summary">
              <div className="prose dark:prose-invert max-w-none min-h-[300px] p-4 border rounded-md">
                {summary.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <Button variant="outline" onClick={summarizeNote} disabled={isSummarizing || !content.trim()}>
            {isSummarizing ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                Summarizing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> AI Summarize
              </>
            )}
          </Button>

          <Button onClick={saveNote} disabled={isSaving || !content.trim()}>
            {isSaving ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


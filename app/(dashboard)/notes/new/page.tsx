"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { useToast } from "@/app/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, Sparkles } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

export default function NewNotePage() {
  const { user } = useAuth()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSummarizing, setIsSummarizing] = useState(false)
  const [summary, setSummary] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const saveNote = async () => {
    if (!user) return
    if (!content.trim()) {
      toast({
        variant: "destructive",
        title: "Content required",
        description: "Please enter some content for your note.",
      })
      return
    }

    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            user_id: user.id,
            title: title.trim() || "Untitled Note",
            content,
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "Note created",
        description: "Your note has been saved successfully.",
      })

      // Send notification via OneSignal
      if (typeof window !== "undefined" && window.OneSignal) {
        window.OneSignal.sendSelfNotification(
          "Note Created",
          "Your new note has been saved successfully.",
          `${window.location.origin}/notes/${data[0].id}`,
          "/favicon.ico",
          { noteId: data[0].id },
        )
      }

      router.push("/notes")
    } catch (error) {
      console.error("Error creating note:", error)
      toast({
        variant: "destructive",
        title: "Error creating note",
        description: "Please try again later.",
      })
    } finally {
      setIsLoading(false)
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

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/notes">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">New Note</h1>
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

          <Button onClick={saveNote} disabled={isLoading || !content.trim()}>
            {isLoading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" /> Save Note
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


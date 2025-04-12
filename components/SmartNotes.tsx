"use client"

import { cn } from "@/lib/utils"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { processImage, queryOmni } from "@/utils/mini-omni"
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import {
  Loader2,
  AlertTriangle,
  Camera,
  FileText,
  Sparkles,
  Lightbulb,
  BookOpen,
  MessageSquare,
  Tag,
  Clock,
} from "lucide-react"

interface Note {
  id: string
  content: string
  timestamp: Date
  type?: "text" | "image"
  tags?: string[]
  title?: string
}

export default function SmartNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [noteTitle, setNoteTitle] = useState("")
  const [imageText, setImageText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [viewMode, setViewMode] = useState<"raw" | "ai">("raw")
  const [aiSummary, setAiSummary] = useState("")
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const q = query(collection(db, "notes"), orderBy("timestamp", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notesData = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Note,
      )
      setNotes(notesData)
    })

    return () => unsubscribe()
  }, [])

  const addNote = async () => {
    if (!newNote.trim()) return

    setIsProcessing(true)
    setError("")

    try {
      const enhanced = await queryOmni(`Enhance this study note: ${newNote}`)
      if ("error" in enhanced) {
        throw new Error(enhanced.error)
      }

      await addDoc(collection(db, "notes"), {
        title: noteTitle || "Untitled Note",
        content: enhanced.text,
        timestamp: new Date(),
        type: "text",
        tags: extractTags(newNote),
      })
      setNewNote("")
      setNoteTitle("")
    } catch (err) {
      console.error("Error adding note:", err)
      setError("Failed to add note. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const extractTags = (content: string): string[] => {
    const tagRegex = /#(\w+)/g
    const matches = content.match(tagRegex)
    return matches ? matches.map((tag) => tag.substring(1)) : []
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsProcessing(true)
    setError("")
    setImageText("")

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        if (typeof event.target?.result !== "string") {
          throw new Error("Failed to read image file")
        }

        const base64Image = event.target.result.split(",")[1]
        const response = await processImage(base64Image)

        if ("error" in response) {
          throw new Error(response.error)
        }

        setImageText(response.text)
        await addDoc(collection(db, "notes"), {
          title: `Scanned Note - ${new Date().toLocaleString()}`,
          content: response.text,
          timestamp: new Date(),
          type: "image",
          tags: ["scanned"],
        })
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error("Error processing image:", err)
      setError("Failed to process image. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const viewNoteDetails = async (note: Note) => {
    setActiveNote(note)
    setViewMode("raw")
    setAiSummary("")
  }

  const generateAiSummary = async () => {
    if (!activeNote) return

    setIsGeneratingSummary(true)
    try {
      const summary = await queryOmni(`Summarize and structure this note into key points:
      
      ${activeNote.content}`)

      if ("error" in summary) {
        throw new Error(summary.error)
      }

      setAiSummary(summary.text)
      setViewMode("ai")
    } catch (err) {
      console.error("Error generating summary:", err)
      setError("Failed to generate AI summary. Please try again.")
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/5 dark:to-secondary/5">
            <CardTitle className="text-xl font-heading flex items-center">
              <BookOpen className="mr-2 h-5 w-5" />
              My Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-auto max-h-[calc(100vh-12rem)]">
            <div className="p-4 border-b">
              <Input placeholder="Search notes..." className="mb-2" />
              <div className="flex flex-wrap gap-2 text-xs">
                <Button variant="outline" size="sm" className="h-6 px-2 rounded-full">
                  <Tag className="h-3 w-3 mr-1" /> All
                </Button>
                <Button variant="outline" size="sm" className="h-6 px-2 rounded-full">
                  <Tag className="h-3 w-3 mr-1" /> #math
                </Button>
                <Button variant="outline" size="sm" className="h-6 px-2 rounded-full">
                  <Tag className="h-3 w-3 mr-1" /> #science
                </Button>
              </div>
            </div>
            <div className="divide-y">
              {notes.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notes yet. Create your first note!</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div
                    key={note.id}
                    className={cn(
                      "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                      activeNote?.id === note.id ? "bg-muted" : "",
                    )}
                    onClick={() => viewNoteDetails(note)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium truncate font-heading">{note.title || "Untitled Note"}</h3>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span className="text-xs">{new Date(note.timestamp).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 font-body">{note.content}</p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags.map((tag) => (
                          <span key={tag} className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2">
        {activeNote ? (
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xl font-heading">{activeNote.title || "Untitled Note"}</CardTitle>
              <div className="flex items-center gap-2">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "raw" | "ai")}>
                  <TabsList>
                    <TabsTrigger value="raw">
                      <FileText className="h-4 w-4 mr-1" /> Raw
                    </TabsTrigger>
                    <TabsTrigger value="ai">
                      <Sparkles className="h-4 w-4 mr-1" /> AI View
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-8rem)] overflow-auto">
              <TabsContent value="raw" className="mt-0">
                <Textarea value={activeNote.content} readOnly className="min-h-[300px] font-body" />
              </TabsContent>
              <TabsContent value="ai" className="mt-0">
                {aiSummary ? (
                  <div className="prose dark:prose-invert max-w-none font-body">
                    <div dangerouslySetInnerHTML={{ __html: aiSummary.replace(/\n/g, "<br/>") }} />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Sparkles className="h-12 w-12 text-primary mb-4 ai-glow p-2 rounded-full" />
                    <h3 className="text-lg font-medium mb-2 font-heading">AI Summary</h3>
                    <p className="text-muted-foreground mb-4 font-body">
                      Generate an AI-powered summary and structured view of your notes
                    </p>
                    <Button onClick={generateAiSummary} disabled={isGeneratingSummary} className="ai-glow text-white">
                      {isGeneratingSummary ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Summary
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </TabsContent>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex items-center gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-1" /> Ask AI
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Lightbulb className="h-4 w-4 mr-1" /> Create Flashcards
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-xl font-heading flex items-center">
                <Sparkles className="mr-2 h-5 w-5" />
                Create New Note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note title (optional)"
                  className="mb-2 font-body"
                />
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter your note... Use #tags to categorize"
                  className="min-h-[200px] font-body"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <Button onClick={addNote} disabled={isProcessing || !newNote.trim()} className="flex-1">
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Save Note
                    </>
                  )}
                </Button>

                <div className="relative flex-1">
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isProcessing}
                    className="hidden"
                  />
                  <Button variant="outline" onClick={triggerFileInput} disabled={isProcessing} className="w-full">
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Scan Notes
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {imageText && (
                <div className="mb-4">
                  <h3 className="font-semibold mb-2 font-heading">Scanned Text:</h3>
                  <Textarea value={imageText} readOnly className="font-body" />
                </div>
              )}

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center font-heading">
                  <Lightbulb className="h-4 w-4 mr-1 text-amber-500" />
                  Pro Tips
                </h3>
                <ul className="text-sm space-y-1 font-body">
                  <li>• Use #tags to categorize your notes</li>
                  <li>• Upload images of handwritten notes for automatic transcription</li>
                  <li>• Switch to AI View to get structured summaries</li>
                  <li>• Ask AI questions about your notes for deeper understanding</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { processImage, queryOmni } from "@/utils/mini-omni"
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Loader2, AlertTriangle, Camera } from "lucide-react"

interface Note {
  id: string
  content: string
  timestamp: Date
  type?: "text" | "image"
}

export default function SmartNotes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState("")
  const [imageText, setImageText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

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
        content: enhanced.text,
        timestamp: new Date(),
        type: "text",
      })
      setNewNote("")
    } catch (err) {
      console.error("Error adding note:", err)
      setError("Failed to add note. Please try again.")
    } finally {
      setIsProcessing(false)
    }
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
          content: response.text,
          timestamp: new Date(),
          type: "image",
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

  return (
    <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white">
        <CardTitle className="text-2xl font-poppins">Smart Notes</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <Textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Enter your note..."
            className="mb-2 font-open-sans"
          />
          <Button
            onClick={addNote}
            disabled={isProcessing || !newNote.trim()}
            className="w-full bg-[#4ECDC4] hover:bg-[#45b7b0] text-white font-poppins"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Add Note"
            )}
          </Button>
        </div>

        <div className="mb-6">
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#4ECDC4] transition-colors duration-300">
              <Camera size={48} className="text-gray-400" />
            </div>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isProcessing}
              className="hidden"
            />
          </label>
          {imageText && (
            <Textarea
              value={imageText}
              readOnly
              className="mt-2 font-open-sans"
              placeholder="Processed text will appear here..."
            />
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id} className="p-4 hover:shadow-md transition-shadow duration-300">
              <p className="font-open-sans">{note.content}</p>
              <small className="text-muted-foreground block mt-2">
                {note.type === "image" ? "Image: " : ""}
                {note.timestamp.toLocaleString()}
              </small>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


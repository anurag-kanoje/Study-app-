"use client"

import React, { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface EditorProps {
  initialContent?: string
  onSave?: (content: string) => Promise<void>
}

export function Editor({ initialContent = "", onSave }: EditorProps) {
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setContent(initialContent)
  }, [initialContent])

  const handleSave = async () => {
    if (!onSave) return

    setIsSaving(true)
    try {
      await onSave(content)
      toast({
        title: "Success",
        description: "Your changes have been saved.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="min-h-[200px]"
        />
        {onSave && (
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        )}
      </div>
    </Card>
  )
}
"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, Mic, MicOff } from "lucide-react"

export function VoiceTranscription() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcription, setTranscription] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const handleToggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false)
      setLoading(true)
      try {
        // TODO: Implement actual transcription
        await new Promise(resolve => setTimeout(resolve, 2000))
        setTranscription("This is a placeholder for voice transcription results.")
      } catch (error) {
        console.error("Error transcribing audio:", error)
      } finally {
        setLoading(false)
      }
    } else {
      setIsRecording(true)
      setTranscription("")
    }
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <Button
          onClick={handleToggleRecording}
          disabled={loading}
          variant={isRecording ? "destructive" : "default"}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : isRecording ? (
            <>
              <MicOff className="mr-2 h-4 w-4" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="mr-2 h-4 w-4" />
              Start Recording
            </>
          )}
        </Button>
        {transcription && (
          <div className="mt-4">
            <h4 className="font-medium">Transcription:</h4>
            <p className="mt-1 text-sm text-gray-600">{transcription}</p>
          </div>
        )}
      </div>
    </Card>
  )
} 
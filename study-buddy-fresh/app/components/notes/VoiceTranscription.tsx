import { useState } from 'react'
import { Mic, StopCircle } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'
import { useToast } from '@/app/components/ui/use-toast'

interface VoiceTranscriptionProps {
  noteId: string
  onTranscription?: (text: string) => void
}

export function VoiceTranscription({ noteId, onTranscription }: VoiceTranscriptionProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const { toast } = useToast()

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        await handleTranscription(blob)
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error('Failed to start recording:', error)
      toast({
        variant: 'destructive',
        title: 'Recording Failed',
        description: 'Please check your microphone permissions.',
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
    }
  }

  const handleTranscription = async (audioBlob: Blob) => {
    try {
      const formData = new FormData()
      formData.append('audio', audioBlob)
      formData.append('noteId', noteId)

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Transcription failed')

      const { text } = await response.json()
      onTranscription?.(text)

      toast({
        title: 'Transcription Complete',
        description: 'Your speech has been converted to text.',
      })
    } catch (error) {
      console.error('Transcription error:', error)
      toast({
        variant: 'destructive',
        title: 'Transcription Failed',
        description: 'Failed to convert speech to text.',
      })
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Voice Input</h3>
      
      <Button
        variant={isRecording ? 'destructive' : 'primary'}
        onClick={isRecording ? stopRecording : startRecording}
        icon={isRecording ? <StopCircle className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </Button>
    </div>
  )
} 

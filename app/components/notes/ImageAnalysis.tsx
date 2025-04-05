import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { ImageUploader } from '../common/ImageUploader'
import { useToast } from '@/app/components/ui/use-toast'
import { Button } from '@/app/components/ui/button'
import { processWithOCR, detectSubjects, calculateConfidence } from '@/lib/ai/ocr'
import type { AIAnalysisResult } from '@/types'

export function ImageAnalysis({ noteId }: { noteId: string }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [results, setResults] = useState<AIAnalysisResult | null>(null)
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  const processImage = async (imageFile: File) => {
    try {
      setIsProcessing(true)
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('temp-uploads')
        .upload(`ocr/${noteId}/${imageFile.name}`, imageFile)
      
      if (uploadError) throw uploadError

      const response = await fetch('/api/ai/process-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: uploadData.path }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to process image')
      }

      const data = await response.json()
      setResults(data)

      toast({
        title: 'Image Processed',
        description: 'Successfully extracted text from image',
      })

    } catch (error) {
      console.error('Image processing failed:', error)
      toast({
        variant: 'destructive',
        title: 'Processing Failed',
        description: 'Failed to process image. Please try again.',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const convertToFlashcards = async (text: string) => {
    try {
      const response = await fetch('/api/ai/generate-flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, noteId }),
      })
      
      if (!response.ok) throw new Error('Failed to generate flashcards')
      
      toast({
        title: 'Flashcards Created',
        description: 'Successfully generated flashcards from text',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Failed to create flashcards. Please try again.',
      })
    }
  }

  const generateSummary = async (text: string) => {
    try {
      const response = await fetch('/api/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      
      if (!response.ok) throw new Error('Failed to generate summary')
      
      const data = await response.json()
      setResults((prev) => prev ? { ...prev, summary: data.summary } : null)
      
      toast({
        title: 'Summary Generated',
        description: 'Successfully generated summary from text',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Failed to create summary. Please try again.',
      })
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-semibold">Extract Text from Images</h3>
      
      <ImageUploader 
        onUpload={processImage}
        accept="image/*"
        maxSize={5 * 1024 * 1024}
        disabled={isProcessing}
      />

      {isProcessing && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
          <p className="ml-2">Processing image...</p>
        </div>
      )}

      {results && (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium">Extracted Content:</h4>
            <p className="text-sm mt-1">{results.text}</p>
          </div>

          {results.subjects?.length > 0 && (
            <div>
              <h4 className="font-medium">Detected Subjects:</h4>
              <div className="flex gap-2 flex-wrap mt-1">
                {results.subjects.map((subject: string) => (
                  <span 
                    key={subject}
                    className="px-2 py-1 bg-primary/10 rounded-full text-xs"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {results.summary && (
            <div>
              <h4 className="font-medium">Summary:</h4>
              <p className="text-sm mt-1">{results.summary}</p>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={() => convertToFlashcards(results.text)}
            >
              Create Flashcards
            </Button>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => generateSummary(results.text)}
            >
              Generate Summary
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 

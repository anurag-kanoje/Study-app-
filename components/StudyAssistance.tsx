'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { queryOmni } from '@/utils/mini-omni'
import { Loader2, AlertTriangle } from 'lucide-react'

export function StudyAssistance() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const askQuestion = async () => {
    if (!question.trim()) return

    setIsLoading(true)
    setError('')
    setAnswer('')
    
    try {
      const response = await queryOmni(question)
      if ('error' in response) {
        throw new Error(response.error)
      }
      setAnswer(response.text)
    } catch (err) {
      console.error('Error asking question:', err)
      setError('Failed to get answer. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Study Assistant</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask any study-related question..."
            className="mb-2"
          />
          <Button 
            onClick={askQuestion} 
            disabled={isLoading || !question.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Ask Question'
            )}
          </Button>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {answer && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Answer:</h3>
            <Textarea 
              value={answer} 
              readOnly 
              className="min-h-[200px]"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}


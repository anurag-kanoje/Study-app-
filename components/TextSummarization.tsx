'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import axios from 'axios'

export function TextSummarization() {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSummarize = async () => {
    if (!text.trim()) return

    setIsLoading(true)
    setError('')
    setSummary('')

    try {
      const response = await axios.post('/api/summarize', { text })
      setSummary(response.data.summary)
    } catch (err) {
      setError('Failed to summarize text. Please try again.')
      console.error('Error summarizing text:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Summarization</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to summarize..."
          className="mb-4"
          rows={6}
        />
        <Button 
          onClick={handleSummarize} 
          disabled={isLoading || !text.trim()}
          className="mb-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Summarizing...
            </>
          ) : (
            'Summarize'
          )}
        </Button>
        
        {error && (
          <div className="mb-4 p-2 text-sm text-red-500 bg-red-50 rounded">
            {error}
          </div>
        )}
        
        {summary && (
          <div>
            <h3 className="font-semibold mb-2">Summary:</h3>
            <Textarea value={summary} readOnly rows={4} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}


'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from 'lucide-react'
import axios from 'axios'

export function VideoSummarization() {
  const [videoUrl, setVideoUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSummarize = async () => {
    if (!videoUrl.trim()) return

    setIsLoading(true)
    setError('')
    setSummary('')

    try {
      const response = await axios.post('/api/summarize-video', { videoUrl })
      setSummary(response.data.summary)
    } catch (err) {
      setError('Failed to summarize video. Please try again.')
      console.error('Error summarizing video:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Summarization</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter YouTube video URL..."
          className="mb-4"
        />
        <Button 
          onClick={handleSummarize} 
          disabled={isLoading || !videoUrl.trim()}
          className="mb-4"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Summarizing Video...
            </>
          ) : (
            'Summarize Video'
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


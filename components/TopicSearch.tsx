'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { queryOmni } from '@/utils/mini-omni'
import { Loader2, AlertTriangle } from 'lucide-react'

export function TopicSearch() {
  const [topic, setTopic] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const searchTopic = async () => {
    if (!topic.trim()) return

    setIsLoading(true)
    setError('')
    setSummary('')

    try {
      const response = await queryOmni(`Provide a concise summary of the topic: ${topic}`)
      if ('error' in response) {
        throw new Error(response.error)
      }
      setSummary(response.text)
    } catch (err) {
      console.error('Error searching topic:', err)
      setError('Failed to search topic. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic to search..."
            className="mb-2"
          />
          <Button 
            onClick={searchTopic} 
            disabled={isLoading || !topic.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              'Search Topic'
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

        {summary && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Summary:</h3>
            <p className="text-sm">{summary}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VideoSummaryPage() {
  const [videoUrl, setVideoUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [summary, setSummary] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoUrl) return
    await processVideo(videoUrl)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      await processVideo(URL.createObjectURL(selectedFile))
    }
  }

  const processVideo = async (videoSource: string) => {
    setIsProcessing(true)
    setProgress(0)
    setSummary('')

    try {
      // Simulating video processing steps
      await simulateProgress('Extracting audio...', 0, 20)
      await simulateProgress('Performing speech recognition...', 20, 40)
      await simulateProgress('Analyzing content...', 40, 60)
      await simulateProgress('Generating summary...', 60, 80)
      await simulateProgress('Finalizing...', 80, 100)

      // Simulating API call to get summary
      const response = await fetch('/api/video-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoSource }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate summary')
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (error) {
      console.error('Error processing video:', error)
      setSummary('An error occurred while processing the video.')
    } finally {
      setIsProcessing(false)
    }
  }

  const simulateProgress = (message: string, start: number, end: number) => {
    return new Promise<void>((resolve) => {
      let current = start
      const interval = setInterval(() => {
        current += 1
        setProgress(current)
        if (current >= end) {
          clearInterval(interval)
          resolve()
        }
      }, 50)
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Video Summarization</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Option 1: Enter Video URL</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <Input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter video URL..."
              className="flex-grow"
            />
            <Button type="submit" disabled={isProcessing}>Summarize</Button>
          </form>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Option 2: Upload Video File</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            disabled={isProcessing}
          />
        </CardContent>
      </Card>
      {isProcessing && (
        <Card className="mb-6">
          <CardContent>
            <Progress value={progress} className="w-full" />
            <p className="text-center mt-2">Processing video... {progress}%</p>
          </CardContent>
        </Card>
      )}
      {summary && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Video Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={summary} readOnly className="w-full h-48" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}


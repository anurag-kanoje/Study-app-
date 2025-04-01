"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useSummarization } from "@/lib/hooks/useSummarization"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Image, Video, Upload, Loader2 } from "lucide-react"
import Navbar from "@/components/navbar"

export default function SummarizePage() {
  const { user, loading: authLoading } = useAuth()
  const { loading, summarizeText, summarizeImage, summarizeVideo } = useSummarization()

  const [text, setText] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [summary, setSummary] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("text")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTextSummarize = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError(null)
    setSummary(null)

    try {
      const { summary, error } = await summarizeText(text)

      if (error) {
        setError(error)
      } else {
        setSummary(summary)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during summarization")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageSummarize = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile || isSubmitting) return

    setIsSubmitting(true)
    setError(null)
    setSummary(null)

    try {
      const { summary, error } = await summarizeImage(imageFile)

      if (error) {
        setError(error)
      } else {
        setSummary(summary)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during image summarization")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVideoSummarize = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoUrl.trim() || isSubmitting) return

    setIsSubmitting(true)
    setError(null)
    setSummary(null)

    try {
      const { summary, error } = await summarizeVideo(videoUrl)

      if (error) {
        setError(error)
      } else {
        setSummary(summary)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during video summarization")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setSummary(null)
    setError(null)
  }

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to use the summarization tool</h1>
        <Button asChild>
          <a href="/auth/login">Sign In</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">AI Summarization</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="text">
                  <FileText className="h-4 w-4 mr-2" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="image">
                  <Image className="h-4 w-4 mr-2" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="video">
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text">
                <Card>
                  <CardHeader>
                    <CardTitle>Text Summarization</CardTitle>
                    <CardDescription>Paste your text below to generate a concise summary.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleTextSummarize} className="space-y-4">
                      <Textarea
                        placeholder="Paste your text here..."
                        className="min-h-[200px]"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                      />
                      <Button type="submit" className="w-full" disabled={isSubmitting || !text.trim()}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Summarizing...
                          </>
                        ) : (
                          "Summarize Text"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="image">
                <Card>
                  <CardHeader>
                    <CardTitle>Image Summarization</CardTitle>
                    <CardDescription>Upload an image to extract and summarize its content.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleImageSummarize} className="space-y-4">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <label htmlFor="image-upload" className="text-sm font-medium">
                          Upload Image
                        </label>
                        <div className="flex items-center gap-2">
                          <Input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} required />
                        </div>
                        {imageFile && <p className="text-sm text-muted-foreground">Selected: {imageFile.name}</p>}
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting || !imageFile}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing Image...
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Analyze Image
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="video">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Summarization</CardTitle>
                    <CardDescription>Enter a video URL to generate a summary of its content.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleVideoSummarize} className="space-y-4">
                      <div className="grid w-full items-center gap-1.5">
                        <label htmlFor="video-url" className="text-sm font-medium">
                          Video URL
                        </label>
                        <Input
                          id="video-url"
                          type="url"
                          placeholder="https://example.com/video.mp4"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting || !videoUrl.trim()}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Video...
                          </>
                        ) : (
                          "Summarize Video"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Summary Result</CardTitle>
                <CardDescription>The AI-generated summary will appear here.</CardDescription>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">{error}</div>
                ) : loading ? (
                  <div className="flex justify-center items-center h-[200px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : summary ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <p className="whitespace-pre-line">{summary}</p>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm">
                        Save Summary
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center text-muted-foreground">
                    <FileText className="h-12 w-12 mb-4" />
                    <p>Your summary will appear here after processing.</p>
                    <p className="text-sm mt-2">Select a tab and submit content to generate a summary.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

interface Question {
  question: string
  answer: string
  marks: number
}

export default function QuestionPaperGenerator() {
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("medium")
  const [numQuestions, setNumQuestions] = useState("5")
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!subject || !topic) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Here you would typically make an API call to your AI service
      // For now, we'll simulate a response
      const mockQuestions: Question[] = [
        {
          question: "What is the capital of France?",
          answer: "Paris",
          marks: 2,
        },
        {
          question: "What is 2 + 2?",
          answer: "4",
          marks: 1,
        },
        // Add more mock questions as needed
      ]

      setQuestions(mockQuestions)
      toast({
        title: "Success",
        description: "Question paper generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate question paper",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Question Paper Generator</h1>
        <p className="text-muted-foreground">Create customized question papers with model answers for your students</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Question Paper</CardTitle>
          <CardDescription>Fill in the details to generate a question paper</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="e.g., Mathematics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Calculus"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numQuestions">Number of Questions</Label>
              <Input
                id="numQuestions"
                type="number"
                min="1"
                max="20"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? "Generating..." : "Generate Question Paper"}
          </Button>
        </CardContent>
      </Card>

      {questions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Questions</CardTitle>
            <CardDescription>Review and download the generated question paper</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((q, index) => (
              <div key={index} className="space-y-4">
                <div>
                  <h3 className="font-medium">Question {index + 1} ({q.marks} marks)</h3>
                  <p className="text-muted-foreground">{q.question}</p>
                </div>
                <div>
                  <h4 className="font-medium">Answer:</h4>
                  <p className="text-muted-foreground">{q.answer}</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              Download PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
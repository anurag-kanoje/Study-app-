"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Download, Copy, FileText, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function QuestionPaperGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [questionPaper, setQuestionPaper] = useState<string | null>(null)
  const [modelAnswers, setModelAnswers] = useState<string | null>(null)
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState(50)
  const [includeAnswers, setIncludeAnswers] = useState(true)
  const [questionCount, setQuestionCount] = useState("10")
  const [syllabus, setSyllabus] = useState("")
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!subject || !topic) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all required fields.",
      })
      return
    }

    setIsGenerating(true)
    setQuestionPaper(null)
    setModelAnswers(null)

    try {
      // Simulate API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Sample generated question paper
      const sampleQuestions = `
# ${subject} Question Paper: ${topic}

## Instructions
- Time allowed: 1 hour
- All questions are compulsory
- Each question carries equal marks

## Section A: Short Answer Questions

1. Define the concept of ${topic} in your own words.
2. List three key characteristics of ${topic}.
3. Explain the significance of ${topic} in real-world applications.
4. Compare and contrast ${topic} with a related concept.
5. Draw a diagram to illustrate the process of ${topic}.

## Section B: Long Answer Questions

6. Describe the historical development of ${topic} and its impact on modern ${subject}.
7. Analyze the advantages and limitations of ${topic} in detail.
8. Explain how ${topic} relates to other key concepts in ${subject}.
9. Discuss a real-world problem that can be solved using principles of ${topic}.
10. Evaluate the future prospects and potential advancements in ${topic}.
      `

      const sampleAnswers = `
# Model Answers for ${subject}: ${topic}

## Section A: Short Answer Questions

1. **Define the concept of ${topic} in your own words.**
   ${topic} refers to the systematic study of [specific definition based on subject]. It encompasses the principles, theories, and applications related to [relevant aspects].

2. **List three key characteristics of ${topic}.**
   - Characteristic 1: [Specific detail]
   - Characteristic 2: [Specific detail]
   - Characteristic 3: [Specific detail]

3. **Explain the significance of ${topic} in real-world applications.**
   ${topic} plays a crucial role in [specific applications]. It enables [specific benefits] and helps solve problems related to [relevant issues].

4. **Compare and contrast ${topic} with a related concept.**
   While ${topic} focuses on [specific aspects], the related concept of [alternative concept] emphasizes [different aspects]. The main similarities include [common features], while the differences involve [distinguishing features].

5. **Draw a diagram to illustrate the process of ${topic}.**
   [Diagram description would be provided here]

## Section B: Long Answer Questions

6. **Describe the historical development of ${topic} and its impact on modern ${subject}.**
   The concept of ${topic} originated in [time period] when [historical context]. Key developments include [significant milestones]. These advancements have shaped modern ${subject} by [specific impacts].

7. **Analyze the advantages and limitations of ${topic} in detail.**
   Advantages:
   - [Advantage 1 with explanation]
   - [Advantage 2 with explanation]
   - [Advantage 3 with explanation]
   
   Limitations:
   - [Limitation 1 with explanation]
   - [Limitation 2 with explanation]
   - [Limitation 3 with explanation]

8. **Explain how ${topic} relates to other key concepts in ${subject}.**
   ${topic} is interconnected with several key concepts in ${subject}, including [related concept 1], [related concept 2], and [related concept 3]. These relationships form a comprehensive framework for understanding [broader subject area].

9. **Discuss a real-world problem that can be solved using principles of ${topic}.**
   A significant real-world problem that can be addressed using ${topic} is [specific problem]. By applying principles such as [principle 1] and [principle 2], we can [solution approach]. This demonstrates the practical utility of ${topic} in solving complex challenges.

10. **Evaluate the future prospects and potential advancements in ${topic}.**
    The future of ${topic} looks promising with emerging trends like [trend 1], [trend 2], and [trend 3]. Potential advancements may include [specific innovation possibilities]. These developments will likely impact [relevant fields or industries] by [potential impacts].
      `

      setQuestionPaper(sampleQuestions)
      setModelAnswers(sampleAnswers)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: "Failed to generate question paper. Please try again.",
      })
      console.error("Error generating question paper:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: `${type} copied to clipboard`,
      description: "You can now paste it in your document editor.",
    })
  }

  const handleDownload = (text: string, type: string) => {
    const element = document.createElement("a")
    const file = new Blob([text], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `${subject}_${topic}_${type}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Question Paper Generator</h1>
        <p className="text-muted-foreground">Create customized question papers with model answers for your students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Question Paper Settings</CardTitle>
            <CardDescription>Configure your question paper details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Biology">Biology</SelectItem>
                  <SelectItem value="History">History</SelectItem>
                  <SelectItem value="Geography">Geography</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic/Chapter</Label>
              <Input 
                id="topic" 
                placeholder="e.g., Calculus, Mechanics, Organic Chemistry" 
                value={topic}\
                  Calculus, Mechanics, Organic Chemistry" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionCount">Number of Questions</Label>
              <Select value={questionCount} onValueChange={setQuestionCount}>
                <SelectTrigger id="questionCount">
                  <SelectValue placeholder="Select number of questions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 Questions</SelectItem>
                  <SelectItem value="10">10 Questions</SelectItem>
                  <SelectItem value="15">15 Questions</SelectItem>
                  <SelectItem value="20">20 Questions</SelectItem>
                  <SelectItem value="25">25 Questions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <span className="text-sm text-muted-foreground">
                  {difficulty < 33 ? "Easy" : difficulty < 66 ? "Medium" : "Hard"}
                </span>
              </div>
              <Slider
                id="difficulty"
                min={0}
                max={100}
                step={1}
                value={[difficulty]}
                onValueChange={(value) => setDifficulty(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="syllabus">Syllabus Content (Optional)</Label>
              <Textarea
                id="syllabus"
                placeholder="Paste specific syllabus content or learning objectives to tailor the questions"
                value={syllabus}
                onChange={(e) => setSyllabus(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="includeAnswers"
                checked={includeAnswers}
                onCheckedChange={setIncludeAnswers}
              />
              <Label htmlFor="includeAnswers">Generate model answers</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleGenerate} 
              className="w-full" 
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Question Paper"
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              Your AI-generated question paper and model answers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-center text-muted-foreground">
                  Generating your customized question paper...
                </p>
              </div>
            ) : questionPaper ? (
              <Tabs defaultValue="questions">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="questions">Question Paper</TabsTrigger>
                  <TabsTrigger value="answers" disabled={!includeAnswers}>
                    Model Answers
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="questions" className="space-y-4">
                  <div className="relative mt-4">
                    <div className="absolute right-2 top-2 flex space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopy(questionPaper, "Question Paper")}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDownload(questionPaper, "Questions")}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                    <div className="rounded-md border bg-muted/50 p-4 mt-2">
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {questionPaper}
                      </pre>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="answers" className="space-y-4">
                  {modelAnswers && (
                    <div className="relative mt-4">
                      <div className="absolute right-2 top-2 flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopy(modelAnswers, "Model Answers")}
                        >
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDownload(modelAnswers, "Answers")}
                        >
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </div>
                      <div className="rounded-md border bg-muted/50 p-4 mt-2">
                        <pre className="text-sm whitespace-pre-wrap font-mono">
                          {modelAnswers}
                        </pre>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <FileText className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No question paper generated yet</h3>
                <p className="text-muted-foreground max-w-md mb-4">
                  Fill in the details on the left and click "Generate Question Paper" to create a customized question paper for your students.
                </p>
              </div>
            )}
          </CardContent>
          {questionPaper && (
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                setQuestionPaper(null)
                setModelAnswers(null)
              }}>
                Reset
              </Button>
              <Button variant="default" className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Save to My Materials
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}


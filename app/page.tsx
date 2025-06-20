import Link from "next/link"
import { Button } from "@/app/components/ui/Button"
import { ModeToggle } from "@/app/components/mode-toggle"
import { ArrowRight, BookOpen, Brain, Upload, Clock, FileText, Users } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/app/components/ui/Card"

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to StudyBuddy</h1>
        <p className="text-xl text-muted-foreground">
          Your AI-powered study assistant that helps you learn more effectively
        </p>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Smart Notes
            </CardTitle>
            <CardDescription>
              Create and organize your study notes with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Get Started</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              AI Chatbot
            </CardTitle>
            <CardDescription>
              Get instant help and explanations from our AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Start Chat</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              File Analysis
            </CardTitle>
            <CardDescription>
              Upload and analyze your study materials with AI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Upload Files</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Peer Pods
            </CardTitle>
            <CardDescription>
              Study with your peers in virtual study groups
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">Join Pod</Button>
          </CardContent>
        </Card>
      </section>

      <section className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Why Choose StudyBuddy?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Learning</CardTitle>
              <CardDescription>
                Get personalized help and explanations from our advanced AI assistant
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Smart Organization</CardTitle>
              <CardDescription>
                Keep your study materials organized and easily accessible
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collaborative Learning</CardTitle>
              <CardDescription>
                Study with peers and share knowledge in virtual study groups
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>
    </div>
  )
}


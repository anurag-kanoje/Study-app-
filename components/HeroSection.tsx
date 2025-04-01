import { Button } from "./ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden py-12 md:py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 dark:from-primary/10 dark:to-secondary/10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 relative">
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl animate-pulse" />
            <img
              src="/placeholder.svg?height=200&width=200"
              alt="StudyBuddy Mascot"
              className="relative w-32 h-32 md:w-48 md:h-48 float"
            />
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-4 font-heading bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Learn Smarter, Not Harder!
          </h1>

          <p className="text-lg md:text-xl mb-8 max-w-2xl font-body">
            Your AI-powered study companion that helps you master any subject with personalized learning, smart notes,
            and fun rewards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="ai-glow text-white font-heading group">
              Start Learning Free
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>

            <Link href="/smart-notes">
              <Button variant="outline" size="lg" className="font-heading">
                <Sparkles className="mr-2 h-4 w-4" />
                Try AI Notes
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-heading font-bold mb-1">Scan Notes</h3>
              <p className="text-sm text-muted-foreground">Upload or scan your notes for instant AI summaries</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-heading font-bold mb-1">AI Study Buddy</h3>
              <p className="text-sm text-muted-foreground">Get personalized help from your AI tutor</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-heading font-bold mb-1">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground">Track progress and earn XP for consistent studying</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


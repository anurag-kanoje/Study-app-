import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { ArrowRight, BookOpen, Brain, Upload, Clock } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold">StudyBuddy</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button asChild variant="outline" className="hidden md:flex">
              <Link href="/auth/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Your AI-Powered <span className="text-primary">Study Companion</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-10">
              StudyBuddy helps you learn smarter with AI-powered notes, summaries, and study tools. Take your learning
              to the next level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link href="/auth/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>

            <div className="mt-16 relative w-full max-w-4xl">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-lg blur opacity-30"></div>
              <div className="relative bg-background rounded-lg border shadow-xl overflow-hidden">
                <img
                  src="/placeholder.svg?height=600&width=1200"
                  alt="StudyBuddy Dashboard"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to enhance your learning experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-background rounded-lg border p-6 hover:shadow-lg transition-shadow">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Notes</h3>
                <p className="text-muted-foreground">
                  Create, organize, and access your notes from anywhere. With automatic tagging and search.
                </p>
              </div>

              <div className="bg-background rounded-lg border p-6 hover:shadow-lg transition-shadow">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Summaries</h3>
                <p className="text-muted-foreground">
                  Get instant AI-powered summaries of your notes, textbooks, and study materials with just one click.
                </p>
              </div>

              <div className="bg-background rounded-lg border p-6 hover:shadow-lg transition-shadow">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">File Storage</h3>
                <p className="text-muted-foreground">
                  Upload and organize your study materials, PDFs, images, and more in one secure place.
                </p>
              </div>

              <div className="bg-background rounded-lg border p-6 hover:shadow-lg transition-shadow">
                <div className="rounded-full bg-primary/10 p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Study Timer</h3>
                <p className="text-muted-foreground">
                  Stay focused with our Pomodoro timer and track your study sessions for better productivity.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Get started with StudyBuddy in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Create an Account</h3>
                <p className="text-muted-foreground">Sign up for free and set up your personal study profile.</p>
              </div>

              <div className="text-center">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Add Your Notes</h3>
                <p className="text-muted-foreground">Create notes or upload existing study materials to get started.</p>
              </div>

              <div className="text-center">
                <div className="rounded-full bg-primary/10 p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Study Smarter</h3>
                <p className="text-muted-foreground">
                  Use AI summaries, flashcards, and other tools to enhance your learning.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of students who are already studying smarter
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background rounded-lg border p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mr-3">
                    <span className="font-bold text-primary">S</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Sarah K.</h4>
                    <p className="text-sm text-muted-foreground">Medical Student</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "StudyBuddy has completely transformed how I prepare for exams. The AI summaries save me hours of
                  review time!"
                </p>
              </div>

              <div className="bg-background rounded-lg border p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mr-3">
                    <span className="font-bold text-primary">J</span>
                  </div>
                  <div>
                    <h4 className="font-bold">James T.</h4>
                    <p className="text-sm text-muted-foreground">Computer Science Major</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "The file storage and organization features are fantastic. I can access all my study materials from
                  any device."
                </p>
              </div>

              <div className="bg-background rounded-lg border p-6">
                <div className="flex items-center mb-4">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mr-3">
                    <span className="font-bold text-primary">L</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Lisa M.</h4>
                    <p className="text-sm text-muted-foreground">High School Student</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "I love the study timer feature! It helps me stay focused and track my progress over time."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Study Habits?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-10">
              Join thousands of students who are already using StudyBuddy to study smarter, not harder.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link href="/auth/signup">
                Get Started for Free <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-background">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">StudyBuddy</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Smart Notes
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    AI Summaries
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    File Storage
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Study Timer
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Documentation
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                    GDPR
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} StudyBuddy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}


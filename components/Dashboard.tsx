"use client"

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "./ui/progress"
import { Button } from "./ui/button"
import { Camera, Brain, Trophy, Clock, BookOpen, Plus, ChevronRight, Sparkles } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const subjects = [
  { name: "Math", color: "bg-blue-500", progress: 65, xp: 650 },
  { name: "Science", color: "bg-green-500", progress: 80, xp: 800 },
  { name: "History", color: "bg-amber-500", progress: 45, xp: 450 },
  { name: "Literature", color: "bg-purple-500", progress: 70, xp: 700 },
]

export function Dashboard() {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null)

  const toggleSubject = (name: string) => {
    if (expandedSubject === name) {
      setExpandedSubject(null)
    } else {
      setExpandedSubject(name)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-heading">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/smart-notes">
              <Card className="h-full hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Camera className="h-8 w-8 mb-2 text-primary bounce" />
                  <span className="font-body">Scan Notes</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/chatbot">
              <Card className="h-full hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Brain className="h-8 w-8 mb-2 text-primary bounce" />
                  <span className="font-body">AI Buddy</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/time-management">
              <Card className="h-full hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Clock className="h-8 w-8 mb-2 text-primary bounce" />
                  <span className="font-body">Focus Timer</span>
                </CardContent>
              </Card>
            </Link>
            <Link href="/progress">
              <Card className="h-full hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <Trophy className="h-8 w-8 mb-2 text-primary bounce" />
                  <span className="font-body">My Rewards</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold font-heading">Your Subjects</h2>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 mr-1" /> Add Subject
            </Button>
          </div>
          <div className="space-y-4">
            {subjects.map((subject) => (
              <Card
                key={subject.name}
                className={cn(
                  "border-l-4 hover:shadow-lg transition-all duration-300",
                  subject.color,
                  expandedSubject === subject.name ? "shadow-md" : "",
                )}
              >
                <CardContent className="p-0">
                  <div className="p-4 cursor-pointer" onClick={() => toggleSubject(subject.name)}>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold font-heading">{subject.name}</h3>
                      <div className="flex items-center">
                        <span className="text-sm font-body mr-2">{subject.xp} XP</span>
                        <ChevronRight
                          className={cn(
                            "h-4 w-4 transition-transform",
                            expandedSubject === subject.name ? "rotate-90" : "",
                          )}
                        />
                      </div>
                    </div>
                    <Progress value={subject.progress} className="mt-2" />
                    <p className="text-sm font-body mt-1">{subject.progress}% Mastered</p>
                  </div>

                  {expandedSubject === subject.name && (
                    <div className="border-t p-4 grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <BookOpen className="h-3 w-3 mr-1" /> Study Notes
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Brain className="h-3 w-3 mr-1" /> Practice Quiz
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" /> Set Reminder
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" /> AI Tutor
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4 font-heading">AI Study Buddy</h2>
          <Card className="neumorphic dark:neumorphic-dark overflow-hidden">
            <CardContent className="p-6">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl animate-pulse" />
                <img
                  src="/placeholder.svg?height=100&width=100"
                  alt="AI Buddy"
                  className="w-24 h-24 mx-auto mb-4 float relative"
                />
              </div>
              <p className="text-center font-body mb-4">Hey there! Ready for a quick study session?</p>
              <Button className="w-full">Chat with Buddy</Button>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4 font-heading">Study Streak</h2>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-center text-2xl font-heading">
                <span className="text-primary">7</span> Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center mb-1",
                        i < 7 ? "bg-primary text-white" : "bg-muted",
                      )}
                    >
                      {day}
                    </div>
                    <span className="text-xs">{i + 1}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <Trophy className="mr-2 h-4 w-4" /> View Rewards
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


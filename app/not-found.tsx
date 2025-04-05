"use client"

import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"

const funnyMessages = [
  "Oops! Looks like our AI went on a coffee break.",
  "404: Brain cells not found. We're working on it!",
  "This page is playing hide and seek. And it's winning.",
  "Our hamsters powering the servers need a nap. Try again later!",
  "You've reached the edge of the internet. Turn back now!",
  "Even our AI couldn't find this page, and it's supposed to be smart.",
  "This page is studying for exams and can't be disturbed right now.",
  "Our code monkeys are scratching their heads too.",
  "This page exists in a parallel universe. We're working on interdimensional travel.",
  "Error 404: Page not found. But we found your determination impressive!",
]

const funnyGifs = [
  "/placeholder.svg?height=300&width=400",
  "/placeholder.svg?height=300&width=400",
  "/placeholder.svg?height=300&width=400",
]

export default function NotFound() {
  const [message, setMessage] = useState("")
  const [gif, setGif] = useState("")

  useEffect(() => {
    setMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)])
    setGif(funnyGifs[Math.floor(Math.random() * funnyGifs.length)])
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <img
        src={gif || "/placeholder.svg"}
        alt="Funny error illustration"
        className="max-w-md w-full h-auto mb-6 rounded-lg"
      />
      <p className="text-xl mb-6">{message}</p>
      <div className="space-y-2">
        <Button asChild size="lg">
          <Link href="/dashboard">Take Me Home</Link>
        </Button>
        <div className="pt-2">
          <Button variant="outline" asChild>
            <Link href="/chatbot">Ask Our AI For Help</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}


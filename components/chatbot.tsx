"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChatbot } from "@/lib/hooks/useChatbot"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Loader2 } from "lucide-react"

export default function Chatbot() {
  const { messages, loading, sendMessage } = useChatbot()
  const [input, setInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      await sendMessage(input)
      setInput("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p className="text-lg font-medium">Welcome to Study AI Chatbot!</p>
                <p className="mt-2">Ask me anything about your studies, and I'll help you out.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  <Card className="bg-primary/10 ml-auto max-w-[80%]">
                    <CardContent className="p-3">
                      <p className="text-sm">{msg.message}</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary/10 mr-auto max-w-[80%]">
                    <CardContent className="p-3">
                      <p className="text-sm">{msg.response}</p>
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your studies..."
            className="min-h-[60px] flex-1"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !input.trim()}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}


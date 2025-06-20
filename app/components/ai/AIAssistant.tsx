<<<<<<< HEAD
"use client"

import { useState } from 'react'
import { MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react'
import { Button } from '@/app/components/ui/Button'

type Message = {
  role: 'user' | 'assistant';
  content: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim()) return

    const newMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, newMessage])
    setInput('')

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      if (!response.ok) throw new Error('Failed to get AI response')

      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
    } catch (error) {
      console.error('AI chat error:', error)
    }
  }

  return (
    <>
      {isOpen && (
          <div
            className={`
              fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl
              transition-all duration-300 transform
              ${isMinimized ? 'h-14' : 'h-[600px]'}
              animate-in fade-in slide-in-from-bottom-4
            `}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">AI Assistant</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="flex-1 p-4 overflow-y-auto">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`mb-4 ${
                        msg.role === 'assistant' ? 'text-left' : 'text-right'
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          msg.role === 'assistant'
                            ? 'bg-gray-100'
                            : 'bg-primary text-white'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="p-4 border-t">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    className="w-full p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </form>
              </>
            )}
          </div>
        )}

      {!isOpen && (
        <Button
          className="fixed bottom-4 right-4"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-5 w-5" />
          AI Assistant
        </Button>
      )}
    </>
  )
} 
=======
"use client"

import { useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Input } from '../ui/input'
import { 
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Loader2
} from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      role: 'user',
      content: input
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // TODO: Implement actual API call
      const response = await new Promise(resolve => 
        setTimeout(() => resolve('This is a mock response from the AI assistant.'), 1000)
      )

      const assistantMessage: Message = {
        role: 'assistant',
        content: response as string
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isMobile) {
    return (
      <>
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg"
        >
          <MessageSquare className="w-6 h-6" />
        </Button>

        {isOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
            <Card className="fixed inset-4 flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">AI Assistant</h2>
                <Button
                  onClick={() => setIsOpen(false)}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-2 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.content}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}
              </div>

              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything..."
                    className="flex-1"
                  />
                  <Button onClick={handleSend} disabled={isLoading}>
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </>
    )
  }

  return (
    <Card className={`
      fixed right-4 bottom-4 w-80 shadow-lg
      transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-y-0' : 'translate-y-[calc(100%-48px)]'}
    `}>
      <div className="flex items-center justify-between p-3 border-b cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <Button
          onClick={(e) => {
            e.stopPropagation()
            setIsOpen(!isOpen)
          }}
          className="p-2"
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
        </Button>
      </div>

      {isOpen && (
        <>
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start space-x-2 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}
          </div>

          <div className="p-3 border-t">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={isLoading}>
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  )
} 
>>>>>>> c53144d (Initial commit)

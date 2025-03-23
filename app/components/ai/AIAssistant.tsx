import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Minimize2, Maximize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Message } from '@/types'

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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`
              fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl
              ${isMinimized ? 'h-14' : 'h-[600px]'}
            `}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">AI Assistant</h3>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                  onClick={() => setIsMinimized(!isMinimized)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X className="h-4 w-4" />}
                  onClick={() => setIsOpen(false)}
                />
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
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <Button
          className="fixed bottom-4 right-4"
          onClick={() => setIsOpen(true)}
          icon={<MessageSquare className="h-5 w-5" />}
        >
          AI Assistant
        </Button>
      )}
    </>
  )
} 
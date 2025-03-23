import { createWorker } from 'tesseract.js'
import { Configuration, OpenAIApi } from 'openai'
import { env } from '@/config/env'

export async function processWithOCR(imageData: Blob): Promise<string> {
  const worker = await createWorker()
  
  try {
    await worker.loadLanguage('eng')
    await worker.initialize('eng')
    
    const { data: { text } } = await worker.recognize(imageData)
    return text
  } finally {
    await worker.terminate()
  }
}

export async function detectSubjects(text: string): Promise<string[]> {
  const openai = new OpenAIApi(new Configuration({
    apiKey: env.openai.apiKey
  }))

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: "Analyze the text and identify academic subjects. Return as JSON array."
    }, {
      role: "user",
      content: text
    }]
  })

  return JSON.parse(response.data.choices[0].message?.content || '[]')
}

export function calculateConfidence(text: string): number {
  // Simple confidence calculation based on text length and structure
  const words = text.split(/\s+/).length
  const sentences = text.split(/[.!?]+/).length
  
  if (words < 10) return 0.5
  if (sentences < 2) return 0.7
  return 0.9
} 
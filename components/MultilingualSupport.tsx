'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
]

export function MultilingualSupport() {
  const [text, setText] = useState('')
  const [translatedText, setTranslatedText] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('es')
  const [isRecording, setIsRecording] = useState(false)

  const translateText = async () => {
    if (text) {
      try {
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLanguage }),
        })
        const data = await response.json()
        setTranslatedText(data.translatedText)
      } catch (error) {
        console.error('Error translating text:', error)
        setTranslatedText('Error translating text. Please try again.')
      }
    }
  }

  const toggleRecording = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        const audioChunks: Blob[] = []

        mediaRecorder.addEventListener('dataavailable', (event) => {
          audioChunks.push(event.data)
        })

        mediaRecorder.addEventListener('stop', async () => {
          const audioBlob = new Blob(audioChunks)
          const formData = new FormData()
          formData.append('audio', audioBlob)
          formData.append('targetLanguage', targetLanguage)

          const response = await fetch('/api/speech-to-text', {
            method: 'POST',
            body: formData,
          })
          const data = await response.json()
          setText(data.text)
          setTranslatedText(data.translatedText)
        })

        mediaRecorder.start()
        setIsRecording(true)

        setTimeout(() => {
          mediaRecorder.stop()
          setIsRecording(false)
        }, 5000) // Record for 5 seconds
      } catch (error) {
        console.error('Error recording audio:', error)
        alert('Error recording audio. Please try again.')
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multilingual Support</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate..."
            className="mb-2"
          />
          <div className="flex items-center space-x-2 mb-2">
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={translateText}>Translate</Button>
          </div>
          <Button onClick={toggleRecording}>
            {isRecording ? 'Recording...' : 'Start Voice Translation'}
          </Button>
        </div>
        {translatedText && (
          <div>
            <h3 className="font-semibold mb-2">Translated Text:</h3>
            <Textarea value={translatedText} readOnly />
          </div>
        )}
      </CardContent>
    </Card>
  )
}


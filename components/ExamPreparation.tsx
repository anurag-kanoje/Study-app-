'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export function ExamPreparation() {
  const [subject, setSubject] = useState('')
  const [questions, setQuestions] = useState<string[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [weakAreas, setWeakAreas] = useState<string[]>([])

  useEffect(() => {
    fetchWeakAreas()
  }, [])

  const fetchWeakAreas] = useState('')
  const [questions, setQuestions] = useState<string[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [weakAreas, setWeakAreas] = useState<string[]>([])

  useEffect(() => {
    fetchWeakAreas()
  }, [])

  const fetchWeakAreas = async () => {
    const q = query(collection(db, 'quizResults'), where('score', '<', 70))
    const querySnapshot = await getDocs(q)
    const areas = querySnapshot.docs.map(doc => doc.data().subject)
    setWeakAreas([...new Set(areas)])
  }

  const generateQuestions = async () => {
    if (subject) {
      try {
        const response = await openai.createCompletion({
          model: "text-davinci-002",
          prompt: `Generate 5 multiple-choice questions about ${subject}:`,
          max_tokens: 1000,
        })
        const generatedQuestions = response.data.choices[0].text?.split('\n').filter(q => q.trim() !== '')
        setQuestions(generatedQuestions || [])
        setCurrentQuestion(0)
        setScore(0)
        setQuizCompleted(false)
      } catch (error) {
        console.error('Error generating questions:', error)
        alert('Error generating questions. Please try again.')
      }
    }
  }

  const submitAnswer = async () => {
    // In a real application, you would check the answer against the correct one
    // For this example, we'll just move to the next question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setAnswer('')
    } else {
      setQuizCompleted(true)
      // Save quiz result
      await addDoc(collection(db, 'quizResults'), {
        subject,
        score,
        timestamp: new Date(),
      })
      fetchWeakAreas()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Preparation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject for mock test..."
            className="mb-2"
          />
          <Button onClick={generateQuestions}>Generate Mock Test</Button>
        </div>
        {questions.length > 0 && !quizCompleted && (
          <div className="mb-4">
            <p className="mb-2">{questions[currentQuestion]}</p>
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer..."
              className="mb-2"
            />
            <Button onClick={submitAnswer}>Submit Answer</Button>
          </div>
        )}
        {quizCompleted && (
          <div className="mb-4">
            <p>Quiz completed! Your score: {score}/{questions.length}</p>
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold mb-2">Weak Areas:</h3>
          <ul>
            {weakAreas.map((area, index) => (
              <li key={index}>{area}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}


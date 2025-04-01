'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from '@/lib/firebase'
import { collection, addDoc, query, getDocs, updateDoc, doc } from 'firebase/firestore'
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY)

export function Flashcards() {
  const [flashcards, setFlashcards] = useState<any[]>([])
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [currentCard, setCurrentCard] = useState<any>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    fetchFlashcards()
  }, [])

  const fetchFlashcards = async () => {
    const q = query(collection(db, 'flashcards'))
    const querySnapshot = await getDocs(q)
    setFlashcards(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
  }

  const addFlashcard = async () => {
    if (front && back) {
      await addDoc(collection(db, 'flashcards'), {
        front,
        back,
        nextReview: new Date(),
        interval: 1,
      })
      setFront('')
      setBack('')
      fetchFlashcards()
    }
  }

  const reviewCard = async (quality: number) => {
    if (currentCard) {
      const { interval, nextReview } = calculateNextReview(quality, currentCard.interval)
      await updateDoc(doc(db, 'flashcards', currentCard.id), {
        interval,
        nextReview,
      })
      setShowAnswer(false)
      fetchFlashcards()
      setCurrentCard(null)
    }
  }

  const calculateNextReview = (quality: number, previousInterval: number) => {
    let interval
    if (quality < 3) {
      interval = 1
    } else {
      interval = previousInterval * (1 + (quality - 3) * 0.1)
    }
    const nextReview = new Date(Date.now() + interval * 24 * 60 * 60 * 1000)
    return { interval, nextReview }
  }

  const startReview = () => {
    const now = new Date()
    const dueCards = flashcards.filter(card => card.nextReview <= now)
    if (dueCards.length > 0) {
      setCurrentCard(dueCards[0])
    } else {
      alert('No cards due for review!')
    }
  }

  const generateFlashcards = async () => {
    if (text) {
      try {
        const response = await hf.summarization({
          model: 'facebook/bart-large-cnn',
          inputs: text,
          parameters: {
            max_length: 100,
            min_length: 30,
          },
        })
        
        const summary = response.summary_text
        const questions = await hf.questionGeneration({
          model: 't5-base',
          inputs: summary,
        })

        for (let question of questions) {
          await addDoc(collection(db, 'flashcards'), {
            front: question.question,
            back: question.answer,
            nextReview: new Date(),
            interval: 1,
          })
        }

        setText('')
        fetchFlashcards()
        alert('Flashcards generated successfully!')
      } catch (error) {
        console.error('Error generating flashcards:', error)
        alert('Error generating flashcards. Please try again.')
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flashcards & Memory Aids</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            type="text"
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Front of card"
            className="mb-2"
          />
          <Input
            type="text"
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Back of card"
            className="mb-2"
          />
          <Button onClick={addFlashcard}>Add Flashcard</Button>
        </div>
        <div className="mb-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to generate flashcards..."
            className="mb-2"
          />
          <Button onClick={generateFlashcards}>Generate Flashcards</Button>
        </div>
        <div className="mb-4">
          <Button onClick={startReview}>Start Review</Button>
        </div>
        {currentCard && (
          <Card>
            <CardContent>
              <p className="mb-2">{currentCard.front}</p>
              {showAnswer && <p className="mb-2">{currentCard.back}</p>}
              {!showAnswer && <Button onClick={() => setShowAnswer(true)}>Show Answer</Button>}
              {showAnswer && (
                <div className="space-x-2">
                  <Button onClick={() => reviewCard(1)}>Hard</Button>
                  <Button onClick={() => reviewCard(3)}>Good</Button>
                  <Button onClick={() => reviewCard(5)}>Easy</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}


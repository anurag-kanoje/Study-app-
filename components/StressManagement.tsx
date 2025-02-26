'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StressManagement() {
  const [isMediating, setIsMediating] = useState(false)
  const [meditationTime, setMeditationTime] = useState(0)
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    // Fetch streak from local storage or API
    const savedStreak = localStorage.getItem('meditationStreak')
    if (savedStreak) {
      setStreak(parseInt(savedStreak))
    }
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isMediating) {
      interval = setInterval(() => {
        setMeditationTime((prevTime) => prevTime + 1)
      }, 1000)
    } else if (meditationTime > 0) {
      // Save meditation session
      saveMeditationSession(meditationTime)
      setMeditationTime(0)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isMediating, meditationTime])

  const toggleMeditation = () => {
    setIsMediating(!isMediating)
  }

  const saveMeditationSession = async (duration: number) => {
    try {
      // In a real application, you would send this data to your backend
      console.log(`Meditation session saved: ${duration} seconds`)
      
      // Update streak
      const newStreak = streak + 1
      setStreak(newStreak)
      localStorage.setItem('meditationStreak', newStreak.toString())

      // Here you would typically integrate with Google Fit API to save the activity
      // For example:
      // await googleFitApi.saveActivity('meditation', duration)
    } catch (error) {
      console.error('Error saving meditation session:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Stress Management & Well-being</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Guided Meditation</h3>
          <div className="text-3xl font-bold mb-2">{formatTime(meditationTime)}</div>
          <Progress value={(meditationTime / 600) * 100} className="mb-2" />
          <Button onClick={toggleMeditation}>
            {isMediating ? 'Stop Meditation' : 'Start Meditation'}
          </Button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Habit Tracking</h3>
          <p>Meditation Streak: {streak} days</p>
        </div>
      </CardContent>
    </Card>
  )
}


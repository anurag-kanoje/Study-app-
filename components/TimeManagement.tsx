'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'

export function TimeManagement() {
  const [timer, setTimer] = useState(25 * 60) // 25 minutes
  const [isActive, setIsActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [task, setTask] = useState('')
  const [trees, setTrees] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1)
        setProgress((prevProgress) => prevProgress + (100 / (25 * 60)))
      }, 1000)
    } else if (timer === 0) {
      setIsActive(false)
      setProgress(100)
      completePomodoro()
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, timer])

  useEffect(() => {
    fetchTrees()
  }, [])

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    setTimer(25 * 60)
    setProgress(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const completePomodoro = async () => {
    try {
      await addDoc(collection(db, 'pomodoros'), {
        task: task,
        completedAt: new Date(),
      })
      setTrees((prevTrees) => prevTrees + 1)
      alert('Pomodoro completed! You grew a tree!')
    } catch (error) {
      console.error('Error saving pomodoro:', error)
    }
  }

  const fetchTrees = async () => {
    const q = query(collection(db, 'pomodoros'), where('completedAt', '>', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)))
    const querySnapshot = await getDocs(q)
    setTrees(querySnapshot.size)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter your task..."
            className="mb-2"
          />
        </div>
        <div className="text-4xl font-bold mb-4">{formatTime(timer)}</div>
        <Progress value={progress} className="mb-4" />
        <div className="space-x-2 mb-4">
          <Button onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}</Button>
          <Button onClick={resetTimer}>Reset</Button>
        </div>
        <div>
          <p>Trees grown this week: {trees}</p>
        </div>
      </CardContent>
    </Card>
  )
}


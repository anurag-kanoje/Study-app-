'use client'

import { useState } from 'react'
import { Button } from "@/app/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/Card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"

const games = [
  { id: 'math', name: 'Math Challenge', description: 'Test your math skills with quick calculations!' },
  { id: 'memory', name: 'Memory Match', description: 'Improve your memory by matching pairs of cards.' },
  { id: 'quiz', name: 'General Knowledge Quiz', description: 'Challenge yourself with a variety of topics.' },
]

export default function GamesPage() {
  const [currentGame, setCurrentGame] = useState<string | null>(null)
  const [score, setScore] = useState(0)

  const startGame = (gameId: string) => {
    setCurrentGame(gameId)
    setScore(0)
  }

  const renderGame = () => {
    switch (currentGame) {
      case 'math':
        return <MathGame score={score} setScore={setScore} />
      case 'memory':
        return <MemoryGame score={score} setScore={setScore} />
      case 'quiz':
        return <QuizGame score={score} setScore={setScore} />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Educational Games</h1>
      {!currentGame ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <Card key={game.id}>
              <CardHeader>
                <CardTitle>{game.name}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => startGame(game.id)}>Start Game</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div>
          <Button onClick={() => setCurrentGame(null)} className="mb-4">Back to Games</Button>
          {renderGame()}
        </div>
      )}
    </div>
  )
}

function MathGame({ score, setScore }: { score: number, setScore: (score: number) => void }) {
  const [num1, setNum1] = useState(Math.floor(Math.random() * 10) + 1)
  const [num2, setNum2] = useState(Math.floor(Math.random() * 10) + 1)
  const [answer, setAnswer] = useState('')

  const checkAnswer = () => {
    if (parseInt(answer) === num1 + num2) {
      setScore(score + 1)
    }
    setNum1(Math.floor(Math.random() * 10) + 1)
    setNum2(Math.floor(Math.random() * 10) + 1)
    setAnswer('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Math Challenge</CardTitle>
        <CardDescription>Solve the addition problem:</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl mb-4">{num1} + {num2} = ?</div>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer"
          />
          <Button onClick={checkAnswer}>Submit</Button>
        </div>
      </CardContent>
      <CardFooter>
        <div>Score: {score}</div>
      </CardFooter>
    </Card>
  )
}

function MemoryGame({ score, setScore }: { score: number, setScore: (score: number) => void }) {
  // Implement memory game logic here
  return <div>Memory Game (Coming Soon)</div>
}

function QuizGame({ score, setScore }: { score: number, setScore: (score: number) => void }) {
  // Implement quiz game logic here
  return <div>Quiz Game (Coming Soon)</div>
}


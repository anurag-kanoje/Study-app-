import { ReactNode } from 'react'

export interface BaseProps {
  children?: ReactNode
  className?: string
}

export interface Note {
  id: string
  title: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
  tags: string[]
  subject: string
  ai_summary?: string
  flashcards?: Flashcard[]
}

export interface Flashcard {
  id: string
  front: string
  back: string
  note_id: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface AIAnalysisResult {
  text: string
  subjects: string[]
  confidence: number
  summary?: string
  keyPoints?: string[]
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export interface StudyGroup {
  id: string
  name: string
  subject: string
  members: string[]
  messages: Message[]
}

export interface Quiz {
  id: string
  title: string
  subject: string
  questions: QuizQuestion[]
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

export interface UserProgress {
  userId: string
  quizResults: {
    quizId: string
    score: number
    completedAt: string
  }[]
  studyStreaks: number
  achievements: string[]
}

export interface TranslationRequest {
  text: string
  fromLang: string
  toLang: string
  dialect?: string
}

export interface AccessibilitySettings {
  screenReader: boolean
  signLanguage: boolean
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large'
} 
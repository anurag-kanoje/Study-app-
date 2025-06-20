<<<<<<< HEAD
"use client"

import { useState } from 'react'
import { Navigation } from './Navigation'
import { AIAssistant } from '../ai/AIAssistant'
import { useMediaQuery } from '@/hooks/useMediaQuery'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(true)
  const isMobile = useMediaQuery('(max-width: 768px)')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light to-background">
      <Navigation 
        isOpen={isNavOpen} 
        onToggle={() => setIsNavOpen(!isNavOpen)}
        isMobile={isMobile}
      />
      
      <main className={`
        transition-all duration-300 ease-in-out
        ${isNavOpen && !isMobile ? 'ml-64' : 'ml-0'}
      `}>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {children}
          </div>
        </div>
      </main>

      <AIAssistant />
    </div>
  )
} 
=======
"use client"

import { useState } from 'react'
import { Navigation } from './Navigation'
import { AIAssistant } from '../ai/AIAssistant'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { 
  Bell, 
  BookOpen, 
  Brain, 
  FileText, 
  Users, 
  Calendar, 
  Trophy, 
  Settings,
  Clock,
  Flame,
  Star
} from 'lucide-react'

const QuickAccessTile = ({ icon: Icon, title, description, onClick }: { 
  icon: any, 
  title: string, 
  description: string,
  onClick: () => void 
}) => (
  <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
    <div className="flex items-start space-x-4">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </Card>
)

const StudyStatsCard = ({ title, value, change, icon: Icon }: {
  title: string,
  value: string,
  change: string,
  icon: any
}) => (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
        <p className={`text-sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </p>
      </div>
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
  </Card>
)

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isNavOpen, setIsNavOpen] = useState(true)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const quickAccessTiles = [
    {
      icon: BookOpen,
      title: 'Smart Notes',
      description: 'Create and organize your study notes',
      onClick: () => window.location.href = '/notes'
    },
    {
      icon: Brain,
      title: 'AI Chatbot',
      description: 'Get instant help from AI',
      onClick: () => window.location.href = '/ai-chat'
    },
    {
      icon: FileText,
      title: 'File Analysis',
      description: 'Upload and analyze study materials',
      onClick: () => window.location.href = '/file-analysis'
    },
    {
      icon: Users,
      title: 'Peer Pods',
      description: 'Study with your peers',
      onClick: () => window.location.href = '/peer-pods'
    },
    {
      icon: Calendar,
      title: 'Study Planner',
      description: 'Plan your study schedule',
      onClick: () => window.location.href = '/planner'
    },
    {
      icon: Trophy,
      title: 'Progress',
      description: 'Track your study progress',
      onClick: () => window.location.href = '/progress'
    }
  ]

  const studyStats = [
    {
      title: 'Study Time',
      value: '12.5h',
      change: '+2.3h',
      icon: Clock
    },
    {
      title: 'Notes Created',
      value: '24',
      change: '+5',
      icon: FileText
    },
    {
      title: 'Streak',
      value: '7 days',
      change: '+1',
      icon: Flame
    },
    {
      title: 'XP Points',
      value: '1,250',
      change: '+150',
      icon: Star
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-light to-background">
      <Navigation 
        isOpen={isNavOpen} 
        onToggle={() => setIsNavOpen(!isNavOpen)}
        isMobile={isMobile}
      />
      
      <main className={`
        transition-all duration-300 ease-in-out
        ${isNavOpen && !isMobile ? 'ml-64' : 'ml-0'}
        pb-16 md:pb-0
      `}>
        <div className="container mx-auto px-4 py-8">
          {/* Quick Access Tiles */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickAccessTiles.map((tile, index) => (
                <QuickAccessTile key={index} {...tile} />
              ))}
            </div>
          </section>

          {/* Study Stats */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Study Stats</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {studyStats.map((stat, index) => (
                <StudyStatsCard key={index} {...stat} />
              ))}
            </div>
          </section>

          {/* Main Content */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {children}
          </div>
        </div>
      </main>

      <AIAssistant />
    </div>
  )
} 
>>>>>>> c53144d (Initial commit)

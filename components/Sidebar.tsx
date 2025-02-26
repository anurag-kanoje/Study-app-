'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { BookOpen, Brain, Search, BarChart, Headphones, Globe, Users, FileText, PenTool, Award, Mic, Glasses, Heart, BookMarked, Zap, GamepadIcon as GameController } from 'lucide-react'

const features = [
  { name: 'AI Chatbot', path: '/chatbot', icon: Brain },
  { name: 'Study Tips', path: '/study-tips', icon: BookOpen },
  { name: 'Topic Search', path: '/topic-search', icon: Search },
  { name: 'Learning Resources', path: '/resources', icon: BookMarked },
  { name: 'Progress Tracking', path: '/progress', icon: BarChart },
  { name: 'Multi-Sensory Tools', path: '/multi-sensory', icon: Headphones },
  { name: 'Language Translation', path: '/translation', icon: Globe },
  { name: 'Virtual Study Groups', path: '/study-groups', icon: Users },
  { name: 'AI Flashcards', path: '/flashcards', icon: FileText },
  { name: 'Essay Writing Assistant', path: '/essay-assistant', icon: PenTool },
  { name: 'Exam Preparation', path: '/exam-prep', icon: Award },
  { name: 'Voice Assistant', path: '/voice-assistant', icon: Mic },
  { name: 'AR/VR Learning', path: '/ar-vr', icon: Glasses },
  { name: 'Mental Health Support', path: '/mental-health', icon: Heart },
  { name: 'Global Resources', path: '/global-resources', icon: BookMarked },
  { name: 'Adaptive Learning', path: '/adaptive-learning', icon: Zap },
  { name: 'Educational Games', path: '/games', icon: GameController },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-64 bg-card text-card-foreground p-4 space-y-2 overflow-y-auto">
      {features.map((feature) => {
        const Icon = feature.icon
        return (
          <Link key={feature.path} href={feature.path}>
            <Button
              variant={pathname === feature.path ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Icon className="mr-2 h-4 w-4" />
              {feature.name}
            </Button>
          </Link>
        )
      })}
    </nav>
  )
}


"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Button } from '../ui/Button'
import { 
  Menu,
  X,
  BookOpen,
  Brain,
  FileText,
  Users,
  Calendar,
  Trophy,
  Settings,
  Bell
} from 'lucide-react'

const navigationItems = [
  { name: 'Smart Notes', href: '/notes', icon: BookOpen },
  { name: 'AI Chatbot', href: '/ai-chat', icon: Brain },
  { name: 'File Analysis', href: '/file-analysis', icon: FileText },
  { name: 'Peer Pods', href: '/peer-pods', icon: Users },
  { name: 'Study Planner', href: '/planner', icon: Calendar },
  { name: 'Progress', href: '/progress', icon: Trophy },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Navigation({ 
  isOpen, 
  onToggle,
  isMobile 
}: { 
  isOpen: boolean
  onToggle: () => void
  isMobile: boolean
}) {
  const pathname = usePathname()

  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border md:hidden">
        <div className="flex justify-around items-center h-16">
          {navigationItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center w-full h-full
                  ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
                  transition-colors duration-200`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    )
  }

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-background border border-border
          hover:bg-accent transition-colors duration-200 md:hidden"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      <nav className={`
        fixed top-0 left-0 h-full bg-background border-r border-border
        transition-transform duration-300 ease-in-out z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:w-64
      `}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <h1 className="text-xl font-bold">StudyBuddy</h1>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-1 px-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg
                      ${isActive 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                      }
                      transition-colors duration-200
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <Button variant="outline" className="w-full justify-start">
              <Bell className="w-5 h-5 mr-2" />
              Notifications
            </Button>
          </div>
        </div>
      </nav>
    </>
  )
} 

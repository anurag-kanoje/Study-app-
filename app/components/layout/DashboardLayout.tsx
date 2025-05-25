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
>>>>>>> c53144d (Initial commit)

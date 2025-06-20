"use client"

import { useState } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { Navigation } from './Navigation'
import { AIAssistant } from '../ai/AIAssistant'

export function AppLayout({ children }: { children: React.ReactNode }) {
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
        pb-16 md:pb-0
      `}>
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      <AIAssistant />
    </div>
  )
} 
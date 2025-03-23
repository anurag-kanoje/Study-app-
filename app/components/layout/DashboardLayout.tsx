import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      <AIAssistant />
    </div>
  )
} 
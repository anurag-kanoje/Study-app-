"use client"

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { PanelLeft } from 'lucide-react';
import { Navigation } from '@/app/components/layout/Navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
    
    // Check if mobile view
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen">
      <div className={`w-64 border-r bg-background ${isSidebarOpen ? '' : 'hidden'}`}>
        <div className="flex h-16 items-center justify-between px-4">
          <h2 className="text-lg font-semibold">StudyBuddy</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(false)}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="px-4 py-2">
          <Navigation 
            isOpen={isSidebarOpen} 
            onToggle={() => setIsSidebarOpen(!isSidebarOpen)} 
            isMobile={isMobile} 
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex h-16 items-center border-b px-4 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
        <main className="container mx-auto p-6">{children}</main>
      </div>
    </div>
  )
} 

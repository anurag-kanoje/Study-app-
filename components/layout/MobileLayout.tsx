"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, BookOpen, Calendar, User, Users, Menu, X, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

const NavItem = ({ href, icon, label, isActive }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center px-2 py-1 text-xs font-medium transition-colors",
        isActive ? "text-primary" : "text-muted-foreground hover:text-primary",
      )}
    >
      <motion.div initial={{ scale: 0.8 }} animate={{ scale: isActive ? 1 : 0.8 }} transition={{ duration: 0.2 }}>
        {icon}
      </motion.div>
      <span className="mt-1">{label}</span>
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute bottom-0 h-1 w-6 rounded-t-full bg-primary"
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  )
}

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const navItems = [
    { href: "/dashboard", icon: <Home size={24} />, label: "Home" },
    { href: "/ai-notes", icon: <BookOpen size={24} />, label: "Notes" },
    { href: "/planner", icon: <Calendar size={24} />, label: "Planner" },
    { href: "/profile", icon: <User size={24} />, label: "Profile" },
    { href: "/community", icon: <Users size={24} />, label: "Community" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top header for mobile */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-xl">StudyWell</span>
        </Link>

        <div className="flex items-center space-x-2">
          {isMounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <div className="flex flex-col space-y-4 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Menu</span>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <X size={18} />
                    </Button>
                  </SheetTrigger>
                </div>
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-accent hover:text-accent-foreground",
                      )}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-16 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="container mx-auto p-4"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-background lg:hidden">
        <div className="grid h-16 grid-cols-5">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </nav>
    </div>
  )
}


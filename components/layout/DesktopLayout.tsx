"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Home,
  BookOpen,
  Calendar,
  User,
  Users,
  Settings,
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  isCollapsed: boolean
}

const NavItem = ({ href, icon, label, isActive, isCollapsed }: NavItemProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
      )}
    >
      {icon}
      {!isCollapsed && <span>{label}</span>}
    </Link>
  )
}

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const navItems = [
    { href: "/dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { href: "/ai-notes", icon: <BookOpen size={20} />, label: "AI Notes" },
    { href: "/planner", icon: <Calendar size={20} />, label: "Study Planner" },
    { href: "/profile", icon: <User size={20} />, label: "Profile" },
    { href: "/community", icon: <Users size={20} />, label: "Community" },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[70px]" : "w-[240px]",
        )}
      >
        <div className="flex h-14 items-center border-b px-3">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="font-bold text-xl">StudyWell</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("ml-auto", isCollapsed && "mx-auto")}
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={pathname === item.href}
                isCollapsed={isCollapsed}
              />
            ))}
          </nav>
        </div>
        <div className="mt-auto border-t p-3">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full" size="icon">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {!isCollapsed && (
              <div className="ml-2">
                <p className="text-sm font-medium">User Name</p>
                <p className="text-xs text-muted-foreground">user@example.com</p>
              </div>
            )}
            {isMounted && !isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "lg:ml-[70px]" : "lg:ml-[240px]",
        )}
      >
        {/* Top header */}
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell size={20} />
          </Button>
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
        </header>

        {/* Page content */}
        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="container mx-auto p-6"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}


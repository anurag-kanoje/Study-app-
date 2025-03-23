"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Home, FileText, Upload, Bell, User, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function Sidebar() {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Home,
    },
    {
      name: "Notes",
      path: "/notes",
      icon: FileText,
    },
    {
      name: "Files",
      path: "/files",
      icon: Upload,
    },
    {
      name: "Notifications",
      path: "/notifications",
      icon: Bell,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
    },
  ]

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/80 md:hidden"
        onClick={() => setIsOpen(false)}
        style={{ display: isOpen ? "block" : "none" }}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-screen",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/dashboard" className="flex items-center">
            <span className="text-xl font-bold">StudyBuddy</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col justify-between h-[calc(100%-4rem)]">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {routes.map((route) => {
              const Icon = route.icon
              const isActive = pathname === route.path

              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {route.name}
                </Link>
              )
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
                <div className="truncate">
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
              </div>
              <ModeToggle />
            </div>

            <Button variant="outline" className="w-full justify-start" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </aside>

      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-20 right-4 z-30 md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  )
}

export default Sidebar


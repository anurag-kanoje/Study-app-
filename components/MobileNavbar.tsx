"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, FileText, Upload, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNavbar() {
  const pathname = usePathname()

  const routes = [
    {
      name: "Home",
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
      name: "Alerts",
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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t md:hidden">
      <div className="flex justify-around">
        {routes.map((route) => {
          const Icon = route.icon
          const isActive = pathname === route.path

          return (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "flex flex-col items-center py-2 px-3",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{route.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}


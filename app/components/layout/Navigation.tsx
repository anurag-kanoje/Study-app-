import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Book,
  FileText,
  Settings,
  Users,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/app/components/ui/Button'

interface NavigationProps {
  isOpen: boolean
  onToggle: () => void
  isMobile: boolean
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: FileText },
  { href: '/notes', label: 'Notes', icon: Book },
  { href: '/study-groups', label: 'Study Groups', icon: Users },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Navigation({ isOpen, onToggle, isMobile }: NavigationProps) {
  const pathname = usePathname()

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 md:hidden z-50"
        onClick={onToggle}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      <nav
        className={cn(
          'fixed top-0 left-0 h-full bg-white border-r w-64 transition-transform duration-300 z-40',
          !isOpen && '-translate-x-full',
          isMobile && 'shadow-xl'
        )}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold">Study App</h1>
        </div>

        <div className="px-4">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                pathname === href
                  ? 'bg-primary text-white'
                  : 'hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
} 

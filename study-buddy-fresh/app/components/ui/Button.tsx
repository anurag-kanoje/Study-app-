"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { type VariantProps, cva } from 'class-variance-authority'

const buttonVariants = cva(
  'rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2',
  {
    variants: {
      variant: {
        primary: 'bg-primary hover:bg-primary-hover text-white',
        secondary: 'bg-secondary hover:bg-secondary-hover text-white',
        outline: 'border-2 border-primary text-primary hover:bg-primary-light',
        ghost: 'hover:bg-gray-100 text-gray-700'
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  icon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, icon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          isLoading && 'opacity-70 cursor-not-allowed',
          'transition-transform hover:scale-[1.02] active:scale-[0.98]',
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : icon}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button' 

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'

const cardVariants = cva('rounded-xl p-6', {
  variants: {
    variant: {
      default: 'bg-white shadow-lg',
      glass: 'backdrop-blur-md bg-white/80',
      outlined: 'border-2 border-gray-200'
    }
  },
  defaultVariants: {
    variant: 'default'
  }
})

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  isInteractive?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, isInteractive = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={isInteractive ? { scale: 1.02 } : undefined}
        whileTap={isInteractive ? { scale: 0.98 } : undefined}
        className={cn(
          cardVariants({ variant }),
          isInteractive && 'cursor-pointer transition-all duration-200',
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter' 
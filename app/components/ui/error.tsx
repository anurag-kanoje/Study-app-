import { AlertCircle } from "lucide-react"
import { Button } from "./Button"

interface ErrorProps {
  message?: string
  onRetry?: () => void
}

export function Error({ message = "Something went wrong", onRetry }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="w-6 h-6" />
        <h3 className="text-lg font-semibold">Error</h3>
      </div>
      <p className="text-muted-foreground text-center">{message}</p>
      {onRetry && (
        <Button onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
} 
"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Label } from "@/app/components/ui/label"
import { AlertCircle, ArrowLeft, Loader2, CheckCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert"
import Link from "next/link"
import { ModeToggle } from "@/app/components/mode-toggle"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { resetPassword, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      await resetPassword(email)
      setIsSubmitted(true)
    } catch (error) {
      setError((error as Error).message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted/50">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            {isSubmitted
              ? "Check your email for reset instructions"
              : "Enter your email address and we'll send you a link to reset your password"}
          </CardDescription>
        </CardHeader>

        {isSubmitted ? (
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">Reset link sent</h3>
              <p className="text-muted-foreground mb-4">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the
                instructions.
              </p>
              <p className="text-sm text-muted-foreground">If you don't see the email, check your spam folder.</p>
            </div>
          </CardContent>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-input/50 focus-visible:ring-primary/50"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <Button variant="ghost" className="w-full" asChild>
                <Link href="/auth/login">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                </Link>
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
    </div>
  )
}


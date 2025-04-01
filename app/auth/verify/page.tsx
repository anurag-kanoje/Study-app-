"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-background to-muted/50">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            We've sent you a verification link to complete your registration
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
          <h3 className="text-lg font-medium mb-2">Verification Email Sent</h3>
          <p className="text-muted-foreground mb-4 max-w-xs">
            Please check your email inbox and click on the verification link to complete your registration.
          </p>
          <p className="text-sm text-muted-foreground">If you don't see the email, check your spam folder.</p>
        </CardContent>
        <CardFooter>
          <Button variant="ghost" className="w-full" asChild>
            <Link href="/auth/login">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


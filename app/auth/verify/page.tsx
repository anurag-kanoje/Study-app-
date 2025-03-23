"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Mail } from "lucide-react"

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Check your email</CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent you a verification link to your email address. Please click the link to verify your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center text-sm text-muted-foreground">
          If you don&apos;t see the email in your inbox, please check your spam folder.
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Return to login</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


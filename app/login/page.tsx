'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from 'react-i18next'
import '../i18n'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('student')
  const router = useRouter()
  const { t, i18n } = useTranslation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Logging in with:', { email, password, role })
    toast({
      title: t('loginSuccessful'),
      description: t('welcomeMessage', { role: t(role) }),
    })
    router.push('/dashboard')
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t('loginToStudyBuddy')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <div>
              <Label>{t('iAmA')}</Label>
              <RadioGroup value={role} onValueChange={setRole} className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">{t('student')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="teacher" id="teacher" />
                  <Label htmlFor="teacher">{t('teacher')}</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="language">{t('language')}</Label>
              <Select onValueChange={changeLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder={t('selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t('english')}</SelectItem>
                  <SelectItem value="hi">{t('hindi')}</SelectItem>
                  <SelectItem value="hne">{t('chhattisgarhi')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">{t('login')}</Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('dontHaveAccount')}{' '}
            <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
              {t('signUp')}
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}


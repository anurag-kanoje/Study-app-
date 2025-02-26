'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface HealthStatus {
  status: 'ok' | 'error'
  services: {
    'mini-omni2': 'healthy' | 'unhealthy'
  }
  error?: string
}

export function HealthCheck() {
  const [status, setStatus] = useState<'loading' | 'healthy' | 'unhealthy'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkHealth = async () => {
    setIsChecking(true)
    try {
      const response = await fetch('/api/health')
      const data: HealthStatus = await response.json()
      
      if (data.status === 'ok' && data.services['mini-omni2'] === 'healthy') {
        setStatus('healthy')
        setError(null)
      } else {
        setStatus('unhealthy')
        setError(data.error || 'System is not healthy')
      }
    } catch (error) {
      setStatus('unhealthy')
      setError('Failed to check system health')
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          System Health
          <Button 
            variant="outline" 
            size="sm"
            onClick={checkHealth}
            disabled={isChecking}
          >
            {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check Again'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status === 'loading' && (
          <div className="flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Checking system health...
          </div>
        )}
        
        {status === 'healthy' && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>System is healthy</AlertTitle>
            <AlertDescription>
              All services are running properly
            </AlertDescription>
          </Alert>
        )}
        
        {status === 'unhealthy' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>System is unhealthy</AlertTitle>
            <AlertDescription>
              {error || 'One or more services are not responding'}
              <div className="mt-2">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                Make sure mini-omni2 server is running:
                <code className="block mt-2 p-2 bg-muted rounded text-sm">
                  conda activate omni<br />
                  cd mini-omni2<br />
                  python server.py
                </code>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}


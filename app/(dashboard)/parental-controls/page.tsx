"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Progress } from "@/app/components/ui/progress"
import { Calendar } from "@/app/components/ui/calendar"
import { useToast } from "@/app/components/ui/use-toast"

export default function ParentalControlsPage() {
  const { toast } = useToast()
  const [screenTime, setScreenTime] = useState(0)
  const [studyMode, setStudyMode] = useState(false)
  const [blockedApps, setBlockedApps] = useState<string[]>([])

  const handleStudyModeToggle = () => {
    setStudyMode(!studyMode)
    toast({
      title: studyMode ? "Study Mode Disabled" : "Study Mode Enabled",
      description: studyMode 
        ? "Apps are now accessible" 
        : "Non-study apps are now blocked during study hours",
    })
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Parental Controls</h1>
      
      <Tabs defaultValue="screen-time" className="space-y-4">
        <TabsList>
          <TabsTrigger value="screen-time">Screen Time</TabsTrigger>
          <TabsTrigger value="app-controls">App Controls</TabsTrigger>
          <TabsTrigger value="study-mode">Study Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="screen-time" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Screen Time</CardTitle>
              <CardDescription>Monitor your child's app usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Total Screen Time</Label>
                  <span className="text-lg font-semibold">{screenTime} hours</span>
                </div>
                <Progress value={screenTime * 10} className="h-2" />
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Most Used Apps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span>YouTube</span>
                          <span>2.5 hours</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Instagram</span>
                          <span>1.8 hours</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Study Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        <li className="flex justify-between">
                          <span>StudyBuddy</span>
                          <span>1.2 hours</span>
                        </li>
                        <li className="flex justify-between">
                          <span>Calculator</span>
                          <span>0.5 hours</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="app-controls" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>App Blocking</CardTitle>
              <CardDescription>Control which apps your child can access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Enter app name to block" />
                  <Button>Block App</Button>
                </div>
                <div className="space-y-2">
                  <Label>Blocked Apps</Label>
                  <div className="space-y-2">
                    {blockedApps.map((app) => (
                      <div key={app} className="flex items-center justify-between p-2 border rounded">
                        <span>{app}</span>
                        <Button variant="destructive" size="sm">Unblock</Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="study-mode" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Study Mode Settings</CardTitle>
              <CardDescription>Configure study mode schedule and restrictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Study Mode</Label>
                  <Button 
                    variant={studyMode ? "destructive" : "default"}
                    onClick={handleStudyModeToggle}
                  >
                    {studyMode ? "Disable" : "Enable"}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Study Hours</Label>
                  <div className="flex items-center space-x-2">
                    <Input type="time" />
                    <span>to</span>
                    <Input type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Allowed Apps During Study Mode</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="studybuddy" />
                      <Label htmlFor="studybuddy">StudyBuddy</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="calculator" />
                      <Label htmlFor="calculator">Calculator</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notes" />
                      <Label htmlFor="notes">Notes</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 

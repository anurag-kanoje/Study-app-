"use client"

import React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Target, Clock, Calendar } from "lucide-react"

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("week")

  const stats = [
    {
      title: "Study Hours",
      value: "24.5",
      description: "This week",
      icon: Clock,
    },
    {
      title: "Topics Covered",
      value: "12",
      description: "Last 7 days",
      icon: BookOpen,
    },
    {
      title: "Goals Achieved",
      value: "8",
      description: "This month",
      icon: Target,
    },
    {
      title: "Next Exam",
      value: "15 days",
      description: "Mathematics",
      icon: Calendar,
    },
  ]

  const recentActivities = [
    {
      title: "Completed Chapter 5",
      description: "Advanced Calculus",
      time: "2 hours ago",
    },
    {
      title: "Quiz Completed",
      description: "Physics - Mechanics",
      time: "5 hours ago",
    },
    {
      title: "Study Session",
      description: "Chemistry - Organic Chemistry",
      time: "1 day ago",
    },
    {
      title: "Notes Updated",
      description: "Biology - Cell Structure",
      time: "2 days ago",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your study progress.</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <Button
            variant={timeframe === "week" ? "default" : "outline"}
            onClick={() => setTimeframe("week")}
          >
            Week
          </Button>
          <Button
            variant={timeframe === "month" ? "default" : "outline"}
            onClick={() => setTimeframe("month")}
          >
            Month
          </Button>
          <Button
            variant={timeframe === "year" ? "default" : "outline"}
            onClick={() => setTimeframe("year")}
          >
            Year
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overall Progress</CardTitle>
            <CardDescription>Your study progress across all subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={75} className="h-2" />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Your latest study activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.title} className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                  <div className="text-sm text-muted-foreground">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
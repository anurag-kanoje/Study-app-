"use client"

import { useEffect, useState } from "react"
import { TeacherDashboard } from "@/app/components/TeacherDashboard"
import QuestionPaperGenerator from "@/app/components/QuestionPaperGenerator"
import { DigitalAttendance } from "@/app/components/DigitalAttendance"
import { FeeManagement } from "@/app/components/FeeManagement"
import { StudyMaterialManager } from "@/app/components/StudyMaterialManager"
import { ParentTeacherCommunication } from "@/app/components/ParentTeacherCommunication"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

export default function TeacherDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto py-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 gap-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="materials">Study Materials</TabsTrigger>
          <TabsTrigger value="questions">Question Papers</TabsTrigger>
          <TabsTrigger value="fees">Fee Management</TabsTrigger>
          <TabsTrigger value="communication">Parent Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <TeacherDashboard />
        </TabsContent>

        <TabsContent value="attendance" className="space-y-6">
          <DigitalAttendance />
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <StudyMaterialManager />
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <QuestionPaperGenerator />
        </TabsContent>

        <TabsContent value="fees" className="space-y-6">
          <FeeManagement />
        </TabsContent>

        <TabsContent value="communication" className="space-y-6">
          <ParentTeacherCommunication />
        </TabsContent>
      </Tabs>
    </div>
  )
}


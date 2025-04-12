"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Sample data
const students = [
  { id: 1, name: "Rahul Sharma", rollNo: "101", class: "Class 10", attendance: 85, overallPerformance: 78 },
  { id: 2, name: "Priya Patel", rollNo: "102", class: "Class 10", attendance: 92, overallPerformance: 92 },
  { id: 3, name: "Amit Kumar", rollNo: "103", class: "Class 10", attendance: 65, overallPerformance: 62 },
  { id: 4, name: "Sneha Gupta", rollNo: "104", class: "Class 11", attendance: 78, overallPerformance: 85 },
  { id: 5, name: "Vikram Singh", rollNo: "105", class: "Class 11", attendance: 45, overallPerformance: 58 },
]

const subjects = [
  { id: 1, name: "Mathematics", color: "bg-blue-500" },
  { id: 2, name: "Physics", color: "bg-green-500" },
  { id: 3, name: "Chemistry", color: "bg-amber-500" },
  { id: 4, name: "Biology", color: "bg-purple-500" },
  { id: 5, name: "English", color: "bg-red-500" },
  { id: 6, name: "Computer Science", color: "bg-cyan-500" },
]

const studentSubjectPerformance = [
  { subjectId: 1, studentId: 3, score: 65, improvement: 5, status: "Needs Improvement" },
  { subjectId: 2, studentId: 3, score: 72, improvement: 8, status: "Satisfactory" },
  { subjectId: 3, studentId: 3, score: 58, improvement: -3, status: "Needs Improvement" },
  { subjectId: 4, studentId: 3, score: 60, improvement: 2, status: "Needs Improvement" },
  { subjectId: 5, studentId: 3, score: 75, improvement: 10, status: "Satisfactory" },
  { subjectId: 6, studentId: 3, score: 42, improvement: -8, status: "Poor" },
]

const assignments = [
  {
    id: 1,
    title: "Mathematics Assignment 1",
    subject: "Mathematics",
    dueDate: "2023-05-15",
    status: "Submitted",
    score: 85,
    maxScore: 100,
  },
  {
    id: 2,
    title: "Physics Lab Report",
    subject: "Physics",
    dueDate: "2023-05-10",
    status: "Submitted",
    score: 78,
    maxScore: 100,
  },
  {
    id: 3,
    title: "Chemistry Periodic Table Quiz",
    subject: "Chemistry",
    dueDate: "2023-05-20",
    status: "Pending",
    score: null,
    maxScore: 50,
  },
  {
    id: 4,
    title: "English Essay",
    subject: "English",
    dueDate: "2023-05-18",
    status: "Submitted",
    score: 92,
    maxScore: 100,
  },
  {
    id: 5,
    title: "Computer Science Project",
    subject: "Computer Science",
    dueDate: "2023-05-25",
    status: "Pending",
    score: null,
    maxScore: 100,
  },
]

const tests = [
  {
    id: 1,
    title: "Mathematics Mid-Term",
    subject: "Mathematics",
    date: "2023-04-15",
    score: 72,
    maxScore: 100,
    classAverage: 68,
  },
  {
    id: 2,
    title: "Physics Quiz 1",
    subject: "Physics",
    date: "2023-04-20",
    score: 85,
    maxScore: 100,
    classAverage: 75,
  },
  {
    id: 3,
    title: "Chemistry Unit Test",
    subject: "Chemistry",
    date: "2023-04-25",
    score: 65,
    maxScore: 100,
    classAverage: 70,
  },
  {
    id: 4,
    title: "English Comprehension",
    subject: "English",
    date: "2023-04-28",
    score: 88,
    maxScore: 100,
    classAverage: 80,
  },
  {
    id: 5,
    title: "Computer Science Theory",
    subject: "Computer Science",
    date: "2023-05-05",
    score: 45,
    maxScore: 100,
    classAverage: 62,
  },
]

export function StudentPerformance() {
  const [selectedStudent, setSelectedStudent] = useState<number>(3) // Default to Amit Kumar
  const [searchQuery, setSearchQuery] = useState("")

  const student = students.find((s) => s.id === selectedStudent)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "text-green-600 dark:text-green-400"
      case "Good":
        return "text-blue-600 dark:text-blue-400"
      case "Satisfactory":
        return "text-yellow-600 dark:text-yellow-400"
      case "Needs Improvement":
        return "text-orange-600 dark:text-orange-400"
      case "Poor":
        return "text-red-600 dark:text-red-400"
      default:
        return "text-muted-foreground"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 75) return "text-blue-600 dark:text-blue-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    if (score >= 40) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  const getImprovementBadge = (improvement: number) => {
    if (improvement > 0) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800">+{improvement}%</Badge>
    }
    if (improvement < 0) {
      return <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">{improvement}%</Badge>
    }
    return <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-800">0%</Badge>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Student Performance Tracking</h1>
        <p className="text-muted-foreground">Monitor and analyze student academic progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Student Profile</CardTitle>
            <CardDescription>View and select student</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-4"
              />
            </div>
            
            <div className="space-y-2">
              {students
                .filter(s => 
                  s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  s.rollNo.includes(searchQuery)
                )
                .map((s) => (
                  <div
                    key={s.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-muted transition-colors",
                      selectedStudent === s.id && "bg-muted"
                    )}
                    onClick={() => setSelectedStudent(s.id)}
                  >
                    <Avatar>
                      <AvatarFallback>{s.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{s.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Roll No: {s.rollNo} | {s.class}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          {student ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{student.name}</CardTitle>
                      <CardDescription>
                        Roll No: {student.rollNo} | {student.class}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Generate Report</Button>
                    <Button>Contact Parent</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="overview">
                  <TabsList className="w-full rounded-none border-b">
                    <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                    <TabsTrigger value="subjects" className="flex-1">Subject Performance</TabsTrigger>
                    <TabsTrigger value="assignments" className="flex-1">Assignments</TabsTrigger>
                    <TabsTrigger value="tests" className="flex-1">Tests & Exams</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="m-0 p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Overall Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{student.overallPerformance}%</div>
                          <Progress value={student.overallPerformance} className="h-2 mt-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            Class Average: 75%
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{student.attendance}%</div>
                          <Progress value={student.attendance} className="h-2 mt-2" />
                \


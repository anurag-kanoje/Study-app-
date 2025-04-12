"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  FileText,
  Video,
  Calendar,
  CreditCard,
  Clock,
  BookOpen,
  Upload,
  Download,
  PlusCircle,
  BarChart,
  CheckCircle,
  AlertCircle,
  Award,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample data
  const students = [
    { id: 1, name: "Rahul Sharma", attendance: 85, fees: "Paid", performance: 78 },
    { id: 2, name: "Priya Patel", attendance: 92, fees: "Paid", performance: 92 },
    { id: 3, name: "Amit Kumar", attendance: 65, fees: "Due", performance: 62 },
    { id: 4, name: "Sneha Gupta", attendance: 78, fees: "Paid", performance: 85 },
    { id: 5, name: "Vikram Singh", attendance: 45, fees: "Due", performance: 58 },
  ]

  const upcomingClasses = [
    { id: 1, subject: "Mathematics", topic: "Calculus", time: "10:00 AM", date: "Today" },
    { id: 2, subject: "Physics", topic: "Mechanics", time: "2:00 PM", date: "Today" },
    { id: 3, subject: "Chemistry", topic: "Organic Chemistry", time: "11:00 AM", date: "Tomorrow" },
  ]

  const recentUploads = [
    { id: 1, name: "Mathematics Notes.pdf", date: "2 days ago", downloads: 15 },
    { id: 2, name: "Physics Question Bank.pdf", date: "3 days ago", downloads: 12 },
    { id: 3, name: "Chemistry Formulas.pdf", date: "5 days ago", downloads: 18 },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your classes, students, and resources</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/teacher/create-class">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Class
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/teacher/settings">Settings</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="materials">Study Materials</TabsTrigger>
          <TabsTrigger value="fees">Fee Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+5 this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <Progress value={78} className="h-2 mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Fee Collection</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹24,500</div>
                <p className="text-xs text-muted-foreground">₹4,500 pending</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Performance</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72%</div>
                <Progress value={72} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>Your scheduled classes for today and tomorrow</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium">{cls.subject}</p>
                      <p className="text-sm text-muted-foreground">{cls.topic}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{cls.time}</p>
                      <p className="text-xs text-muted-foreground">{cls.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/teacher/schedule">
                    <Calendar className="mr-2 h-4 w-4" /> View Full Schedule
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
                <CardDescription>Study materials you've recently uploaded</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentUploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{upload.name}</p>
                        <p className="text-xs text-muted-foreground">Uploaded {upload.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{upload.downloads} downloads</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/teacher/materials">
                    <Upload className="mr-2 h-4 w-4" /> Upload New Material
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>View and manage your students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-muted p-3 font-medium">
                  <div>Name</div>
                  <div>Attendance</div>
                  <div>Fees Status</div>
                  <div>Performance</div>
                  <div className="text-right">Actions</div>
                </div>
                {students.map((student) => (
                  <div key={student.id} className="grid grid-cols-5 p-3 border-t items-center">
                    <div>{student.name}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Progress value={student.attendance} className="h-2 w-16" />
                        <span className="text-sm">{student.attendance}%</span>
                      </div>
                    </div>
                    <div>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                          student.fees === "Paid"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
                        )}
                      >
                        {student.fees === "Paid" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <AlertCircle className="mr-1 h-3 w-3" />
                        )}
                        {student.fees}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Progress value={student.performance} className="h-2 w-16" />
                        <span className="text-sm">{student.performance}%</span>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/teacher/students/${student.id}`}>
                          <BarChart className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Award className="h-4 w-4" />
                        <span className="sr-only">Performance</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/teacher/students">View All Students</Link>
              </Button>
              <Button asChild>
                <Link href="/teacher/students/add">
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Student
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="classes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Create Live Class</CardTitle>
                <CardDescription>Start a new live class session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-center h-20 bg-muted rounded-md">
                  <Video className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/teacher/classes/create-live">Start Live Class</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Record Video Lecture</CardTitle>
                <CardDescription>Record a new video lecture</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-center h-20 bg-muted rounded-md">
                  <Video className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/teacher/classes/record">Record Lecture</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Schedule Class</CardTitle>
                <CardDescription>Schedule a future class</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-center h-20 bg-muted rounded-md">
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/teacher/classes/schedule">Schedule Class</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>Your scheduled classes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-4">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{cls.subject}</p>
                        <p className="text-sm text-muted-foreground">{cls.topic}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{cls.time}</p>
                      <p className="text-sm text-muted-foreground">{cls.date}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upload Study Material</CardTitle>
                <CardDescription>Share notes, PDFs, and resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-center h-20 bg-muted rounded-md">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/teacher/materials/upload">Upload Material</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Generate Question Paper</CardTitle>
                <CardDescription>Create AI-generated question papers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-center h-20 bg-muted rounded-md">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/teacher/materials/generate-questions">Generate Questions</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Manage Materials</CardTitle>
                <CardDescription>View and organize your materials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-center h-20 bg-muted rounded-md">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/teacher/materials/manage">Manage Materials</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Materials</CardTitle>
              <CardDescription>Recently uploaded study materials</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUploads.map((upload) => (
                  <div
                    key={upload.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-2 rounded-full mr-4">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{upload.name}</p>
                        <p className="text-sm text-muted-foreground">Uploaded {upload.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{upload.downloads} downloads</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fee Management</CardTitle>
              <CardDescription>Track and manage student fees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-5 bg-muted p-3 font-medium">
                  <div>Student</div>
                  <div>Fee Amount</div>
                  <div>Due Date</div>
                  <div>Status</div>
                  <div className="text-right">Actions</div>
                </div>
                {students.map((student) => (
                  <div key={student.id} className="grid grid-cols-5 p-3 border-t items-center">
                    <div>{student.name}</div>
                    <div>₹2,500</div>
                    <div>15 May 2023</div>
                    <div>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                          student.fees === "Paid"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                            : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
                        )}
                      >
                        {student.fees === "Paid" ? (
                          <CheckCircle className="mr-1 h-3 w-3" />
                        ) : (
                          <AlertCircle className="mr-1 h-3 w-3" />
                        )}
                        {student.fees}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      {student.fees === "Due" ? (
                        <Button size="sm">Send Reminder</Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          View Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/teacher/fees/history">View Payment History</Link>
              </Button>
              <Button asChild>
                <Link href="/teacher/fees/settings">Fee Settings</Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Search, Download, QrCode, CheckCircle, XCircle, Clock, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import QRCode from "qrcode.react"

// Sample data
const classes = [
  { id: "class1", name: "Class 10 - Mathematics" },
  { id: "class2", name: "Class 11 - Physics" },
  { id: "class3", name: "Class 12 - Chemistry" },
]

const students = [
  { id: 1, name: "Rahul Sharma", rollNo: "101", present: true },
  { id: 2, name: "Priya Patel", rollNo: "102", present: true },
  { id: 3, name: "Amit Kumar", rollNo: "103", present: false },
  { id: 4, name: "Sneha Gupta", rollNo: "104", present: true },
  { id: 5, name: "Vikram Singh", rollNo: "105", present: false },
  { id: 6, name: "Neha Verma", rollNo: "106", present: true },
  { id: 7, name: "Rajesh Khanna", rollNo: "107", present: true },
  { id: 8, name: "Ananya Desai", rollNo: "108", present: true },
  { id: 9, name: "Karan Malhotra", rollNo: "109", present: false },
  { id: 10, name: "Divya Sharma", rollNo: "110", present: true },
]

export function DigitalAttendance() {
  const [selectedClass, setSelectedClass] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [attendanceData, setAttendanceData] = useState<typeof students>([])
  const [qrCodeValue, setQrCodeValue] = useState("")
  const [qrCodeVisible, setQrCodeVisible] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (selectedClass) {
      // In a real app, this would fetch attendance data for the selected class and date
      setAttendanceData(students)
    } else {
      setAttendanceData([])
    }
  }, [selectedClass, date])

  const handleToggleAttendance = (studentId: number) => {
    setAttendanceData(
      attendanceData.map((student) => (student.id === studentId ? { ...student, present: !student.present } : student)),
    )
  }

  const handleMarkAll = (present: boolean) => {
    setAttendanceData(attendanceData.map((student) => ({ ...student, present })))
  }

  const handleSaveAttendance = () => {
    // In a real app, this would save the attendance data to the database
    toast({
      title: "Attendance saved",
      description: `Attendance for ${selectedClass} on ${format(date, "PPP")} has been saved.`,
    })
  }

  const handleGenerateQRCode = () => {
    // Generate a unique code for this class and date
    const code = `attendance-${selectedClass}-${format(date, "yyyy-MM-dd")}-${Date.now()}`
    setQrCodeValue(code)
    setQrCodeVisible(true)

    toast({
      title: "QR Code generated",
      description: "Students can now scan this QR code to mark their attendance.",
    })
  }

  const filteredStudents = attendanceData.filter(
    (student) => student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.rollNo.includes(searchQuery),
  )

  const presentCount = attendanceData.filter((student) => student.present).length
  const absentCount = attendanceData.length - presentCount
  const attendancePercentage = attendanceData.length > 0 ? Math.round((presentCount / attendanceData.length) * 100) : 0

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Digital Attendance System</h1>
        <p className="text-muted-foreground">Track and manage student attendance with ease</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Management</CardTitle>
          <CardDescription>Mark and track student attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="mark">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mark">Mark Attendance</TabsTrigger>
              <TabsTrigger value="qr">QR Code Attendance</TabsTrigger>
              <TabsTrigger value="reports">Attendance Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="mark" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="class-select">Select Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="class-select">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="date-picker">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button id="date-picker" variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="search">Search Student</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      type="search"
                      placeholder="Search by name or roll no."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {selectedClass ? (
                <>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Total: {attendanceData.length}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          Present: {presentCount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          Absent: {absentCount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
                        <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          Attendance: {attendancePercentage}%
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleMarkAll(true)}>
                        Mark All Present
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleMarkAll(false)}>
                        Mark All Absent
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border mt-4">
                    <div className="grid grid-cols-12 bg-muted p-3 font-medium">
                      <div className="col-span-1">Roll No.</div>
                      <div className="col-span-5">Name</div>
                      <div className="col-span-6 text-right">Attendance</div>
                    </div>
                    <div className="divide-y">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                          <div key={student.id} className="grid grid-cols-12 p-3 items-center">
                            <div className="col-span-1">{student.rollNo}</div>
                            <div className="col-span-5">{student.name}</div>
                            <div className="col-span-6 flex justify-end">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`student-${student.id}`}
                                  checked={student.present}
                                  onCheckedChange={() => handleToggleAttendance(student.id)}
                                />
                                <Label
                                  htmlFor={`student-${student.id}`}
                                  className={cn(
                                    "text-sm font-medium",
                                    student.present
                                      ? "text-green-600 dark:text-green-400"
                                      : "text-red-600 dark:text-red-400",
                                  )}
                                >
                                  {student.present ? "Present" : "Absent"}
                                </Label>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          No students found. Try a different search term.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No class selected</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    Please select a class to view and mark attendance.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="qr" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Generate QR Code</CardTitle>
                    <CardDescription>Create a QR code for students to scan and mark their attendance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="qr-class-select">Select Class</Label>
                      <Select value={selectedClass} onValueChange={setSelectedClass}>
                        <SelectTrigger id="qr-class-select">
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="qr-date-picker">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="qr-date-picker"
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => date && setDate(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <Button className="w-full" onClick={handleGenerateQRCode} disabled={!selectedClass}>
                      <QrCode className="mr-2 h-4 w-4" />
                      Generate QR Code
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>QR Code</CardTitle>
                    <CardDescription>Students can scan this QR code to mark their attendance</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center">
                    {qrCodeVisible ? (
                      <div className="text-center">
                        <div className="bg-white p-4 rounded-md inline-block mb-4">
                          <QRCode value={qrCodeValue} size={200} />
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Valid for: {selectedClass && classes.find((c) => c.id === selectedClass)?.name}
                          <br />
                          Date: {format(date, "PPP")}
                        </p>
                        <Button variant="outline" size="sm" onClick={() => setQrCodeVisible(false)}>
                          Reset
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Select a class and date, then click "Generate QR Code" to create a QR code for attendance.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="report-class-select">Select Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="report-class-select">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="report-date-picker">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="report-date-picker"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-end">
                  <Button className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    View Report
                  </Button>
                </div>
              </div>

              {selectedClass ? (
                <>
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-muted p-2 rounded-md">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Total: {attendanceData.length}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 p-2 rounded-md">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          Present: {presentCount}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-2 rounded-md">
                        <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          Absent: {absentCount}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  </div>

                  <div className="rounded-md border mt-4">
                    <div className="grid grid-cols-12 bg-muted p-3 font-medium">
                      <div className="col-span-1">Roll No.</div>
                      <div className="col-span-5">Name</div>
                      <div className="col-span-3">Status</div>
                      <div className="col-span-3">Time</div>
                    </div>
                    <div className="divide-y">
                      {attendanceData.map((student) => (
                        <div key={student.id} className="grid grid-cols-12 p-3 items-center">
                          <div className="col-span-1">{student.rollNo}</div>
                          <div className="col-span-5">{student.name}</div>
                          <div className="col-span-3">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                                student.present
                                  ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                  : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
                              )}
                            >
                              {student.present ? (
                                <CheckCircle className="mr-1 h-3 w-3" />
                              ) : (
                                <XCircle className="mr-1 h-3 w-3" />
                              )}
                              {student.present ? "Present" : "Absent"}
                            </span>
                          </div>
                          <div className="col-span-3 text-sm text-muted-foreground">
                            {student.present ? "09:15 AM" : "-"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <Users className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No report generated</h3>
                  <p className="text-muted-foreground max-w-md mb-4">
                    Please select a class and date to view attendance reports.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        {selectedClass && (
          <CardFooter className="flex justify-end">
            <Button onClick={handleSaveAttendance}>Save Attendance</Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}


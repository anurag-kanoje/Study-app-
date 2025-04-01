"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  CalendarIcon,
  Search,
  Download,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Send,
  AlertCircle,
  BarChart,
  Printer,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"

// Sample data
const students = [
  {
    id: 1,
    name: "Rahul Sharma",
    rollNo: "101",
    class: "Class 10",
    feeStatus: "Paid",
    amount: 2500,
    dueDate: "2023-05-15",
    paidDate: "2023-05-10",
  },
  {
    id: 2,
    name: "Priya Patel",
    rollNo: "102",
    class: "Class 10",
    feeStatus: "Paid",
    amount: 2500,
    dueDate: "2023-05-15",
    paidDate: "2023-05-12",
  },
  {
    id: 3,
    name: "Amit Kumar",
    rollNo: "103",
    class: "Class 10",
    feeStatus: "Due",
    amount: 2500,
    dueDate: "2023-05-15",
    paidDate: null,
  },
  {
    id: 4,
    name: "Sneha Gupta",
    rollNo: "104",
    class: "Class 11",
    feeStatus: "Paid",
    amount: 3000,
    dueDate: "2023-05-15",
    paidDate: "2023-05-08",
  },
  {
    id: 5,
    name: "Vikram Singh",
    rollNo: "105",
    class: "Class 11",
    feeStatus: "Due",
    amount: 3000,
    dueDate: "2023-05-15",
    paidDate: null,
  },
  {
    id: 6,
    name: "Neha Verma",
    rollNo: "106",
    class: "Class 11",
    feeStatus: "Overdue",
    amount: 3000,
    dueDate: "2023-04-15",
    paidDate: null,
  },
  {
    id: 7,
    name: "Rajesh Khanna",
    rollNo: "107",
    class: "Class 12",
    feeStatus: "Paid",
    amount: 3500,
    dueDate: "2023-05-15",
    paidDate: "2023-05-14",
  },
  {
    id: 8,
    name: "Ananya Desai",
    rollNo: "108",
    class: "Class 12",
    feeStatus: "Paid",
    amount: 3500,
    dueDate: "2023-05-15",
    paidDate: "2023-05-11",
  },
  {
    id: 9,
    name: "Karan Malhotra",
    rollNo: "109",
    class: "Class 12",
    feeStatus: "Due",
    amount: 3500,
    dueDate: "2023-05-15",
    paidDate: null,
  },
  {
    id: 10,
    name: "Divya Sharma",
    rollNo: "110",
    class: "Class 12",
    feeStatus: "Overdue",
    amount: 3500,
    dueDate: "2023-04-15",
    paidDate: null,
  },
]

export function FeeManagement() {
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [date, setDate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null)
  const { toast } = useToast()

  const handleSendReminder = (studentId: number) => {
    toast({
      title: "Reminder sent",
      description: "Fee reminder has been sent to the student and parents.",
    })
  }

  const handleMarkAsPaid = (studentId: number) => {
    toast({
      title: "Payment recorded",
      description: "Fee payment has been recorded successfully.",
    })
  }

  const handleGenerateReceipt = (studentId: number) => {
    toast({
      title: "Receipt generated",
      description: "Fee receipt has been generated and is ready for download.",
    })
  }

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.rollNo.includes(searchQuery)
    const matchesClass = selectedClass ? student.class === selectedClass : true
    return matchesSearch && matchesClass
  })

  const paidCount = filteredStudents.filter((s) => s.feeStatus === "Paid").length
  const dueCount = filteredStudents.filter((s) => s.feeStatus === "Due").length
  const overdueCount = filteredStudents.filter((s) => s.feeStatus === "Overdue").length
  const totalAmount = filteredStudents.reduce((sum, student) => sum + student.amount, 0)
  const collectedAmount = filteredStudents
    .filter((s) => s.feeStatus === "Paid")
    .reduce((sum, student) => sum + student.amount, 0)
  const pendingAmount = totalAmount - collectedAmount

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Fee Management System</h1>
        <p className="text-muted-foreground">Track and manage student fee payments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Management</CardTitle>
          <CardDescription>Track, collect, and manage student fees</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="collect">Collect Fees</TabsTrigger>
              <TabsTrigger value="reminders">Send Reminders</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="class-select">Filter by Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="class-select">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Classes</SelectItem>
                      <SelectItem value="Class 10">Class 10</SelectItem>
                      <SelectItem value="Class 11">Class 11</SelectItem>
                      <SelectItem value="Class 12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="month-picker">Month</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="month-picker"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "MMMM yyyy") : <span>Select month</span>}
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{filteredStudents.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Collected</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{collectedAmount.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">{paidCount} students paid</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{pendingAmount.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">{dueCount + overdueCount} students pending</p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border mt-6">
                <div className="grid grid-cols-12 bg-muted p-3 font-medium">
                  <div className="col-span-1">Roll No.</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2">Class</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <div key={student.id} className="grid grid-cols-12 p-3 items-center">
                        <div className="col-span-1">{student.rollNo}</div>
                        <div className="col-span-3">{student.name}</div>
                        <div className="col-span-2">{student.class}</div>
                        <div className="col-span-2">₹{student.amount.toLocaleString()}</div>
                        <div className="col-span-2">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                              student.feeStatus === "Paid"
                                ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                : student.feeStatus === "Due"
                                  ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                                  : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
                            )}
                          >
                            {student.feeStatus === "Paid" ? (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            ) : student.feeStatus === "Due" ? (
                              <Clock className="mr-1 h-3 w-3" />
                            ) : (
                              <XCircle className="mr-1 h-3 w-3" />
                            )}
                            {student.feeStatus}
                          </span>
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          {student.feeStatus === "Paid" ? (
                            <Button variant="outline" size="sm" onClick={() => handleGenerateReceipt(student.id)}>
                              <Printer className="h-3 w-3 mr-1" /> Receipt
                            </Button>
                          ) : (
                            <>
                              <Button variant="outline" size="sm" onClick={() => handleMarkAsPaid(student.id)}>
                                <CheckCircle className="h-3 w-3 mr-1" /> Mark Paid
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleSendReminder(student.id)}>
                                <Send className="h-3 w-3 mr-1" /> Remind
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      No students found. Try a different search term or class filter.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="collect" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Collect Fee</CardTitle>
                    <CardDescription>Record a new fee payment</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="student-select">Select Student</Label>
                      <Select
                        value={selectedStudent?.toString() || ""}
                        onValueChange={(value) => setSelectedStudent(Number.parseInt(value))}
                      >
                        <SelectTrigger id="student-select">
                          <SelectValue placeholder="Select student" />
                        </SelectTrigger>
                        <SelectContent>
                          {students.map((student) => (
                            <SelectItem key={student.id} value={student.id.toString()}>
                              {student.name} ({student.rollNo})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedStudent && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="fee-amount">Fee Amount</Label>
                            <Input
                              id="fee-amount"
                              type="number"
                              defaultValue={students.find((s) => s.id === selectedStudent)?.amount.toString()}
                            />
                          </div>
                          <div>
                            <Label htmlFor="payment-date">Payment Date</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  id="payment-date"
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
                        </div>

                        <div>
                          <Label htmlFor="payment-method">Payment Method</Label>
                          <Select defaultValue="cash_payment">
                            <SelectTrigger id="payment-method">
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash_payment">Cash</SelectItem>
                              <SelectItem value="upi">UPI</SelectItem>
                              <SelectItem value="bank">Bank Transfer</SelectItem>
                              <SelectItem value="cheque">Cheque</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="transaction-id">Transaction ID (Optional)</Label>
                          <Input id="transaction-id" placeholder="Enter transaction ID or reference number" />
                        </div>

                        <div>
                          <Label htmlFor="remarks">Remarks (Optional)</Label>
                          <Input id="remarks" placeholder="Add any additional notes" />
                        </div>
                      </>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full"
                      disabled={!selectedStudent}
                      onClick={() => {
                        if (selectedStudent) {
                          handleMarkAsPaid(selectedStudent)
                          setSelectedStudent(null)
                        }
                      }}
                    >
                      Record Payment
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Instructions</CardTitle>
                    <CardDescription>Share payment details with parents</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="font-semibold mb-2">Bank Transfer Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3">
                          <span className="text-muted-foreground">Account Name:</span>
                          <span className="col-span-2 font-medium">ABC School Trust</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="text-muted-foreground">Account Number:</span>
                          <span className="col-span-2 font-medium">1234567890</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="text-muted-foreground">IFSC Code:</span>
                          <span className="col-span-2 font-medium">ABCD0001234</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="text-muted-foreground">Bank:</span>
                          <span className="col-span-2 font-medium">State Bank of India</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="text-muted-foreground">Branch:</span>
                          <span className="col-span-2 font-medium">Main Branch, New Delhi</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <h4 className="font-semibold mb-2">UPI Payment</h4>
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-3">
                          <span className="text-muted-foreground">UPI ID:</span>
                          <span className="col-span-2 font-medium">abcschool@sbi</span>
                        </div>
                        <div className="grid grid-cols-3">
                          <span className="text-muted-foreground">QR Code:</span>
                          <span className="col-span-2">
                            <Button variant="outline" size="sm">
                              <Download className="mr-2 h-3 w-3" /> Download QR Code
                            </Button>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <h4 className="font-semibold mb-2">Important Notes</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        <li>Please mention student name and roll number in the payment reference</li>
                        <li>Keep the payment receipt/screenshot for future reference</li>
                        <li>Late fee of ₹100 will be charged after the due date</li>
                        <li>For any payment-related queries, contact the accounts department</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      <Send className="mr-2 h-4 w-4" /> Share Payment Instructions
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reminders" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="reminder-class-select">Filter by Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="reminder-class-select">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Classes</SelectItem>
                      <SelectItem value="Class 10">Class 10</SelectItem>
                      <SelectItem value="Class 11">Class 11</SelectItem>
                      <SelectItem value="Class 12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reminder-status">Filter by Status</Label>
                  <Select defaultValue="unpaid">
                    <SelectTrigger id="reminder-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unpaid_overdue">Unpaid (Due + Overdue)</SelectItem>
                      <SelectItem value="due">Due Only</SelectItem>
                      <SelectItem value="overdue">Overdue Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reminder-search">Search Student</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="reminder-search"
                      type="search"
                      placeholder="Search by name or roll no."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div>
                  <h3 className="text-lg font-semibold">Students with Pending Fees</h3>
                  <p className="text-sm text-muted-foreground">{dueCount + overdueCount} students have pending fees</p>
                </div>
                <Button
                  onClick={() => {
                    toast({
                      title: "Bulk reminders sent",
                      description: "Fee reminders have been sent to all students with pending fees.",
                    })
                  }}
                >
                  <Send className="mr-2 h-4 w-4" /> Send Bulk Reminders
                </Button>
              </div>

              <div className="rounded-md border mt-4">
                <div className="grid grid-cols-12 bg-muted p-3 font-medium">
                  <div className="col-span-1">Roll No.</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2">Class</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Due Date</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {filteredStudents
                    .filter((s) => s.feeStatus === "Due" || s.feeStatus === "Overdue")
                    .map((student) => (
                      <div key={student.id} className="grid grid-cols-12 p-3 items-center">
                        <div className="col-span-1">{student.rollNo}</div>
                        <div className="col-span-3">{student.name}</div>
                        <div className="col-span-2">{student.class}</div>
                        <div className="col-span-2">₹{student.amount.toLocaleString()}</div>
                        <div className="col-span-2">
                          <span
                            className={cn(
                              "inline-flex items-center",
                              student.feeStatus === "Overdue" ? "text-red-600 dark:text-red-400" : "",
                            )}
                          >
                            {format(new Date(student.dueDate), "dd MMM yyyy")}
                          </span>
                        </div>
                        <div className="col-span-2 flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleSendReminder(student.id)}>
                            <Send className="h-3 w-3 mr-1" /> Send Reminder
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleMarkAsPaid(student.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" /> Mark Paid
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="report-class-select">Filter by Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="report-class-select">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Classes</SelectItem>
                      <SelectItem value="Class 10">Class 10</SelectItem>
                      <SelectItem value="Class 11">Class 11</SelectItem>
                      <SelectItem value="Class 12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="report-month">Select Month</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="report-month"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "MMMM yyyy") : <span>Select month</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select defaultValue="fee_collection">
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fee_collection">Fee Collection</SelectItem>
                      <SelectItem value="pending">Pending Fees</SelectItem>
                      <SelectItem value="defaulters">Defaulters List</SelectItem>
                      <SelectItem value="summary">Monthly Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div>
                  <h3 className="text-lg font-semibold">Fee Collection Report</h3>
                  <p className="text-sm text-muted-foreground">{format(date, "MMMM yyyy")}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Printer className="mr-2 h-4 w-4" /> Print Report
                  </Button>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Collection</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{collectedAmount.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">{paidCount} payments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">₹{pendingAmount.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">{dueCount + overdueCount} students</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Math.round((collectedAmount / totalAmount) * 100)}%</div>
                    <p className="text-xs text-muted-foreground">Target: 95%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Defaulters</CardTitle>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{overdueCount}</div>
                    <p className="text-xs text-muted-foreground">Overdue payments</p>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-md border mt-4">
                <div className="grid grid-cols-12 bg-muted p-3 font-medium">
                  <div className="col-span-1">Roll No.</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-2">Class</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Payment Date</div>
                </div>
                <div className="divide-y">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="grid grid-cols-12 p-3 items-center">
                      <div className="col-span-1">{student.rollNo}</div>
                      <div className="col-span-3">{student.name}</div>
                      <div className="col-span-2">{student.class}</div>
                      <div className="col-span-2">₹{student.amount.toLocaleString()}</div>
                      <div className="col-span-2">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                            student.feeStatus === "Paid"
                              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              : student.feeStatus === "Due"
                                ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400",
                          )}
                        >
                          {student.feeStatus === "Paid" ? (
                            <CheckCircle className="mr-1 h-3 w-3" />
                          ) : student.feeStatus === "Due" ? (
                            <Clock className="mr-1 h-3 w-3" />
                          ) : (
                            <XCircle className="mr-1 h-3 w-3" />
                          )}
                          {student.feeStatus}
                        </span>
                      </div>
                      <div className="col-span-2">
                        {student.paidDate ? format(new Date(student.paidDate), "dd MMM yyyy") : "-"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


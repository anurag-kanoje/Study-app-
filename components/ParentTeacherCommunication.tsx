"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Phone, Video, Calendar, Clock, Users, MessageSquare } from "lucide-react"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

// Sample data
const parents = [
  {
    id: 1,
    name: "Rajesh Sharma",
    studentName: "Rahul Sharma",
    class: "Class 10",
    unread: 2,
    lastMessage: "Thank you for the update on Rahul's progress.",
    lastMessageTime: "2023-05-10T14:30:00",
  },
  {
    id: 2,
    name: "Meena Patel",
    studentName: "Priya Patel",
    class: "Class 10",
    unread: 0,
    lastMessage: "I'll make sure she completes the assignment by tomorrow.",
    lastMessageTime: "2023-05-09T10:15:00",
  },
  {
    id: 3,
    name: "Suresh Kumar",
    studentName: "Amit Kumar",
    class: "Class 10",
    unread: 5,
    lastMessage: "Can we schedule a meeting to discuss Amit's performance?",
    lastMessageTime: "2023-05-11T09:45:00",
  },
  {
    id: 4,
    name: "Anita Gupta",
    studentName: "Sneha Gupta",
    class: "Class 11",
    unread: 0,
    lastMessage: "Sneha will be absent tomorrow due to a doctor's appointment.",
    lastMessageTime: "2023-05-08T16:20:00",
  },
  {
    id: 5,
    name: "Vikram Singh",
    studentName: "Vikram Singh Jr.",
    class: "Class 11",
    unread: 1,
    lastMessage: "I'm concerned about his recent test scores.",
    lastMessageTime: "2023-05-10T11:05:00",
  },
]

const messages = [
  {
    id: 1,
    sender: "parent",
    text: "Hello, I wanted to check on Amit's progress in Mathematics. He seems to be struggling with the recent topics.",
    time: "2023-05-11T09:30:00",
  },
  {
    id: 2,
    sender: "teacher",
    text: "Hello Mr. Kumar, thank you for reaching out. Yes, I've noticed that Amit is having some difficulty with calculus concepts. I've been providing extra attention during class.",
    time: "2023-05-11T09:35:00",
  },
  {
    id: 3,
    sender: "parent",
    text: "Is there anything we can do at home to help him improve?",
    time: "2023-05-11T09:38:00",
  },
  {
    id: 4,
    sender: "teacher",
    text: "I would recommend spending 30 minutes daily on the practice problems I've assigned. Also, there are some excellent video tutorials on the topic that might help him understand better.",
    time: "2023-05-11T09:40:00",
  },
  {
    id: 5,
    sender: "parent",
    text: "Thank you for the suggestion. We'll definitely implement this at home.",
    time: "2023-05-11T09:42:00",
  },
  {
    id: 6,
    sender: "parent",
    text: "Can we schedule a meeting to discuss his progress in more detail?",
    time: "2023-05-11T09:45:00",
  },
]

export function ParentTeacherCommunication() {
  const [selectedParent, setSelectedParent] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("messages")
  const { toast } = useToast()

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    toast({
      title: "Message sent",
      description: "Your message has been sent successfully.",
    })

    setNewMessage("")
  }

  const handleScheduleMeeting = () => {
    toast({
      title: "Meeting scheduled",
      description: "The meeting has been scheduled and notification sent to the parent.",
    })
  }

  const handleSendReport = () => {
    toast({
      title: "Report sent",
      description: "The progress report has been sent to the parent.",
    })
  }

  const filteredParents = parents.filter(
    (parent) =>
      parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      parent.studentName.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const selectedParentData = parents.find((parent) => parent.id === selectedParent)

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Parent-Teacher Communication</h1>
        <p className="text-muted-foreground">Connect with parents to discuss student progress and concerns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Parents</CardTitle>
            <CardDescription>Select a parent to start communication</CardDescription>
            <div className="mt-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search parents or students..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px]">
              {filteredParents.length > 0 ? (
                <div className="divide-y">
                  {filteredParents.map((parent) => (
                    <div
                      key={parent.id}
                      className={cn(
                        "flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors",
                        selectedParent === parent.id && "bg-muted",
                      )}
                      onClick={() => setSelectedParent(parent.id)}
                    >
                      <Avatar>
                        <AvatarFallback>{parent.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{parent.name}</p>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(parent.lastMessageTime), "h:mm a")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {parent.studentName} ({parent.class})
                        </p>
                        <p className="text-xs truncate">{parent.lastMessage}</p>
                      </div>
                      {parent.unread > 0 && (
                        <Badge variant="default" className="rounded-full px-2">
                          {parent.unread}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <Users className="h-10 w-10 text-muted-foreground mb-4" />
                  <p className="font-medium mb-1">No parents found</p>
                  <p className="text-sm text-muted-foreground">Try a different search term</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          {selectedParent ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{selectedParentData?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedParentData?.name}</CardTitle>
                      <CardDescription>
                        Parent of {selectedParentData?.studentName} ({selectedParentData?.class})
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Phone className="h-4 w-4" />
                      <span className="sr-only">Call</span>
                    </Button>
                    <Button variant="outline" size="icon">
                      <Video className="h-4 w-4" />
                      <span className="sr-only">Video Call</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="messages" onValueChange={setActiveTab}>
                  <TabsList className="w-full rounded-none border-b">
                    <TabsTrigger value="messages" className="flex-1">
                      Messages
                    </TabsTrigger>
                    <TabsTrigger value="meetings" className="flex-1">
                      Meetings
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="flex-1">
                      Reports
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="messages" className="m-0">
                    <ScrollArea className="h-[350px] p-4">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={cn("flex", message.sender === "teacher" ? "justify-end" : "justify-start")}
                          >
                            <div
                              className={cn(
                                "max-w-[80%] rounded-lg px-4 py-2",
                                message.sender === "teacher" ? "bg-primary text-primary-foreground" : "bg-muted",
                              )}
                            >
                              <p>{message.text}</p>
                              <p
                                className={cn(
                                  "text-xs mt-1",
                                  message.sender === "teacher" ? "text-primary-foreground/70" : "text-muted-foreground",
                                )}
                              >
                                {format(new Date(message.time), "h:mm a")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Textarea
                          placeholder="Type your message..."
                          className="min-h-[80px]"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <Button className="shrink-0" onClick={handleSendMessage}>
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Send</span>
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="meetings" className="m-0 p-4 space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Schedule a Meeting</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="meeting-date">Date</Label>
                          <Input id="meeting-date" type="date" min={format(new Date(), "yyyy-MM-dd")} />
                        </div>
                        <div>
                          <Label htmlFor="meeting-time">Time</Label>
                          <Input id="meeting-time" type="time" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="meeting-type">Meeting Type</Label>
                        <Select defaultValue="in-person">
                          <SelectTrigger id="meeting-type">
                            <SelectValue placeholder="Select meeting type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in-person">In-Person</SelectItem>
                            <SelectItem value="video">Video Call</SelectItem>
                            <SelectItem value="phone">Phone Call</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="meeting-agenda">Agenda</Label>
                        <Textarea
                          id="meeting-agenda"
                          placeholder="Briefly describe the purpose of the meeting..."
                          className="min-h-[100px]"
                        />
                      </div>
                      <Button className="w-full" onClick={handleScheduleMeeting}>
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Meeting
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-4">Upcoming Meetings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Parent-Teacher Conference</p>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-4 w-4" />
                              <span>May 15, 2023</span>
                              <Clock className="ml-2 mr-1 h-4 w-4" />
                              <span>4:00 PM</span>
                            </div>
                          </div>
                          <Badge>In-Person</Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reports" className="m-0 p-4 space-y-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Send Progress Report</h3>
                      <div>
                        <Label htmlFor="report-type">Report Type</Label>
                        <Select defaultValue="academic">
                          <SelectTrigger id="report-type">
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="academic">Academic Progress</SelectItem>
                            <SelectItem value="behavior">Behavior Report</SelectItem>
                            <SelectItem value="attendance">Attendance Report</SelectItem>
                            <SelectItem value="custom">Custom Report</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="report-period">Time Period</Label>
                        <Select defaultValue="month">
                          <SelectTrigger id="report-period">
                            <SelectValue placeholder="Select time period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="week">Last Week</SelectItem>
                            <SelectItem value="month">Last Month</SelectItem>
                            <SelectItem value="quarter">Last Quarter</SelectItem>
                            <SelectItem value="custom">Custom Period</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="report-comments">Additional Comments</Label>
                        <Textarea
                          id="report-comments"
                          placeholder="Add any specific observations or recommendations..."
                          className="min-h-[100px]"
                        />
                      </div>
                      <Button className="w-full" onClick={handleSendReport}>
                        <Send className="mr-2 h-4 w-4" />
                        Send Report
                      </Button>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-4">Recent Reports</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Monthly Academic Progress</p>
                            <p className="text-sm text-muted-foreground">Sent on May 1, 2023</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <p className="font-medium">Quarterly Assessment Report</p>
                            <p className="text-sm text-muted-foreground">Sent on April 5, 2023</p>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No conversation selected</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                Select a parent from the list to start a conversation, schedule a meeting, or send a progress report.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}


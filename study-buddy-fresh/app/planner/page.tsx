"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/Card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Button } from "@/app/components/ui/Button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Badge } from "@/app/components/ui/badge"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Progress } from "@/app/components/ui/progress"
import { CalendarIcon, Clock, Plus, MoreHorizontal, Bell, BookOpen, Trash2, Edit, BarChart } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Calendar } from "@/app/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover"
import { format } from "date-fns"

// Task card component
function TaskCard({
  title,
  subject,
  dueDate,
  priority,
  isCompleted,
  onToggleComplete,
}: {
  title: string
  subject: string
  dueDate: string
  priority: "high" | "medium" | "low"
  isCompleted: boolean
  onToggleComplete: () => void
}) {
  const priorityColors = {
    high: "text-red-500",
    medium: "text-amber-500",
    low: "text-green-500",
  }

  return (
    <Card className={cn("transition-all", isCompleted ? "opacity-60" : "hover:shadow-md")}>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <Checkbox checked={isCompleted} onCheckedChange={onToggleComplete} className="mt-1" />
            <div>
              <CardTitle
                className={cn("text-base transition-all", isCompleted && "line-through text-muted-foreground")}
              >
                {title}
              </CardTitle>
              <CardDescription className="mt-1">{subject}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Set Reminder
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="mr-1 h-4 w-4" />
          <span>{dueDate}</span>
        </div>
        <Badge variant="outline" className={priorityColors[priority]}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
      </CardFooter>
    </Card>
  )
}

// Study session card component
function StudySessionCard({
  subject,
  topic,
  duration,
  startTime,
  progress = 0,
}: {
  subject: string
  topic: string
  duration: string
  startTime: string
  progress?: number
}) {
  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{subject}</CardTitle>
            <CardDescription className="mt-1">{topic}</CardDescription>
          </div>
          <Badge>{duration}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">{startTime}</span>
          <span className="font-medium">{progress}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm">
          <Bell className="mr-2 h-4 w-4" />
          Remind
        </Button>
        <Button size="sm">
          <BookOpen className="mr-2 h-4 w-4" />
          Start Studying
        </Button>
      </CardFooter>
    </Card>
  )
}

// Study habit card component
function StudyHabitCard({
  title,
  description,
  streak,
  lastCompleted,
}: {
  title: string
  description: string
  streak: number
  lastCompleted: string
}) {
  return (
    <Card>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">
              {streak} day streak
            </Badge>
            <span className="text-xs text-muted-foreground">Last: {lastCompleted}</span>
          </div>
          <Checkbox />
        </div>
      </CardContent>
    </Card>
  )
}

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState("today")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false)
  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Complete Physics Assignment",
      subject: "Physics",
      dueDate: "Today, 6:00 PM",
      priority: "high" as const,
      isCompleted: false,
    },
    {
      id: "2",
      title: "Read Chapter 5 of History Textbook",
      subject: "History",
      dueDate: "Today, 8:00 PM",
      priority: "medium" as const,
      isCompleted: false,
    },
    {
      id: "3",
      title: "Prepare Notes for Biology Class",
      subject: "Biology",
      dueDate: "Tomorrow, 9:00 AM",
      priority: "medium" as const,
      isCompleted: true,
    },
    {
      id: "4",
      title: "Practice Math Problems",
      subject: "Mathematics",
      dueDate: "Tomorrow, 2:00 PM",
      priority: "low" as const,
      isCompleted: false,
    },
    {
      id: "5",
      title: "Write English Essay Draft",
      subject: "English",
      dueDate: "Mar 25, 11:59 PM",
      priority: "high" as const,
      isCompleted: false,
    },
  ])

  const studySessions = [
    {
      id: "1",
      subject: "Mathematics",
      topic: "Calculus: Derivatives",
      duration: "1h 30m",
      startTime: "Today, 3:00 PM",
      progress: 0,
    },
    {
      id: "2",
      subject: "Computer Science",
      topic: "Data Structures: Trees",
      duration: "2h",
      startTime: "Today, 5:00 PM",
      progress: 0,
    },
    {
      id: "3",
      subject: "Physics",
      topic: "Electromagnetism",
      duration: "1h",
      startTime: "Tomorrow, 10:00 AM",
      progress: 0,
    },
  ]

  const studyHabits = [
    {
      id: "1",
      title: "Morning Review",
      description: "Review notes for 15 minutes every morning",
      streak: 5,
      lastCompleted: "Today, 8:15 AM",
    },
    {
      id: "2",
      title: "Spaced Repetition",
      description: "Practice flashcards for 20 minutes",
      streak: 12,
      lastCompleted: "Today, 1:30 PM",
    },
    {
      id: "3",
      title: "Evening Summary",
      description: "Summarize what you learned today",
      streak: 8,
      lastCompleted: "Yesterday, 9:45 PM",
    },
  ]

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Study Planner</h1>
        <p className="text-muted-foreground">Organize your tasks, schedule study sessions, and track your habits.</p>
      </div>

      <Tabs defaultValue="today" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="habits">Habits</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-dashed">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>

            <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription>Create a new task for your study plan.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input id="task-title" placeholder="Enter task title" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="task-subject">Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="task-date">Due Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            <span>Pick a date</span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="task-priority">Priority</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddTaskOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddTaskOpen(false)}>Add Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <TabsContent value="today" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Tasks</h2>
              <Button variant="outline" size="sm">
                <BarChart className="mr-2 h-4 w-4" />
                Task Analytics
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {tasks
                  .filter((task) => task.dueDate.includes("Today"))
                  .map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <TaskCard
                        title={task.title}
                        subject={task.subject}
                        dueDate={task.dueDate}
                        priority={task.priority}
                        isCompleted={task.isCompleted}
                        onToggleComplete={() => toggleTaskComplete(task.id)}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Study Sessions</h2>
              <Button variant="outline" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Session
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {studySessions
                  .filter((session) => session.startTime.includes("Today"))
                  .map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <StudySessionCard
                        subject={session.subject}
                        topic={session.topic}
                        duration={session.duration}
                        startTime={session.startTime}
                        progress={session.progress}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Upcoming Tasks</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {tasks
                  .filter((task) => !task.dueDate.includes("Today"))
                  .map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <TaskCard
                        title={task.title}
                        subject={task.subject}
                        dueDate={task.dueDate}
                        priority={task.priority}
                        isCompleted={task.isCompleted}
                        onToggleComplete={() => toggleTaskComplete(task.id)}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Upcoming Study Sessions</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {studySessions
                  .filter((session) => !session.startTime.includes("Today"))
                  .map((session, index) => (
                    <motion.div
                      key={session.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <StudySessionCard
                        subject={session.subject}
                        topic={session.topic}
                        duration={session.duration}
                        startTime={session.startTime}
                        progress={session.progress}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="habits" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Study Habits</h2>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Habit
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {studyHabits.map((habit, index) => (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <StudyHabitCard
                    title={habit.title}
                    description={habit.description}
                    streak={habit.streak}
                    lastCompleted={habit.lastCompleted}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Habit Statistics</CardTitle>
              <CardDescription>Track your consistency and progress over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <BarChart className="h-16 w-16 text-muted-foreground" />
              <p className="ml-4 text-muted-foreground">Habit statistics chart will appear here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


import { Card, CardContent } from "./ui/card"
import { Progress } from "./ui/progress"
import { Camera, Brain, Trophy } from "lucide-react"

const subjects = [
  { name: "Math", color: "blue", progress: 65 },
  { name: "Science", color: "green", progress: 80 },
  { name: "History", color: "yellow", progress: 45 },
  { name: "Literature", color: "purple", progress: 70 },
]

export function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold mb-4 font-poppins">Your Subjects</h2>
        <div className="grid grid-cols-2 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject.name}
              className={`border-l-4 border-${subject.color}-500 hover:shadow-lg transition-shadow duration-300 float`}
            >
              <CardContent className="p-4">
                <h3 className="text-lg font-semibold mb-2 font-poppins">{subject.name}</h3>
                <Progress value={subject.progress} className="mb-2" />
                <p className="text-sm font-open-sans">{subject.progress}% Mastered</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4 font-poppins">AI Study Buddy</h2>
        <Card className="p-4">
          <img src="/placeholder.svg?height=100&width=100" alt="AI Buddy" className="w-24 h-24 mx-auto mb-4 float" />
          <p className="text-center font-open-sans">Time for a 5-min quiz!</p>
        </Card>
      </div>
      <div className="md:col-span-3">
        <h2 className="text-2xl font-bold mb-4 font-poppins">Quick Actions</h2>
        <div className="flex justify-around">
          <div className="text-center">
            <Camera size={48} className="mx-auto mb-2 bounce" />
            <p className="font-open-sans">Scan Notes</p>
          </div>
          <div className="text-center">
            <Brain size={48} className="mx-auto mb-2 bounce" />
            <p className="font-open-sans">Daily Quiz</p>
          </div>
          <div className="text-center">
            <Trophy size={48} className="mx-auto mb-2 bounce" />
            <p className="font-open-sans">My Rewards</p>
          </div>
        </div>
      </div>
    </div>
  )
}


'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Progress } from '@/app/components/ui/progress';
import { Calendar } from '@/app/components/ui/calendar';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useToast } from '@/app/components/ui/use-toast';

interface StudyTopic {
  id: string;
  name: string;
  progress: number;
  estimatedHours: number;
  completedHours: number;
}

interface StudyPlan {
  id: string;
  examName: string;
  examDate: Date;
  topics: StudyTopic[];
  totalProgress: number;
}

export default function ExamPrepPage() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([
    {
      id: '1',
      examName: 'Mathematics Final',
      examDate: new Date('2024-05-15'),
      topics: [
        {
          id: '1',
          name: 'Calculus',
          progress: 60,
          estimatedHours: 20,
          completedHours: 12,
        },
        {
          id: '2',
          name: 'Linear Algebra',
          progress: 30,
          estimatedHours: 15,
          completedHours: 4.5,
        },
      ],
      totalProgress: 45,
    },
  ]);

  const handleCreatePlan = () => {
    // TODO: Implement plan creation
    toast({
      title: 'Study Plan Created',
      description: 'Your personalized study plan has been generated.',
    });
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Exam Preparation</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Study Plan</CardTitle>
            <CardDescription>
              Generate a personalized study plan for your upcoming exam
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exam-name">Exam Name</Label>
                <Input id="exam-name" placeholder="Enter exam name" />
              </div>
              <div className="space-y-2">
                <Label>Exam Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              <Button onClick={handleCreatePlan} className="w-full">
                Generate Plan
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Study Plans</CardTitle>
            <CardDescription>Track your exam preparation progress</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {studyPlans.map((plan) => (
                  <Card key={plan.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{plan.examName}</CardTitle>
                        <Badge variant="secondary">
                          {new Date(plan.examDate).toLocaleDateString()}
                        </Badge>
                      </div>
                      <CardDescription>
                        Overall Progress: {plan.totalProgress}%
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Progress value={plan.totalProgress} className="h-2" />
                        <div className="space-y-2">
                          {plan.topics.map((topic) => (
                            <div key={topic.id} className="space-y-1">
                              <div className="flex items-center justify-between">
                                <Label>{topic.name}</Label>
                                <span className="text-sm text-muted-foreground">
                                  {topic.completedHours}/{topic.estimatedHours} hours
                                </span>
                              </div>
                              <Progress value={topic.progress} className="h-1" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Study Recommendations</CardTitle>
          <CardDescription>
            AI-powered suggestions to optimize your study schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Focus Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <Badge variant="destructive">High Priority</Badge>
                      <span>Complete Linear Algebra exercises</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Badge variant="warning">Medium Priority</Badge>
                      <span>Review Calculus formulas</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Study Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li>• Take regular breaks every 45 minutes</li>
                    <li>• Practice with mock tests</li>
                    <li>• Review notes before bedtime</li>
                    <li>• Join study groups for difficult topics</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 

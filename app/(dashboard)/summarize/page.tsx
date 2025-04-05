'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Textarea } from '@/app/components/ui/textarea';
import { Progress } from '@/app/components/ui/progress';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { useToast } from '@/app/components/ui/use-toast';

interface Summary {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'text';
  timestamp: Date;
}

export default function SummarizePage() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summaries, setSummaries] = useState<Summary[]>([
    {
      id: '1',
      title: 'Introduction to Calculus',
      content: 'Key points:\n1. Limits and continuity\n2. Derivatives and their applications\n3. Integration techniques',
      type: 'video',
      timestamp: new Date(),
    },
  ]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    // TODO: Implement actual video processing
    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
      toast({
        title: 'Video Processed',
        description: 'Your video has been successfully summarized.',
      });
    }, 5000);
  };

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 20;
      });
    }, 500);

    // TODO: Implement actual text processing
    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
      toast({
        title: 'Text Processed',
        description: 'Your text has been successfully summarized.',
      });
    }, 2500);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Content Summarization</h1>

      <Tabs defaultValue="video" className="space-y-4">
        <TabsList>
          <TabsTrigger value="video">Video Summarization</TabsTrigger>
          <TabsTrigger value="text">Text Summarization</TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Video</CardTitle>
              <CardDescription>
                Upload a video to generate a summary of its content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="video">Video File</Label>
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                  />
                </div>
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Processing</Label>
                      <span className="text-sm text-muted-foreground">
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Text Summarization</CardTitle>
              <CardDescription>
                Paste your text to generate a summary
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTextSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text">Text Content</Label>
                  <Textarea
                    id="text"
                    placeholder="Paste your text here..."
                    className="min-h-[200px]"
                  />
                </div>
                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Processing</Label>
                      <span className="text-sm text-muted-foreground">
                        {progress}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
                <Button type="submit" disabled={isProcessing}>
                  Generate Summary
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Summaries</CardTitle>
          <CardDescription>View your previously generated summaries</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {summaries.map((summary) => (
                <Card key={summary.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{summary.title}</CardTitle>
                      <Badge variant="secondary">
                        {summary.type === 'video' ? 'Video' : 'Text'}
                      </Badge>
                    </div>
                    <CardDescription>
                      {summary.timestamp.toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="whitespace-pre-wrap">{summary.content}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
} 

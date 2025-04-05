"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { Label } from "@/app/components/ui/label"
import { Badge } from "@/app/components/ui/badge"
import {
  Upload,
  ImageIcon,
  FileText,
  Sparkles,
  Copy,
  Download,
  Share2,
  Loader2,
  BookOpen,
  ListTodo,
  Network,
  Pencil,
} from "lucide-react"
// Animation now uses CSS instead of framer-motion
import { cn } from "@/lib/utils"

// Note card component
function NoteCard({
  title,
  preview,
  date,
  tags = [],
  onSelect,
}: {
  title: string
  preview: string
  date: string
  tags?: string[]
  onSelect: () => void
}) {
  return (
    <Card className="cursor-pointer transition-all hover:shadow-md" onClick={onSelect}>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-xs">{date}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">{preview}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  )
}

// File upload area component
function FileUploadArea({
  isProcessing,
  onUpload,
}: {
  isProcessing: boolean
  onUpload: (files: FileList | null) => void
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
        <Upload className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-medium">Upload your notes</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-xs">
        Drag and drop your handwritten notes or images, or click to browse files
      </p>
      <div className="mt-4 flex flex-col items-center gap-2">
        <Input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*,.pdf"
          multiple
          onChange={(e) => onUpload(e.target.files)}
          disabled={isProcessing}
        />
        <Label
          htmlFor="file-upload"
          className={cn(
            "inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
            isProcessing && "opacity-50 cursor-not-allowed",
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ImageIcon className="mr-2 h-4 w-4" />
              Select Files
            </>
          )}
        </Label>
        <p className="text-xs text-muted-foreground">Supports: JPG, PNG, PDF (max 10MB)</p>
      </div>
    </div>
  )
}

// Output format option component
function OutputFormatOption({
  icon,
  title,
  description,
  isSelected,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  description: string
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <div
      className={cn(
        "flex cursor-pointer items-start space-x-3 rounded-lg border p-3 transition-all",
        isSelected ? "border-primary bg-primary/5" : "hover:border-primary/50",
      )}
      onClick={onClick}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">{icon}</div>
      <div className="space-y-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export default function AINotesPage() {
  const [activeTab, setActiveTab] = useState("upload")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState("notes")
  const [selectedNote, setSelectedNote] = useState<string | null>(null)

  const sampleNotes = [
    {
      id: "1",
      title: "Quantum Physics Lecture",
      preview: "Notes on quantum entanglement and wave-particle duality from today's lecture...",
      date: "Today, 2:30 PM",
      tags: ["Physics", "Quantum", "Lecture"],
      content:
        '# Quantum Physics Lecture Notes\n\n## Wave-Particle Duality\n- Light exhibits properties of both waves and particles\n- De Broglie wavelength: λ = h/p\n- Demonstrated by double-slit experiment\n\n## Quantum Entanglement\n- Particles become correlated, sharing quantum states\n- Einstein called it "spooky action at a distance"\n- Violates local realism\n\n## Heisenberg Uncertainty Principle\n- Cannot simultaneously know position and momentum precisely\n- ΔxΔp ≥ ħ/2\n- Fundamental limit, not measurement problem',
    },
    {
      id: "2",
      title: "Organic Chemistry Mechanisms",
      preview: "Summary of nucleophilic substitution and elimination reactions with examples...",
      date: "Yesterday, 10:15 AM",
      tags: ["Chemistry", "Organic", "Mechanisms"],
      content:
        "# Organic Chemistry Mechanisms\n\n## Nucleophilic Substitution\n\n### SN1 Mechanism\n1. Leaving group departs, forming carbocation\n2. Nucleophile attacks carbocation\n3. Favored by tertiary substrates\n\n### SN2 Mechanism\n1. Nucleophile attacks from back side\n2. Simultaneous departure of leaving group\n3. Inversion of stereochemistry\n4. Favored by primary and secondary substrates\n\n## Elimination Reactions\n\n### E1 Mechanism\n1. Leaving group departs, forming carbocation\n2. Proton abstraction from adjacent carbon\n3. Formation of double bond\n\n### E2 Mechanism\n1. Simultaneous proton abstraction and leaving group departure\n2. Anti-periplanar arrangement required\n3. Stereospecific",
    },
    {
      id: "3",
      title: "Data Structures: Trees & Graphs",
      preview: "Implementation details and complexity analysis of various tree and graph algorithms...",
      date: "Mar 22, 2023",
      tags: ["CS", "Algorithms", "Data Structures"],
      content:
        "# Trees & Graphs\n\n## Binary Trees\n- Each node has at most 2 children\n- Operations:\n  - Insertion: O(log n) average, O(n) worst\n  - Deletion: O(log n) average, O(n) worst\n  - Search: O(log n) average, O(n) worst\n\n## Binary Search Trees (BST)\n- Left child < parent < right child\n- In-order traversal gives sorted sequence\n- Balancing techniques:\n  - AVL Trees\n  - Red-Black Trees\n  - B-Trees\n\n## Graph Representations\n1. Adjacency Matrix\n   - O(V²) space complexity\n   - O(1) edge lookup\n   - O(V²) to iterate all edges\n\n2. Adjacency List\n   - O(V+E) space complexity\n   - O(degree) edge lookup\n   - O(V+E) to iterate all edges\n\n## Graph Algorithms\n- BFS: O(V+E), uses queue, finds shortest path in unweighted graph\n- DFS: O(V+E), uses stack/recursion, useful for topological sort\n- Dijkstra: O(E log V) with binary heap, finds shortest path in weighted graph\n- Bellman-Ford: O(VE), handles negative weights\n- Floyd-Warshall: O(V³), all-pairs shortest paths",
    },
  ]

  const outputFormats = [
    {
      id: "notes",
      icon: <FileText className="h-5 w-5 text-primary" />,
      title: "Structured Notes",
      description: "Convert to well-organized, formatted notes with headings and bullet points",
    },
    {
      id: "summary",
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      title: "Summary",
      description: "Generate a concise summary of the key points and concepts",
    },
    {
      id: "flashcards",
      icon: <ListTodo className="h-5 w-5 text-primary" />,
      title: "Flashcards",
      description: "Create question and answer pairs for effective studying",
    },
    {
      id: "mindmap",
      icon: <Network className="h-5 w-5 text-primary" />,
      title: "Mind Map",
      description: "Visualize concepts and their relationships in a hierarchical structure",
    },
  ]

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return

    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
      setActiveTab("preview")
    }, 2000)
  }

  const handleNoteSelect = (noteId: string) => {
    setSelectedNote(noteId)
    setActiveTab("preview")
  }

  const getSelectedNoteContent = () => {
    const note = sampleNotes.find((note) => note.id === selectedNote)
    return note ? note.content : ""
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Notes</h1>
        <p className="text-muted-foreground">
          Convert handwritten notes to digital text, generate summaries, flashcards, and more.
        </p>
      </div>

      <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="preview">Preview & Edit</TabsTrigger>
          <TabsTrigger value="library">My Library</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <FileUploadArea isProcessing={isProcessing} onUpload={handleFileUpload} />

          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-medium">Choose Output Format</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {outputFormats.map((format) => (
                <OutputFormatOption
                  key={format.id}
                  icon={format.icon}
                  title={format.title}
                  description={format.description}
                  isSelected={selectedFormat === format.id}
                  onClick={() => setSelectedFormat(format.id)}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>
                  {selectedNote ? sampleNotes.find((note) => note.id === selectedNote)?.title : "Extracted Text"}
                </CardTitle>
                <CardDescription>
                  {selectedNote
                    ? sampleNotes.find((note) => note.id === selectedNote)?.date
                    : "Preview and edit before saving"}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                className="min-h-[300px] font-mono text-sm"
                placeholder="Your extracted text will appear here..."
                value={getSelectedNoteContent()}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Enhance
                </Button>
              </div>
              <Button>Save to Library</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-sm">
              <Input type="search" placeholder="Search notes..." className="pl-8" />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              New Upload
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sampleNotes.map((note, index) => (
                <div
                  key={note.id}
                  className="opacity-0 translate-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 fill-mode-forwards"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <NoteCard
                    title={note.title}
                    preview={note.preview}
                    date={note.date}
                    tags={note.tags}
                    onSelect={() => handleNoteSelect(note.id)}
                  />
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}


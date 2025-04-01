"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  FileText,
  Upload,
  Download,
  Search,
  Eye,
  Trash2,
  ImageIcon,
  Video,
  File,
  CheckCircle,
  Loader2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

// Sample data
const materials = [
  {
    id: 1,
    title: "Mathematics Notes - Calculus",
    type: "pdf",
    size: "2.4 MB",
    subject: "Mathematics",
    class: "Class 12",
    downloads: 45,
    createdAt: "2023-04-15",
    isOfflineAvailable: true,
  },
  {
    id: 2,
    title: "Physics Formula Sheet",
    type: "pdf",
    size: "1.2 MB",
    subject: "Physics",
    class: "Class 12",
    downloads: 32,
    createdAt: "2023-04-18",
    isOfflineAvailable: true,
  },
  {
    id: 3,
    title: "Chemistry Organic Reactions",
    type: "pdf",
    size: "3.5 MB",
    subject: "Chemistry",
    class: "Class 12",
    downloads: 28,
    createdAt: "2023-04-20",
    isOfflineAvailable: false,
  },
  {
    id: 4,
    title: "Biology Diagrams Collection",
    type: "image",
    size: "5.8 MB",
    subject: "Biology",
    class: "Class 11",
    downloads: 19,
    createdAt: "2023-04-22",
    isOfflineAvailable: true,
  },
  {
    id: 5,
    title: "History Timeline - Modern India",
    type: "pdf",
    size: "1.8 MB",
    subject: "History",
    class: "Class 10",
    downloads: 23,
    createdAt: "2023-04-25",
    isOfflineAvailable: false,
  },
  {
    id: 6,
    title: "English Grammar Rules",
    type: "pdf",
    size: "1.1 MB",
    subject: "English",
    class: "Class 10",
    downloads: 41,
    createdAt: "2023-04-28",
    isOfflineAvailable: true,
  },
  {
    id: 7,
    title: "Computer Science - Python Basics",
    type: "video",
    size: "45.2 MB",
    subject: "Computer Science",
    class: "Class 11",
    downloads: 37,
    createdAt: "2023-05-02",
    isOfflineAvailable: false,
  },
  {
    id: 8,
    title: "Geography - Map Practice",
    type: "image",
    size: "8.3 MB",
    subject: "Geography",
    class: "Class 10",
    downloads: 15,
    createdAt: "2023-05-05",
    isOfflineAvailable: true,
  },
]

export function StudyMaterialManager() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedMaterial, setSelectedMaterial] = useState<number | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isConverting, setIsConverting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate file upload with progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          toast({
            title: "Upload complete",
            description: "Your study material has been uploaded successfully.",
          })
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleImageToText = async () => {
    setIsConverting(true)

    // Simulate OCR processing
    setTimeout(() => {
      setIsConverting(false)
      toast({
        title: "Conversion complete",
        description: "Your handwritten notes have been converted to text successfully.",
      })
    }, 3000)
  }

  const handleMakeAvailableOffline = (id: number) => {
    toast({
      title: "Material available offline",
      description: "This material is now available for offline access.",
    })
  }

  const handleDelete = (id: number) => {
    toast({
      title: "Material deleted",
      description: "The study material has been deleted successfully.",
    })
  }

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject ? material.subject === selectedSubject : true
    const matchesClass = selectedClass ? material.class === selectedClass : true
    return matchesSearch && matchesSubject && matchesClass
  })

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-500" />
      case "image":
        return <ImageIcon className="h-8 w-8 text-blue-500" />
      case "video":
        return <Video className="h-8 w-8 text-purple-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Study Material Manager</h1>
        <p className="text-muted-foreground">Upload, organize, and share study materials with your students</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Study Materials</CardTitle>
          <CardDescription>Manage all your teaching resources in one place</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="browse">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="browse">Browse Materials</TabsTrigger>
              <TabsTrigger value="upload">Upload Materials</TabsTrigger>
              <TabsTrigger value="convert">Convert Handwritten Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="browse" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label htmlFor="subject-select">Filter by Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger id="subject-select">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Geography">Geography</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="class-select">Filter by Class</Label>
                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger id="class-select">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="Class 10">Class 10</SelectItem>
                      <SelectItem value="Class 11">Class 11</SelectItem>
                      <SelectItem value="Class 12">Class 12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="search">Search Materials</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      type="search"
                      placeholder="Search by title..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {filteredMaterials.length > 0 ? (
                  filteredMaterials.map((material) => (
                    <Card key={material.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-base">
                          {getFileIcon(material.type)}
                          <span className="ml-2 truncate">{material.title}</span>
                        </CardTitle>
                        <CardDescription>
                          {material.subject} | {material.class}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Size: {material.size}</span>
                          <span>{material.downloads} downloads</span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t bg-muted/50 p-2">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <a href="#" onClick={(e) => e.preventDefault()}>
                              <Eye className="mr-2 h-4 w-4" /> Preview
                            </a>
                          </Button>
                          <Button variant="ghost" size="sm" asChild>
                            <a href="#" onClick={(e) => e.preventDefault()}>
                              <Download className="mr-2 h-4 w-4" /> Download
                            </a>
                          </Button>
                        </div>
                        <div className="flex gap-1">
                          {!material.isOfflineAvailable && (
                            <Button variant="ghost" size="sm" onClick={() => handleMakeAvailableOffline(material.id)}>
                              <CheckCircle className="mr-2 h-4 w-4" /> Make Available Offline
                            </Button>
                          )}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Are you sure?</DialogTitle>
                                <DialogDescription>
                                  This will permanently delete the study material. This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline">Cancel</Button>
                                <Button variant="destructive" onClick={() => handleDelete(material.id)}>
                                  Delete
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-primary/10 p-3 mb-4">
                      <FileText className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No materials found</h3>
                    <p className="text-muted-foreground max-w-md mb-4">
                      {searchQuery || selectedSubject || selectedClass
                        ? "No materials match your search criteria. Try different filters."
                        : "You haven't uploaded any study materials yet. Upload your first material to get started."}
                    </p>
                    {!(searchQuery || selectedSubject || selectedClass) && (
                      <Button asChild>
                        <a href="#upload">
                          <Upload className="mr-2 h-4 w-4" /> Upload Material
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="upload" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Study Material</CardTitle>
                    <CardDescription>Upload PDFs, documents, images, or videos for your students</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="material-title">Title</Label>
                      <Input id="material-title" placeholder="Enter a title for your material" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="material-subject">Subject</Label>
                        <Select>
                          <SelectTrigger id="material-subject">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Physics">Physics</SelectItem>
                            <SelectItem value="Chemistry">Chemistry</SelectItem>
                            <SelectItem value="Biology">Biology</SelectItem>
                            <SelectItem value="History">History</SelectItem>
                            <SelectItem value="Geography">Geography</SelectItem>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="material-class">Class</Label>
                        <Select>
                          <SelectTrigger id="material-class">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Class 10">Class 10</SelectItem>
                            <SelectItem value="Class 11">Class 11</SelectItem>
                            <SelectItem value="Class 12">Class 12</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="material-description">Description (Optional)</Label>
                      <Textarea
                        id="material-description"
                        placeholder="Add a brief description of this material"
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="material-file">Upload File</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="material-file"
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          onChange={handleFileUpload}
                        />
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-24 flex flex-col items-center justify-center border-dashed"
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-6 w-6 animate-spin mb-2" />
                              <span>Uploading... {uploadProgress}%</span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-6 w-6 mb-2" />
                              <span>Click to select file</span>
                              <span className="text-xs text-muted-foreground">
                                PDF, DOCX, PPT, JPG, PNG, MP4 (Max 100MB)
                              </span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {isUploading && <Progress value={uploadProgress} className="h-2" />}

                    <div className="flex items-center space-x-2">
                      <Switch id="offline-available" />
                      <Label htmlFor="offline-available">Make available for offline access</Label>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" disabled={isUploading}>
                      {isUploading ? "Uploading..." : "Upload Material"}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bulk Upload</CardTitle>
                    <CardDescription>Upload multiple files at once for faster content creation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="bulk-subject">Subject</Label>
                        <Select>
                          <SelectTrigger id="bulk-subject">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Physics">Physics</SelectItem>
                            <SelectItem value="Chemistry">Chemistry</SelectItem>
                            <SelectItem value="Biology">Biology</SelectItem>
                            <SelectItem value="History">History</SelectItem>
                            <SelectItem value="Geography">Geography</SelectItem>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="bulk-class">Class</Label>
                        <Select>
                          <SelectTrigger id="bulk-class">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Class 10">Class 10</SelectItem>
                            <SelectItem value="Class 11">Class 11</SelectItem>
                            <SelectItem value="Class 12">Class 12</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="bulk-files">Upload Multiple Files</Label>
                      <div className="flex items-center gap-2">
                        <Input id="bulk-files" type="file" multiple className="hidden" />
                        <Button
                          variant="outline"
                          onClick={() => document.getElementById("bulk-files")?.click()}
                          className="w-full h-32 flex flex-col items-center justify-center border-dashed"
                        >
                          <Upload className="h-8 w-8 mb-2" />
                          <span>Drag and drop files here</span>
                          <span>or click to select files</span>
                          <span className="text-xs text-muted-foreground mt-2">
                            You can select multiple files at once
                          </span>
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="bulk-offline-available" />
                      <Label htmlFor="bulk-offline-available">Make all files available for offline access</Label>
                    </div>

                    <div className="rounded-md border p-4 bg-muted/50">
                      <h4 className="font-semibold mb-2">Bulk Upload Tips</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>File names will be used as material titles</li>
                        <li>All files will be assigned to the selected subject and class</li>
                        <li>You can edit individual materials after upload</li>
                        <li>Maximum 10 files can be uploaded at once</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Upload Multiple Files</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="convert" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Convert Handwritten Notes</CardTitle>
                    <CardDescription>Use AI to convert handwritten notes to digital text</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="image-title">Title</Label>
                      <Input id="image-title" placeholder="Enter a title for your notes" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="image-subject">Subject</Label>
                        <Select>
                          <SelectTrigger id="image-subject">
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Mathematics">Mathematics</SelectItem>
                            <SelectItem value="Physics">Physics</SelectItem>
                            <SelectItem value="Chemistry">Chemistry</SelectItem>
                            <SelectItem value="Biology">Biology</SelectItem>
                            <SelectItem value="History">History</SelectItem>
                            <SelectItem value="Geography">Geography</SelectItem>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Computer Science">Computer Science</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="image-class">Class</Label>
                        <Select>
                          <SelectTrigger id="image-class">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Class 10">Class 10</SelectItem>
                            <SelectItem value="Class 11">Class 11</SelectItem>
                            <SelectItem value="Class 12">Class 12</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="handwritten-image">Upload Image</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="handwritten-image"
                          type="file"
                          accept="image/*"
                          ref={imageInputRef}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          onClick={() => imageInputRef.current?.click()}
                          className="w-full h-32 flex flex-col items-center justify-center border-dashed"
                          disabled={isConverting}
                        >
                          {isConverting ? (
                            <>
                              <Loader2 className="h-8 w-8 animate-spin mb-2" />
                              <span>Converting to text...</span>
                              <span className="text-xs text-muted-foreground">This may take a few moments</span>
                            </>
                          ) : (
                            <>
                              <ImageIcon className="h-8 w-8 mb-2" />
                              <span>Upload image of handwritten notes</span>
                              <span className="text-xs text-muted-foreground">JPG, PNG, or GIF (Max 10MB)</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-md border p-4 bg-muted/50">
                      <h4 className="font-semibold mb-2">Tips for Best Results</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Ensure good lighting and clear contrast</li>
                        <li>Write legibly with dark ink on light background</li>
                        <li>Avoid shadows and glare on the paper</li>
                        <li>Keep the image focused and avoid blurriness</li>
                        <li>Crop the image to include only the text</li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" disabled={isConverting} onClick={handleImageToText}>
                      {isConverting ? "Converting..." : "Convert to Text"}
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Converted Text</CardTitle>
                    <CardDescription>Review and edit the extracted text before saving</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Converted text will appear here..."
                      className="min-h-[300px] font-mono text-sm"
                    />

                    <div className="flex items-center space-x-2">
                      <Switch id="save-both" defaultChecked />
                      <Label htmlFor="save-both">Save both image and text</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="make-searchable" defaultChecked />
                      <Label htmlFor="make-searchable">Make text searchable</Label>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Reset</Button>
                    <Button>Save Converted Text</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}


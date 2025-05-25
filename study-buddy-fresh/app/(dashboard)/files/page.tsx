"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import type { FileObject } from "@/lib/supabase"
import { Button } from "@/app/components/ui/Button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/Card"
import { useToast } from "@/app/components/ui/use-toast"
import { Upload, File, Image, FileText, FileIcon as FilePdf, FileArchive, Download, Trash2, Eye } from "lucide-react"
import { formatBytes } from "@/lib/utils"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog"

export default function FilesPage() {
  const { user } = useAuth()
  const [files, setFiles] = useState<FileObject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewFile, setPreviewFile] = useState<FileObject | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    fetchFiles()
  }, [user])

  const fetchFiles = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.storage.from("uploads").list(user.id, {
        sortBy: { column: "created_at", order: "desc" },
      })

      if (error) throw error

      // Transform the data to include URLs
      const filesWithUrls = await Promise.all(
        (data || []).map(async (file) => {
          const {
            data: { publicUrl },
          } = supabase.storage.from("uploads").getPublicUrl(`${user.id}/${file.name}`)

          return {
            id: file.id,
            name: file.name,
            size: file.metadata.size,
            created_at: file.created_at,
            url: publicUrl,
            type: file.metadata.mimetype || "application/octet-stream",
          } as FileObject
        }),
      )

      setFiles(filesWithUrls)
    } catch (error) {
      console.error("Error fetching files:", error)
      toast({
        variant: "destructive",
        title: "Error fetching files",
        description: "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile || !user) return

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const filePath = `${user.id}/${selectedFile.name}`

      const { error } = await supabase.storage.from("uploads").upload(filePath, selectedFile, {
        cacheControl: "3600",
        upsert: true,
        onUploadProgress: (progress) => {
          const percent = Math.round((progress.loaded / progress.total) * 100)
          setUploadProgress(percent)
        },
      })

      if (error) throw error

      toast({
        title: "File uploaded",
        description: "Your file has been uploaded successfully.",
      })

      // Refresh the file list
      fetchFiles()
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        variant: "destructive",
        title: "Error uploading file",
        description: "Please try again later.",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const deleteFile = async (file: FileObject) => {
    if (!user) return

    try {
      const { error } = await supabase.storage.from("uploads").remove([`${user.id}/${file.name}`])

      if (error) throw error

      setFiles(files.filter((f) => f.id !== file.id))

      toast({
        title: "File deleted",
        description: "Your file has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting file:", error)
      toast({
        variant: "destructive",
        title: "Error deleting file",
        description: "Please try again later.",
      })
    }
  }

  const getFileIcon = (file: FileObject) => {
    if (file.type.startsWith("image/")) {
      return <Image className="h-8 w-8 text-blue-500" />
    } else if (file.type === "application/pdf") {
      return <FilePdf className="h-8 w-8 text-red-500" />
    } else if (file.type.startsWith("text/")) {
      return <FileText className="h-8 w-8 text-green-500" />
    } else if (file.type.includes("zip") || file.type.includes("compressed")) {
      return <FileArchive className="h-8 w-8 text-yellow-500" />
    } else {
      return <File className="h-8 w-8 text-gray-500" />
    }
  }

  const isPreviewable = (file: FileObject) => {
    return (
      file.type.startsWith("image/") ||
      file.type === "application/pdf" ||
      file.type.startsWith("text/") ||
      file.type.startsWith("video/")
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Files</h1>
        <div>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            {isUploading ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" /> Upload File
              </>
            )}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-muted rounded animate-pulse mb-2"></div>
                <div className="h-4 w-2/3 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : files.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <Card key={file.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-base">
                  {getFileIcon(file)}
                  <span className="ml-2 truncate">{file.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="text-sm text-muted-foreground">
                  <p>Size: {formatBytes(file.size)}</p>
                  <p>Uploaded: {format(new Date(file.created_at), "MMM d, yyyy")}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/50 p-2">
                <div className="flex gap-1">
                  {isPreviewable(file) && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setPreviewFile(file)}>
                          <Eye className="mr-2 h-4 w-4" /> Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center">
                            {getFileIcon(file)}
                            <span className="ml-2">{file.name}</span>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 max-h-[70vh] overflow-auto">
                          {file.type.startsWith("image/") ? (
                            <img
                              src={file.url || "/placeholder.svg"}
                              alt={file.name}
                              className="max-w-full h-auto rounded-md"
                            />
                          ) : file.type === "application/pdf" ? (
                            <iframe src={file.url} className="w-full h-[70vh] rounded-md" title={file.name} />
                          ) : file.type.startsWith("video/") ? (
                            <video src={file.url} controls className="w-full rounded-md" />
                          ) : (
                            <div className="p-4 bg-muted rounded-md">
                              <p>Preview not available for this file type.</p>
                              <Button asChild className="mt-2">
                                <a href={file.url} target="_blank" rel="noopener noreferrer">
                                  <Download className="mr-2 h-4 w-4" /> Download to view
                                </a>
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}

                  <Button variant="ghost" size="sm" asChild>
                    <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </a>
                  </Button>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your file.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteFile(file)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <Upload className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No files uploaded yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Upload your first file to get started. You can upload documents, images, and more.
          </p>
          <Button onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" /> Upload File
          </Button>
        </div>
      )}
    </div>
  )
}


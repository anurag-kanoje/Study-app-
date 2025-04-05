"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import type { Note } from "@/lib/supabase"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { FileText, Plus, Search, Trash2, Edit, Calendar } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/app/components/ui/use-toast"
import { format } from "date-fns"
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

export default function NotesPage() {
  const { user } = useAuth()
  const [notes, setNotes] = useState<Note[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    async function fetchNotes() {
      try {
        const { data, error } = await supabase
          .from("notes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error
        setNotes(data || [])
      } catch (error) {
        console.error("Error fetching notes:", error)
        toast({
          variant: "destructive",
          title: "Error fetching notes",
          description: "Please try again later.",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotes()
  }, [user, toast])

  const deleteNote = async (id: number) => {
    try {
      const { error } = await supabase.from("notes").delete().eq("id", id)

      if (error) throw error

      setNotes(notes.filter((note) => note.id !== id))

      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      })

      // Send notification via OneSignal
      if (typeof window !== "undefined" && window.OneSignal) {
        window.OneSignal.sendSelfNotification(
          "Note Deleted",
          "Your note has been deleted successfully.",
          `${window.location.origin}/notes`,
          "/favicon.ico",
          { noteId: id },
        )
      }
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        variant: "destructive",
        title: "Error deleting note",
        description: "Please try again later.",
      })
    }
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Notes</h1>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search notes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button asChild>
            <Link href="/notes/new">
              <Plus className="mr-2 h-4 w-4" /> New Note
            </Link>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredNotes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <Card key={note.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="truncate">{note.title || "Untitled Note"}</CardTitle>
                <CardDescription className="flex items-center text-xs">
                  <Calendar className="mr-1 h-3 w-3" />
                  {format(new Date(note.created_at), "MMM d, yyyy")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/50 p-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/notes/${note.id}`}>
                    <FileText className="mr-2 h-4 w-4" /> View
                  </Link>
                </Button>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/notes/${note.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
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
                          This action cannot be undone. This will permanently delete your note.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deleteNote(note.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <FileText className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No notes found</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            {searchQuery
              ? `No notes matching "${searchQuery}". Try a different search term.`
              : "You haven't created any notes yet. Create your first note to get started."}
          </p>
          {!searchQuery && (
            <Button asChild>
              <Link href="/notes/new">
                <Plus className="mr-2 h-4 w-4" /> Create your first note
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  )
}


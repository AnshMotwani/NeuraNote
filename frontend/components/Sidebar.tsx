'use client'

import { useState, useEffect } from 'react'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { Plus, Search, Folder, FileText, X } from 'lucide-react'
import { api } from '@/lib/api'
import { toast } from 'react-hot-toast'

interface Note {
  id: number
  title: string
  content?: string
  created_at: string
  updated_at?: string
  tags: any[]
}

interface SidebarProps {
  selectedNote: Note | null
  onNoteSelect: (note: Note) => void
  onClose?: () => void
}

export default function Sidebar({ selectedNote, onNoteSelect, onClose }: SidebarProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showNewNoteForm, setShowNewNoteForm] = useState(false)
  const [newNoteTitle, setNewNoteTitle] = useState('')

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes/')
      setNotes(response.data)
    } catch (error) {
      toast.error('Failed to fetch notes')
    } finally {
      setIsLoading(false)
    }
  }

  const createNote = async () => {
    if (!newNoteTitle.trim()) return

    try {
      const response = await api.post('/notes/', {
        title: newNoteTitle,
        content: '',
      })
      
      const newNote = response.data
      setNotes([newNote, ...notes])
      onNoteSelect(newNote)
      setNewNoteTitle('')
      setShowNewNoteForm(false)
      toast.success('Note created successfully!')
    } catch (error) {
      toast.error('Failed to create note')
    }
  }

  const searchNotes = async () => {
    if (!searchQuery.trim()) {
      fetchNotes()
      return
    }

    try {
      const response = await api.get(`/notes/search/?q=${encodeURIComponent(searchQuery)}`)
      setNotes(response.data)
    } catch (error) {
      toast.error('Search failed')
    }
  }

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-full flex flex-col bg-card border-r">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Notes</CardTitle>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchNotes()}
          />
          <Button variant="outline" size="icon" onClick={searchNotes}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-0">
        <div className="p-4">
          <Button
            onClick={() => setShowNewNoteForm(true)}
            className="w-full mb-4"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>

          {showNewNoteForm && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <Input
                  placeholder="Note title..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') createNote()
                    if (e.key === 'Escape') setShowNewNoteForm(false)
                  }}
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={createNote}>
                    Create
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowNewNoteForm(false)}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notes found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedNote?.id === note.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => onNoteSelect(note)}
                >
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{note.title}</p>
                      <p className="text-xs opacity-70 truncate">
                        {new Date(note.updated_at || note.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </div>
  )
} 
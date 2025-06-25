'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Highlight from '@tiptap/extension-highlight'
import CodeBlock from '@tiptap/extension-code-block'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card'
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link as LinkIcon,
  Save,
  FileText
} from 'lucide-react'
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

interface NoteEditorProps {
  note: Note | null
  onNoteUpdate: (note: Note) => void
}

export default function NoteEditor({ note, onNoteUpdate }: NoteEditorProps) {
  const [title, setTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
      Highlight,
      CodeBlock,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      // Auto-save functionality could be added here
    },
  })

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      editor?.commands.setContent(note.content || '')
    } else {
      setTitle('')
      editor?.commands.setContent('')
    }
  }, [note, editor])

  const saveNote = async () => {
    if (!note) return

    setIsSaving(true)
    try {
      const response = await api.put(`/notes/${note.id}`, {
        title,
        content: editor?.getHTML() || '',
      })
      
      onNoteUpdate(response.data)
      toast.success('Note saved successfully!')
    } catch (error) {
      toast.error('Failed to save note')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleBold = () => editor?.chain().focus().toggleBold().run()
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run()
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run()
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run()
  const toggleBlockquote = () => editor?.chain().focus().toggleBlockquote().run()
  const toggleCodeBlock = () => editor?.chain().focus().toggleCodeBlock().run()
  const setLink = () => {
    const url = window.prompt('Enter URL')
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run()
    }
  }

  if (!note) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">Select a note to start editing</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="text-xl font-semibold border-none shadow-none focus-visible:ring-0"
          />
          <Button onClick={saveNote} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </CardHeader>

      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-2 flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBold}
            className={editor?.isActive('bold') ? 'bg-muted' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleItalic}
            className={editor?.isActive('italic') ? 'bg-muted' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBulletList}
            className={editor?.isActive('bulletList') ? 'bg-muted' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleOrderedList}
            className={editor?.isActive('orderedList') ? 'bg-muted' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBlockquote}
            className={editor?.isActive('blockquote') ? 'bg-muted' : ''}
          >
            <Quote className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCodeBlock}
            className={editor?.isActive('codeBlock') ? 'bg-muted' : ''}
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={editor?.isActive('link') ? 'bg-muted' : ''}
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-y-auto">
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    </div>
  )
} 
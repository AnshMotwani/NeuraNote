'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth'
import Sidebar from './Sidebar'
import NoteEditor from './NoteEditor'
import GraphView from './GraphView'
import { Button } from './ui/Button'
import { LogOut, Menu, X } from 'lucide-react'

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const [selectedNote, setSelectedNote] = useState<any>(null)
  const [view, setView] = useState<'editor' | 'graph'>('editor')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="h-screen flex bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-card border-r">
            <Sidebar
              selectedNote={selectedNote}
              onNoteSelect={setSelectedNote}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={`hidden lg:block ${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300`}>
        <Sidebar
          selectedNote={selectedNote}
          onNoteSelect={setSelectedNote}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-xl font-semibold">NeuraNote</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <Button
                variant={view === 'editor' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('editor')}
              >
                Editor
              </Button>
              <Button
                variant={view === 'graph' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setView('graph')}
              >
                Graph
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.username}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-hidden">
          {view === 'editor' ? (
            <NoteEditor
              note={selectedNote}
              onNoteUpdate={(updatedNote) => setSelectedNote(updatedNote)}
            />
          ) : (
            <GraphView />
          )}
        </main>
      </div>
    </div>
  )
} 
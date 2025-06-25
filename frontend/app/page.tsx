'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import Dashboard from '@/components/Dashboard'
import LoginForm from '@/components/LoginForm'

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on mount
    if (!isLoading && !isAuthenticated) {
      // User is not authenticated, stay on login page
    }
  }, [isAuthenticated, isLoading])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return <Dashboard />
} 
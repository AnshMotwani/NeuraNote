'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { useAuthStore } from '@/store/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

interface LoginFormData {
  email: string
  password: string
}

interface RegisterFormData {
  email: string
  username: string
  password: string
  fullName: string
}

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { login, register } = useAuthStore()
  
  const loginForm = useForm<LoginFormData>()
  const registerForm = useForm<RegisterFormData>()

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Logged in successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const onRegister = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      await register(data.email, data.username, data.password, data.fullName)
      toast.success('Account created successfully!')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">NeuraNote</CardTitle>
          <CardDescription>
            Your intelligent note-taking companion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...loginForm.register('email', { required: true })}
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...loginForm.register('password', { required: true })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    {...registerForm.register('email', { required: true })}
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Username"
                    {...registerForm.register('username', { required: true })}
                  />
                </div>
                <div>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    {...registerForm.register('fullName', { required: true })}
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    {...registerForm.register('password', { required: true, minLength: 6 })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 
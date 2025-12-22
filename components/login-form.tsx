"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, School, Users, GraduationCap, Handshake } from "lucide-react"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const success = await login(username, password)

    if (!success) {
      setError("Invalid username or password")
    }
    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div 
        className="relative h-[50vh] lg:h-[45vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('/hero-bg.jpg')`
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Looma Education</h1>
          <h2 className="text-xl md:text-3xl font-light mb-4">Education for All in Nepal</h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            Dashboard for managing and monitoring Looma devices across schools
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Impact</h3>
            <div className="w-16 h-1 bg-blue-600 mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <School className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">70</p>
              <p className="text-sm text-gray-600 font-medium">Schools</p>
              <p className="text-xs text-gray-500 mt-1">Using Looma Boxes</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-100 flex items-center justify-center">
                <svg className="h-8 w-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-3xl font-bold text-gray-900">300</p>
              <p className="text-sm text-gray-600 font-medium">Computer Labs</p>
              <p className="text-xs text-gray-500 mt-1">With Looma Servers</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">350</p>
              <p className="text-sm text-gray-600 font-medium">Teachers</p>
              <p className="text-xs text-gray-500 mt-1">Trained on Looma</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <Handshake className="h-8 w-8 text-amber-600" />
              </div>
              <p className="text-3xl font-bold text-gray-900">14</p>
              <p className="text-sm text-gray-600 font-medium">Partnerships</p>
              <p className="text-xs text-gray-500 mt-1">Major Organizations</p>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="border shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard Login</h2>
                  <p className="text-gray-600 mt-1">Sign in to manage schools</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                      className="h-11"
                      autoComplete="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="h-11"
                      autoComplete="current-password"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-6 text-center">
        <p className="text-sm">Looma Education - Bringing quality education to Nepal</p>
        <p className="text-xs text-gray-400 mt-1">Tax ID: 84-3424916 | Menlo Park, CA, USA</p>
      </footer>
    </div>
  )
}

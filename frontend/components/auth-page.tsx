"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./button"
import { Input } from "./input"
import { Card, CardContent } from "./card"

type AuthMode = "login" | "signup"

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<AuthMode>("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const apiBase = process.env.NEXT_PUBLIC_API_URL ;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup"
      const url = `${apiBase}${endpoint}`

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          ...(mode === "signup" && { confirmPassword }),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Authentication failed")
        return
      }

      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      router.push("/dashboard")
    } catch (err) {
      console.log(err);
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-3 0h.01m-3 4h.01m-3 0h.01"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">TaskFlow</h1>
          <p className="text-muted-foreground">Organize your tasks, master your day</p>
        </div>

        <Card>
          <CardContent className="py-8">

            <div className="flex gap-2 mb-8 bg-muted p-1 rounded-lg">
              <button
                onClick={() => {
                  setMode("login")
                  setError("")
                }}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                  mode === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode("signup")
                  setError("")
                }}
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                  mode === "signup"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Sign Up
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {mode === "signup" && (
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}

              <Button type="submit" variant="primary" size="lg" className="w-full mt-6" isLoading={isLoading}>
                {mode === "login" ? "Sign In" : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-primary hover:underline font-medium"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  )
}

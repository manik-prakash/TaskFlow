"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AuthPage from "@/components/auth-page"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setIsAuthenticated(true)
      router.push("/dashboard")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary" />
      </div>
    )
  }

  return <AuthPage />
}

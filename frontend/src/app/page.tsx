"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/main-layout"
import { LoginForm } from "@/components/login-form"

export default function SocialApp() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121016] flex items-center justify-center">
        <div className="animate-pulse text-purple-600 text-xl">Loading nokoSocial...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return <MainLayout />
}


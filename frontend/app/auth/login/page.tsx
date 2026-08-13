"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ShieldCheck, 
  Github, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { nhostSignIn, nhostSignUp, nhostSignInWithGithub } from "@/services/nhostAuthService"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem("github_token") || localStorage.getItem("github_connected")
    if (token) {
      router.push("/dashboard")
    } else {
      window.location.href = "http://localhost:8000/api/auth/github/login"
    }
  }, [router])

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-300">Redirecting to GitHub OAuth login...</p>
      </div>
    </div>
  )
}

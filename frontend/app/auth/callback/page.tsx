"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    const error = searchParams.get("error")

    if (token) {
      // Save token to localStorage
      localStorage.setItem("github_token", token)
      // Redirect to repositories dashboard page
      router.push("/dashboard/repositories")
    } else if (error) {
      console.error("GitHub OAuth Error:", error)
      // Redirect back to dashboard home or show error (for simplicity, go to dashboard home with error)
      router.push(`/dashboard?error=${encodeURIComponent(error)}`)
    } else {
      // Fallback redirect if neither token nor error is present
      router.push("/dashboard")
    }
  }, [router, searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Loading Spinner */}
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">Completing GitHub connection...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <p className="text-sm font-semibold text-slate-600">Loading auth details...</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  )
}

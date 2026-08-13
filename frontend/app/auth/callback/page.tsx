"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get("token")
      const error = searchParams.get("error")

      if (token) {
        // Save GitHub access token
        localStorage.setItem("github_token", token)
        localStorage.setItem("github_connected", "true")

        try {
          // Fetch real GitHub profile info
          const res = await fetch(`http://localhost:8000/api/auth/github/user?token=${token}`)
          if (res.ok) {
            const userData = await res.json()
            localStorage.setItem("github_connected_user", JSON.stringify(userData))
          }
        } catch (e) {
          console.warn("Notice: could not fetch profile info during callback", e)
        }

        // Notify app components of updated GitHub state
        window.dispatchEvent(new Event("impact_iq_teams_updated"))
        window.dispatchEvent(new Event("storage"))

        // Redirect to connected repositories page
        router.push("/dashboard/repositories")
      } else if (error) {
        console.error("GitHub OAuth Error:", error)
        router.push(`/dashboard?error=${encodeURIComponent(error)}`)
      } else {
        router.push("/dashboard")
      }
    }

    handleAuth()
  }, [router, searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-700">Fetching GitHub profile & repositories...</p>
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

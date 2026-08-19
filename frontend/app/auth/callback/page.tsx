"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { githubTokenService } from "@/services/githubTokenService"

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get("token")
      const refreshToken = searchParams.get("refresh_token") || ""
      const expiresIn = parseInt(searchParams.get("expires_in") || "900", 10)
      const error = searchParams.get("error")

      if (token) {
        // Save access token, refresh token, and timestamp
        githubTokenService.saveTokens(token, refreshToken, expiresIn)

        try {
          // Fetch real GitHub profile info
          const res = await fetch(`http://localhost:8000/api/auth/github/user?token=${token}`)
          if (res.ok) {
            const userData = await res.json()
            localStorage.setItem("github_connected_user", JSON.stringify(userData))
            localStorage.setItem("impact_iq_user", JSON.stringify({
              name: userData.name || userData.login,
              email: userData.email || `${userData.login}@github.com`,
              avatar: userData.avatar_url,
              role: "Owner & Lead",
              isGuest: false
            }))
          }
        } catch (e) {
          console.warn("Notice: could not fetch profile info during callback", e)
        }

        // Notify app components of updated GitHub state
        window.dispatchEvent(new Event("impact_iq_user_updated"))
        window.dispatchEvent(new Event("impact_iq_teams_updated"))
        window.dispatchEvent(new Event("storage"))

        // Redirect back to landing page so the user sees their account on the landing page
        router.push("/")
      } else if (error) {
        console.error("GitHub OAuth Error:", error)
        router.push(`/?error=${encodeURIComponent(error)}`)
      } else {
        router.push("/")
      }
    }

    handleAuth()
  }, [router, searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#030712] text-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold text-slate-300">Authenticating GitHub account...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#030712] text-white">
        <p className="text-sm font-semibold text-slate-400">Loading auth details...</p>
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  )
}

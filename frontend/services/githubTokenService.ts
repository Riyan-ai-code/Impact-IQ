/**
 * GitHub Token Management & Auto-Refresh Service
 * Manages GitHub Access Tokens (15 min lifespan) and Refresh Tokens.
 * Automatically refreshes tokens after 14 minutes so user sessions stay active.
 */

export const githubTokenService = {
  saveTokens: (accessToken: string, refreshToken?: string, expiresInSeconds: number = 900) => {
    if (typeof window === "undefined") return
    localStorage.setItem("github_token", accessToken)
    localStorage.setItem("github_connected", "true")
    localStorage.setItem("github_token_issued_at", Date.now().toString())
    localStorage.setItem("github_token_expires_in", expiresInSeconds.toString())

    if (refreshToken) {
      localStorage.setItem("github_refresh_token", refreshToken)
    }
  },

  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("github_token") || localStorage.getItem("github_connected")
  },

  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("github_refresh_token")
  },

  isTokenExpiringSoon: (): boolean => {
    if (typeof window === "undefined") return false
    const issuedAt = localStorage.getItem("github_token_issued_at")
    if (!issuedAt) return false

    const elapsedMs = Date.now() - parseInt(issuedAt, 10)
    // 14 minutes = 14 * 60 * 1000 = 840,000 ms
    return elapsedMs >= 840000
  },

  refreshTokenIfNeeded: async (): Promise<string | null> => {
    if (typeof window === "undefined") return null
    const token = localStorage.getItem("github_token")
    const refreshToken = localStorage.getItem("github_refresh_token")

    if (!token && !refreshToken) return null

    // If token is expiring after 14 mins and we have a refresh token, refresh via API
    if (githubTokenService.isTokenExpiringSoon() && refreshToken) {
      try {
        const res = await fetch("http://localhost:8000/api/auth/github/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refreshToken })
        })

        if (res.ok) {
          const data = await res.json()
          if (data.access_token) {
            githubTokenService.saveTokens(
              data.access_token,
              data.refresh_token || refreshToken,
              data.expires_in || 900
            )
            return data.access_token
          }
        }
      } catch (err) {
        console.warn("Notice: GitHub token refresh skipped:", err)
      }
    }

    return token
  },

  clearTokens: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem("github_token")
    localStorage.removeItem("github_refresh_token")
    localStorage.removeItem("github_connected")
    localStorage.removeItem("github_connected_user")
    localStorage.removeItem("github_token_issued_at")
    localStorage.removeItem("github_token_expires_in")
  }
}

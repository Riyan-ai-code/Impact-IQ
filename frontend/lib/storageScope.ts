/**
 * Storage Scoping Utility
 * Ensures Projects, Teams, and Repositories created in Guest mode never overlap
 * with normal authenticated GitHub user accounts.
 */

export function isGuestMode(): boolean {
  if (typeof window === "undefined") return true

  const ghToken = localStorage.getItem("github_token") || localStorage.getItem("github_connected")
  const ghSaved = localStorage.getItem("github_connected_user")

  // If valid GitHub user or token exists, user is definitely authenticated (NOT guest)
  if (ghSaved) {
    try {
      const gh = JSON.parse(ghSaved)
      if (gh.name || gh.login || gh.email) return false
    } catch (e) {}
  }

  if (ghToken && !ghToken.startsWith("guest") && ghToken !== "true") {
    return false
  }

  const savedUser = localStorage.getItem("impact_iq_user")
  if (savedUser) {
    try {
      const user = JSON.parse(savedUser)
      if (user.isGuest === false && (user.name || user.email || user.id)) return false
      if (user.isGuest === true) return true
    } catch (e) {}
  }

  return true
}

export function getScopedKey(baseKey: string): string {
  if (typeof window === "undefined") return baseKey

  if (isGuestMode()) {
    return `${baseKey}_guest`
  }

  const ghToken = localStorage.getItem("github_token") || localStorage.getItem("github_connected")
  const savedUser = localStorage.getItem("github_connected_user")

  if (ghToken && savedUser) {
    try {
      const user = JSON.parse(savedUser)
      const userKey = user.login || user.name || "auth_user"
      return `${baseKey}_${userKey.toLowerCase().replace(/[^a-z0-9_-]/g, "_")}`
    } catch (e) {
      return `${baseKey}_auth_user`
    }
  }

  if (ghToken) {
    return `${baseKey}_auth_user`
  }

  const savedNhostUser = localStorage.getItem("impact_iq_user")
  if (savedNhostUser) {
    try {
      const user = JSON.parse(savedNhostUser)
      if (!user.isGuest && (user.email || user.id)) {
        const userKey = (user.email || user.id).toLowerCase().replace(/[^a-z0-9_-]/g, "_")
        return `${baseKey}_${userKey}`
      }
    } catch (e) {}
  }

  return `${baseKey}_guest`
}

export function getScopedItem(baseKey: string): string | null {
  if (typeof window === "undefined") return null
  const scopedKey = getScopedKey(baseKey)
  return localStorage.getItem(scopedKey)
}

export function setScopedItem(baseKey: string, value: string): void {
  if (typeof window === "undefined") return
  const scopedKey = getScopedKey(baseKey)
  localStorage.setItem(scopedKey, value)
}

export function removeScopedItem(baseKey: string): void {
  if (typeof window === "undefined") return
  const scopedKey = getScopedKey(baseKey)
  localStorage.removeItem(scopedKey)
}

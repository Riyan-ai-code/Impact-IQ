/**
 * Storage Scoping Utility
 * Ensures Projects, Teams, and Repositories created in Guest mode never overlap
 * with normal authenticated GitHub user accounts.
 */

export function getScopedKey(baseKey: string): string {
  if (typeof window === "undefined") return baseKey

  const ghToken = localStorage.getItem("github_token")
  const savedUser = localStorage.getItem("github_connected_user")

  if (ghToken && savedUser) {
    try {
      const user = JSON.parse(savedUser)
      const userKey = user.login || user.name || "auth_user"
      return `${baseKey}_${userKey}`
    } catch (e) {
      return `${baseKey}_auth_user`
    }
  }

  if (ghToken) {
    return `${baseKey}_auth_user`
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

import { nhost } from "@/lib/nhost"

export interface NhostUser {
  id: string
  email: string
  displayName?: string
  avatarUrl?: string
  createdAt?: string
}

// ----------------------------------------------------
// NHOST AUTHENTICATION SERVICE METHODS
// ----------------------------------------------------

/**
 * Sign up a new user with Email and Password
 */
export async function nhostSignUp(email: string, password: string, displayName?: string) {
  try {
    const res = await nhost.auth.signUp({
      email,
      password,
      options: {
        displayName: displayName || email.split("@")[0]
      }
    })

    if (res.error) {
      console.error("Nhost Sign Up Error:", res.error.message)
      return { user: null, error: res.error.message }
    }

    return { user: res.session?.user || null, error: null }
  } catch (err: any) {
    console.error("Sign up exception:", err)
    return { user: null, error: err.message || "Sign up failed" }
  }
}

/**
 * Sign in an existing user with Email and Password
 */
export async function nhostSignIn(email: string, password: string) {
  try {
    const res = await nhost.auth.signIn({
      email,
      password
    })

    if (res.error) {
      console.error("Nhost Sign In Error:", res.error.message)
      return { user: null, error: res.error.message }
    }

    return { user: res.session?.user || null, error: null }
  } catch (err: any) {
    console.error("Sign in exception:", err)
    return { user: null, error: err.message || "Sign in failed" }
  }
}

/**
 * Sign in with GitHub OAuth
 */
export function nhostSignInWithGithub() {
  const subdomain = process.env.NEXT_PUBLIC_NHOST_SUBDOMAIN || "ieoqkrnezzpfxpsugifg"
  const region = process.env.NEXT_PUBLIC_NHOST_REGION || "ap-south-1"
  const githubAuthUrl = `https://${subdomain}.auth.${region}.nhost.run/v1/providers/github`
  window.location.href = githubAuthUrl
}

/**
 * Sign out current authenticated user
 */
export async function nhostSignOut() {
  try {
    await nhost.auth.signOut()
    localStorage.removeItem("impact_iq_user")
    window.location.href = "/auth/login"
  } catch (err) {
    console.error("Sign out error:", err)
  }
}

/**
 * Get current authenticated Nhost user
 */
export function nhostGetUser(): NhostUser | null {
  try {
    const user = nhost.auth.getUser()
    if (user) return user as unknown as NhostUser
  } catch (err) {
    console.warn("Nhost user notice:", err)
  }

  // Fallback to local storage session
  const saved = localStorage.getItem("impact_iq_user")
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch (e) {
      console.error("Error parsing user:", e)
    }
  }

  return null
}

/**
 * Check if user is authenticated
 */
export function nhostIsAuthenticated(): boolean {
  try {
    return nhost.auth.isAuthenticated()
  } catch (e) {
    return !!localStorage.getItem("impact_iq_user")
  }
}

// ----------------------------------------------------
// GRAPHQL AUTH QUERIES
// ----------------------------------------------------

export const GET_ALL_USERS_QUERY = `
  query GetAllUsers {
    users {
      id
      email
      displayName
      avatarUrl
      createdAt
    }
  }
`

export const GET_CURRENT_USER_QUERY = `
  query GetCurrentUser {
    user {
      id
      email
      displayName
      avatarUrl
    }
  }
`

export async function fetchNhostUsers(): Promise<NhostUser[]> {
  try {
    const res = await nhost.graphql.request(GET_ALL_USERS_QUERY)
    if (res.error) {
      console.warn("Nhost GraphQL users notice:", res.error)
      return []
    }
    return res.data?.users || []
  } catch (err) {
    console.warn("Error fetching users from Nhost:", err)
    return []
  }
}

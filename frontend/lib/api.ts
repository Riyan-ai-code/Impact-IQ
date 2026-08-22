/**
 * Impact-IQ API Configuration & Utilities
 * Centralized API URL resolution for Local, Vercel, Render, and AWS environments.
 */

// Strip trailing slash if present
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, "")

/**
 * Returns a fully-qualified API URL for a given endpoint path.
 * Handles leading/trailing slashes gracefully.
 *
 * @param path - e.g. "/api/auth/github/login" or "api/teams"
 * @returns Fully-qualified URL e.g. "https://api.yourdomain.com/api/teams"
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}

/**
 * Convenience wrapper around native fetch that prepends the API base URL.
 */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const url = getApiUrl(path)
  return fetch(url, init)
}

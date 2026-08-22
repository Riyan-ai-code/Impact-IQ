"use client"

import { usePathname, useRouter } from "next/navigation"
import { Menu, Sun, Moon, Bell, ChevronDown, LogOut, User, ShieldCheck, Github } from "lucide-react"
import { useState, useEffect } from "react"
import { nhostSignOut } from "@/services/nhostAuthService"
import { githubTokenService } from "@/services/githubTokenService"
import { getApiUrl } from "@/lib/api"

interface HeaderProps {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  // Dynamic user profile state
  const [userProfile, setUserProfile] = useState<{
    isConnected: boolean
    name: string
    email: string
    avatar: string
    role: string
  }>({
    isConnected: false,
    name: "Guest",
    email: "",
    avatar: "",
    role: ""
  })

  useEffect(() => {
    // Check initial dark mode
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)

    // 1. Auto-refresh GitHub token after 14 minutes
    githubTokenService.refreshTokenIfNeeded()
    const refreshInterval = setInterval(() => {
      githubTokenService.refreshTokenIfNeeded()
    }, 60000)

    const fetchUserProfile = async () => {
      // 1. Check real GitHub token & connected user first
      const ghToken = localStorage.getItem("github_token") || localStorage.getItem("github_connected")
      const ghSaved = localStorage.getItem("github_connected_user")

      if (ghSaved) {
        try {
          const gh = JSON.parse(ghSaved)
          if (gh.name || gh.login) {
            setUserProfile({
              isConnected: true,
              name: gh.name || gh.login,
              email: gh.email || `${gh.login}@github.com`,
              avatar: gh.avatar_url || `https://github.com/${gh.login}.png`,
              role: "Owner & Lead"
            })
            return
          }
        } catch (e) {}
      }

      if (ghToken && !ghToken.startsWith("guest") && ghToken !== "true") {
        try {
          const res = await fetch(getApiUrl(`/api/auth/github/user?token=${ghToken}`))
          if (res.ok) {
            const data = await res.json()
            localStorage.setItem("github_connected_user", JSON.stringify(data))
            setUserProfile({
              isConnected: true,
              name: data.name || data.login || "Connected Developer",
              email: data.email || "dev@impactiq.dev",
              avatar: data.avatar_url || "https://github.com/github.png",
              role: "Owner & Lead"
            })
            return
          }
        } catch (err) {
          console.warn("Backend user fetch notice:", err)
        }
      }

      // 2. Check custom saved non-guest user
      const savedUser = localStorage.getItem("impact_iq_user")
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser)
          if (parsed && !parsed.isGuest && (parsed.name || parsed.displayName)) {
            setUserProfile({
              isConnected: true,
              name: parsed.name || parsed.displayName,
              email: parsed.email || "dev@impactiq.dev",
              avatar: parsed.avatar || "",
              role: parsed.role || "Owner & Lead"
            })
            return
          }
          if (parsed && parsed.isGuest) {
            setUserProfile({
              isConnected: false,
              name: parsed.name || "Guest Developer",
              email: parsed.email || "guest@impactiq.dev",
              avatar: "",
              role: "Guest User"
            })
            return
          }
        } catch (e) {}
      }

      // Default to Not Connected
      setUserProfile({
        isConnected: false,
        name: "Guest Developer",
        email: "guest@impactiq.dev",
        avatar: "",
        role: "Guest User"
      })
    }

    fetchUserProfile()

    window.addEventListener("impact_iq_user_updated", fetchUserProfile)
    window.addEventListener("storage", fetchUserProfile)

    return () => {
      window.removeEventListener("impact_iq_user_updated", fetchUserProfile)
      window.removeEventListener("storage", fetchUserProfile)
      clearInterval(refreshInterval)
    }
  }, [])

  const handleToggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.classList.add("light")
    }
  }

  // Map route path to human-readable page name
  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean)
    if (parts.length <= 1) return "Dashboard"
    
    return parts.slice(1).map(segment => 
      segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')
    ).join(' — ')
  }

  return (
    <header className="h-[4.5rem] border-b border-border bg-surface-1 px-6 flex items-center justify-between flex-shrink-0 select-none relative z-40 text-content-primary transition-colors duration-150">
      {/* Left section: Hamburger menu & Title */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg text-content-secondary hover:bg-surface-2 hover:text-content-primary transition-colors cursor-pointer">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col text-left justify-center">
          <h1 className="text-lg font-bold text-content-primary tracking-tight leading-tight">
            {getPageTitle()}
          </h1>
          {pathname === "/dashboard/repositories" && (
            <p className="text-xs text-content-muted mt-0.5">
              Select a repository to create a project
            </p>
          )}
        </div>
      </div>

      {/* Right section: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={handleToggleTheme}
          className="p-2 rounded-lg text-content-secondary hover:bg-surface-2 hover:text-content-primary transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications Button */}
        <button 
          onClick={() => router.push("/dashboard/notifications")}
          className="p-2 rounded-lg text-content-secondary hover:bg-surface-2 hover:text-content-primary transition-colors relative mr-1 cursor-pointer" 
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-rose-500 text-[9px] text-white flex items-center justify-center font-bold border-2 border-surface-1 shadow-xs">
            3
          </span>
        </button>

        {/* Profile Section */}
        <div className="relative">
          <div 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 pl-3 border-l border-border hover:opacity-90 transition-opacity cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-surface-2 flex items-center justify-center text-brand font-bold text-xs">
              {Boolean(userProfile.avatar) && (
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name}
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              )}
              <span className="text-xs font-bold text-brand">{userProfile.name.charAt(0)}</span>
            </div>
            <div className="flex flex-col text-left leading-tight">
              <span className="text-xs font-bold text-content-primary">{userProfile.name}</span>
              <span className="text-[10px] text-content-muted">{userProfile.role}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-content-muted" />
          </div>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-1 border border-border rounded-xl shadow-xl py-2 text-left z-50 animate-fadeIn">
              <div className="px-4 py-2.5 border-b border-border space-y-0.5">
                <p className="text-xs font-bold text-content-primary">{userProfile.name}</p>
                <p className="text-[11px] text-content-muted truncate">{userProfile.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => { setIsProfileMenuOpen(false); router.push("/dashboard/settings?tab=account"); }}
                  className="w-full px-4 py-2 text-xs font-semibold text-content-secondary hover:bg-surface-2 hover:text-content-primary flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <User className="w-4 h-4 text-content-muted" />
                  Account Settings
                </button>
                
                <button
                  onClick={() => { 
                    setIsProfileMenuOpen(false); 
                    localStorage.removeItem("github_token");
                    localStorage.removeItem("github_connected_user");
                    localStorage.removeItem("impact_iq_user");
                    window.location.href = "/";
                  }}
                  className="w-full px-4 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

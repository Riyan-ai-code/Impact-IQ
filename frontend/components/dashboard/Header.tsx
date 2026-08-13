"use client"

import { usePathname, useRouter } from "next/navigation"
import { Menu, Sun, Moon, Bell, ChevronDown, LogOut, User, ShieldCheck, Github } from "lucide-react"
import { useState, useEffect } from "react"
import { nhostGetUser, nhostSignOut } from "@/services/nhostAuthService"
import { githubTokenService } from "@/services/githubTokenService"

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
  }>(() => {
    if (typeof window !== "undefined") {
      const ghSaved = localStorage.getItem("github_connected_user")
      const ghToken = localStorage.getItem("github_token") || localStorage.getItem("github_connected")
      if (ghSaved) {
        try {
          const gh = JSON.parse(ghSaved)
          return {
            isConnected: true,
            name: gh.name || gh.login || "Connected Developer",
            email: gh.email || `${gh.login || "dev"}@github.com`,
            avatar: gh.avatar_url || `https://github.com/${gh.login || "github"}.png`,
            role: "Owner & Lead"
          }
        } catch (e) {}
      }
      if (ghToken) {
        return {
          isConnected: true,
          name: "Connected Developer",
          email: "dev@impactiq.dev",
          avatar: "https://github.com/github.png",
          role: "Owner & Lead"
        }
      }
    }
    return {
      isConnected: false,
      name: "Guest",
      email: "",
      avatar: "",
      role: ""
    }
  })

  useEffect(() => {
    // 1. Auto-refresh GitHub token after 14 minutes
    githubTokenService.refreshTokenIfNeeded()
    const refreshInterval = setInterval(() => {
      githubTokenService.refreshTokenIfNeeded()
    }, 60000) // check every minute

    const fetchUserProfile = async () => {
      // 1. Check Nhost Auth user
      const nhUser = nhostGetUser()
      if (nhUser && (nhUser.displayName || nhUser.email)) {
        setUserProfile({
          isConnected: true,
          name: nhUser.displayName || nhUser.email.split("@")[0],
          email: nhUser.email,
          avatar: nhUser.avatarUrl || `https://github.com/${nhUser.email.split("@")[0]}.png`,
          role: "Owner & Lead"
        })
        return
      }

      // 2. Check GitHub token / connected user
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

      if (ghToken) {
        try {
          const res = await fetch(`http://localhost:8000/api/auth/github/user?token=${ghToken}`)
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

      // 3. Check ImpactIQ user storage
      const savedUser = localStorage.getItem("impact_iq_user")
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser)
          if (parsed.displayName || parsed.name || parsed.email) {
            setUserProfile({
              isConnected: true,
              name: parsed.displayName || parsed.name || parsed.email.split("@")[0],
              email: parsed.email || "",
              avatar: `https://github.com/${(parsed.email || "dev").split("@")[0]}.png`,
              role: "Owner & Lead"
            })
            return
          }
        } catch (e) {}
      }

      // Default to Not Connected
      setUserProfile({
        isConnected: false,
        name: "Guest",
        email: "",
        avatar: "",
        role: ""
      })
    }

    fetchUserProfile()
  }, [])

  // Map route path to human-readable page name
  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean)
    if (parts.length <= 1) return "Dashboard"
    
    return parts.slice(1).map(segment => 
      segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')
    ).join(' — ')
  }

  return (
    <header className="h-[4.5rem] border-b border-gray-200 bg-white px-6 flex items-center justify-between flex-shrink-0 select-none relative z-40">
      {/* Left section: Hamburger menu & Title */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col text-left justify-center">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
            {getPageTitle()}
          </h1>
          {pathname === "/dashboard/repositories" && (
            <p className="text-xs text-gray-500 mt-0.5">
              Select a repository to create a project
            </p>
          )}
        </div>
      </div>

      {/* Right section: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Notifications Button */}
        <button 
          onClick={() => router.push("/dashboard/notifications")}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors relative mr-1 cursor-pointer" 
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-rose-500 text-[9px] text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">
            3
          </span>
        </button>

        {/* Profile Section */}
        <div className="relative">
          <div 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2.5 pl-3 border-l border-gray-200 hover:opacity-90 transition-opacity cursor-pointer"
          >
              <div className="w-8 h-8 rounded-full overflow-hidden border border-indigo-200 bg-indigo-50 flex items-center justify-center text-indigo-700 font-bold text-xs">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name}
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span className="text-xs font-bold text-indigo-700">{userProfile.name.charAt(0)}</span>
              </div>
              <div className="flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-gray-900">{userProfile.name}</span>
                <span className="text-[10px] text-gray-500">{userProfile.role}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 text-left z-50 animate-in fade-in duration-150">
                <div className="px-4 py-2.5 border-b border-gray-100 space-y-0.5">
                  <p className="text-xs font-bold text-gray-900">{userProfile.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{userProfile.email}</p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { setIsProfileMenuOpen(false); router.push("/dashboard/settings"); }}
                    className="w-full px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    Account Settings
                  </button>
                  
                  <button
                    onClick={() => { setIsProfileMenuOpen(false); nhostSignOut(); }}
                    className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
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

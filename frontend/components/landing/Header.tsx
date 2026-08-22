"use client"

import Link from "next/link"
import { ShieldCheck, Moon, Sun, ArrowRight, User, LogOut, LayoutDashboard, ChevronDown, Github, Lock, X, KeyRound, AlertCircle } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { getApiUrl } from "@/lib/api"

export default function Header() {
  const [isDark, setIsDark] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userProfile, setUserProfile] = useState<{
    name: string
    email: string
    avatar: string
    isGuest?: boolean
  } | null>(null)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")

  // Passcode login state
  const [accessCode, setAccessCode] = useState("")
  const [codeError, setCodeError] = useState("")

  const menuRef = useRef<HTMLDivElement>(null)

  const checkAuth = () => {
    const savedUserStr = localStorage.getItem("impact_iq_user")
    const ghUser = localStorage.getItem("github_connected_user")
    const ghToken = localStorage.getItem("github_token")

    // Check if saved user is explicitly a guest
    let isGuestUser = false
    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr)
        if (parsed && parsed.isGuest) {
          isGuestUser = true
        } else if (parsed && (parsed.name || parsed.displayName)) {
          setUserProfile({
            name: parsed.name || parsed.displayName,
            email: parsed.email || "developer@impactiq.dev",
            avatar: parsed.avatar || "",
            isGuest: false
          })
          setIsAuthenticated(true)
          return
        }
      } catch (e) {}
    }

    if (isGuestUser) {
      setIsAuthenticated(false)
      setUserProfile(null)
      return
    }

    if (ghUser) {
      try {
        const parsed = JSON.parse(ghUser)
        if (parsed.name || parsed.login) {
          setUserProfile({
            name: parsed.name || parsed.login,
            email: parsed.email || `${parsed.login}@github.com`,
            avatar: parsed.avatar_url || `https://github.com/${parsed.login}.png`,
            isGuest: false
          })
          setIsAuthenticated(true)
          return
        }
      } catch (e) {}
    }

    if (ghToken && !ghToken.startsWith("guest") && ghToken !== "true") {
      setIsAuthenticated(true)
      setUserProfile({
        name: "Connected Developer",
        email: "dev@impactiq.dev",
        avatar: "https://github.com/github.png",
        isGuest: false
      })
      return
    }

    setIsAuthenticated(false)
    setUserProfile(null)
  }

  useEffect(() => {
    checkAuth()
    window.addEventListener("storage", checkAuth)
    window.addEventListener("impact_iq_user_updated", checkAuth)

    const handleOpenModalEvent = () => {
      setModalMessage("Please sign in with your account to launch the platform.")
      setCodeError("")
      setAccessCode("")
      setIsSignInModalOpen(true)
    }
    window.addEventListener("open_sign_in_modal", handleOpenModalEvent)

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsAccountMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      window.removeEventListener("storage", checkAuth)
      window.removeEventListener("impact_iq_user_updated", checkAuth)
      window.removeEventListener("open_sign_in_modal", handleOpenModalEvent)
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleLaunchPlatform = () => {
    // STRICT AUTH CHECK: Only launches if authenticated
    if (isAuthenticated) {
      window.location.href = "/dashboard"
    } else {
      setModalMessage("Please sign in with your account to launch the platform.")
      setCodeError("")
      setAccessCode("")
      setIsSignInModalOpen(true)
    }
  }

  const handleOpenSignIn = () => {
    setModalMessage("Sign in to your ImpactIQ workspace")
    setCodeError("")
    setAccessCode("")
    setIsSignInModalOpen(true)
  }

  const handlePasscodeSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    const code = accessCode.trim().toLowerCase()

    if (code === "bidnis") {
      const newUser = {
        name: "Developer Admin",
        email: "admin@impactiq.dev",
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DeveloperAdmin",
        role: "Owner & Lead",
        isGuest: false
      }

      localStorage.setItem("impact_iq_user", JSON.stringify(newUser))
      localStorage.setItem("github_token", "dev_auth_token_" + Date.now())
      localStorage.setItem("github_connected", "true")
      localStorage.setItem("github_connected_user", JSON.stringify({
        name: newUser.name,
        login: "developer_admin",
        email: newUser.email,
        avatar_url: newUser.avatar
      }))

      setIsAuthenticated(true)
      setUserProfile(newUser)
      setIsSignInModalOpen(false)
      setAccessCode("")
      setCodeError("")
      window.dispatchEvent(new Event("impact_iq_user_updated"))
    } else {
      setCodeError("Invalid passcode. Please try again.")
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("github_token")
    localStorage.removeItem("github_refresh_token")
    localStorage.removeItem("github_connected")
    localStorage.removeItem("github_connected_user")
    localStorage.removeItem("impact_iq_user")
    setIsAuthenticated(false)
    setUserProfile(null)
    setIsAccountMenuOpen(false)
    window.dispatchEvent(new Event("impact_iq_user_updated"))
  }

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

  return (
    <>
      <header className="w-full border-b border-border bg-[#fafbff]/90 dark:bg-[#0a0e27]/90 py-3.5 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 backdrop-blur-xl transition-colors duration-150 text-content-primary">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5.5 h-5.5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-content-primary flex items-center">
            Impact<span className="text-brand font-semibold">IQ</span>
          </span>
        </Link>

        {/* Clean Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-content-secondary">
          <a href="#platform-modules" className="hover:text-content-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-content-primary transition-colors">How It Works</a>
          <Link href="/docs" className="hover:text-content-primary transition-colors">Documentation</Link>
          <Link href="/about" className="hover:text-content-primary transition-colors">About Us</Link>
        </nav>

        {/* Auth & CTA Buttons */}
        <div className="flex items-center gap-3.5">
          <button 
            onClick={handleToggleTheme}
            className="p-2 rounded-lg text-content-secondary hover:text-content-primary hover:bg-surface-2 transition-all cursor-pointer"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Dynamic Account / Sign In State */}
          {isAuthenticated && userProfile ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer"
              >
                {userProfile.avatar ? (
                  <img 
                    src={userProfile.avatar} 
                    alt={userProfile.name} 
                    className="w-5 h-5 rounded-full object-cover border border-indigo-400"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                    {userProfile.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="max-w-[110px] truncate">{userProfile.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* Account Dropdown */}
              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#0c101c] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-white/5">
                    <p className="text-xs font-bold text-white truncate">{userProfile.name}</p>
                    <p className="text-[11px] text-gray-400 truncate">{userProfile.email}</p>
                  </div>
                  <div className="py-1 space-y-0.5">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                      Open Dashboard
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      Account Settings
                    </Link>
                  </div>
                  <div className="pt-1 border-t border-white/5">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Button 
              variant="ghost" 
              onClick={handleOpenSignIn}
              className="text-gray-300 hover:text-white hover:bg-white/5 cursor-pointer text-xs md:text-sm font-medium"
            >
              Sign in
            </Button>
          )}

          {/* Launch Platform Button (Strict Auth Check) */}
          <Button 
            variant="brand" 
            onClick={handleLaunchPlatform}
            className="rounded-xl text-white text-xs md:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all px-4 py-2"
          >
            Launch Platform
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </header>

      {/* Sign In Modal with Code Bypass ('bidnis') */}
      {isSignInModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0c101c] border border-white/10 rounded-2xl shadow-2xl p-6 relative animate-fadeIn">
            <button 
              onClick={() => {
                setIsSignInModalOpen(false)
                setCodeError("")
                setAccessCode("")
              }}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Sign In to ImpactIQ</h3>
              <p className="text-xs text-gray-400 mt-1">
                {modalMessage || "Authenticate with your account to access the workspace."}
              </p>
            </div>

            {/* GitHub OAuth Button */}
            <button
              onClick={() => window.location.href = getApiUrl("/api/auth/github/login")}
              className="w-full bg-[#161b22] hover:bg-[#1f242c] border border-white/10 text-white text-xs font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 shadow transition-all cursor-pointer mb-4"
            >
              <Github className="w-4 h-4" />
              Continue with GitHub OAuth
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-[1px] bg-white/10" />
              <span className="text-[10px] uppercase font-bold text-gray-500">or access passcode</span>
              <div className="flex-1 h-[1px] bg-white/10" />
            </div>

            {/* Access Code Login Form */}
            <form onSubmit={handlePasscodeSignIn} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                  Passcode
                </label>
                <input 
                  type="password" 
                  placeholder="Enter passcode..."
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value)
                    setCodeError("")
                  }}
                  className="w-full bg-[#05070e] border border-white/10 rounded-xl py-2.5 px-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 font-mono tracking-wider"
                  autoFocus
                  required
                />
              </div>

              {codeError && (
                <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{codeError}</span>
                </div>
              )}

              <Button 
                type="submit"
                variant="brand" 
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 cursor-pointer mt-2"
              >
                Sign In with Code
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

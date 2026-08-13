"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { 
  ShieldCheck, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  FileText, 
  FolderGit2, 
  GitFork, 
  Layers2, 
  Settings, 
  Users, 
  Bell, 
  HelpCircle,
  BookOpen,
  ChevronDown,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { nhostGetUser, nhostSignOut } from "@/services/nhostAuthService"

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
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

  const sections = [
    {
      title: "Analysis",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "New Analysis", href: "/dashboard/analysis", icon: PlusCircle },
        { name: "Analysis History", href: "/dashboard/history", icon: History },
        { name: "Reports", href: "/dashboard/reports", icon: FileText },
      ]
    },
    {
      title: "Manage",
      items: [
        { name: "Projects", href: "/dashboard/projects", icon: FolderGit2 },
        { name: "Repositories", href: "/dashboard/repositories", icon: GitFork },
        { name: "Integrations", href: "/dashboard/integrations", icon: Layers2 },
      ]
    },
    {
      title: "Settings",
      items: [
        { name: "Project Settings", href: "/dashboard/settings", icon: Settings },
        { name: "Team", href: "/dashboard/team", icon: Users },
        { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
      ]
    }
  ]

  return (
    <aside className="w-64 h-full bg-[#080d1a] text-gray-400 flex flex-col justify-between border-r border-white/5 flex-shrink-0 z-30 select-none">
      {/* Top Brand Block */}
      <div className="p-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#4f46e5] flex items-center justify-center text-white shadow-md">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white flex items-center">
          Impact<span className="font-medium text-white">IQ</span>
        </span>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 py-4 overflow-y-auto no-scrollbar px-3 space-y-5">
        {sections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="space-y-1.5">
            <h4 className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {section.title}
            </h4>
            <ul className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const isDashboard = item.name === "Dashboard"
                const isRepositories = item.name === "Repositories"
                
                const isDashboardActive = isDashboard && (pathname === "/dashboard" || pathname === "/dashboard/repositories")
                const isRepositoriesActive = isRepositories && pathname === "/dashboard/repositories"
                
                const isActive = isDashboardActive || isRepositoriesActive || (!isDashboard && !isRepositories && pathname === item.href)
                const activeClass = isDashboardActive 
                  ? "bg-[#4f46e5] text-white" 
                  : isRepositoriesActive 
                    ? "bg-white/10 text-white" 
                    : "bg-[#4f46e5] text-white"

                const Icon = item.icon
                return (
                  <li key={itemIdx}>
                    <Link href={item.href} className="block">
                      <div className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer",
                        isActive 
                          ? activeClass 
                          : "hover:bg-white/5 hover:text-white"
                      )}>
                        <Icon className={cn("w-4.5 h-4.5", isActive ? "text-white" : "text-gray-500")} />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Profile Block */}
      <div className="p-4 border-t border-white/5 bg-[#050912] flex-shrink-0 relative">
        {!userProfile.isConnected ? (
          <button
            onClick={() => router.push("/auth/login")}
            className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span>Connect Account</span>
          </button>
        ) : (
          <div>
            <div 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/10 hover:bg-slate-900/80 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs border border-white/10 overflow-hidden">
                    <img 
                      src={userProfile.avatar} 
                      alt={userProfile.name}
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <span className="text-xs font-bold">{userProfile.name.charAt(0)}</span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#050912]" />
                </div>
                <div className="text-left leading-tight">
                  <h4 className="text-xs font-bold text-white truncate max-w-[100px]">{userProfile.name}</h4>
                  <span className="text-[10px] text-gray-400">{userProfile.role}</span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
            </div>

            {/* Sidebar Profile Popover */}
            {isProfileMenuOpen && (
              <div className="absolute bottom-full left-4 mb-2 w-56 bg-[#0a0f1d] border border-white/10 rounded-xl shadow-2xl py-2 text-left z-50 animate-in fade-in duration-150">
                <div className="px-4 py-2 border-b border-white/5">
                  <p className="text-xs font-bold text-white">{userProfile.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{userProfile.email}</p>
                </div>
                <button
                  onClick={() => nhostSignOut()}
                  className="w-full px-4 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 cursor-pointer mt-1"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}

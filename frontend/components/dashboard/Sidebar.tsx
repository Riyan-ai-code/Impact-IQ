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
  User,
  Bell, 
  ChevronDown,
  LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"
import { fetchTeamsFromNhost } from "@/services/nhostService"
import { getScopedItem, setScopedItem } from "@/lib/storageScope"

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

  // Team management state
  const [teams, setTeams] = useState<any[]>([])
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string>("Owner")

  useEffect(() => {
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
              role: "Guest Workspace"
            })
            return
          }
        } catch (e) {}
      }

      // Default
      setUserProfile({
        isConnected: false,
        name: "Guest Developer",
        email: "guest@impactiq.dev",
        avatar: "",
        role: "Guest Workspace"
      })
    }

    fetchUserProfile()

    window.addEventListener("impact_iq_user_updated", fetchUserProfile)
    window.addEventListener("storage", fetchUserProfile)

    return () => {
      window.removeEventListener("impact_iq_user_updated", fetchUserProfile)
      window.removeEventListener("storage", fetchUserProfile)
    }
  }, [])

  const fetchTeams = async () => {
    let loaded: any[] = []

    try {
      const res = await fetch("http://localhost:8000/api/teams")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          loaded = data
        }
      }
    } catch (e) {}

    if (loaded.length === 0) {
      try {
        const nhostTeams = await fetchTeamsFromNhost()
        if (nhostTeams && nhostTeams.length > 0) {
          loaded = nhostTeams
        }
      } catch (e) {}
    }

    if (loaded.length === 0) {
      const saved = getScopedItem("impact_iq_teams")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) {
            loaded = parsed
          }
        } catch (e) {}
      }
    }

    setTeams(loaded)

    const savedActiveId = getScopedItem("impact_iq_active_team_id") || localStorage.getItem("impact_iq_active_team_id")
    if (savedActiveId && loaded.some((t: any) => t.id === savedActiveId)) {
      setActiveTeamId(savedActiveId)
    } else if (loaded.length > 0) {
      setActiveTeamId(loaded[0].id)
      setScopedItem("impact_iq_active_team_id", loaded[0].id)
      localStorage.setItem("impact_iq_active_team_id", loaded[0].id)
    } else {
      setActiveTeamId(null)
    }
  }

  useEffect(() => {
    fetchTeams()

    const handleTeamsSync = () => {
      fetchTeams()
    }

    window.addEventListener("impact_iq_teams_updated", handleTeamsSync)
    window.addEventListener("storage", handleTeamsSync)
    const interval = setInterval(fetchTeams, 3000)

    return () => {
      window.removeEventListener("impact_iq_teams_updated", handleTeamsSync)
      window.removeEventListener("storage", handleTeamsSync)
      clearInterval(interval)
    }
  }, [userProfile.name, userProfile.email])

  const activeTeam = teams.find(t => t.id === activeTeamId) || (teams.length > 0 ? teams[0] : null)

  const handleJoinTeam = (team: any) => {
    setActiveTeamId(team.id)
    setScopedItem("impact_iq_active_team_id", team.id)
    localStorage.setItem("impact_iq_active_team_id", team.id)

    const isMember = team.members?.some((m: any) => m.email === userProfile.email || m.name === userProfile.name)
    if (!isMember && userProfile.name) {
      const newMember = {
        id: "m-" + Date.now(),
        name: userProfile.name,
        email: userProfile.email || `${userProfile.name.toLowerCase().replace(/\s+/g, '')}@impactiq.dev`,
        role: "Developer",
        status: "active"
      }
      const updatedTeams = teams.map(t => {
        if (t.id === team.id) {
          return {
            ...t,
            members: [...(t.members || []), newMember]
          }
        }
        return t
      })
      setTeams(updatedTeams)
      setScopedItem("impact_iq_teams", JSON.stringify(updatedTeams))
      localStorage.setItem("impact_iq_teams", JSON.stringify(updatedTeams))
    }

    const currentRole = team.members?.find((m: any) => m.name === userProfile.name || m.email === userProfile.email)?.role || "Owner"
    setUserRole(currentRole)
    window.dispatchEvent(new Event("impact_iq_teams_updated"))
    setIsProfileMenuOpen(false)
  }

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
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
        { name: "Team & Access", href: "/dashboard/team", icon: Users },
        { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
      ]
    }
  ]

  return (
    <aside className="w-64 h-full bg-[#f3f4ff] dark:bg-[#0f1219] text-content-secondary flex flex-col justify-between border-r border-border flex-shrink-0 z-30 select-none transition-colors duration-150">
      {/* Top Brand Block */}
      <div className="p-5 border-b border-border flex items-center gap-2.5 bg-[#f3f4ff] dark:bg-[#0f1219]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-content-primary flex items-center">
          Impact<span className="font-semibold text-brand">IQ</span>
        </span>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 py-4 overflow-y-auto no-scrollbar px-3 space-y-5">
        {sections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="space-y-1.5">
            <h4 className="px-3 text-[10px] font-bold text-content-muted uppercase tracking-[0.5px]">
              {section.title}
            </h4>
            <ul className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const isDashboard = item.name === "Dashboard"
                const isRepositories = item.name === "Repositories"
                
                const isDashboardActive = isDashboard && (pathname === "/dashboard" || pathname === "/dashboard/repositories")
                const isRepositoriesActive = isRepositories && pathname === "/dashboard/repositories"
                
                const isActive = isDashboardActive || isRepositoriesActive || (!isDashboard && !isRepositories && pathname === item.href)

                const Icon = item.icon
                return (
                  <li key={itemIdx}>
                    <Link href={item.href} className="block">
                      <div className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer",
                        isActive 
                          ? "bg-surface-2 dark:bg-[#1a1f3a] text-content-primary border-l-[3px] border-brand shadow-xs" 
                          : "hover:bg-surface-2 hover:text-content-primary text-content-secondary"
                      )}>
                        <Icon className={cn("w-4 h-4", isActive ? "text-brand" : "text-content-muted")} />
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

      {/* Bottom Profile & Team Block */}
      <div className="p-4 border-t border-border bg-[#eef0ff] dark:bg-[#0a0e27] flex-shrink-0 relative transition-colors duration-150">
        <div>
          <div 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center justify-between p-2.5 rounded-xl bg-surface-1 border border-border hover:bg-surface-2 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs border border-border overflow-hidden">
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
                  <span className="text-xs font-bold">{userProfile.name.charAt(0)}</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-surface-1" />
              </div>

              <div className="text-left leading-tight min-w-0 flex-1">
                <h4 className="text-xs font-bold text-content-primary truncate max-w-[120px]">{userProfile.name}</h4>
                {activeTeam ? (
                  <span className="text-[10px] text-brand font-semibold block truncate max-w-[120px]">
                    {activeTeam.name} • {userRole}
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-500 font-bold block truncate">
                    No Team Connected
                  </span>
                )}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-content-muted group-hover:text-content-primary transition-colors flex-shrink-0 ml-1" />
          </div>

          {/* Sidebar Profile & Team Switcher Popover */}
          {isProfileMenuOpen && (
            <div className="absolute bottom-full left-4 mb-2 w-64 bg-surface-1 border border-border rounded-xl shadow-xl py-3 text-left z-50 animate-fadeIn space-y-2">
              <div className="px-4 pb-2 border-b border-border space-y-0.5">
                <p className="text-xs font-bold text-content-primary">{userProfile.name}</p>
                <p className="text-[10px] text-content-muted truncate">{userProfile.email || "dev@impactiq.dev"}</p>
              </div>

              {/* Team Switcher Section */}
              <div className="px-4 py-1 space-y-2">
                <span className="text-[10px] font-bold text-content-muted uppercase tracking-[0.5px] block">
                  ENGINEERING TEAMS
                </span>

                {teams.length === 0 ? (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 space-y-2 text-center">
                    <p className="text-[10px] text-amber-500 font-bold">No Team Connected</p>
                    <button
                      onClick={() => { setIsProfileMenuOpen(false); router.push("/dashboard/team"); }}
                      className="w-full py-1 text-[10px] font-bold bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-md cursor-pointer transition-colors"
                    >
                      + Create a Team
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                    {teams.map((t: any) => {
                      const isSelected = t.id === activeTeamId
                      return (
                        <div
                          key={t.id}
                          className={cn(
                            "w-full px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between border transition-all",
                            isSelected 
                              ? "bg-brand border-brand text-white" 
                              : "bg-surface-2 border-border text-content-secondary hover:bg-surface-3 hover:text-content-primary"
                          )}
                        >
                          <span className="truncate max-w-[110px]">{t.name}</span>
                          {isSelected ? (
                            <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono flex-shrink-0">Active</span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleJoinTeam(t)}
                              className="text-[9px] bg-brand hover:bg-brand-hover text-white font-bold px-2 py-0.5 rounded cursor-pointer transition-colors flex-shrink-0"
                            >
                              Join Team
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-border px-2">
                <button
                  onClick={() => { setIsProfileMenuOpen(false); router.push("/dashboard/team"); }}
                  className="w-full px-3 py-1.5 text-xs font-semibold text-content-secondary hover:bg-surface-2 rounded-lg flex items-center gap-2 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-content-muted" />
                  Manage Teams
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

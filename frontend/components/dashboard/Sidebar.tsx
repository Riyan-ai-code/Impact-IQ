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

  // Team management state
  const [teams, setTeams] = useState<any[]>([])
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string>("Owner")

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

  const fetchTeams = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/teams")
      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setTeams(data)
          const savedActiveId = localStorage.getItem("impact_iq_active_team_id")
          if (data.length > 0) {
            if (savedActiveId && data.some((t: any) => t.id === savedActiveId)) {
              setActiveTeamId(savedActiveId)
            } else if (!activeTeamId) {
              setActiveTeamId(data[0].id)
            }
          } else {
            setActiveTeamId(null)
          }
          return
        }
      }
    } catch (e) {}

    const saved = localStorage.getItem("impact_iq_teams")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setTeams(parsed)
          const savedActiveId = localStorage.getItem("impact_iq_active_team_id")
          if (parsed.length > 0) {
            if (savedActiveId && parsed.some((t: any) => t.id === savedActiveId)) {
              setActiveTeamId(savedActiveId)
            } else if (!activeTeamId) {
              setActiveTeamId(parsed[0].id)
            }
          } else {
            setActiveTeamId(null)
          }
          return
        }
      } catch (e) {}
    }

    setTeams([])
    setActiveTeamId(null)
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
  }, [])

  const activeTeam = teams.find(t => t.id === activeTeamId) || (teams.length > 0 ? teams[0] : null)

  const handleJoinTeam = (team: any) => {
    setActiveTeamId(team.id)
    localStorage.setItem("impact_iq_active_team_id", team.id)

    // Check if user is in team roster
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
      localStorage.setItem("impact_iq_teams", JSON.stringify(updatedTeams))
    }

    // Set role
    const currentRole = team.members?.find((m: any) => m.name === userProfile.name || m.email === userProfile.email)?.role || "Owner"
    setUserRole(currentRole)

    // Dispatch global event so all pages update automatically
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

      {/* Bottom Profile & Team Block */}
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
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative flex-shrink-0">
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

                <div className="text-left leading-tight min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-white truncate max-w-[120px]">{userProfile.name}</h4>
                  {activeTeam ? (
                    <span className="text-[10px] text-indigo-400 font-semibold block truncate max-w-[120px]">
                      {activeTeam.name} • {userRole}
                    </span>
                  ) : (
                    <span className="text-[10px] text-amber-400 font-bold block truncate">
                      No Team Connected
                    </span>
                  )}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors flex-shrink-0 ml-1" />
            </div>

            {/* Sidebar Profile & Team Switcher Popover */}
            {isProfileMenuOpen && (
              <div className="absolute bottom-full left-4 mb-2 w-64 bg-[#0a0f1d] border border-white/10 rounded-xl shadow-2xl py-3 text-left z-50 animate-in fade-in duration-150 space-y-2">
                <div className="px-4 pb-2 border-b border-white/5 space-y-0.5">
                  <p className="text-xs font-bold text-white">{userProfile.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{userProfile.email || "dev@impactiq.dev"}</p>
                </div>

                {/* Team Switcher Section */}
                <div className="px-4 py-1 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    ENGINEERING TEAMS
                  </span>

                  {teams.length === 0 ? (
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5 space-y-2 text-center">
                      <p className="text-[10px] text-amber-300 font-bold">No Team Connected</p>
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
                                ? "bg-indigo-600/90 border-indigo-500 text-white shadow-xs" 
                                : "bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                            )}
                          >
                            <span className="truncate max-w-[110px]">{t.name}</span>
                            {isSelected ? (
                              <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded text-white font-mono flex-shrink-0">Active</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleJoinTeam(t)}
                                className="text-[9px] bg-indigo-500 hover:bg-indigo-400 text-white font-bold px-2 py-0.5 rounded cursor-pointer transition-colors flex-shrink-0"
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

                <div className="pt-2 border-t border-white/5 px-2">
                  <button
                    onClick={() => { setIsProfileMenuOpen(false); router.push("/dashboard/team"); }}
                    className="w-full px-3 py-1.5 text-xs font-semibold text-gray-300 hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    Manage Teams
                  </button>

                  <button
                    onClick={() => nhostSignOut()}
                    className="w-full px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 cursor-pointer mt-0.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}

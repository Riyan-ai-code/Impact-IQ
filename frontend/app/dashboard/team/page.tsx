"use client"

import { useState, useEffect } from "react"
import { 
  Users, 
  Plus, 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  Trash2, 
  Crown, 
  Check, 
  X, 
  Building2, 
  Shield, 
  Search,
  ChevronDown,
  ArrowDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TeamMember {
  id: string
  name: string
  email: string
  role: "Owner" | "Admin" | "Maintainer" | "Developer" | "Viewer"
  status: "active" | "pending"
  avatarUrl?: string
  joinedAt: string
}

interface Team {
  id: string
  name: string
  description: string
  lead: string
  members: TeamMember[]
  createdAt: string
}

import { getScopedItem, setScopedItem, isGuestMode } from "@/lib/storageScope"

const getUserIdentity = () => {
  if (typeof window !== "undefined") {
    // 1. Check custom configured user in impact_iq_user
    const savedUser = localStorage.getItem("impact_iq_user")
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        if (parsed.name || parsed.displayName) {
          return {
            name: parsed.name || parsed.displayName,
            email: parsed.email || "dev@impactiq.dev",
            role: parsed.role || "Owner"
          }
        }
      } catch (e) {}
    }

    if (!isGuestMode()) {
      const ghSaved = localStorage.getItem("github_connected_user")
      if (ghSaved) {
        try {
          const gh = JSON.parse(ghSaved)
          return {
            name: gh.name || gh.login || "Connected Developer",
            email: gh.email || `${gh.login || "dev"}@github.com`,
            role: "Owner"
          }
        } catch (e) {}
      }
    }
  }
  return {
    name: "Guest Developer",
    email: "guest@impactiq.dev",
    role: "Owner"
  }
}

export default function TeamPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Modals state
  const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false)
  const [isInviteMemberModalOpen, setIsInviteMemberModalOpen] = useState(false)
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false)

  // Create Team Form
  const [teamName, setTeamName] = useState("")
  const [teamDescription, setTeamDescription] = useState("")

  // Invite Member Form
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteName, setInviteName] = useState("")
  const [inviteRole, setInviteRole] = useState<"Admin" | "Maintainer" | "Developer" | "Viewer">("Developer")

  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const fetchTeamsFromBackend = async () => {
    const isGuest = isGuestMode()
    const user = getUserIdentity()

    if (!isGuest) {
      const ghToken = localStorage.getItem("github_token")
      if (ghToken) {
        try {
          const res = await fetch("http://localhost:8000/api/teams")
          if (res.ok) {
            const data = await res.json()
            if (Array.isArray(data) && data.length > 0) {
              setTeams(data)
              const savedActiveId = getScopedItem("impact_iq_active_team_id")
              if (savedActiveId && data.some((t: any) => t.id === savedActiveId)) {
                setActiveTeamId(savedActiveId)
              } else {
                setActiveTeamId(data[0].id)
              }
              setIsLoading(false)
              return
            }
          }
        } catch (err) {
          console.warn("Backend teams notice:", err)
        }
      }
    }

    const savedTeams = getScopedItem("impact_iq_teams")
    const savedActiveId = getScopedItem("impact_iq_active_team_id")

    if (savedTeams) {
      try {
        const parsed: Team[] = JSON.parse(savedTeams)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTeams(parsed)
          if (savedActiveId && parsed.some((t: any) => t.id === savedActiveId)) {
            setActiveTeamId(savedActiveId)
          } else {
            setActiveTeamId(parsed[0].id)
          }
          setIsLoading(false)
          return
        }
      } catch (err) {
        console.error("Error parsing saved teams:", err)
      }
    }

    if (isGuest) {
      const guestDefaultTeams: Team[] = [
        {
          id: "team-guest-1",
          name: "Guest Workspace Team",
          description: "Interactive demo sandbox team for exploring ImpactIQ capabilities.",
          lead: user.name,
          createdAt: "2026-08-16",
          members: [
            {
              id: "m-guest-1",
              name: user.name,
              email: user.email,
              role: "Owner",
              status: "active",
              joinedAt: "2026-08-16"
            }
          ]
        }
      ]
      setTeams(guestDefaultTeams)
      setActiveTeamId("team-guest-1")
      setScopedItem("impact_iq_teams", JSON.stringify(guestDefaultTeams))
      setScopedItem("impact_iq_active_team_id", "team-guest-1")
      setIsLoading(false)
      return
    }

    // Default authenticated team with user's configured name
    const defaultAuthTeams: Team[] = [
      {
        id: "team-1",
        name: "Platform Engineering",
        description: "Core cloud-native services and deployment infrastructure team.",
        lead: user.name,
        createdAt: "2026-08-16",
        members: [
          {
            id: "m-1",
            name: user.name,
            email: user.email,
            role: "Owner",
            status: "active",
            joinedAt: "2026-08-16"
          }
        ]
      }
    ]
    setTeams(defaultAuthTeams)
    setActiveTeamId("team-1")
    setScopedItem("impact_iq_teams", JSON.stringify(defaultAuthTeams))
    setScopedItem("impact_iq_active_team_id", "team-1")
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTeamsFromBackend()

    const handleSync = () => {
      fetchTeamsFromBackend()
    }

    window.addEventListener("impact_iq_user_updated", handleSync)
    window.addEventListener("impact_iq_teams_updated", handleSync)
    window.addEventListener("storage", handleSync)
    const interval = setInterval(fetchTeamsFromBackend, 3000)

    return () => {
      window.removeEventListener("impact_iq_user_updated", handleSync)
      window.removeEventListener("impact_iq_teams_updated", handleSync)
      window.removeEventListener("storage", handleSync)
      clearInterval(interval)
    }
  }, [])

  const handleSelectActiveTeam = (teamId: string) => {
    setActiveTeamId(teamId)
    setScopedItem("impact_iq_active_team_id", teamId)
    window.dispatchEvent(new Event("impact_iq_teams_updated"))
  }

  const saveTeamsToStorage = (updatedTeams: Team[]) => {
    setTeams(updatedTeams)
    setScopedItem("impact_iq_teams", JSON.stringify(updatedTeams))
  }

  const handleCreateTeam = async () => {
    if (!teamName.trim()) return

    const user = getUserIdentity()
    const newTeam: Team = {
      id: "team-" + Date.now(),
      name: teamName.trim(),
      description: teamDescription.trim() || `Engineering team for ${teamName.trim()}`,
      lead: user.name,
      members: [
        {
          id: "m-" + Date.now(),
          name: user.name,
          email: user.email,
          role: "Owner",
          status: "active",
          joinedAt: new Date().toISOString().split("T")[0]
        }
      ],
      createdAt: new Date().toISOString()
    }

    const isGuest = isGuestMode()
    if (!isGuest) {
      try {
        await fetch("http://localhost:8000/api/teams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: teamName.trim(),
            description: teamDescription.trim()
          })
        })
      } catch (err) {
        console.warn("Could not post team to backend server:", err)
      }
    }

    const updated = [newTeam, ...teams]
    saveTeamsToStorage(updated)
    setActiveTeamId(newTeam.id)
    setIsCreateTeamModalOpen(false)
    setTeamName("")
    setTeamDescription("")

    setSuccessMsg(`Team "${newTeam.name}" created successfully!`)
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  const handleInviteMember = async () => {
    if (!inviteEmail.trim() || !activeTeamId) return

    setIsSendingEmail(true)

    const targetTeam = teams.find(t => t.id === activeTeamId)
    const currentTeamName = targetTeam ? targetTeam.name : "Platform Engineering"

    const newMember: TeamMember = {
      id: "member-" + Date.now(),
      name: inviteName.trim() || inviteEmail.split("@")[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "pending",
      joinedAt: new Date().toISOString().split("T")[0]
    }

    try {
      await fetch(`http://localhost:8000/api/teams/${activeTeamId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          name: inviteName.trim() || inviteEmail.split("@")[0],
          role: inviteRole
        })
      })
    } catch (err) {
      console.warn("Could not sync member with backend server:", err)
    }

    const updated = teams.map(t => {
      if (t.id === activeTeamId) {
        return {
          ...t,
          members: [...t.members, newMember]
        }
      }
      return t
    })

    saveTeamsToStorage(updated)

    // Call Nodemailer API route to send email invitation
    try {
      const currentUser = getUserIdentity()
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          name: inviteName.trim() || inviteEmail.split("@")[0],
          teamName: currentTeamName,
          role: inviteRole,
          inviterName: currentUser.name
        })
      })
      const data = await res.json()
      if (data.previewUrl) {
        console.log("Nodemailer Email Preview URL:", data.previewUrl)
      }
    } catch (err) {
      console.error("Error triggering Nodemailer invite:", err)
    } finally {
      setIsSendingEmail(false)
      setIsInviteMemberModalOpen(false)
      setInviteEmail("")
      setInviteName("")

      setSuccessMsg(`Invitation email sent via Nodemailer to ${newMember.email}!`)
      setTimeout(() => setSuccessMsg(null), 5000)
    }
  }

  const handleRemoveMember = async (teamId: string, memberId: string) => {
    try {
      await fetch(`http://localhost:8000/api/teams/${teamId}/members/${memberId}`, {
        method: "DELETE"
      })
    } catch (err) {
      console.warn("Backend remove error:", err)
    }

    const updated = teams.map(t => {
      if (t.id === teamId) {
        return {
          ...t,
          members: t.members.filter(m => m.id !== memberId)
        }
      }
      return t
    })
    saveTeamsToStorage(updated)
  }

  const handleDeleteTeam = async (teamId: string) => {
    try {
      await fetch(`http://localhost:8000/api/teams/${teamId}`, { method: "DELETE" })
    } catch (err) {
      console.warn("Backend team delete notice:", err)
    }

    const updated = teams.filter(t => t.id !== teamId)
    saveTeamsToStorage(updated)
    if (activeTeamId === teamId) {
      setActiveTeamId(updated.length > 0 ? updated[0].id : "")
    }
  }

  const activeTeam = teams.find(t => t.id === activeTeamId)

  const filteredMembers = activeTeam ? activeTeam.members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  ) : []

  const handleMemberClick = () => {
    setIsMembersModalOpen(true)
    const el = document.getElementById("team-members-section")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading team workspace...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-left">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#4B4453] dark:text-[#f1f5ff] leading-tight">Team Management</h1>
          <p className="text-xs text-[#6E6678] dark:text-[#9ca3b8] mt-1">Create teams, manage members, and set role-based access controls (RBAC).</p>
        </div>

        <Button
          variant="brand"
          onClick={() => setIsCreateTeamModalOpen(true)}
          className="h-10 text-xs font-bold bg-[#FF8066] hover:bg-[#ff6c4a] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 shadow-xs transition-all duration-150 cursor-pointer"
        >
          <Building2 className="w-4 h-4" />
          Create New Team
        </Button>
      </div>

      {successMsg && (
        <div className="bg-white dark:bg-[#141829] border border-[#845EC2]/25 rounded-2xl p-4 flex items-center justify-between text-left animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#059669]/10 text-[#059669] flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-[#4B4453] dark:text-[#f1f5ff]">{successMsg}</p>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-[#B0A8B9] hover:text-[#C34A36] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* If No Teams Exist — Empty State */}
      {teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[55vh] p-8 border-2 border-dashed border-[#845EC2]/30 rounded-3xl bg-white dark:bg-[#141829] space-y-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#FF8066] text-white flex items-center justify-center shadow-md">
            <Users className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-base font-bold text-[#4B4453] dark:text-[#f1f5ff]">No Teams Created Yet</h3>
            <p className="text-xs text-[#6E6678] dark:text-[#9ca3b8] leading-relaxed">
              Create your engineering team to collaborate on pull request risk assessments, assign RBAC roles, and share repository analysis reports.
            </p>
          </div>

          <Button
            variant="brand"
            onClick={() => setIsCreateTeamModalOpen(true)}
            className="px-6 h-11 text-xs font-bold bg-[#FF8066] hover:bg-[#ff6c4a] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 transition-all duration-150 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Your First Team
          </Button>
        </div>
      ) : (
        /* Team Content View */
        <div className="space-y-6">
          {/* Team Switcher Selector */}
          <div className="flex items-center justify-between bg-white dark:bg-[#141829] border border-[#845EC2]/20 dark:border-white/10 rounded-2xl p-4.5 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF8066] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-[#B0A8B9] uppercase tracking-wider block mb-1">ACTIVE TEAM</span>
                <div className="relative inline-flex items-center">
                  <select
                    value={activeTeamId || ""}
                    onChange={(e) => handleSelectActiveTeam(e.target.value)}
                    className="text-xs md:text-sm font-bold text-[#4B4453] dark:text-[#f1f5ff] bg-white dark:bg-[#1a1f3a] border border-[#845EC2]/20 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#845EC2] cursor-pointer pr-8 appearance-none shadow-xs min-w-[200px]"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#B0A8B9] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Clickable Team Member Avatars Stack inside header */}
              {activeTeam && (
                <button
                  onClick={handleMemberClick}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-[#845EC2]/25 bg-[#845EC2]/10 hover:bg-[#845EC2]/15 transition-all cursor-pointer group shadow-xs"
                  title="Click to view team members"
                >
                  <div className="flex -space-x-2 overflow-hidden">
                    {activeTeam.members.slice(0, 4).map((m, idx) => (
                      <div
                        key={m.id}
                        className={cn(
                          "inline-flex h-6 w-6 rounded-full ring-2 ring-white text-white font-bold items-center justify-center text-[9px] shadow-xs",
                          idx === 0 ? "bg-[#845EC2]" : idx === 1 ? "bg-[#C34A36]" : idx === 2 ? "bg-[#FF8066]" : "bg-[#059669]"
                        )}
                      >
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {activeTeam.members.length > 4 && (
                      <div className="inline-flex h-6 w-6 rounded-full ring-2 ring-white bg-[#B0A8B9]/30 text-[#4B4453] font-bold items-center justify-center text-[9px]">
                        +{activeTeam.members.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#845EC2] group-hover:underline flex items-center gap-1">
                    {activeTeam.members.length} Members
                  </span>
                </button>
              )}

              <Button
                variant="outline"
                onClick={() => setIsInviteMemberModalOpen(true)}
                className="h-9 px-4 text-xs font-bold border-[#845EC2]/30 text-[#845EC2] bg-white dark:bg-[#141829] hover:bg-[#845EC2]/10 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                Invite Member
              </Button>

              <button
                onClick={() => activeTeamId && handleDeleteTeam(activeTeamId)}
                className="p-2 rounded-xl text-[#B0A8B9] hover:text-[#C34A36] hover:bg-[#C34A36]/10 transition-colors cursor-pointer"
                title="Delete Active Team"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Team Detail Card */}
          {activeTeam && (
            <div className="space-y-5">
              <div className="bg-white dark:bg-[#141829] border border-[#845EC2]/20 dark:border-white/10 rounded-2xl p-5 shadow-sm space-y-4 text-left">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#845EC2]/10 text-[#845EC2] flex items-center justify-center">
                        <Building2 className="w-4.5 h-4.5" />
                      </div>
                      <h2 className="text-base font-extrabold text-[#4B4453] dark:text-[#f1f5ff]">{activeTeam.name}</h2>
                    </div>
                    <p className="text-xs text-[#6E6678] dark:text-[#9ca3b8] mt-1.5">{activeTeam.description}</p>
                  </div>

                  {/* Clickable Team Member Avatars Stack */}
                  <button
                    onClick={handleMemberClick}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-[#845EC2]/25 bg-[#845EC2]/10 hover:bg-[#845EC2]/15 transition-all cursor-pointer shadow-xs group"
                    title="Click to view team members modal"
                  >
                    <div className="flex -space-x-2 overflow-hidden">
                      {activeTeam.members.slice(0, 4).map((m, idx) => (
                        <div
                          key={m.id}
                          className={cn(
                            "inline-flex h-8 w-8 rounded-full ring-2 ring-white text-white font-bold items-center justify-center text-xs shadow-sm",
                            idx === 0 ? "bg-[#845EC2]" : idx === 1 ? "bg-[#C34A36]" : idx === 2 ? "bg-[#FF8066]" : "bg-[#059669]"
                          )}
                        >
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {activeTeam.members.length > 4 && (
                        <div className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-[#B0A8B9]/30 text-[#4B4453] font-bold items-center justify-center text-xs">
                          +{activeTeam.members.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="text-left pr-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#B0A8B9] block">TEAM MEMBERS</span>
                      <span className="text-xs font-bold text-[#845EC2] group-hover:underline flex items-center gap-1">
                        {activeTeam.members.length} Members
                        <ArrowDown className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Members Section Header */}
              <div id="team-members-section" className="flex items-center justify-between pt-2">
                <h3 className="text-sm font-extrabold text-[#4B4453] dark:text-[#f1f5ff] flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#845EC2]" />
                  Team Members ({filteredMembers.length})
                </h3>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A8B9]" />
                  <input
                    type="text"
                    placeholder="Filter members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-56 pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#141829] border border-[#845EC2]/20 rounded-xl focus:outline-none focus:border-[#845EC2] text-[#4B4453] dark:text-[#f1f5ff] shadow-xs font-medium"
                  />
                </div>
              </div>

              {/* Members Table */}
              <div className="bg-white dark:bg-[#141829] border border-[#845EC2]/20 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#845EC2]/5 border-b border-[#845EC2]/15 text-[11px] font-bold text-[#845EC2] uppercase tracking-wider">
                      <th className="py-3 px-5">Member</th>
                      <th className="py-3 px-5">Role</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5">Joined Date</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#845EC2]/10 text-xs">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-[#845EC2]/5 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-[#FF8066] text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-2xs">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-extrabold text-[#4B4453] dark:text-[#f1f5ff] flex items-center gap-1.5">
                                {member.name}
                                {member.role === "Owner" && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                              </p>
                              <p className="text-[11px] text-[#B0A8B9] font-mono">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={cn(
                            "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                            member.role === "Owner" && "bg-[#FF8066]/15 text-[#C34A36] border-[#C34A36]/30",
                            member.role === "Admin" && "bg-[#845EC2]/15 text-[#845EC2] border-[#845EC2]/30",
                            member.role === "Maintainer" && "bg-[#845EC2]/10 text-[#845EC2] border-[#845EC2]/25",
                            member.role === "Developer" && "bg-[#4B4453]/10 text-[#4B4453] dark:text-[#f1f5ff] border-[#B0A8B9]/30",
                            member.role === "Viewer" && "bg-[#B0A8B9]/15 text-[#6E6678] border-[#B0A8B9]/30"
                          )}>
                            {member.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={cn(
                            "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                            member.status === "active" ? "bg-[#059669]/10 text-[#059669] border-[#059669]/25" : "bg-[#FF8066]/15 text-[#FF8066] border-[#FF8066]/30"
                          )}>
                            {member.status === "active" ? "Active" : "Pending Invite"}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-[#6E6678] dark:text-[#9ca3b8] font-mono">
                          {member.joinedAt}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          {member.role !== "Owner" && (
                            <button
                              onClick={() => activeTeam && handleRemoveMember(activeTeam.id, member.id)}
                              className="text-[#B0A8B9] hover:text-[#C34A36] transition-colors p-1 cursor-pointer"
                              title="Remove Member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TEAM MEMBERS POPUP MODAL DRAWER */}
      {isMembersModalOpen && activeTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#141829] border border-[#845EC2]/25 shadow-2xl rounded-2xl w-full max-w-xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-4 border-b border-[#845EC2]/15 flex items-center justify-between bg-[#845EC2]/5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF8066] text-white flex items-center justify-center shadow-xs">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#4B4453] dark:text-[#f1f5ff]">{activeTeam.name} — Members</h3>
                  <p className="text-[11px] text-[#6E6678] dark:text-[#9ca3b8]">Active roster ({activeTeam.members.length} members)</p>
                </div>
              </div>
              <button onClick={() => setIsMembersModalOpen(false)} className="p-1 text-[#B0A8B9] hover:text-[#4B4453] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[450px] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-[#845EC2]/10">
                <span className="text-[11px] font-bold text-[#845EC2] uppercase tracking-wider">Team Member Roster</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsMembersModalOpen(false)
                    setIsInviteMemberModalOpen(true)
                  }}
                  className="h-8 px-3 text-xs font-bold border-[#845EC2]/30 text-[#845EC2] hover:bg-[#845EC2]/10 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Invite Member
                </Button>
              </div>

              <div className="divide-y divide-[#845EC2]/10">
                {activeTeam.members.map((member) => (
                  <div key={member.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#FF8066] text-white font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-2xs">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-[#4B4453] dark:text-[#f1f5ff] flex items-center gap-1.5">
                          {member.name}
                          {member.role === "Owner" && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                        </p>
                        <p className="text-[11px] text-[#B0A8B9] font-mono">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                        member.role === "Owner" && "bg-[#FF8066]/15 text-[#C34A36] border-[#C34A36]/30",
                        member.role === "Admin" && "bg-[#845EC2]/15 text-[#845EC2] border-[#845EC2]/30",
                        member.role === "Maintainer" && "bg-[#845EC2]/10 text-[#845EC2] border-[#845EC2]/25",
                        member.role === "Developer" && "bg-[#4B4453]/10 text-[#4B4453] dark:text-[#f1f5ff] border-[#B0A8B9]/30",
                        member.role === "Viewer" && "bg-[#B0A8B9]/15 text-[#6E6678] border-[#B0A8B9]/30"
                      )}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#845EC2]/15 flex items-center justify-end bg-[#845EC2]/5">
              <Button
                variant="outline"
                onClick={() => setIsMembersModalOpen(false)}
                className="h-9 px-5 text-xs font-bold border-[#845EC2]/30 bg-white dark:bg-[#141829] hover:bg-[#845EC2]/10 text-[#4B4453] dark:text-[#f1f5ff] rounded-xl cursor-pointer"
              >
                Close Roster
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE TEAM MODAL */}
      {isCreateTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#141829] border border-[#845EC2]/25 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-4 border-b border-[#845EC2]/15 flex items-center justify-between bg-[#845EC2]/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF8066] text-white flex items-center justify-center shadow-xs">
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-sm font-extrabold text-[#4B4453] dark:text-[#f1f5ff]">Create Engineering Team</h3>
              </div>
              <button onClick={() => setIsCreateTeamModalOpen(false)} className="p-1 text-[#B0A8B9] hover:text-[#4B4453] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#4B4453] dark:text-[#9ca3b8] uppercase tracking-wide">
                  Team Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Platform Engineering, Security Ops"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1a1f3a] border border-[#845EC2]/20 rounded-xl focus:outline-none focus:border-[#845EC2] text-[#4B4453] dark:text-[#f1f5ff] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#4B4453] dark:text-[#9ca3b8] uppercase tracking-wide">Description</label>
                <textarea
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  placeholder="Describe your team's mission or scope..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1a1f3a] border border-[#845EC2]/20 rounded-xl focus:outline-none focus:border-[#845EC2] text-[#4B4453] dark:text-[#f1f5ff] resize-none font-medium"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#845EC2]/15 flex items-center justify-between bg-[#845EC2]/5">
              <Button variant="outline" onClick={() => setIsCreateTeamModalOpen(false)} className="h-9 px-4 text-xs font-bold border-[#845EC2]/30 text-[#4B4453] dark:text-[#f1f5ff] rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button variant="brand" onClick={handleCreateTeam} className="h-9 px-5 text-xs font-bold bg-[#FF8066] hover:bg-[#ff6c4a] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl cursor-pointer shadow-xs">
                Create Team
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* INVITE MEMBER MODAL */}
      {isInviteMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#141829] border border-[#845EC2]/25 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-4 border-b border-[#845EC2]/15 flex items-center justify-between bg-[#845EC2]/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF8066] text-white flex items-center justify-center shadow-xs">
                  <UserPlus className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-sm font-extrabold text-[#4B4453] dark:text-[#f1f5ff]">Invite Team Member</h3>
              </div>
              <button onClick={() => setIsInviteMemberModalOpen(false)} className="p-1 text-[#B0A8B9] hover:text-[#4B4453] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#4B4453] dark:text-[#9ca3b8] uppercase tracking-wide">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1a1f3a] border border-[#845EC2]/20 rounded-xl focus:outline-none focus:border-[#845EC2] text-[#4B4453] dark:text-[#f1f5ff] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#4B4453] dark:text-[#9ca3b8] uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1a1f3a] border border-[#845EC2]/20 rounded-xl focus:outline-none focus:border-[#845EC2] text-[#4B4453] dark:text-[#f1f5ff] font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#4B4453] dark:text-[#9ca3b8] uppercase tracking-wide">Role Assignment</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#1a1f3a] border border-[#845EC2]/20 rounded-xl focus:outline-none focus:border-[#845EC2] text-[#4B4453] dark:text-[#f1f5ff] font-bold cursor-pointer"
                >
                  <option value="Admin">Admin &mdash; Manage projects, scans &amp; members</option>
                  <option value="Maintainer">Maintainer &mdash; Trigger &amp; approve deployment scans</option>
                  <option value="Developer">Developer &mdash; Trigger scans &amp; view PR checklists</option>
                  <option value="Viewer">Viewer &mdash; Read-only access to risk reports</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-[#845EC2]/15 flex items-center justify-between bg-[#845EC2]/5">
              <Button variant="outline" onClick={() => setIsInviteMemberModalOpen(false)} className="h-9 px-4 text-xs font-bold border-[#845EC2]/30 text-[#4B4453] dark:text-[#f1f5ff] rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button
                variant="brand"
                disabled={isSendingEmail || !inviteEmail.trim()}
                onClick={handleInviteMember}
                className="h-9 px-5 text-xs font-bold bg-[#FF8066] hover:bg-[#ff6c4a] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl cursor-pointer shadow-xs disabled:opacity-75 flex items-center gap-2"
              >
                {isSendingEmail ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending Invite...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Invite</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

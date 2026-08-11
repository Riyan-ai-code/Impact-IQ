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
  ArrowDown,
  ExternalLink
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

const DEFAULT_INITIAL_TEAMS: Team[] = [
  {
    id: "team-platform",
    name: "Platform Engineering",
    description: "Core platform microservices, infrastructure CI/CD pipelines, and deployment risk governance.",
    lead: "Riyan Shah",
    createdAt: "2026-06-01",
    members: [
      {
        id: "m-1",
        name: "Riyan Shah",
        email: "riyan@impactiq.dev",
        role: "Owner",
        status: "active",
        joinedAt: "2026-06-01"
      },
      {
        id: "m-2",
        name: "Arjun Dev",
        email: "arjun@impactiq.dev",
        role: "Admin",
        status: "active",
        joinedAt: "2026-06-10"
      },
      {
        id: "m-3",
        name: "Sarah Jenkins",
        email: "sarah@impactiq.dev",
        role: "Developer",
        status: "active",
        joinedAt: "2026-07-02"
      }
    ]
  },
  {
    id: "team-devops",
    name: "DevOps Core",
    description: "Kubernetes GitOps pipelines, container security, and cloud infrastructure.",
    lead: "Arjun Dev",
    createdAt: "2026-06-15",
    members: [
      {
        id: "m-2",
        name: "Arjun Dev",
        email: "arjun@impactiq.dev",
        role: "Owner",
        status: "active",
        joinedAt: "2026-06-15"
      },
      {
        id: "m-1",
        name: "Riyan Shah",
        email: "riyan@impactiq.dev",
        role: "Admin",
        status: "active",
        joinedAt: "2026-06-15"
      }
    ]
  }
]

export default function TeamPage() {
  const [teams, setTeams] = useState<Team[]>(DEFAULT_INITIAL_TEAMS)
  const [activeTeamId, setActiveTeamId] = useState<string | null>("team-platform")
  
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

  const [searchQuery, setSearchQuery] = useState("")
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("impact_iq_teams")
    if (saved) {
      try {
        const parsed: Team[] = JSON.parse(saved)
        if (parsed.length > 0) {
          setTeams(parsed)
          setActiveTeamId(parsed[0].id)
          return
        }
      } catch (err) {
        console.error("Error loading teams:", err)
      }
    }
    setTeams(DEFAULT_INITIAL_TEAMS)
    setActiveTeamId(DEFAULT_INITIAL_TEAMS[0].id)
    localStorage.setItem("impact_iq_teams", JSON.stringify(DEFAULT_INITIAL_TEAMS))
  }, [])

  const saveTeamsToStorage = (updatedTeams: Team[]) => {
    setTeams(updatedTeams)
    localStorage.setItem("impact_iq_teams", JSON.stringify(updatedTeams))
  }

  const handleCreateTeam = () => {
    if (!teamName.trim()) return

    const newTeam: Team = {
      id: "team-" + Date.now(),
      name: teamName.trim(),
      description: teamDescription.trim() || `Engineering team for ${teamName.trim()}`,
      lead: "Riyan Shah",
      members: [
        {
          id: "m-" + Date.now(),
          name: "Riyan Shah",
          email: "riyan@impactiq.dev",
          role: "Owner",
          status: "active",
          joinedAt: new Date().toISOString().split("T")[0]
        }
      ],
      createdAt: new Date().toISOString()
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

  const handleInviteMember = () => {
    if (!inviteEmail.trim() || !activeTeamId) return

    const newMember: TeamMember = {
      id: "member-" + Date.now(),
      name: inviteName.trim() || inviteEmail.split("@")[0],
      email: inviteEmail.trim(),
      role: inviteRole,
      status: "pending",
      joinedAt: new Date().toISOString().split("T")[0]
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
    setIsInviteMemberModalOpen(false)
    setInviteEmail("")
    setInviteName("")

    setSuccessMsg(`Invitation sent to ${newMember.email}!`)
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  const handleRemoveMember = (teamId: string, memberId: string) => {
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

  const handleDeleteTeam = (teamId: string) => {
    const updated = teams.filter(t => t.id !== teamId)
    saveTeamsToStorage(updated)
    if (activeTeamId === teamId) {
      setActiveTeamId(updated.length > 0 ? updated[0].id : null)
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Team Management</h1>
          <p className="text-xs text-slate-500 mt-1">Create teams, manage members, and set role-based access controls (RBAC).</p>
        </div>

        <Button
          variant="brand"
          onClick={() => setIsCreateTeamModalOpen(true)}
          className="h-10 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg flex items-center gap-2 shadow-sm transition-all duration-150 cursor-pointer"
        >
          <Building2 className="w-4 h-4" />
          Create New Team
        </Button>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between text-left animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-emerald-900">{successMsg}</p>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* If No Teams Exist — Empty State */}
      {teams.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[55vh] p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white space-y-5 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <Users className="w-8 h-8" />
          </div>

          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-base font-bold text-slate-900">No Teams Created Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create your engineering team to collaborate on pull request risk assessments, assign RBAC roles, and share repository analysis reports.
            </p>
          </div>

          <Button
            variant="brand"
            onClick={() => setIsCreateTeamModalOpen(true)}
            className="px-6 h-11 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg flex items-center gap-2 transition-all duration-150 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Your First Team
          </Button>
        </div>
      ) : (
        /* Team Content View */
        <div className="space-y-6">
          {/* Team Switcher Selector */}
          <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">ACTIVE TEAM</span>
                <div className="relative inline-flex items-center">
                  <select
                    value={activeTeamId || ""}
                    onChange={(e) => setActiveTeamId(e.target.value)}
                    className="text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer pr-8 appearance-none shadow-2xs"
                  >
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Clickable Team Member Avatars Stack inside header */}
              {activeTeam && (
                <button
                  onClick={handleMemberClick}
                  className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/70 transition-all cursor-pointer group shadow-xs"
                  title="Click to view team members"
                >
                  <div className="flex -space-x-2 overflow-hidden">
                    {activeTeam.members.slice(0, 4).map((m, idx) => (
                      <div
                        key={m.id}
                        className={cn(
                          "inline-flex h-6 w-6 rounded-full ring-2 ring-white text-white font-bold items-center justify-center text-[9px] shadow-xs",
                          idx === 0 ? "bg-indigo-600" : idx === 1 ? "bg-purple-600" : idx === 2 ? "bg-blue-600" : "bg-emerald-600"
                        )}
                      >
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {activeTeam.members.length > 4 && (
                      <div className="inline-flex h-6 w-6 rounded-full ring-2 ring-white bg-slate-200 text-slate-700 font-bold items-center justify-center text-[9px]">
                        +{activeTeam.members.length - 4}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-bold text-indigo-700 group-hover:underline flex items-center gap-1">
                    {activeTeam.members.length} Members
                  </span>
                </button>
              )}

              <Button
                variant="outline"
                onClick={() => setIsInviteMemberModalOpen(true)}
                className="h-9 px-4 text-xs font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                Invite Member
              </Button>

              <button
                onClick={() => activeTeamId && handleDeleteTeam(activeTeamId)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete Active Team"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Team Detail Card */}
          {activeTeam && (
            <div className="space-y-5">
              <div className="bg-white border border-slate-100 rounded-xl p-5 shadow-sm space-y-4 text-left">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-indigo-600" />
                      <h2 className="text-base font-bold text-slate-900">{activeTeam.name}</h2>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{activeTeam.description}</p>
                  </div>

                  {/* Clickable Team Member Avatars Stack */}
                  <button
                    onClick={handleMemberClick}
                    className="flex items-center gap-3 p-3 rounded-xl border border-indigo-200 bg-indigo-50/60 hover:bg-indigo-100/70 transition-all cursor-pointer shadow-xs group"
                    title="Click to view team members modal"
                  >
                    <div className="flex -space-x-2 overflow-hidden">
                      {activeTeam.members.slice(0, 4).map((m, idx) => (
                        <div
                          key={m.id}
                          className={cn(
                            "inline-flex h-8 w-8 rounded-full ring-2 ring-white text-white font-bold items-center justify-center text-xs shadow-sm",
                            idx === 0 ? "bg-indigo-600" : idx === 1 ? "bg-purple-600" : idx === 2 ? "bg-blue-600" : "bg-emerald-600"
                          )}
                        >
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {activeTeam.members.length > 4 && (
                        <div className="inline-flex h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 text-slate-700 font-bold items-center justify-center text-xs">
                          +{activeTeam.members.length - 4}
                        </div>
                      )}
                    </div>
                    <div className="text-left pr-1">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">TEAM MEMBERS</span>
                      <span className="text-xs font-bold text-indigo-700 group-hover:underline flex items-center gap-1">
                        {activeTeam.members.length} Members
                        <ArrowDown className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Members Section Header */}
              <div id="team-members-section" className="flex items-center justify-between pt-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  Team Members ({filteredMembers.length})
                </h3>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-56 pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Members Table */}
              <div className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-5">Member</th>
                      <th className="py-3 px-5">Role</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5">Joined Date</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                                {member.name}
                                {member.role === "Owner" && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                              </p>
                              <p className="text-[11px] text-slate-400">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                            member.role === "Owner" && "bg-amber-50 text-amber-700 border-amber-200",
                            member.role === "Admin" && "bg-purple-50 text-purple-700 border-purple-200",
                            member.role === "Maintainer" && "bg-blue-50 text-blue-700 border-blue-200",
                            member.role === "Developer" && "bg-indigo-50 text-indigo-700 border-indigo-200",
                            member.role === "Viewer" && "bg-slate-100 text-slate-600 border-slate-200"
                          )}>
                            {member.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full",
                            member.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                          )}>
                            {member.status === "active" ? "Active" : "Pending Invite"}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-slate-500 font-medium">
                          {member.joinedAt}
                        </td>
                        <td className="py-3.5 px-5 text-right">
                          {member.role !== "Owner" && (
                            <button
                              onClick={() => activeTeam && handleRemoveMember(activeTeam.id, member.id)}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeTeam.name} — Members</h3>
                  <p className="text-[11px] text-slate-500">Active roster ({activeTeam.members.length} members)</p>
                </div>
              </div>
              <button onClick={() => setIsMembersModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[450px] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Team Member Roster</span>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsMembersModalOpen(false)
                    setIsInviteMemberModalOpen(true)
                  }}
                  className="h-8 px-3 text-xs font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Invite Member
                </Button>
              </div>

              <div className="divide-y divide-slate-100">
                {activeTeam.members.map((member) => (
                  <div key={member.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          {member.name}
                          {member.role === "Owner" && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                        </p>
                        <p className="text-[11px] text-slate-400">{member.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                        member.role === "Owner" && "bg-amber-50 text-amber-700 border-amber-200",
                        member.role === "Admin" && "bg-purple-50 text-purple-700 border-purple-200",
                        member.role === "Maintainer" && "bg-blue-50 text-blue-700 border-blue-200",
                        member.role === "Developer" && "bg-indigo-50 text-indigo-700 border-indigo-200",
                        member.role === "Viewer" && "bg-slate-100 text-slate-600 border-slate-200"
                      )}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
              <Button
                variant="outline"
                onClick={() => setIsMembersModalOpen(false)}
                className="h-9 px-5 text-xs font-bold border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer"
              >
                Close Roster
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE TEAM MODAL */}
      {isCreateTeamModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Building2 className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Create Engineering Team</h3>
              </div>
              <button onClick={() => setIsCreateTeamModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Team Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Platform Engineering, Security Ops"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Description</label>
                <textarea
                  value={teamDescription}
                  onChange={(e) => setTeamDescription(e.target.value)}
                  placeholder="Describe your team's mission or scope..."
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <Button variant="outline" onClick={() => setIsCreateTeamModalOpen(false)} className="h-9 px-4 text-xs font-semibold cursor-pointer">
                Cancel
              </Button>
              <Button variant="brand" onClick={handleCreateTeam} className="h-9 px-5 text-xs font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] cursor-pointer">
                Create Team
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* INVITE MEMBER MODAL */}
      {isInviteMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-md overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <UserPlus className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Invite Team Member</h3>
              </div>
              <button onClick={() => setIsInviteMemberModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Full Name (optional)</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Assign RBAC Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white cursor-pointer"
                >
                  <option value="Admin">Admin (Full project & analysis management)</option>
                  <option value="Maintainer">Maintainer (Manage projects & triggers)</option>
                  <option value="Developer">Developer (Run analyses & view reports)</option>
                  <option value="Viewer">Viewer (Read-only access)</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <Button variant="outline" onClick={() => setIsInviteMemberModalOpen(false)} className="h-9 px-4 text-xs font-semibold cursor-pointer">
                Cancel
              </Button>
              <Button variant="brand" onClick={handleInviteMember} className="h-9 px-5 text-xs font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] cursor-pointer">
                Send Invitation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

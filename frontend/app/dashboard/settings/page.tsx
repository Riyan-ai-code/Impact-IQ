"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { 
  Settings, 
  FolderGit2, 
  Building2, 
  GitBranch, 
  Check, 
  Save, 
  Trash2, 
  AlertTriangle, 
  X,
  User,
  Mail,
  Briefcase,
  Github,
  CheckCircle2,
  Lock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Info,
  Ban,
  Sliders,
  Sparkles,
  SlidersHorizontal,
  Send,
  Clock,
  CheckCheck,
  XCircle,
  ToggleLeft,
  ToggleRight,
  KeyRound,
  UserCheck,
  Crown,
  AlertCircle,
  ArrowRight,
  UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getScopedItem, setScopedItem, isGuestMode } from "@/lib/storageScope"
import { ROLE_DEFINITIONS, canUser, RoleType, RoleChangeRequest } from "@/lib/rbac"

interface Setting {
  id: string
  name: string
  description: string
  branch: string
  team: string
  userRole?: RoleType
  allowAdminRoleManagement?: boolean
}

const DEFAULT_PROJECTS: Setting[] = [
  {
    id: "p-1",
    name: "Payment Platform",
    description: "Microservices based payment platform and checkout processing service.",
    branch: "main",
    team: "Platform Engineering",
    userRole: "Owner",
    allowAdminRoleManagement: true
  },
  {
    id: "p-2",
    name: "Auth Service",
    description: "OAuth 2.0 and JWT authentication identity management service.",
    branch: "main",
    team: "Security Ops",
    userRole: "Maintainer",
    allowAdminRoleManagement: false
  }
]

const ROLE_OPTIONS: RoleType[] = [
  "Owner",
  "Admin",
  "Maintainer",
  "Developer",
  "Viewer"
]

const ROLE_ICONS: Record<RoleType, string> = {
  Owner: "👑",
  Admin: "🛡️",
  Maintainer: "🔧",
  Developer: "💻",
  Viewer: "👁️"
}

interface MemberOption {
  name: string
  email: string
  role: string
}

function SettingsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // Tab state: "account" | "project"
  const initialTab = searchParams.get("tab") === "project" ? "project" : "account"
  const [activeTab, setActiveTab] = useState<"account" | "project">(initialTab)

  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam === "project") {
      setActiveTab("project")
    } else if (tabParam === "account") {
      setActiveTab("account")
    }
  }, [searchParams])

  // ==========================================
  // ACCOUNT PROFILE STATE
  // ==========================================
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userBio, setUserBio] = useState("")
  const [userGithub, setUserGithub] = useState("")
  const [isGuest, setIsGuest] = useState(true)
  const [accountSaveMsg, setAccountSaveMsg] = useState<string | null>(null)
  
  // Persistent Account Authority (Owner / Admin / Member from workspace/invitation)
  const [userAccountRole, setUserAccountRole] = useState<RoleType>("Owner")

  // ==========================================
  // PROJECT SETTINGS STATE
  // ==========================================
  const [projects, setProjects] = useState<Setting[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [projectName, setProjectName] = useState("Payment Platform")
  const [projectDescription, setProjectDescription] = useState("Microservices based payment platform.")
  const [defaultBranch, setDefaultBranch] = useState("main")
  const [teamOwnership, setTeamOwnership] = useState("Platform Engineering")
  const [projectRole, setProjectRole] = useState<RoleType>("Owner")
  const [explainingRole, setExplainingRole] = useState<RoleType>("Owner")
  const [allowAdminRoleManagement, setAllowAdminRoleManagement] = useState<boolean>(true)

  const [teams, setTeams] = useState<{ id: string; name: string }[]>([
    { id: "t-1", name: "Platform Engineering" },
    { id: "t-2", name: "DevOps Core" },
    { id: "t-3", name: "Security Ops" }
  ])
  const [availableTeamMembers, setAvailableTeamMembers] = useState<MemberOption[]>([])

  const [projectSaveMsg, setProjectSaveMsg] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // ==========================================
  // ROLE REQUEST & APPROVAL WORKFLOW STATE
  // ==========================================
  const [roleRequests, setRoleRequests] = useState<RoleChangeRequest[]>([])
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const [targetRequestedRole, setTargetRequestedRole] = useState<RoleType>("Admin")
  const [requestReason, setRequestReason] = useState("")
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [requestSuccessMsg, setRequestSuccessMsg] = useState<string | null>(null)

  // ==========================================
  // OWNER OWNERSHIP TRANSFER & DEMOTION STATE
  // ==========================================
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [isDoubleConfirmOpen, setIsDoubleConfirmOpen] = useState(false)
  const [newOwnerEmail, setNewOwnerEmail] = useState("")
  const [ownerNewRole, setOwnerNewRole] = useState<RoleType>("Admin")

  // Permanent authority check
  const hasManagerAuthority = userAccountRole === "Owner" || (userAccountRole === "Admin" && allowAdminRoleManagement)
  const isWorkspaceOwner = userAccountRole === "Owner" || projectRole === "Owner"
  
  // Project action permissions based on the active role or Owner authority
  const canEdit = isWorkspaceOwner || canUser(projectRole, "edit_project")
  const canDelete = isWorkspaceOwner || canUser(projectRole, "delete_project")
  
  const currentRoleInfo = ROLE_DEFINITIONS[projectRole] || ROLE_DEFINITIONS.Developer

  // Load account and project data
  useEffect(() => {
    const guest = isGuestMode()
    setIsGuest(guest)

    // 1. Load Account Profile & Real Account Authority
    const savedUser = localStorage.getItem("impact_iq_user")
    const ghSaved = localStorage.getItem("github_connected_user")
    const savedTeams = getScopedItem("impact_iq_teams")

    let determinedRole: RoleType = "Owner"
    let currentEmail = "dev@impactiq.dev"
    let currentName = "Developer"

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        currentName = parsed.name || parsed.displayName || (guest ? "Guest Developer" : "Developer")
        currentEmail = parsed.email || (guest ? "guest@impactiq.dev" : "dev@impactiq.dev")
        setUserName(currentName)
        setUserEmail(currentEmail)
        setUserBio(parsed.bio || "")
        setUserGithub(parsed.githubUsername || "")
        if (parsed.role && ROLE_OPTIONS.includes(parsed.role as RoleType)) {
          determinedRole = parsed.role as RoleType
        }
      } catch (e) {}
    } else if (ghSaved) {
      try {
        const gh = JSON.parse(ghSaved)
        currentName = gh.name || gh.login || "Developer"
        currentEmail = gh.email || `${gh.login}@github.com`
        setUserName(currentName)
        setUserEmail(currentEmail)
        setUserGithub(gh.login || "")
      } catch (e) {}
    } else if (guest) {
      currentName = "Guest Developer"
      currentEmail = "guest@impactiq.dev"
      setUserName(currentName)
      setUserEmail(currentEmail)
    }

    // Check if team member has a specific assigned role
    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams)
        if (Array.isArray(parsedTeams) && parsedTeams.length > 0) {
          setTeams(parsedTeams.map((t: any) => ({ id: t.id, name: t.name })))
          const activeTeam = parsedTeams[0]
          
          if (Array.isArray(activeTeam.members)) {
            setAvailableTeamMembers(activeTeam.members.map((m: any) => ({
              name: m.name || m.email.split("@")[0],
              email: m.email,
              role: m.role || "Developer"
            })))

            const member = activeTeam.members.find((m: any) => m.email === currentEmail || m.name === currentName)
            if (member?.role && ROLE_OPTIONS.includes(member.role as RoleType)) {
              determinedRole = member.role as RoleType
            }
          }
        }
      } catch (e) {
        console.error("Error reading teams:", e)
      }
    }

    setUserAccountRole(determinedRole)

    // 2. Load Role Requests
    const savedRequests = getScopedItem("impact_iq_role_requests")
    if (savedRequests) {
      try {
        const parsedReqs = JSON.parse(savedRequests)
        if (Array.isArray(parsedReqs)) {
          setRoleRequests(parsedReqs)
        }
      } catch (e) {}
    }

    // 3. Load Projects & Roles
    const savedProjects = getScopedItem("impact_iq_projects")

    if (savedProjects) {
      try {
        const parsed: any[] = JSON.parse(savedProjects)
        if (parsed.length > 0) {
          const mapped: Setting[] = parsed.map(p => {
            let roleForProject = (p.userRole as RoleType) || determinedRole
            if (savedTeams) {
              try {
                const teamsList = JSON.parse(savedTeams)
                const team = teamsList.find((t: any) => t.name === p.team || t.id === p.team)
                if (team && Array.isArray(team.members)) {
                  const m = team.members.find((mem: any) => 
                    (mem.email && currentEmail && mem.email.toLowerCase() === currentEmail.toLowerCase()) || 
                    (mem.name && currentName && mem.name.toLowerCase() === currentName.toLowerCase())
                  )
                  if (m && m.role && ROLE_OPTIONS.includes(m.role as RoleType)) {
                    roleForProject = m.role as RoleType
                  }
                }
              } catch (e) {}
            }

            return {
              id: p.id,
              name: p.name,
              description: p.description || "",
              branch: p.branch || "main",
              team: p.team || "Platform Engineering",
              userRole: roleForProject,
              allowAdminRoleManagement: p.allowAdminRoleManagement !== undefined ? p.allowAdminRoleManagement : true
            }
          })
          setProjects(mapped)
          setSelectedProjectId(mapped[0].id)
          populateProjectForm(mapped[0])
          return
        }
      } catch (e) {
        console.error("Error reading projects:", e)
      }
    }

    setProjects(DEFAULT_PROJECTS)
    setSelectedProjectId(DEFAULT_PROJECTS[0].id)
    populateProjectForm(DEFAULT_PROJECTS[0])
  }, [])

  const populateProjectForm = (project: Setting) => {
    setProjectName(project.name)
    setProjectDescription(project.description)
    setDefaultBranch(project.branch)
    setTeamOwnership(project.team)

    // Check if user has an assigned invitation role in this project's team
    let resolvedRole: RoleType = project.userRole || userAccountRole || "Owner"
    try {
      const savedTeams = getScopedItem("impact_iq_teams")
      if (savedTeams) {
        const parsedTeams = JSON.parse(savedTeams)
        const team = parsedTeams.find((t: any) => t.name === project.team || t.id === project.team)
        if (team && Array.isArray(team.members)) {
          setAvailableTeamMembers(team.members.map((m: any) => ({
            name: m.name || m.email.split("@")[0],
            email: m.email,
            role: m.role || "Developer"
          })))

          const m = team.members.find((mem: any) => 
            (mem.email && userEmail && mem.email.toLowerCase() === userEmail.toLowerCase()) || 
            (mem.name && userName && mem.name.toLowerCase() === userName.toLowerCase())
          )
          if (m && m.role && ROLE_OPTIONS.includes(m.role as RoleType)) {
            resolvedRole = m.role as RoleType
          }
        }
      }
    } catch (e) {}

    setProjectRole(resolvedRole)
    setExplainingRole(resolvedRole)
    setAllowAdminRoleManagement(project.allowAdminRoleManagement !== false)
  }

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id)
    const target = projects.find(p => p.id === id)
    if (target) {
      populateProjectForm(target)
    }
  }

  // Submit Role Change Request & Send Email to Owner & Admins
  const handleSubmitRoleRequest = async () => {
    setIsSendingEmail(true)

    const newRequest: RoleChangeRequest = {
      id: `req-${Date.now()}`,
      projectId: selectedProjectId,
      projectName: projectName,
      requesterName: userName || "Developer",
      requesterEmail: userEmail || "dev@impactiq.dev",
      currentRole: projectRole,
      requestedRole: targetRequestedRole,
      reason: requestReason.trim() || "Requested role change for project engineering duties.",
      status: "pending",
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " today"
    }

    const updatedRequests = [newRequest, ...roleRequests]
    setRoleRequests(updatedRequests)
    setScopedItem("impact_iq_role_requests", JSON.stringify(updatedRequests))

    // 1. Send in-app notification to Owner & Admins
    try {
      const savedNotifs = getScopedItem("impact_iq_notifications")
      let notifList = savedNotifs ? JSON.parse(savedNotifs) : []
      notifList.unshift({
        id: `notif-role-${Date.now()}`,
        title: `Role Change Request: ${userName || "Developer"} (${targetRequestedRole})`,
        description: `${userName || "Developer"} requested upgrade from ${projectRole} to ${targetRequestedRole} for ${projectName}. Reason: "${newRequest.reason}"`,
        category: "team",
        timestamp: "Just now",
        isUnread: true,
        actionUrl: "/dashboard/settings?tab=project"
      })
      setScopedItem("impact_iq_notifications", JSON.stringify(notifList))
    } catch (e) {}

    // 2. Determine recipient email list (strictly Owner & Admins only)
    let recipientEmails: string[] = []
    try {
      const savedTeams = getScopedItem("impact_iq_teams")
      if (savedTeams) {
        const parsedTeams = JSON.parse(savedTeams)
        if (Array.isArray(parsedTeams)) {
          parsedTeams.forEach((t: any) => {
            if (Array.isArray(t.members)) {
              t.members.forEach((m: any) => {
                if ((m.role === "Owner" || m.role === "Admin") && m.email) {
                  const cleaned = m.email.trim().toLowerCase()
                  if (!recipientEmails.includes(cleaned)) {
                    recipientEmails.push(cleaned)
                  }
                }
              })
            }
          })
        }
      }
    } catch (e) {}

    if (recipientEmails.length === 0) {
      recipientEmails = ["admin@impactiq.dev", "owner@impactiq.dev"]
    }

    // 3. Dispatch Nodemailer email to Owner & Admins
    try {
      const res = await fetch("/api/role-request-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients: recipientEmails,
          requesterName: userName || "Developer",
          requesterEmail: userEmail || "dev@impactiq.dev",
          projectName: projectName,
          currentRole: projectRole,
          requestedRole: targetRequestedRole,
          reason: newRequest.reason
        })
      })
      const data = await res.json()
      if (data.previewUrl) {
        console.log("Nodemailer Role Request Email Preview URL:", data.previewUrl)
      }
    } catch (err) {
      console.warn("Notice sending role request email:", err)
    } finally {
      setIsSendingEmail(false)
      setIsRequestModalOpen(false)
      setRequestReason("")
      setRequestSuccessMsg(`Role request email dispatched to project Owner & Admins (${recipientEmails.join(", ")})!`)
      setTimeout(() => setRequestSuccessMsg(null), 6000)
    }
  }

  // Owner: Perform Ownership Transfer & Demotion
  const handleExecuteOwnershipTransfer = () => {
    const targetEmail = newOwnerEmail.trim()
    if (!targetEmail) return

    // 1. Update Project Role for current user
    const updatedProjects = projects.map(p => {
      if (p.id === selectedProjectId) {
        return { ...p, userRole: ownerNewRole }
      }
      return p
    })
    setProjects(updatedProjects)
    setScopedItem("impact_iq_projects", JSON.stringify(updatedProjects))
    setProjectRole(ownerNewRole)
    setExplainingRole(ownerNewRole)

    // 2. Update Team Roster: Assign chosen member as Owner and current user as ownerNewRole
    let newOwnerName = targetEmail.split("@")[0]
    try {
      const savedTeams = getScopedItem("impact_iq_teams")
      if (savedTeams) {
        const parsedTeams = JSON.parse(savedTeams)
        const updatedTeams = parsedTeams.map((t: any) => {
          let hasFoundNewOwner = false
          let updatedMembers = (t.members || []).map((m: any) => {
            if (m.email.toLowerCase() === targetEmail.toLowerCase()) {
              hasFoundNewOwner = true
              newOwnerName = m.name || newOwnerName
              return { ...m, role: "Owner" }
            }
            if (m.email.toLowerCase() === userEmail.toLowerCase() || m.name === userName) {
              return { ...m, role: ownerNewRole }
            }
            return m
          })

          // If new owner wasn't in list, add them as Owner
          if (!hasFoundNewOwner) {
            updatedMembers.push({
              id: "member-" + Date.now(),
              name: newOwnerName,
              email: targetEmail,
              role: "Owner",
              status: "active",
              joinedAt: new Date().toISOString().split("T")[0]
            })
          }

          return {
            ...t,
            lead: newOwnerName,
            members: updatedMembers
          }
        })
        setScopedItem("impact_iq_teams", JSON.stringify(updatedTeams))
      }
    } catch (e) {}

    // 3. Update active user profile authority
    setUserAccountRole(ownerNewRole)
    const savedUserStr = localStorage.getItem("impact_iq_user")
    if (savedUserStr) {
      try {
        const parsedUser = JSON.parse(savedUserStr)
        localStorage.setItem("impact_iq_user", JSON.stringify({ ...parsedUser, role: ownerNewRole }))
      } catch (e) {}
    }

    // 4. Dispatch global events
    window.dispatchEvent(new Event("impact_iq_user_updated"))
    window.dispatchEvent(new Event("impact_iq_teams_updated"))
    window.dispatchEvent(new Event("storage"))

    setIsDoubleConfirmOpen(false)
    setIsTransferModalOpen(false)
    setProjectSaveMsg(`Ownership transferred to ${newOwnerName} (${targetEmail}). Your role is now ${ownerNewRole}.`)
    setTimeout(() => setProjectSaveMsg(null), 6000)
  }

  // Owner/Admin: Approve Role Request
  const handleApproveRequest = (request: RoleChangeRequest) => {
    // Only the Owner has the power to change or approve role changes for other Admins
    if (!isWorkspaceOwner && (request.currentRole === "Admin" || request.requestedRole === "Admin" || request.requestedRole === "Owner")) {
      setProjectSaveMsg("Access Denied: Only the Owner can change or approve role changes for Admins.")
      setTimeout(() => setProjectSaveMsg(null), 5000)
      return
    }

    // 1. Update Project Role
    const updated = projects.map(p => {
      if (p.id === request.projectId) {
        return { ...p, userRole: request.requestedRole }
      }
      return p
    })
    setProjects(updated)
    setScopedItem("impact_iq_projects", JSON.stringify(updated))

    if (request.projectId === selectedProjectId) {
      setProjectRole(request.requestedRole)
      setExplainingRole(request.requestedRole)
    }

    // 2. Update Team Member Role in Team Roster
    try {
      const savedTeams = getScopedItem("impact_iq_teams")
      if (savedTeams) {
        const parsedTeams = JSON.parse(savedTeams)
        const updatedTeams = parsedTeams.map((t: any) => ({
          ...t,
          members: (t.members || []).map((m: any) => {
            if (m.email === request.requesterEmail || m.name === request.requesterName) {
              return { ...m, role: request.requestedRole }
            }
            return m
          })
        }))
        setScopedItem("impact_iq_teams", JSON.stringify(updatedTeams))
      }
    } catch (e) {}

    // 3. Mark request approved
    const updatedRequests = roleRequests.map(r => 
      r.id === request.id 
        ? { ...r, status: "approved" as const, reviewedBy: userName || "Owner", reviewedAt: "Just now" } 
        : r
    )
    setRoleRequests(updatedRequests)
    setScopedItem("impact_iq_role_requests", JSON.stringify(updatedRequests))

    // 4. Dispatch global events
    window.dispatchEvent(new Event("impact_iq_user_updated"))
    window.dispatchEvent(new Event("impact_iq_teams_updated"))
    window.dispatchEvent(new Event("storage"))

    setProjectSaveMsg(`Approved ${request.requesterName}'s request! Granted ${request.requestedRole} role.`)
    setTimeout(() => setProjectSaveMsg(null), 4000)
  }

  // Owner/Admin: Reject Role Request
  const handleRejectRequest = (requestId: string) => {
    const updatedRequests = roleRequests.map(r => 
      r.id === requestId 
        ? { ...r, status: "rejected" as const, reviewedBy: userName || "Owner", reviewedAt: "Just now" } 
        : r
    )
    setRoleRequests(updatedRequests)
    setScopedItem("impact_iq_role_requests", JSON.stringify(updatedRequests))

    setProjectSaveMsg(`Role change request declined.`)
    setTimeout(() => setProjectSaveMsg(null), 4000)
  }

  // Owner Toggle: Allow Admins to manage roles
  const handleToggleAdminRolePower = () => {
    if (!isWorkspaceOwner) return

    const newVal = !allowAdminRoleManagement
    setAllowAdminRoleManagement(newVal)

    const updated = projects.map(p => {
      if (p.id === selectedProjectId) {
        return { ...p, allowAdminRoleManagement: newVal }
      }
      return p
    })
    setProjects(updated)
    setScopedItem("impact_iq_projects", JSON.stringify(updated))

    setProjectSaveMsg(newVal 
      ? "Admins are now empowered to change & approve roles in this project." 
      : "Admin role powers revoked. Only Owner can change & approve roles."
    )
    setTimeout(() => setProjectSaveMsg(null), 4000)
  }

  // SAVE ACCOUNT SETTINGS
  const handleSaveAccount = () => {
    const finalName = userName.trim() || (isGuest ? "Guest Developer" : "Developer")
    const finalEmail = userEmail.trim() || (isGuest ? "guest@impactiq.dev" : "dev@impactiq.dev")

    const updatedUser = {
      name: finalName,
      displayName: finalName,
      email: finalEmail,
      role: userAccountRole,
      bio: userBio.trim(),
      githubUsername: userGithub.trim(),
      isGuest: isGuest
    }

    localStorage.setItem("impact_iq_user", JSON.stringify(updatedUser))

    const ghSaved = localStorage.getItem("github_connected_user")
    if (ghSaved) {
      try {
        const parsed = JSON.parse(ghSaved)
        const updatedGh = {
          ...parsed,
          name: finalName,
          email: finalEmail
        }
        localStorage.setItem("github_connected_user", JSON.stringify(updatedGh))
      } catch (e) {}
    }

    window.dispatchEvent(new Event("impact_iq_user_updated"))
    window.dispatchEvent(new Event("impact_iq_teams_updated"))
    window.dispatchEvent(new Event("storage"))

    setAccountSaveMsg(`Account profile updated! Saved as "${finalName}".`)
    setTimeout(() => setAccountSaveMsg(null), 4000)
  }

  // SAVE PROJECT SETTINGS
  const handleSaveProject = () => {
    if (!canEdit) {
      return
    }

    const updated = projects.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          name: projectName,
          description: projectDescription,
          branch: defaultBranch,
          team: teamOwnership,
          userRole: projectRole,
          allowAdminRoleManagement: allowAdminRoleManagement
        }
      }
      return p
    })

    setProjects(updated)
    setScopedItem("impact_iq_projects", JSON.stringify(updated))

    window.dispatchEvent(new Event("impact_iq_user_updated"))
    window.dispatchEvent(new Event("impact_iq_teams_updated"))
    window.dispatchEvent(new Event("storage"))

    setProjectSaveMsg(`Settings and role (${projectRole}) saved successfully for ${projectName}!`)
    setTimeout(() => setProjectSaveMsg(null), 4000)
  }

  const handleDeleteProject = () => {
    if (!canDelete) {
      return
    }

    const updated = projects.filter(p => p.id !== selectedProjectId)
    setProjects(updated)
    setScopedItem("impact_iq_projects", JSON.stringify(updated))
    setIsDeleteModalOpen(false)

    if (updated.length > 0) {
      setSelectedProjectId(updated[0].id)
      populateProjectForm(updated[0])
    }
  }

  const pendingRequestsForProject = roleRequests.filter(
    r => r.projectId === selectedProjectId && r.status === "pending"
  )

  const myPendingRequest = roleRequests.find(
    r => r.projectId === selectedProjectId && r.status === "pending" && (r.requesterEmail === userEmail || r.requesterName === userName)
  )

  const eligibleNewOwners = availableTeamMembers.filter(
    m => m.email.toLowerCase() !== userEmail.toLowerCase() && m.name.toLowerCase() !== userName.toLowerCase()
  )

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Settings &amp; Preferences</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal profile, display identity, per-project roles, and role change approvals.
          </p>
        </div>

        {/* Tab Toggle Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveTab("account")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === "account"
                ? "bg-white text-indigo-600 shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <User className="w-3.5 h-3.5" />
            <span>Account Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("project")}
            className={cn(
              "flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
              activeTab === "project"
                ? "bg-white text-indigo-600 shadow-xs border border-slate-200/60"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Project Settings</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: ACCOUNT SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === "account" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {accountSaveMsg && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-emerald-900">{accountSaveMsg}</p>
              </div>
              <button onClick={() => setAccountSaveMsg(null)} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Profile Card & Avatar */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{userName || "User Profile"}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {userAccountRole} Authority
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{userEmail}</p>
                  <span className="inline-block text-[10px] font-semibold text-slate-400">
                    {isGuest ? "Guest Mode Profile" : "Production Account"}
                  </span>
                </div>
              </div>

              <Button
                variant="brand"
                onClick={handleSaveAccount}
                className="h-10 px-5 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl flex items-center gap-2 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </Button>
            </div>

            {/* Profile Fields Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  Your Display Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your full name or nickname"
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium"
                />
                <p className="text-[10px] text-slate-400">
                  This name will appear on all team rosters, invite notices, and audit logs.
                </p>
              </div>

              {/* Email Address - READ ONLY */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    Email Address
                  </label>
                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Lock className="w-3 h-3 text-slate-400" /> Read-only
                  </span>
                </div>
                <input
                  type="email"
                  value={userEmail}
                  readOnly
                  disabled
                  placeholder="your.email@company.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 text-slate-500 border border-slate-200/90 rounded-xl cursor-not-allowed select-none font-medium focus:outline-none"
                />
                <p className="text-[10px] text-slate-400">
                  Managed by your authentication provider and cannot be changed here.
                </p>
              </div>

              {/* GitHub Handle - READ ONLY */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-slate-700" />
                    GitHub Username
                  </label>
                  <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md">
                    <Lock className="w-3 h-3 text-slate-400" /> Read-only
                  </span>
                </div>
                <input
                  type="text"
                  value={userGithub}
                  readOnly
                  disabled
                  placeholder="e.g. octocat"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 text-slate-500 border border-slate-200/90 rounded-xl cursor-not-allowed select-none font-medium focus:outline-none"
                />
                <p className="text-[10px] text-slate-400">
                  Synced directly with your connected GitHub OAuth account identity.
                </p>
              </div>

            </div>

            {/* Bio / Summary */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Bio &amp; Engineering Focus
              </label>
              <textarea
                value={userBio}
                onChange={(e) => setUserBio(e.target.value)}
                placeholder="Share a short bio or your microservices / infrastructure responsibilities..."
                rows={3}
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none font-medium"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <p className="text-[11px] text-slate-500">
                Changes saved here will immediately update your team membership card and dashboard identity.
              </p>

              <Button
                variant="brand"
                onClick={handleSaveAccount}
                className="h-9 px-4 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Profile</span>
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PROJECT SETTINGS */}
      {/* ========================================================================= */}
      {activeTab === "project" && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {projectSaveMsg && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-emerald-900">{projectSaveMsg}</p>
              </div>
              <button onClick={() => setProjectSaveMsg(null)} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {requestSuccessMsg && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-center justify-between animate-in fade-in duration-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-indigo-950">{requestSuccessMsg}</p>
              </div>
              <button onClick={() => setRequestSuccessMsg(null)} className="text-indigo-500 hover:text-indigo-700 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Project Switcher Bar */}
          <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <FolderGit2 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">SELECT PROJECT</span>
                <select
                  value={selectedProjectId}
                  onChange={(e) => handleSelectProject(e.target.value)}
                  className="text-xs md:text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer min-w-[220px]"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              variant="brand"
              disabled={!canEdit}
              onClick={handleSaveProject}
              className={cn(
                "h-9 px-4 text-xs font-bold rounded-lg flex items-center gap-2 shadow-xs transition-all",
                canEdit
                  ? "bg-[#4f46e5] hover:bg-[#4338ca] text-white cursor-pointer"
                  : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-70"
              )}
            >
              {canEdit ? <Save className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
              <span>{canEdit ? "Save Project" : "Locked (Read-Only)"}</span>
            </Button>
          </div>

          {/* ======================================================== */}
          {/* OWNER ROLE DELEGATION & MANAGEMENT PANEL */}
          {/* ======================================================== */}
          {isWorkspaceOwner && (
            <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-200/80 rounded-2xl p-5 shadow-xs text-left space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-amber-200/60">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    <Crown className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span>Owner Authority &amp; Transfer Controls</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300">
                        Owner Sovereign
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      You are the Owner of <strong>{projectName}</strong>. Manage Admin delegation or transfer ownership if you wish to step down.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleToggleAdminRolePower}
                    className={cn(
                      "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border",
                      allowAdminRoleManagement
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700"
                        : "bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300"
                    )}
                  >
                    {allowAdminRoleManagement ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Admin Role Powers: ON</span>
                      </>
                    ) : (
                      <>
                        <Ban className="w-3.5 h-3.5" />
                        <span>Admin Role Powers: OFF</span>
                      </>
                    )}
                  </button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (eligibleNewOwners.length > 0) {
                        setNewOwnerEmail(eligibleNewOwners[0].email)
                      } else {
                        setNewOwnerEmail("")
                      }
                      setOwnerNewRole("Admin")
                      setIsTransferModalOpen(true)
                    }}
                    className="h-8 px-3 text-xs font-bold border-amber-300 bg-white hover:bg-amber-50 text-amber-900 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                    <span>Change / Step Down Role</span>
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-amber-100/60 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-amber-950 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Notice:</strong> If you change your role from Owner, you will permanently step down and transfer authority to another team member. You cannot revert this yourself once completed.
                </p>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* PENDING ROLE REQUESTS INBOX (OWNER / AUTHORIZED ADMINS) */}
          {/* ======================================================== */}
          {hasManagerAuthority && pendingRequestsForProject.length > 0 && (
            <div className="bg-white border border-indigo-200 rounded-2xl p-5 shadow-xs text-left space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping" />
                  <h3 className="text-xs font-bold text-indigo-950">
                    Pending Role Change Requests ({pendingRequestsForProject.length})
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  Action Required
                </span>
              </div>

              <div className="space-y-2.5">
                {pendingRequestsForProject.map((req) => {
                  const isReqAdmin = req.currentRole === "Admin" || req.requestedRole === "Admin" || req.requestedRole === "Owner"
                  const canApproveThis = isWorkspaceOwner || (!isReqAdmin && hasManagerAuthority)

                  return (
                    <div key={req.id} className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{req.requesterName}</span>
                          <span className="text-[11px] text-slate-500">({req.requesterEmail})</span>
                          <span className="text-[10px] text-slate-400">• {req.createdAt}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Requested upgrade from <span className="font-semibold text-slate-700">{req.currentRole}</span> to <span className="font-bold text-indigo-700 bg-white px-1.5 py-0.5 rounded border border-indigo-200">{ROLE_ICONS[req.requestedRole]} {req.requestedRole}</span>
                        </p>
                        {req.reason && (
                          <p className="text-[10px] text-slate-500 italic bg-white/70 px-2 py-1 rounded border border-indigo-50">
                            &ldquo;{req.reason}&rdquo;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {canApproveThis ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRejectRequest(req.id)}
                              className="h-8 px-3 text-xs font-bold border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-lg cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Decline</span>
                            </Button>

                            <Button
                              variant="brand"
                              size="sm"
                              onClick={() => handleApproveRequest(req)}
                              className="h-8 px-3 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>Approve &amp; Grant</span>
                            </Button>
                          </>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                            Owner Approval Required
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Non-Manager Notice if Request is Pending */}
          {!hasManagerAuthority && myPendingRequest && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900">
                    Role Change Request Pending
                  </h4>
                  <p className="text-[11px] text-amber-700">
                    Your request to upgrade to <strong>{myPendingRequest.requestedRole}</strong> is currently awaiting review from the project Owner / Admins.
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-200/70 text-amber-900 text-[10px] font-bold">
                In Review
              </span>
            </div>
          )}

          {/* ROLE CAPABILITIES & EXPLANATION CARD */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs text-left space-y-6">
            
            {/* Header with Active Role Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-lg">
                  {ROLE_ICONS[projectRole]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Role Capabilities Summary for {projectName}</span>
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-bold border", currentRoleInfo.badgeColor)}>
                      {projectRole} (Tier {currentRoleInfo.level})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{currentRoleInfo.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isWorkspaceOwner ? (
                  <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs flex items-center gap-1.5 select-none">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    <span>Owner Sovereign Authority</span>
                  </span>
                ) : (
                  <Button
                    type="button"
                    onClick={() => {
                      setTargetRequestedRole(explainingRole !== projectRole ? explainingRole : "Admin")
                      setIsRequestModalOpen(true)
                    }}
                    className="h-8 px-3.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-1.5 cursor-pointer font-bold shadow-xs transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Role Change</span>
                  </Button>
                )}
              </div>
            </div>

            {/* ======================================================== */}
            {/* 5-ROLE INTERACTIVE EXPLANATION BAR */}
            {/* ======================================================== */}
            <div className="space-y-3 p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                  Role Capabilities &amp; Permissions Explainer
                </label>
                <span className="text-[11px] font-bold text-indigo-600 bg-white px-2.5 py-0.5 rounded-md border border-slate-200 shadow-xs">
                  Viewing: {ROLE_ICONS[explainingRole]} {explainingRole} (Tier {ROLE_DEFINITIONS[explainingRole].level} of 5)
                </span>
              </div>

              {/* 5 Role Explanation Selector Tabs */}
              <div className="grid grid-cols-5 gap-2">
                {ROLE_OPTIONS.map((roleOpt, idx) => {
                  const isSelected = explainingRole === roleOpt
                  const isAssigned = projectRole === roleOpt

                  return (
                    <button
                      key={roleOpt}
                      type="button"
                      onClick={() => setExplainingRole(roleOpt)}
                      className={cn(
                        "py-2.5 px-1.5 rounded-xl text-center transition-all cursor-pointer border flex flex-col items-center justify-center gap-1 relative",
                        isSelected
                          ? "bg-white border-indigo-500 text-indigo-700 shadow-sm ring-2 ring-indigo-500/20 font-bold"
                          : "bg-white/70 border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 font-medium"
                      )}
                    >
                      {isAssigned && (
                        <span className="absolute -top-2 right-2 text-[8px] font-extrabold bg-emerald-600 text-white px-1.5 py-0.2 rounded-full shadow-xs">
                          Active
                        </span>
                      )}
                      <span className="text-lg">{ROLE_ICONS[roleOpt]}</span>
                      <span className="text-[11px] leading-tight block truncate w-full">{roleOpt}</span>
                      <span className={cn(
                        "text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase",
                        isSelected ? "bg-indigo-50 text-indigo-700" : "text-slate-400"
                      )}>
                        Tier {idx + 1}
                      </span>
                    </button>
                  )
                })}
              </div>

              <p className="text-[10px] text-slate-500 text-center pt-0.5">
                Click any role above to inspect its included permissions, scope, and operational restrictions.
              </p>
            </div>

            {/* Side-by-Side Included vs Restricted Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Allowed / Included */}
              <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] uppercase tracking-wide">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Included Permissions ({ROLE_DEFINITIONS[explainingRole].allowed.length})</span>
                </div>
                <ul className="space-y-1.5">
                  {ROLE_DEFINITIONS[explainingRole].allowed.map((item, idx) => (
                    <li key={idx} className="text-[11px] text-slate-700 flex items-start gap-2">
                      <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Included / Restricted */}
              <div className="bg-rose-50/60 border border-rose-200/80 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-rose-800 font-bold text-[11px] uppercase tracking-wide">
                  <Ban className="w-3.5 h-3.5 text-rose-500" />
                  <span>Not Included / Restricted ({ROLE_DEFINITIONS[explainingRole].restricted.length})</span>
                </div>
                {ROLE_DEFINITIONS[explainingRole].restricted.length === 0 ? (
                  <p className="text-[11px] text-emerald-700 font-medium italic pt-1">
                    No restrictions. This role holds full organization and project authority.
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {ROLE_DEFINITIONS[explainingRole].restricted.map((item, idx) => (
                      <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-2">
                        <span className="text-rose-400 font-bold mt-0.5">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* GENERAL PROJECT SETTINGS CARD */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Settings className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Project Configuration</h2>
                  <p className="text-[11px] text-slate-500">Project metadata, branch configurations, team ownership, and your project role.</p>
                </div>
              </div>

              {!canEdit && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-amber-600" />
                  Read-Only Mode ({projectRole})
                </span>
              )}
            </div>

            <div className="space-y-4">
              {/* Project Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Project Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  disabled={!canEdit}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className={cn(
                    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium",
                    canEdit 
                      ? "bg-white border-slate-200 focus:border-indigo-500" 
                      : "bg-slate-50 text-slate-500 border-slate-200/80 cursor-not-allowed"
                  )}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={projectDescription}
                  disabled={!canEdit}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your service or repository..."
                  rows={3}
                  className={cn(
                    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-medium",
                    canEdit 
                      ? "bg-white border-slate-200 focus:border-indigo-500" 
                      : "bg-slate-50 text-slate-500 border-slate-200/80 cursor-not-allowed"
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Default Branch */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                    <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                    Default Branch
                  </label>
                  <select
                    value={defaultBranch}
                    disabled={!canEdit}
                    onChange={(e) => setDefaultBranch(e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium",
                      canEdit 
                        ? "bg-white border-slate-200 cursor-pointer" 
                        : "bg-slate-50 text-slate-500 border-slate-200/80 cursor-not-allowed"
                    )}
                  >
                    <option value="main">main</option>
                    <option value="develop">develop</option>
                    <option value="staging">staging</option>
                    <option value="master">master</option>
                  </select>
                </div>

                {/* Team Ownership */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    Team Ownership
                  </label>
                  <select
                    value={teamOwnership}
                    disabled={!canEdit}
                    onChange={(e) => setTeamOwnership(e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium",
                      canEdit 
                        ? "bg-white border-slate-200 cursor-pointer" 
                        : "bg-slate-50 text-slate-500 border-slate-200/80 cursor-not-allowed"
                    )}
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Your Role In This Project */}
                <div className="space-y-1.5 md:col-span-3 pt-2">
                  <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5 text-left">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-900">Your Active Role in {projectName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-white text-indigo-700 border border-indigo-200 shadow-xs">
                          {ROLE_ICONS[projectRole]} {projectRole}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {isWorkspaceOwner
                          ? "You are the Owner. To change your role, you must assign ownership to a team member."
                          : "Want to promote, demote, or change your role? Request an authorization review from the project Owner & Admins."}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 self-start sm:self-auto">
                      <div className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-indigo-900 border border-indigo-200 shadow-xs flex items-center gap-2 select-none">
                        <span className="text-base">{ROLE_ICONS[projectRole]}</span>
                        <span className="font-extrabold">{projectRole}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                          Tier {ROLE_DEFINITIONS[projectRole].level}
                        </span>
                      </div>

                      {isWorkspaceOwner ? (
                        <Button
                          type="button"
                          onClick={() => {
                            if (eligibleNewOwners.length > 0) {
                              setNewOwnerEmail(eligibleNewOwners[0].email)
                            } else {
                              setNewOwnerEmail("")
                            }
                            setOwnerNewRole("Admin")
                            setIsTransferModalOpen(true)
                          }}
                          className="h-9 px-3.5 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-1.5 font-bold shadow-xs cursor-pointer transition-all flex-shrink-0"
                        >
                          <Crown className="w-3.5 h-3.5" />
                          <span>Change Owner Role</span>
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => {
                            setTargetRequestedRole(explainingRole !== projectRole ? explainingRole : "Admin")
                            setIsRequestModalOpen(true)
                          }}
                          className="h-9 px-3.5 text-xs bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg flex items-center gap-1.5 font-bold shadow-xs cursor-pointer transition-all flex-shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Request Role Change</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-slate-100">
                <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <span>Danger Zone</span>
                      {!canDelete && (
                        <span className="text-[10px] font-semibold text-rose-500 bg-rose-100/60 px-2 py-0.5 rounded-md">
                          Requires Owner Role
                        </span>
                      )}
                    </h4>
                    <p className="text-[11px] text-rose-600">
                      Permanently delete this project and clear its analysis metrics.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    disabled={!canDelete}
                    onClick={() => setIsDeleteModalOpen(true)}
                    className={cn(
                      "h-8 px-3 text-xs font-bold rounded-lg transition-all self-start sm:self-auto",
                      canDelete
                        ? "border-rose-200 text-rose-600 hover:bg-rose-100/60 cursor-pointer"
                        : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                    )}
                  >
                    {canDelete ? <Trash2 className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3 text-slate-400" />}
                    <span>{canDelete ? "Delete Project" : "Owner Only"}</span>
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* OWNER: TRANSFER OWNERSHIP & CHANGE ROLE MODAL */}
      {/* ======================================================== */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-amber-600">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Transfer Ownership &amp; Change Role</h3>
                  <p className="text-[11px] text-slate-500">Assign a new Owner before stepping down from the Owner role.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsTransferModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Crucial Warning Notice */}
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-950 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-rose-900">Irreversible Action Notice</p>
                <p className="text-[11px] text-rose-700 leading-relaxed">
                  If you change your role, you will immediately lose Owner privileges on <strong>{projectName}</strong>. You cannot revert this action yourself once confirmed.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Step 1: Select or enter the New Owner */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  Step 1: Select New Project Owner <span className="text-rose-500">*</span>
                </label>
                
                {eligibleNewOwners.length > 0 ? (
                  <select
                    value={newOwnerEmail}
                    onChange={(e) => setNewOwnerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-bold text-slate-800 cursor-pointer"
                  >
                    {eligibleNewOwners.map(m => (
                      <option key={m.email} value={m.email}>
                        {m.name} ({m.email}) — Current: {m.role}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[11px] text-slate-500">
                      No other team members currently in this team. Enter the email address of the teammate who will become the new Owner:
                    </p>
                    <input
                      type="email"
                      value={newOwnerEmail}
                      onChange={(e) => setNewOwnerEmail(e.target.value)}
                      placeholder="teammate@company.com"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
                    />
                  </div>
                )}
              </div>

              {/* Step 2: Select your new demoted role */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                  Step 2: Select Your New Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={ownerNewRole}
                  onChange={(e) => setOwnerNewRole(e.target.value as RoleType)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-800 cursor-pointer"
                >
                  {ROLE_OPTIONS.filter(r => r !== "Owner").map(r => (
                    <option key={r} value={r}>{ROLE_ICONS[r]} {r} ({ROLE_DEFINITIONS[r].description.split('.')[0]})</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={() => setIsTransferModalOpen(false)} 
                className="h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                variant="brand" 
                disabled={!newOwnerEmail.trim()}
                onClick={() => setIsDoubleConfirmOpen(true)} 
                className="h-9 px-4 text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue to Confirmation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* DOUBLE CONFIRMATION MODAL: OWNER DEMOTION & TRANSFER */}
      {/* ======================================================== */}
      {isDoubleConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4 text-left">
          <div className="bg-white border border-rose-200 shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-11 h-11 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Confirm Role Change?</h3>
                <p className="text-xs text-rose-600 font-semibold">Final step: Sovereign authority will be transferred</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Project:</span>
                <span className="font-bold text-slate-900">{projectName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Assigning New Owner:</span>
                <span className="font-bold text-amber-700">{newOwnerEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Your New Role:</span>
                <span className="font-bold text-indigo-700">{ROLE_ICONS[ownerNewRole]} {ownerNewRole}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Are you sure you want to change your role? You will lose Owner privileges on this project immediately and <strong>cannot revert it yourself</strong> unless the new Owner promotes you back.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={() => setIsDoubleConfirmOpen(false)} 
                className="h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                No, Keep My Owner Role
              </Button>
              <Button 
                variant="brand" 
                onClick={handleExecuteOwnershipTransfer} 
                className="h-9 px-4 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer shadow-xs"
              >
                Yes, Transfer &amp; Change Role
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REQUEST ROLE CHANGE MODAL (NON-MANAGERS) */}
      {/* ======================================================== */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 text-left">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-indigo-600">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Send className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Request Role Change</h3>
                  <p className="text-[11px] text-slate-500">Submit an authorization request to project Owner &amp; Admins.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Project:</span>
                  <span className="font-bold text-slate-900">{projectName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Current Role:</span>
                  <span className="font-semibold text-slate-800">{ROLE_ICONS[projectRole]} {projectRole}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Target Role:</span>
                  <span className="font-bold text-indigo-600">{ROLE_ICONS[targetRequestedRole]} {targetRequestedRole}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Select Requested Role
                </label>
                <select
                  value={targetRequestedRole}
                  onChange={(e) => setTargetRequestedRole(e.target.value as RoleType)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-800 cursor-pointer"
                >
                  {ROLE_OPTIONS.filter(r => r !== projectRole).map(r => (
                    <option key={r} value={r}>{ROLE_ICONS[r]} {r} ({ROLE_DEFINITIONS[r].description.split('.')[0]})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                  Reason for Request <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="Explain why you require this role (e.g., managing deployments, reviewing pipeline risk...)"
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <Button 
                variant="outline" 
                onClick={() => setIsRequestModalOpen(false)} 
                className="h-9 px-4 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button 
                variant="brand" 
                disabled={isSendingEmail}
                onClick={handleSubmitRoleRequest} 
                className="h-9 px-4 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
              >
                {isSendingEmail ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Dispatching Email...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Request &amp; Email Admins</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-md p-6 space-y-4 text-left animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete {projectName}?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete project <strong>{projectName}</strong>? All analysis history, risk reports, and settings will be permanently removed.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="h-9 px-4 text-xs font-semibold">
                Cancel
              </Button>
              <Button variant="brand" onClick={handleDeleteProject} className="h-9 px-4 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white">
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold text-slate-500">Loading settings...</p>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}

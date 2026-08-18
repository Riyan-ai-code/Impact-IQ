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
  UserPlus,
  Tag,
  Layers,
  History,
  Download,
  GitMerge,
  Server,
  Flame,
  FileSpreadsheet
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
  // Enterprise fields
  environment?: "Production" | "Staging" | "Development" | "Internal Tool"
  criticalityTier?: "Tier 1 - Mission Critical" | "Tier 2 - Business Standard" | "Tier 3 - Non-Critical"
  requireSeniorReview?: boolean
  minimumApprovals?: number
  blockDirectCommits?: boolean
}

export interface ProjectAuditLog {
  id: string
  projectId: string
  projectName: string
  action: string
  category: "roles" | "config" | "security" | "approvals"
  actorName: string
  actorRole: string
  timestamp: string
  createdAt?: number
  details: string
}

const DEFAULT_PROJECTS: Setting[] = [
  {
    id: "p-1",
    name: "Payment Platform",
    description: "Microservices based payment platform and checkout processing service.",
    branch: "main",
    team: "Platform Engineering",
    userRole: "Owner",
    allowAdminRoleManagement: true,
    environment: "Production",
    criticalityTier: "Tier 1 - Mission Critical",
    requireSeniorReview: true,
    minimumApprovals: 2,
    blockDirectCommits: true
  },
  {
    id: "p-2",
    name: "Auth Service",
    description: "OAuth 2.0 and JWT authentication identity management service.",
    branch: "main",
    team: "Security Ops",
    userRole: "Maintainer",
    allowAdminRoleManagement: false,
    environment: "Staging",
    criticalityTier: "Tier 2 - Business Standard",
    requireSeniorReview: true,
    minimumApprovals: 1,
    blockDirectCommits: false
  }
]

const DEFAULT_AUDIT_LOGS: ProjectAuditLog[] = [
  {
    id: "log-1",
    projectId: "p-1",
    projectName: "Payment Platform",
    action: "Criticality Tier Set to Tier 1",
    category: "config",
    actorName: "David K.",
    actorRole: "Owner",
    timestamp: "10 mins ago",
    createdAt: Date.now() - 10 * 60 * 1000,
    details: "Configured business criticality as Mission Critical (1.5x Risk Weight multiplier)."
  },
  {
    id: "log-2",
    projectId: "p-1",
    projectName: "Payment Platform",
    action: "Branch Protection Enforced",
    category: "approvals",
    actorName: "Sarah Jenkins",
    actorRole: "Admin",
    timestamp: "2 hours ago",
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    details: "Required 2 peer approvals & Maintainer review for high-risk PRs."
  },
  {
    id: "log-3",
    projectId: "p-1",
    projectName: "Payment Platform",
    action: "Role Granted: Maintainer",
    category: "roles",
    actorName: "David K.",
    actorRole: "Owner",
    timestamp: "Yesterday",
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    details: "Approved role promotion for Alex Rivera (alex@company.com)."
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
  const [userAvatar, setUserAvatar] = useState("")
  const [userBio, setUserBio] = useState("")
  const [userGithub, setUserGithub] = useState("")
  const [isGuest, setIsGuest] = useState(true)
  const [accountSaveMsg, setAccountSaveMsg] = useState<string | null>(null)
  
  // Persistent Account Authority
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

  // Enterprise Feature States
  const [environment, setEnvironment] = useState<"Production" | "Staging" | "Development" | "Internal Tool">("Production")
  const [criticalityTier, setCriticalityTier] = useState<"Tier 1 - Mission Critical" | "Tier 2 - Business Standard" | "Tier 3 - Non-Critical">("Tier 1 - Mission Critical")
  const [requireSeniorReview, setRequireSeniorReview] = useState<boolean>(true)
  const [minimumApprovals, setMinimumApprovals] = useState<number>(2)
  const [blockDirectCommits, setBlockDirectCommits] = useState<boolean>(true)

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<ProjectAuditLog[]>(DEFAULT_AUDIT_LOGS)
  const [auditFilter, setAuditFilter] = useState<"all" | "roles" | "config" | "approvals">("all")
  const [auditPage, setAuditPage] = useState<number>(1)
  const AUDIT_PAGE_SIZE = 10

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
  const [roleRequests, setRoleRequests] = useState<RoleChangeRequest[]>([
    {
      id: "req-app-1",
      projectId: "p-1",
      projectName: "Payment Platform",
      requesterName: "Alex Rivera",
      requesterEmail: "alex@company.com",
      currentRole: "Developer",
      requestedRole: "Maintainer",
      reason: "Assigned to lead payment gateway integrations and deployment reviews.",
      status: "approved",
      reviewedBy: "David K. (Owner)",
      reviewedAt: "Yesterday",
      createdAt: "Yesterday"
    },
    {
      id: "req-app-2",
      projectId: "p-1",
      projectName: "Payment Platform",
      requesterName: "Sarah Jenkins",
      requesterEmail: "sarah@company.com",
      currentRole: "Maintainer",
      requestedRole: "Admin",
      reason: "Promoted to Platform Team Engineering Lead.",
      status: "approved",
      reviewedBy: "David K. (Owner)",
      reviewedAt: "3 days ago",
      createdAt: "3 days ago"
    }
  ])
  const [roleRequestsTab, setRoleRequestsTab] = useState<"pending" | "approved">("pending")
  const [grantsPage, setGrantsPage] = useState<number>(1)
  const [pendingRequestsPage, setPendingRequestsPage] = useState<number>(1)
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

  // Strict per-project authority check
  const isProjectOwner = projectRole === "Owner"
  const hasManagerAuthority = projectRole === "Owner" || (projectRole === "Admin" && allowAdminRoleManagement)
  
  // Project action permissions based on the active role or Owner authority
  const canEdit = isProjectOwner || canUser(projectRole, "edit_project")
  const canDelete = isProjectOwner || canUser(projectRole, "delete_project")
  
  const currentRoleInfo = ROLE_DEFINITIONS[projectRole] || ROLE_DEFINITIONS.Developer

  // Helper to append an audit event (with 7-day retention timestamp)
  const logAuditEvent = (action: string, category: "roles" | "config" | "security" | "approvals", details: string) => {
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
    const now = Date.now()

    const newEntry: ProjectAuditLog = {
      id: `log-${Date.now()}`,
      projectId: selectedProjectId,
      projectName: projectName,
      action,
      category,
      actorName: userName || "Developer",
      actorRole: projectRole,
      timestamp: "Just now",
      createdAt: now,
      details
    }

    // Filter out messages older than 7 days
    const unexpired = [newEntry, ...auditLogs].filter(log => {
      if (!log.createdAt) return true
      return (now - log.createdAt) <= SEVEN_DAYS_MS
    })

    setAuditLogs(unexpired)
    setScopedItem("impact_iq_audit_logs", JSON.stringify(unexpired))
    setAuditPage(1)
  }

  // Load account, project data, and audit logs
  const loadSettingsData = () => {
    const guest = isGuestMode()
    setIsGuest(guest)

    // 1. Load Account Profile & Authority (Auto-sync with connected GitHub)
    const ghToken = localStorage.getItem("github_token")
    const ghSaved = localStorage.getItem("github_connected_user")
    const savedUser = localStorage.getItem("impact_iq_user")
    const savedTeams = getScopedItem("impact_iq_teams") || localStorage.getItem("impact_iq_teams")
    const activeTeamId = getScopedItem("impact_iq_active_team_id") || localStorage.getItem("impact_iq_active_team_id")

    let determinedRole: RoleType = "Owner"
    let currentEmail = "dev@impactiq.dev"
    let currentName = "Developer"
    let currentAvatar = ""
    let currentGithub = ""

    // If GitHub OAuth is connected, automatically populate real GitHub profile details
    if (ghSaved) {
      try {
        const gh = JSON.parse(ghSaved)
        currentName = gh.name || gh.login || "Developer"
        currentEmail = gh.email || `${gh.login}@users.noreply.github.com`
        currentGithub = gh.login || ""
        currentAvatar = gh.avatar_url || ""
        setUserName(currentName)
        setUserEmail(currentEmail)
        setUserGithub(currentGithub)
        setUserAvatar(currentAvatar)
      } catch (e) {}
    }

    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        if (!ghSaved) {
          currentName = parsed.name || parsed.displayName || (guest ? "Guest Developer" : "Developer")
          currentEmail = parsed.email || (guest ? "guest@impactiq.dev" : "dev@impactiq.dev")
          currentGithub = parsed.githubUsername || ""
          currentAvatar = parsed.avatar || ""
          setUserName(currentName)
          setUserEmail(currentEmail)
          setUserGithub(currentGithub)
          setUserAvatar(currentAvatar)
        }
        setUserBio(parsed.bio || "")
        if (parsed.role && ROLE_OPTIONS.includes(parsed.role as RoleType)) {
          determinedRole = parsed.role as RoleType
        }
      } catch (e) {}
    } else if (guest && !ghSaved) {
      currentName = "Guest Developer"
      currentEmail = "guest@impactiq.dev"
      setUserName(currentName)
      setUserEmail(currentEmail)
    }

    // If token exists, refresh live profile from backend to get latest primary email
    if (ghToken) {
      fetch(`http://localhost:8000/api/auth/github/user?token=${ghToken}`)
        .then(res => res.ok ? res.json() : null)
        .then(gh => {
          if (gh && gh.login) {
            localStorage.setItem("github_connected_user", JSON.stringify(gh))
            setUserName(gh.name || gh.login)
            setUserEmail(gh.email || `${gh.login}@users.noreply.github.com`)
            setUserGithub(gh.login)
            setUserAvatar(gh.avatar_url || "")

            const existing = localStorage.getItem("impact_iq_user")
            const parsed = existing ? JSON.parse(existing) : {}
            const updated = {
              ...parsed,
              name: gh.name || gh.login,
              displayName: gh.name || gh.login,
              email: gh.email || `${gh.login}@users.noreply.github.com`,
              githubUsername: gh.login,
              avatar: gh.avatar_url,
              isGuest: false
            }
            localStorage.setItem("impact_iq_user", JSON.stringify(updated))
          }
        })
        .catch(() => {})
    }

    // Load and auto-purge Audit Logs older than 7 days
    const savedLogs = getScopedItem("impact_iq_audit_logs")
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
    const now = Date.now()

    if (savedLogs) {
      try {
        const parsed = JSON.parse(savedLogs)
        if (Array.isArray(parsed)) {
          const validLogs = parsed.filter((l: ProjectAuditLog) => {
            if (!l.createdAt) return true
            return (now - l.createdAt) <= SEVEN_DAYS_MS
          })
          setAuditLogs(validLogs)
          setScopedItem("impact_iq_audit_logs", JSON.stringify(validLogs))
        }
      } catch (e) {}
    }

    let activeTeamObj: any = null

    // Check if team member has a specific assigned role in active team
    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams)
        if (Array.isArray(parsedTeams) && parsedTeams.length > 0) {
          setTeams(parsedTeams.map((t: any) => ({ id: t.id, name: t.name })))
          activeTeamObj = (activeTeamId ? parsedTeams.find((t: any) => t.id === activeTeamId) : null) || parsedTeams[0]
          
          if (activeTeamObj && Array.isArray(activeTeamObj.members)) {
            setAvailableTeamMembers(activeTeamObj.members.map((m: any) => ({
              name: m.name || m.email.split("@")[0],
              email: m.email,
              role: m.role || "Developer"
            })))

            const member = activeTeamObj.members.find((m: any) => 
              (m.email && currentEmail && m.email.toLowerCase() === currentEmail.toLowerCase()) || 
              (m.name && currentName && m.name.toLowerCase() === currentName.toLowerCase())
            )
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

    // 2. Load Role Requests & Auto-Purge older than 7 days
    const savedRequests = getScopedItem("impact_iq_role_requests")
    if (savedRequests) {
      try {
        const parsedReqs = JSON.parse(savedRequests)
        if (Array.isArray(parsedReqs)) {
          const validReqs = parsedReqs.filter((r: RoleChangeRequest) => {
            if (r.status === "pending") return true
            if (!r.createdAtEpoch) return true
            return (now - r.createdAtEpoch) <= SEVEN_DAYS_MS
          })
          setRoleRequests(validReqs)
          setScopedItem("impact_iq_role_requests", JSON.stringify(validReqs))
        }
      } catch (e) {}
    }

    // 3. Load Projects & Roles (Hybrid Model: Inherits from active team, with project-level override)
    const savedProjects = getScopedItem("impact_iq_projects") || localStorage.getItem("impact_iq_projects")

    if (savedProjects) {
      try {
        const parsed: any[] = JSON.parse(savedProjects)
        if (parsed.length > 0) {
          const mapped: Setting[] = parsed.map(p => {
            // Hybrid Role Resolution:
            // 1. Explicit Project-level override (p.userRole)
            // 2. Fallback to Team-level role (from active team members)
            // 3. Fallback to account determined role
            let roleForProject = (p.userRole as RoleType)
            if (!roleForProject && activeTeamObj && Array.isArray(activeTeamObj.members)) {
              const mem = activeTeamObj.members.find((m: any) =>
                (m.email && currentEmail && m.email.toLowerCase() === currentEmail.toLowerCase()) ||
                (m.name && currentName && m.name.toLowerCase() === currentName.toLowerCase())
              )
              if (mem && mem.role && ROLE_OPTIONS.includes(mem.role as RoleType)) {
                roleForProject = mem.role as RoleType
              }
            }

            return {
              id: p.id,
              name: p.name,
              description: p.description || "",
              branch: p.branch || "main",
              team: p.team || (activeTeamObj ? activeTeamObj.name : "Platform Engineering"),
              userRole: roleForProject || determinedRole || "Developer",
              allowAdminRoleManagement: p.allowAdminRoleManagement !== undefined ? p.allowAdminRoleManagement : true,
              environment: p.environment || "Production",
              criticalityTier: p.criticalityTier || "Tier 1 - Mission Critical",
              requireSeniorReview: p.requireSeniorReview !== undefined ? p.requireSeniorReview : true,
              minimumApprovals: p.minimumApprovals || 2,
              blockDirectCommits: p.blockDirectCommits !== undefined ? p.blockDirectCommits : true
            }
          })

          // Filter projects by active team if active team exists
          const activeTeamName = activeTeamObj?.name
          const teamFiltered = activeTeamName 
            ? mapped.filter(p => p.team === activeTeamName || p.team === activeTeamObj?.id)
            : mapped

          const finalProjects = teamFiltered.length > 0 ? teamFiltered : mapped
          setProjects(finalProjects)
          setSelectedProjectId(finalProjects[0].id)
          populateProjectForm(finalProjects[0])
          return
        }
      } catch (e) {
        console.error("Error reading projects:", e)
      }
    }

    setProjects(DEFAULT_PROJECTS)
    setSelectedProjectId(DEFAULT_PROJECTS[0].id)
    populateProjectForm(DEFAULT_PROJECTS[0])
  }

  useEffect(() => {
    loadSettingsData()

    window.addEventListener("impact_iq_teams_updated", loadSettingsData)
    window.addEventListener("impact_iq_projects_updated", loadSettingsData)
    window.addEventListener("storage", loadSettingsData)
    return () => {
      window.removeEventListener("impact_iq_teams_updated", loadSettingsData)
      window.removeEventListener("impact_iq_projects_updated", loadSettingsData)
      window.removeEventListener("storage", loadSettingsData)
    }
  }, [])

  const populateProjectForm = (project: Setting) => {
    setProjectName(project.name)
    setProjectDescription(project.description)
    setDefaultBranch(project.branch)
    setTeamOwnership(project.team)
    setEnvironment(project.environment || "Production")
    setCriticalityTier(project.criticalityTier || "Tier 1 - Mission Critical")
    setRequireSeniorReview(project.requireSeniorReview !== false)
    setMinimumApprovals(project.minimumApprovals || 2)
    setBlockDirectCommits(project.blockDirectCommits !== false)

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
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " today",
      createdAtEpoch: Date.now()
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

    // 2. Log audit event
    logAuditEvent(
      `Role Request Submitted (${targetRequestedRole})`, 
      "roles", 
      `User requested tier change from ${projectRole} to ${targetRequestedRole}.`
    )

    // 3. Determine recipient email list
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

    // 4. Dispatch Nodemailer email to Owner & Admins
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

    let newOwnerName = targetEmail.split("@")[0]

    // Log audit event
    logAuditEvent(
      `Ownership Transferred to ${newOwnerName}`, 
      "roles", 
      `Former Owner stepped down to ${ownerNewRole}. Assigned ${newOwnerName} (${targetEmail}) as new Owner.`
    )

    window.dispatchEvent(new Event("impact_iq_user_updated"))
    window.dispatchEvent(new Event("impact_iq_teams_updated"))
    window.dispatchEvent(new Event("storage"))

    setIsDoubleConfirmOpen(false)
    setIsTransferModalOpen(false)
    setProjectSaveMsg(`Ownership of ${projectName} transferred to ${newOwnerName} (${targetEmail}). Your role in ${projectName} is now ${ownerNewRole}.`)
    setTimeout(() => setProjectSaveMsg(null), 6000)
  }

  // Owner/Admin: Approve Role Request
  const handleApproveRequest = (request: RoleChangeRequest) => {
    if (!isProjectOwner && (request.currentRole === "Admin" || request.requestedRole === "Admin" || request.requestedRole === "Owner")) {
      setProjectSaveMsg("Access Denied: Only the Owner can change or approve role changes for Admins.")
      setTimeout(() => setProjectSaveMsg(null), 5000)
      return
    }

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

    const updatedRequests = roleRequests.map(r => 
      r.id === request.id 
        ? { ...r, status: "approved" as const, reviewedBy: userName || "Owner", reviewedAt: "Just now", createdAtEpoch: r.createdAtEpoch || Date.now() } 
        : r
    )
    setRoleRequests(updatedRequests)
    setScopedItem("impact_iq_role_requests", JSON.stringify(updatedRequests))

    logAuditEvent(
      `Role Approved: ${request.requestedRole}`,
      "roles",
      `Approved ${request.requesterName}'s request. Granted ${request.requestedRole} tier.`
    )

    window.dispatchEvent(new Event("impact_iq_user_updated"))
    window.dispatchEvent(new Event("impact_iq_teams_updated"))
    window.dispatchEvent(new Event("storage"))

    setProjectSaveMsg(`Approved ${request.requesterName}'s request! Granted ${request.requestedRole} role.`)
    setTimeout(() => setProjectSaveMsg(null), 4000)
  }

  // Owner/Admin: Reject Role Request
  const handleRejectRequest = (requestId: string) => {
    const target = roleRequests.find(r => r.id === requestId)
    const updatedRequests = roleRequests.map(r => 
      r.id === requestId 
        ? { ...r, status: "rejected" as const, reviewedBy: userName || "Owner", reviewedAt: "Just now" } 
        : r
    )
    setRoleRequests(updatedRequests)
    setScopedItem("impact_iq_role_requests", JSON.stringify(updatedRequests))

    if (target) {
      logAuditEvent(
        `Role Request Declined (${target.requestedRole})`,
        "roles",
        `Declined ${target.requesterName}'s request for ${target.requestedRole} tier.`
      )
    }

    setProjectSaveMsg(`Role change request declined.`)
    setTimeout(() => setProjectSaveMsg(null), 4000)
  }

  // Owner Toggle: Allow Admins to manage roles
  const handleToggleAdminRolePower = () => {
    if (!isProjectOwner) return

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

    logAuditEvent(
      newVal ? "Admin Role Delegation Enabled" : "Admin Role Delegation Revoked",
      "config",
      newVal ? "Empowered Admins to change/approve team member roles." : "Revoked Admin role changing permissions."
    )

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

  // SAVE PROJECT SETTINGS (Includes Environment, Criticality, & Policies)
  const handleSaveProject = () => {
    if (!canEdit) return

    const updated = projects.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          name: projectName,
          description: projectDescription,
          branch: defaultBranch,
          team: teamOwnership,
          userRole: projectRole,
          allowAdminRoleManagement: allowAdminRoleManagement,
          // Priority & criticality can only be updated by the Project Owner
          environment: isProjectOwner ? environment : (p.environment || environment),
          criticalityTier: isProjectOwner ? criticalityTier : (p.criticalityTier || criticalityTier),
          requireSeniorReview: requireSeniorReview,
          minimumApprovals: minimumApprovals,
          blockDirectCommits: blockDirectCommits
        }
      }
      return p
    })

    setProjects(updated)
    setScopedItem("impact_iq_projects", JSON.stringify(updated))

    logAuditEvent(
      "Project Configuration & Policies Updated",
      "config",
      `Saved Environment (${environment}), Criticality (${criticalityTier}), and Branch Protection policies.`
    )

    window.dispatchEvent(new Event("impact_iq_user_updated"))
    window.dispatchEvent(new Event("impact_iq_teams_updated"))
    window.dispatchEvent(new Event("storage"))

    setProjectSaveMsg(`Settings and enterprise policies saved successfully for ${projectName}!`)
    setTimeout(() => setProjectSaveMsg(null), 4000)
  }

  const handleDeleteProject = () => {
    if (!canDelete) return

    const updated = projects.filter(p => p.id !== selectedProjectId)
    setProjects(updated)
    setScopedItem("impact_iq_projects", JSON.stringify(updated))
    setIsDeleteModalOpen(false)

    logAuditEvent("Project Deleted", "config", `Project ${projectName} was permanently removed.`)

    if (updated.length > 0) {
      setSelectedProjectId(updated[0].id)
      populateProjectForm(updated[0])
    }
  }

  // Export audit logs as JSON / CSV
  const handleExportAuditLogs = () => {
    const projectLogs = auditLogs.filter(l => l.projectId === selectedProjectId || l.projectName === projectName)
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(projectLogs, null, 2)
    )}`
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", jsonString)
    downloadAnchor.setAttribute("download", `audit-log-${projectName.toLowerCase().replace(/\s+/g, "-")}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  // 7-Day Auto-Purge & Pagination calculation for Audit Logs & Role Requests
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
  const now = Date.now()

  // 1-Week Auto-Purge for Role Requests
  const unexpiredRoleRequests = roleRequests.filter(r => {
    if (r.status === "pending") return true
    if (!r.createdAtEpoch) return true
    return (now - r.createdAtEpoch) <= SEVEN_DAYS_MS
  })

  const pendingRequestsForProject = unexpiredRoleRequests.filter(
    r => (r.projectId === selectedProjectId || r.projectName === projectName) && r.status === "pending"
  )

  const approvedRequestsForProject = unexpiredRoleRequests.filter(
    r => (r.projectId === selectedProjectId || r.projectName === projectName) && r.status === "approved"
  )

  const totalGrantsPages = Math.ceil(approvedRequestsForProject.length / 5) || 1
  const paginatedApprovedRequests = approvedRequestsForProject.slice(
    (grantsPage - 1) * 5,
    grantsPage * 5
  )

  const totalPendingRequestsPages = Math.ceil(pendingRequestsForProject.length / 5) || 1
  const paginatedPendingRequests = pendingRequestsForProject.slice(
    (pendingRequestsPage - 1) * 5,
    pendingRequestsPage * 5
  )

  const myPendingRequest = unexpiredRoleRequests.find(
    r => (r.projectId === selectedProjectId || r.projectName === projectName) && r.status === "pending" && (r.requesterEmail === userEmail || r.requesterName === userName)
  )

  const eligibleNewOwners = availableTeamMembers.filter(
    m => m.email.toLowerCase() !== userEmail.toLowerCase() && m.name.toLowerCase() !== userName.toLowerCase()
  )

  // 1-Week Auto-Purge for Audit Logs
  const unexpiredAuditLogs = auditLogs.filter(log => {
    if (!log.createdAt) return true
    return (now - log.createdAt) <= SEVEN_DAYS_MS
  })

  const filteredAuditLogs = unexpiredAuditLogs.filter(log => {
    const isThisProj = log.projectId === selectedProjectId || log.projectName === projectName
    if (!isThisProj) return false
    if (auditFilter === "all") return true
    return log.category === auditFilter
  })

  const totalAuditPages = Math.ceil(filteredAuditLogs.length / AUDIT_PAGE_SIZE) || 1
  const paginatedAuditLogs = filteredAuditLogs.slice(
    (auditPage - 1) * AUDIT_PAGE_SIZE,
    auditPage * AUDIT_PAGE_SIZE
  )

  // Risk multiplier calculation based on criticality tier
  const riskMultiplier = criticalityTier.includes("Tier 1") ? "1.5x Multiplier" : criticalityTier.includes("Tier 2") ? "1.0x Multiplier" : "0.7x Multiplier"

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Settings &amp; Preferences</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your personal profile, display identity, per-project roles, environment tiers, and audit compliance.
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
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-extrabold text-2xl flex items-center justify-center shadow-md overflow-hidden border border-slate-100 flex-shrink-0">
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt={userName}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : null}
                  <span className={userAvatar ? "hidden" : ""}>{userName ? userName.charAt(0).toUpperCase() : "U"}</span>
                </div>
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{userName || "User Profile"}</h3>
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border flex items-center gap-1 shadow-2xs", currentRoleInfo.badgeColor)}>
                      <span>{ROLE_ICONS[userAccountRole]}</span>
                      <span>{userAccountRole} Authority</span>
                      <span className="text-[9px] bg-white/60 px-1 py-0.2 rounded font-mono font-bold">Tier {currentRoleInfo.level}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{userEmail}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="inline-block text-[10px] font-semibold text-slate-400">
                      {isGuest ? "Guest Mode Sandbox" : "GitHub Verified Identity"}
                    </span>
                    {userGithub && (
                      <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        @{userGithub}
                      </span>
                    )}
                  </div>
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
                  Synced directly from your GitHub profile identity.
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
                  Verified primary email associated with your GitHub account.
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
            <div className="space-y-1.5 pt-2 text-left">
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
              <span className="text-[11px] text-slate-400">
                Changes saved here will immediately update your team membership card and dashboard identity.
              </span>

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

          {/* ========================================================= */}
          {/* 🛡️ ACCOUNT AUTHORITY & ROLE BREAKDOWN CARD */}
          {/* ========================================================= */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center text-lg">
                  {ROLE_ICONS[userAccountRole]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Your Active Workspace Authority:</span>
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-bold border", currentRoleInfo.badgeColor)}>
                      {ROLE_ICONS[userAccountRole]} {userAccountRole} (Tier {currentRoleInfo.level})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">{currentRoleInfo.description}</p>
                </div>
              </div>
            </div>

            {/* Permissions list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-2.5">
                <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Granted Authority Powers
                </span>
                <ul className="space-y-1.5 text-xs text-emerald-950">
                  {currentRoleInfo.allowed.slice(0, 5).map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-[11px] leading-snug">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  Hybrid Role Hierarchy
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Under the <strong>Hybrid Role Model</strong>, your baseline authority is inherited from your role in the active team. Specific critical projects may have designated <strong>Project Owners</strong> and <strong>Maintainers</strong>.
                </p>
                <div className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("project")}
                    className="h-8 px-3 text-xs font-bold border-indigo-200 bg-white hover:bg-indigo-50 text-indigo-700 rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>View Project Overrides &amp; Tiers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
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
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SELECT PROJECT</span>
                  <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    Team: {teamOwnership || "Current Team"}
                  </span>
                </div>
                <select
                  value={selectedProjectId}
                  onChange={(e) => handleSelectProject(e.target.value)}
                  className="text-xs md:text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer min-w-[220px]"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Showing projects for <strong className="text-slate-600">{teamOwnership}</strong>. Switch active team in sidebar to manage other team projects.
                </p>
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
          {isProjectOwner && (
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
                      You are the Owner of <strong>{projectName}</strong>. Transfer ownership if you wish to step down.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
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
          {/* ROLE CHANGE REQUESTS & APPROVAL HISTORY */}
          {/* ======================================================== */}
          {hasManagerAuthority && (
            <div className="bg-white border border-indigo-200 rounded-2xl p-5 shadow-xs text-left space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-indigo-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold text-indigo-950">
                    Team Role Management &amp; Approvals
                  </h3>
                </div>

                {/* Filter Tabs between Pending & Approved */}
                <div className="flex items-center bg-indigo-50/70 p-1 rounded-lg border border-indigo-100 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setRoleRequestsTab("pending")}
                    className={cn(
                      "px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5",
                      roleRequestsTab === "pending"
                        ? "bg-white text-indigo-700 shadow-xs border border-indigo-200"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <span>Pending Requests</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-extrabold">
                      {pendingRequestsForProject.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRoleRequestsTab("approved")}
                    className={cn(
                      "px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1.5",
                      roleRequestsTab === "approved"
                        ? "bg-white text-emerald-700 shadow-xs border border-emerald-200"
                        : "text-slate-600 hover:text-slate-900"
                    )}
                  >
                    <span>Approved Roles &amp; Grants</span>
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
                      {roleRequests.filter(r => (r.projectId === selectedProjectId || r.projectName === projectName) && r.status === "approved").length}
                    </span>
                  </button>
                </div>
              </div>

              {/* TAB 1: PENDING REQUESTS (5 PER PAGE) */}
              {roleRequestsTab === "pending" && (
                <div className="space-y-3">
                  {paginatedPendingRequests.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center italic">
                      No pending role requests for this project.
                    </p>
                  ) : (
                    paginatedPendingRequests.map((req) => {
                      const isReqAdmin = req.currentRole === "Admin" || req.requestedRole === "Admin" || req.requestedRole === "Owner"
                      const canApproveThis = isProjectOwner || (!isReqAdmin && hasManagerAuthority)

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
                    })
                  )}

                  {totalPendingRequestsPages > 1 && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-500">
                        Showing {(pendingRequestsPage - 1) * 5 + 1} - {Math.min(pendingRequestsPage * 5, pendingRequestsForProject.length)} of {pendingRequestsForProject.length} pending
                      </span>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pendingRequestsPage === 1}
                          onClick={() => setPendingRequestsPage(p => Math.max(1, p - 1))}
                          className="h-7 px-2 text-xs font-bold border-slate-200 cursor-pointer disabled:opacity-40"
                        >
                          Previous
                        </Button>
                        <span className="text-[11px] font-bold text-slate-700 px-2">
                          Page {pendingRequestsPage} of {totalPendingRequestsPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pendingRequestsPage === totalPendingRequestsPages}
                          onClick={() => setPendingRequestsPage(p => Math.min(totalPendingRequestsPages, p + 1))}
                          className="h-7 px-2 text-xs font-bold border-slate-200 cursor-pointer disabled:opacity-40"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: APPROVED ROLES & GRANTS (5 PER PAGE + 1-WEEK AUTO PURGE) */}
              {roleRequestsTab === "approved" && (
                <div className="space-y-3">
                  {paginatedApprovedRequests.length === 0 ? (
                    <div className="py-6 text-center space-y-1">
                      <p className="text-xs font-bold text-slate-600">No approved role grants recorded</p>
                      <p className="text-[11px] text-slate-400">Approved records older than 7 days are automatically purged.</p>
                    </div>
                  ) : (
                    paginatedApprovedRequests.map((req) => (
                      <div key={req.id} className="p-3.5 bg-emerald-50/40 border border-emerald-200/70 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{req.requesterName}</span>
                            <span className="text-[11px] text-slate-500">({req.requesterEmail})</span>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <CheckCheck className="w-3 h-3 text-emerald-600" />
                              <span>Approved &amp; Granted</span>
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-700">
                            Assigned Role: <span className="font-bold text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-200 shadow-2xs">{ROLE_ICONS[req.requestedRole]} {req.requestedRole} (Tier {ROLE_DEFINITIONS[req.requestedRole]?.level || 2})</span>
                          </p>
                          {req.reason && (
                            <p className="text-[10px] text-slate-500 italic bg-white/60 px-2 py-0.5 rounded border border-emerald-100">
                              Justification: &ldquo;{req.reason}&rdquo;
                            </p>
                          )}
                        </div>

                        <div className="text-right text-[11px] text-slate-500 flex-shrink-0 self-start sm:self-auto">
                          <span className="font-semibold text-slate-700">Authorized by {req.reviewedBy || "Owner"}</span>
                          <span className="block text-[10px] text-slate-400">{req.reviewedAt || req.createdAt || "Recently"}</span>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Pagination Controls & 1-Week Retention Banner */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">
                        Showing {approvedRequestsForProject.length === 0 ? 0 : (grantsPage - 1) * 5 + 1} - {Math.min(grantsPage * 5, approvedRequestsForProject.length)} of {approvedRequestsForProject.length} grants
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-200">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>1-Week Retention (Auto-Purged)</span>
                      </span>
                    </div>

                    {totalGrantsPages > 1 && (
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={grantsPage === 1}
                          onClick={() => setGrantsPage(p => Math.max(1, p - 1))}
                          className="h-7 px-2.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer disabled:opacity-40"
                        >
                          Previous
                        </Button>

                        <div className="flex items-center gap-1 px-1">
                          {Array.from({ length: totalGrantsPages }).map((_, idx) => {
                            const pNum = idx + 1
                            return (
                              <button
                                key={pNum}
                                type="button"
                                onClick={() => setGrantsPage(pNum)}
                                className={cn(
                                  "w-6 h-6 rounded-md text-xs font-bold transition-all cursor-pointer",
                                  grantsPage === pNum
                                    ? "bg-[#4f46e5] text-white shadow-xs"
                                    : "text-slate-600 hover:bg-slate-100"
                                )}
                              >
                                {pNum}
                              </button>
                            )
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          disabled={grantsPage === totalGrantsPages}
                          onClick={() => setGrantsPage(p => Math.min(totalGrantsPages, p + 1))}
                          className="h-7 px-2.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer disabled:opacity-40"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                {isProjectOwner ? (
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

            {/* 5-ROLE INTERACTIVE EXPLANATION BAR */}
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

            {/* Side-by-Side Permissions Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
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

          {/* ======================================================== */}
          {/* 🏷️ ENVIRONMENT & CRITICALITY TIER CLASSIFICATION */}
          {/* ======================================================== */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Environment &amp; Criticality Classification</h2>
                  <p className="text-[11px] text-slate-500">Classify deployment targets and business criticality for <strong className="text-slate-800">{projectName}</strong>.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
                  <FolderGit2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project:</span>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => handleSelectProject(e.target.value)}
                    className="text-xs font-bold text-slate-900 bg-transparent border-0 focus:outline-none cursor-pointer pr-1"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {riskMultiplier}
                </span>
              </div>
            </div>

            {/* Notice for Non-Owners */}
            {!isProjectOwner && (
              <div className="flex items-center gap-2 p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-amber-900 text-xs">
                <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Priority &amp; Criticality settings are sovereign to the <strong>Project Owner</strong> ({projectRole} view only).</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Environment Tag */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-slate-500" />
                  Target Environment
                  {!isProjectOwner && <span className="text-[9px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-normal">Owner Only</span>}
                </label>
                <select
                  value={environment}
                  disabled={!isProjectOwner}
                  onChange={(e) => setEnvironment(e.target.value as any)}
                  className={cn(
                    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 font-bold",
                    isProjectOwner 
                      ? "bg-white border-slate-200 text-slate-800 cursor-pointer" 
                      : "bg-slate-50 text-slate-500 border-slate-200/80 cursor-not-allowed select-none"
                  )}
                >
                  <option value="Production">🚀 Production (Live User Traffic)</option>
                  <option value="Staging">🧪 Staging (Pre-release QA &amp; Testing)</option>
                  <option value="Development">💻 Development (Local &amp; Sandbox)</option>
                  <option value="Internal Tool">🛠️ Internal Tool (Backoffice &amp; Admin)</option>
                </select>
                <p className="text-[10px] text-slate-400">Production environments trigger strictest blast radius analysis.</p>
              </div>

              {/* Criticality Tier */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  Business Criticality Tier
                  {!isProjectOwner && <span className="text-[9px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-normal">Owner Only</span>}
                </label>
                <select
                  value={criticalityTier}
                  disabled={!isProjectOwner}
                  onChange={(e) => setCriticalityTier(e.target.value as any)}
                  className={cn(
                    "w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 font-bold",
                    isProjectOwner 
                      ? "bg-white border-slate-200 text-slate-800 cursor-pointer" 
                      : "bg-slate-50 text-slate-500 border-slate-200/80 cursor-not-allowed select-none"
                  )}
                >
                  <option value="Tier 1 - Mission Critical">🔴 Tier 1 - Mission Critical (1.5x Risk Weight &amp; Strict Merge Gate)</option>
                  <option value="Tier 2 - Business Standard">🟡 Tier 2 - Business Standard (1.0x Standard Risk Weight)</option>
                  <option value="Tier 3 - Non-Critical">🟢 Tier 3 - Non-Critical / Sandbox (0.7x Relaxed Risk Scoring)</option>
                </select>
                <p className="text-[10px] text-slate-400">Dynamically calibrates AI scoring sensitivity and checklist rigor.</p>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 🛡️ BRANCH PROTECTION & APPROVAL POLICIES */}
          {/* ======================================================== */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <GitMerge className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Branch Protection &amp; Deployment Sign-off</h2>
                  <p className="text-[11px] text-slate-500">Enforce role-based peer approvals before high-risk changes can be deployed.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Senior Review Gate */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">Require Maintainer or Admin Sign-off for High-Risk PRs</span>
                  <p className="text-[11px] text-slate-500">Blocks deployment checklists if Risk Score &gt; 70 until approved by a Tier 2/3 leader.</p>
                </div>
                <button
                  type="button"
                  disabled={!canEdit}
                  onClick={() => setRequireSeniorReview(!requireSeniorReview)}
                  className={cn(
                    "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    requireSeniorReview ? "bg-indigo-600" : "bg-slate-300"
                  )}
                >
                  <span className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out",
                    requireSeniorReview ? "translate-x-4" : "translate-x-0"
                  )} />
                </button>
              </div>

              {/* Block Direct Commits */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">Block Direct Commits to Default Branch ({defaultBranch})</span>
                  <p className="text-[11px] text-slate-500">Requires all engineering changes to go through a pull request with AST impact scans.</p>
                </div>
                <button
                  type="button"
                  disabled={!canEdit}
                  onClick={() => setBlockDirectCommits(!blockDirectCommits)}
                  className={cn(
                    "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    blockDirectCommits ? "bg-indigo-600" : "bg-slate-300"
                  )}
                >
                  <span className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out",
                    blockDirectCommits ? "translate-x-4" : "translate-x-0"
                  )} />
                </button>
              </div>

              {/* Minimum Approvals Select */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">Minimum Required Peer Approvals</span>
                  <p className="text-[11px] text-slate-500">Minimum number of approved code reviews required before merge.</p>
                </div>
                <select
                  value={minimumApprovals}
                  disabled={!canEdit}
                  onChange={(e) => setMinimumApprovals(Number(e.target.value))}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold text-slate-800 cursor-pointer"
                >
                  <option value={1}>1 Approval Required</option>
                  <option value={2}>2 Approvals Required</option>
                  <option value={3}>3 Approvals Required</option>
                </select>
              </div>
            </div>
          </div>

          {/* GENERAL CONFIGURATION CARD */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Settings className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">General Configuration</h2>
                  <p className="text-[11px] text-slate-500">Project metadata, branch configurations, and your project role.</p>
                </div>
              </div>

              {/* Project Switcher in General Configuration */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 shadow-2xs">
                  <FolderGit2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Project:</span>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => handleSelectProject(e.target.value)}
                    className="text-xs font-bold text-slate-900 bg-transparent border-0 focus:outline-none cursor-pointer pr-1"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                {!canEdit && (
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-amber-600" />
                    Read-Only ({projectRole})
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
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
                        {isProjectOwner
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

                      {isProjectOwner ? (
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

          {/* ======================================================== */}
          {/* 📜 PROJECT AUDIT TRAIL & COMPLIANCE LOGS */}
          {/* ======================================================== */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4 text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Project Audit &amp; Compliance Activity</h2>
                  <p className="text-[11px] text-slate-500">Immutable chronological record of role changes, branch policy updates, and tier changes.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Category filter pills */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                  {(["all", "roles", "config", "approvals"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setAuditFilter(tab)}
                      className={cn(
                        "px-2 py-1 rounded-md transition-all capitalize cursor-pointer",
                        auditFilter === tab ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportAuditLogs}
                  className="h-8 px-2.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </Button>
              </div>
            </div>

            {/* Audit Log Table / Stream (10 per page) */}
            <div className="divide-y divide-slate-100">
              {paginatedAuditLogs.length === 0 ? (
                <div className="py-8 text-center space-y-1">
                  <p className="text-xs font-bold text-slate-600">No audit records found</p>
                  <p className="text-[11px] text-slate-400">Activity logs older than 7 days are automatically purged.</p>
                </div>
              ) : (
                paginatedAuditLogs.map(log => (
                  <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{log.action}</span>
                        <span className={cn(
                          "px-2 py-0.2 rounded-full text-[9px] font-bold uppercase",
                          log.category === "roles" ? "bg-purple-50 text-purple-700 border border-purple-100" :
                          log.category === "approvals" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                          "bg-blue-50 text-blue-700 border border-blue-100"
                        )}>
                          {log.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{log.details}</p>
                    </div>

                    <div className="text-right text-[11px] text-slate-400 flex-shrink-0 self-start sm:self-auto">
                      <span className="font-semibold text-slate-700">{log.actorName}</span> ({log.actorRole}) &bull; {log.timestamp}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls & 7-Day Retention Notice */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">
                  Showing {filteredAuditLogs.length === 0 ? 0 : (auditPage - 1) * AUDIT_PAGE_SIZE + 1} - {Math.min(auditPage * AUDIT_PAGE_SIZE, filteredAuditLogs.length)} of {filteredAuditLogs.length} events
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-200">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>1-Week Retention (Auto-Purged)</span>
                </span>
              </div>

              {totalAuditPages > 1 && (
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={auditPage === 1}
                    onClick={() => setAuditPage(p => Math.max(1, p - 1))}
                    className="h-8 px-2.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer disabled:opacity-40"
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1 px-1">
                    {Array.from({ length: totalAuditPages }).map((_, idx) => {
                      const pNum = idx + 1
                      return (
                        <button
                          key={pNum}
                          type="button"
                          onClick={() => setAuditPage(pNum)}
                          className={cn(
                            "w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer",
                            auditPage === pNum
                              ? "bg-[#4f46e5] text-white shadow-xs"
                              : "text-slate-600 hover:bg-slate-100"
                          )}
                        >
                          {pNum}
                        </button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={auditPage === totalAuditPages}
                    onClick={() => setAuditPage(p => Math.min(totalAuditPages, p + 1))}
                    className="h-8 px-2.5 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer disabled:opacity-40"
                  >
                    Next
                  </Button>
                </div>
              )}
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

      {/* DOUBLE CONFIRMATION MODAL */}
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

      {/* REQUEST ROLE CHANGE MODAL */}
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

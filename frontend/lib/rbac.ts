export type RoleType = "Owner" | "Admin" | "Maintainer" | "Developer" | "Viewer"

export interface RoleDefinition {
  name: RoleType
  label: string
  level: number
  badgeColor: string
  description: string
  allowed: string[]
  restricted: string[]
}

export interface RoleChangeRequest {
  id: string
  projectId: string
  projectName: string
  requesterName: string
  requesterEmail: string
  currentRole: RoleType
  requestedRole: RoleType
  reason?: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
  reviewedBy?: string
  reviewedAt?: string
}

export const ROLE_DEFINITIONS: Record<RoleType, RoleDefinition> = {
  Owner: {
    name: "Owner",
    label: "Owner (Full Admin)",
    level: 1,
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Complete authority over the organization, billing, project lifecycle, and destructive actions.",
    allowed: [
      "Permanently delete projects & repositories",
      "Invite, promote, and remove team members",
      "Modify project branches and team ownership",
      "Configure webhooks and integrations (Slack, Nhost, GitHub)",
      "Trigger AI risk analysis & generate deployment checklists",
      "Export risk reports & compliance audit logs",
      "Directly grant or change anyone's role as per mood",
      "Toggle Admin power to change and approve project roles"
    ],
    restricted: []
  },
  Admin: {
    name: "Admin",
    label: "Admin",
    level: 2,
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    description: "Administrative control over project configurations, invitations, and pipeline integrations.",
    allowed: [
      "Create & configure projects and repositories",
      "Invite & manage team members",
      "Configure webhooks and integrations (Slack, Nhost)",
      "Trigger AI risk scans and view all reports",
      "Export risk reports and checklists",
      "Approve and change roles (when granted by Owner)"
    ],
    restricted: [
      "Permanently delete projects (Owner only)",
      "Delete teams or transfer organization ownership",
      "Change roles if Owner has disabled Admin role management"
    ]
  },
  Maintainer: {
    name: "Maintainer",
    label: "Maintainer",
    level: 3,
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    description: "Engineering lead responsible for repository settings, branch protection, and pipeline scans.",
    allowed: [
      "Edit project settings and default branches",
      "Trigger and rerun AI risk analysis scans",
      "View breaking change impacts and dependency graphs",
      "Export reports and audit logs",
      "Submit role change requests to Owner & Admin"
    ],
    restricted: [
      "Directly change own role without Owner/Admin approval",
      "Permanently delete projects or services",
      "Invite new team members or alter team roles",
      "Connect or revoke global webhook integrations"
    ]
  },
  Developer: {
    name: "Developer",
    label: "Developer",
    level: 4,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Standard developer access to run PR risk scans, view insights, and access deployment checklists.",
    allowed: [
      "Trigger AI risk analysis on pull requests",
      "View risk scorecards, blast radius, and AI explanations",
      "Export and download analysis reports",
      "Submit role change requests to Owner & Admin"
    ],
    restricted: [
      "Directly change own role without Owner/Admin approval",
      "Modify project configuration or default branches",
      "Invite or remove team members",
      "Delete projects or repositories",
      "Configure integration tokens and webhooks"
    ]
  },
  Viewer: {
    name: "Viewer",
    label: "Viewer (Read-Only)",
    level: 5,
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    description: "Auditor and stakeholder read-only access to view risk reports, architecture graphs, and metrics.",
    allowed: [
      "View project dashboards and health metrics",
      "Inspect AI risk reports and architectural graphs",
      "Read compliance checklists",
      "Submit role upgrade requests to Owner & Admin"
    ],
    restricted: [
      "Directly change own role without Owner/Admin approval",
      "Trigger or re-run risk analysis scans",
      "Edit project settings or branch defaults",
      "Invite or manage team members",
      "Modify integrations or delete projects"
    ]
  }
}

export const canUser = (
  role: RoleType | string, 
  action: "delete_project" | "edit_project" | "invite_member" | "delete_team" | "manage_integrations" | "trigger_scan" | "manage_roles",
  allowAdminRoleManagement: boolean = true
): boolean => {
  const normalizedRole = (role || "Developer") as RoleType
  
  switch (action) {
    case "delete_project":
      return normalizedRole === "Owner"
    case "delete_team":
      return normalizedRole === "Owner"
    case "edit_project":
      return normalizedRole === "Owner" || normalizedRole === "Admin" || normalizedRole === "Maintainer"
    case "invite_member":
      return normalizedRole === "Owner" || normalizedRole === "Admin"
    case "manage_integrations":
      return normalizedRole === "Owner" || normalizedRole === "Admin"
    case "trigger_scan":
      return normalizedRole !== "Viewer"
    case "manage_roles":
      if (normalizedRole === "Owner") return true
      if (normalizedRole === "Admin" && allowAdminRoleManagement) return true
      return false
    default:
      return false
  }
}

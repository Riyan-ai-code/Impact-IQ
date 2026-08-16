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
  createdAtEpoch?: number
  reviewedBy?: string
  reviewedAt?: string
}

export const ROLE_DEFINITIONS: Record<RoleType, RoleDefinition> = {
  Owner: {
    name: "Owner",
    label: "Owner (Full Admin)",
    level: 1,
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    description: "Complete sovereign authority over the project, billing, roles, and destructive actions.",
    allowed: [
      "Permanently delete projects & repositories",
      "Transfer project ownership or step down to lower tiers",
      "Change and approve roles for Admins and all team members",
      "Configure Environment & Business Criticality Tiers (Tier 1/2/3)",
      "Enforce Branch Protection & Deployment Sign-off Policies",
      "Invite, promote, and remove team members",
      "Configure webhooks & pipeline integrations (Slack, GitHub)",
      "Trigger AI risk analysis, AST scans, and manual prompt reviews",
      "Export compliance audit logs and risk reports"
    ],
    restricted: []
  },
  Admin: {
    name: "Admin",
    label: "Admin",
    level: 2,
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    description: "Administrative control over project configurations, invitations, and team role management.",
    allowed: [
      "Create & configure projects, default branches, and environment tiers",
      "Approve and grant role change requests for Maintainers, Developers, and Viewers",
      "Enforce Branch Protection & Deployment Approval gates",
      "Invite and manage team members",
      "Configure webhooks & integrations (Slack, GitHub)",
      "Trigger AI risk scans and approve PR deployment checklists",
      "Export risk reports, checklists, and compliance audit logs"
    ],
    restricted: [
      "Cannot modify or approve roles for other Admins (Owner-only authority)",
      "Cannot change or transfer Owner role",
      "Cannot permanently delete projects or repositories (Owner only)"
    ]
  },
  Maintainer: {
    name: "Maintainer",
    label: "Maintainer",
    level: 3,
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    description: "Engineering lead responsible for repository settings, branch protection, and high-risk PR sign-offs.",
    allowed: [
      "Trigger and rerun AI risk analysis & manual prompt scans",
      "Authorize deployment sign-off checklists for High-Risk PRs",
      "Edit project general settings and default branches",
      "View breaking change impacts and dependency graphs",
      "Export analysis reports and compliance audit logs",
      "Submit role upgrade requests to Owner & Admins"
    ],
    restricted: [
      "Cannot approve or reject role change requests",
      "Cannot invite or remove team members",
      "Cannot configure global webhooks or third-party integrations",
      "Cannot delete projects or change ownership"
    ]
  },
  Developer: {
    name: "Developer",
    label: "Developer",
    level: 4,
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    description: "Standard developer access to run PR risk scans, view insights, and submit role change requests.",
    allowed: [
      "Trigger automated AI risk analysis & custom prompt reviews on PRs",
      "View risk scorecards, blast radius, and AI explanations",
      "Inspect project audit logs & compliance history",
      "Export and download analysis reports",
      "Submit role change requests via email to Owner & Admins"
    ],
    restricted: [
      "Cannot sign off on High-Risk PR deployment gates (requires Maintainer/Admin)",
      "Cannot modify project configurations or default branches",
      "Cannot approve role change requests",
      "Cannot invite or remove team members",
      "Cannot delete projects or manage integrations"
    ]
  },
  Viewer: {
    name: "Viewer",
    label: "Viewer (Read-Only)",
    level: 5,
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    description: "Auditor and stakeholder read-only access to view risk reports, architecture graphs, and audit trails.",
    allowed: [
      "Read-only access to project overview, health metrics, and architecture",
      "Inspect published AI risk scorecards and dependency graphs",
      "View project audit trail and compliance activity",
      "Submit role upgrade requests via email to Owner & Admins"
    ],
    restricted: [
      "Cannot trigger or rerun AI risk analysis scans",
      "Cannot edit project configurations, environments, or branch rules",
      "Cannot approve deployment sign-offs or role requests",
      "Cannot invite or manage team members",
      "Cannot modify integrations or delete projects"
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

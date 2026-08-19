"use client"

import { useState, useEffect } from "react"
import {
  Rocket,
  ShieldCheck,
  BarChart2,
  Plus,
  Github,
  Lightbulb,
  GitBranch,
  FolderPlus,
  FolderGit2,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  ShieldAlert,
  Activity,
  Layers,
  Sparkles,
  Search
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getScopedItem } from "@/lib/storageScope"

interface Project {
  id: string
  name: string
  description: string
  repository: string
  branch: string
  team?: string
  securityAnalysis: boolean
  dependencyAnalysis: boolean
  apiAnalysis: boolean
  createdAt: string
}

export default function DashboardHome() {
  const [isGuest, setIsGuest] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<{ name: string; email?: string; login?: string }>({
    name: "Guest"
  })
  const [userProjects, setUserProjects] = useState<Project[]>([])

  useEffect(() => {
    const ghToken = localStorage.getItem("github_token") || localStorage.getItem("github_connected")
    const ghSaved = localStorage.getItem("github_connected_user")
    const savedUser = localStorage.getItem("impact_iq_user")

    let authenticated = false

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        if (user.isGuest === true) {
          authenticated = false
        } else if (user.id || user.email) {
          authenticated = true
          setUserProfile({
            name: user.displayName || user.name || user.email.split("@")[0],
            email: user.email
          })
        }
      } catch (e) {}
    }

    if (ghSaved) {
      try {
        const gh = JSON.parse(ghSaved)
        authenticated = true
        setUserProfile({
          name: gh.name || gh.login || "Connected Developer",
          email: gh.email || `${gh.login}@github.com`,
          login: gh.login
        })
      } catch (e) {}
    } else if (ghToken && !ghToken.startsWith("guest") && ghToken !== "true") {
      authenticated = true
    }

    // Determine user's teams for strict team isolation
    const savedTeams = getScopedItem("impact_iq_teams")
    const currentEmail = userProfile.email || "dev@impactiq.dev"
    const currentName = userProfile.name || "Developer"
    const myTeams: string[] = []

    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams)
        if (Array.isArray(parsedTeams)) {
          parsedTeams.forEach((t: any) => {
            if (Array.isArray(t.members)) {
              const isMember = t.members.some((m: any) => 
                (m.email && currentEmail && m.email.toLowerCase() === currentEmail.toLowerCase()) ||
                (m.name && currentName && m.name.toLowerCase() === currentName.toLowerCase()) ||
                !authenticated
              )
              if (isMember) {
                myTeams.push(t.name)
              }
            }
          })
        }
      } catch (e) {}
    }

    setIsGuest(!authenticated)

    // Load Projects scoped to user's team
    const savedProjects = getScopedItem("impact_iq_projects")
    if (savedProjects) {
      try {
        const parsed = JSON.parse(savedProjects)
        if (Array.isArray(parsed)) {
          const visible = parsed.filter((p: Project) => {
            if (!p.team) return true
            return myTeams.includes(p.team) || !authenticated
          })
          setUserProjects(visible)
        }
      } catch (e) {}
    }

    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
        <div className="flex items-center gap-2 text-xs font-bold text-content-secondary">
          <Github className="w-4 h-4 text-brand" />
          <span>Loading workspace...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-6rem)] py-6 select-none relative text-content-primary">
      <div className="w-full max-w-5xl space-y-6 text-left">
        
        {/* ========================================================================= */}
        {/* GUEST MODE VIEW ONLY */}
        {/* ========================================================================= */}
        {isGuest ? (
          <div className="space-y-6">
            {/* Guest Header Banner */}
            <div className="bg-gradient-to-r from-[#845EC2] via-[#C34A36] to-[#FF8066] dark:from-[#0f1219] dark:via-[#141829] dark:to-[#1a1f3a] border border-border rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-bold uppercase tracking-[0.5px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Interactive Guest Workspace</span>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">Example Demo Repositories</h2>
                <p className="text-xs text-white/90 leading-relaxed">
                  Explore live deployment risk analysis, PR impact scores, and service dependency maps on pre-loaded example microservices.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 z-10">
                <Button
                  onClick={() => window.location.href = "/dashboard/analysis"}
                  className="h-11 px-5 text-xs font-bold bg-white text-gray-900 hover:bg-white/90 rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Rocket className="w-4 h-4 text-brand" />
                  <span>Run New Analysis</span>
                </Button>
                <Button
                  onClick={() => window.location.href = "http://localhost:8000/api/auth/github/login"}
                  className="h-11 px-4 text-xs font-bold bg-black/20 hover:bg-black/30 border border-white/20 text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                  <span>Connect GitHub</span>
                </Button>
              </div>
            </div>

            {/* Sample Repositories for Guest Mode Only */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-content-primary uppercase tracking-[0.5px] flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-brand" />
                SAMPLE REPOSITORIES AVAILABLE FOR RISK INSPECTION
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Repo 1 */}
                <div className="bg-surface-1 border border-border hover:bg-surface-2 rounded-xl p-5 shadow-xs transition-all duration-150 space-y-4 flex flex-col justify-between text-content-primary">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--tag-typescript-bg)] text-[var(--tag-typescript-text)] border border-border">
                        TypeScript
                      </span>
                      <span className="text-[10px] font-bold text-[var(--tag-iot-text)] bg-[var(--tag-iot-bg)] px-2 py-0.5 rounded-full">
                        Low Risk (94%)
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-content-primary flex items-center gap-1.5">
                      <Github className="w-4 h-4 text-content-muted" />
                      payment-service
                    </h4>
                    <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                      Microservices based Stripe & PayPal checkout platform with webhook events.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] font-medium text-content-muted">Branch: main</span>
                    <Button
                      onClick={() => window.location.href = "/dashboard/analysis"}
                      className="h-8 px-3 text-[11px] font-bold border border-border text-brand hover:bg-surface-3 bg-surface-2 rounded-lg cursor-pointer transition-colors"
                    >
                      View Report
                    </Button>
                  </div>
                </div>

                {/* Repo 2 */}
                <div className="bg-surface-1 border border-border hover:bg-surface-2 rounded-xl p-5 shadow-xs transition-all duration-150 space-y-4 flex flex-col justify-between text-content-primary">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--tag-iot-bg)] text-[var(--tag-iot-text)] border border-border">
                        Python FastAPI
                      </span>
                      <span className="text-[10px] font-bold text-[var(--tag-dependencies-text)] bg-[var(--tag-dependencies-bg)] px-2 py-0.5 rounded-full">
                        Medium Risk (88%)
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-content-primary flex items-center gap-1.5">
                      <Github className="w-4 h-4 text-content-muted" />
                      auth-gateway
                    </h4>
                    <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                      OAuth2 JWT token validation and role-based access control service.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] font-medium text-content-muted">Branch: develop</span>
                    <Button
                      onClick={() => window.location.href = "/dashboard/analysis"}
                      className="h-8 px-3 text-[11px] font-bold border border-border text-brand hover:bg-surface-3 bg-surface-2 rounded-lg cursor-pointer transition-colors"
                    >
                      View Report
                    </Button>
                  </div>
                </div>

                {/* Repo 3 */}
                <div className="bg-surface-1 border border-border hover:bg-surface-2 rounded-xl p-5 shadow-xs transition-all duration-150 space-y-4 flex flex-col justify-between text-content-primary">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--tag-p2p-bg)] text-[var(--tag-p2p-text)] border border-border">
                        Go / Microservice
                      </span>
                      <span className="text-[10px] font-bold text-[var(--tag-iot-text)] bg-[var(--tag-iot-bg)] px-2 py-0.5 rounded-full">
                        Low Risk (96%)
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-content-primary flex items-center gap-1.5">
                      <Github className="w-4 h-4 text-content-muted" />
                      order-processing
                    </h4>
                    <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                      High-throughput event-driven order processing engine with Kafka queue.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <span className="text-[10px] font-medium text-content-muted">Branch: main</span>
                    <Button
                      onClick={() => window.location.href = "/dashboard/analysis"}
                      className="h-8 px-3 text-[11px] font-bold border border-border text-brand hover:bg-surface-3 bg-surface-2 rounded-lg cursor-pointer transition-colors"
                    >
                      View Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards Grid (Guest Mode) */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="bg-surface-1 rounded-xl p-5 border border-border flex items-start gap-4 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[var(--tag-typescript-bg)] border border-border flex items-center justify-center text-[var(--tag-typescript-text)] flex-shrink-0">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-content-primary">Example Projects</h4>
                  <p className="text-[11px] text-content-secondary mt-0.5 leading-normal">
                    Inspect sample microservice codebases with pre-calculated PR risk scores.
                  </p>
                </div>
              </div>

              <div className="bg-surface-1 rounded-xl p-5 border border-border flex items-start gap-4 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[var(--tag-iot-bg)] border border-border flex items-center justify-center text-[var(--tag-iot-text)] flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-content-primary">Smart Analysis</h4>
                  <p className="text-[11px] text-content-secondary mt-0.5 leading-normal">
                    Automatically analyze pull requests, dependencies, and API contract risks.
                  </p>
                </div>
              </div>

              <div className="bg-surface-1 rounded-xl p-5 border border-border flex items-start gap-4 shadow-xs">
                <div className="w-10 h-10 rounded-lg bg-[var(--tag-p2p-bg)] border border-border flex items-center justify-center text-[var(--tag-p2p-text)] flex-shrink-0">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-content-primary">Actionable Insights</h4>
                  <p className="text-[11px] text-content-secondary mt-0.5 leading-normal">
                    Get detailed insights and fix deployment risks before shipping to production.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* NORMAL (AUTHENTICATED) MODE VIEW ONLY */
          /* ========================================================================= */
          <div className="space-y-6">
            {/* Authenticated Header Banner */}
            <div className="bg-gradient-to-r from-[#845EC2] via-[#C34A36] to-[#FF8066] dark:from-[#0f1219] dark:via-[#141829] dark:to-[#1a1f3a] border border-border rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-bold uppercase tracking-[0.5px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Production Workspace</span>
                </div>
                <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">
                  Welcome back, {userProfile.name}
                </h2>
                <p className="text-xs text-white/90 leading-relaxed">
                  Your live deployment risk intelligence pipeline is active. Manage your connected GitHub repositories, run AI-powered PR impact scans, and monitor breaking changes.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 z-10">
                <Button
                  onClick={() => window.location.href = "/dashboard/analysis"}
                  className="h-11 px-5 text-xs font-bold bg-white text-gray-900 hover:bg-white/90 rounded-xl flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Rocket className="w-4 h-4 text-brand" />
                  <span>Run New Analysis</span>
                </Button>
                <Button
                  onClick={() => window.location.href = "/dashboard/repositories"}
                  className="h-11 px-4 text-xs font-bold bg-black/20 hover:bg-black/30 border border-white/20 text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </Button>
              </div>
            </div>

            {/* Quick Metrics Bar for Authenticated User */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-surface-1 border border-border rounded-xl p-4 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[var(--tag-typescript-bg)] border border-border flex items-center justify-center text-[var(--tag-typescript-text)]">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-content-muted">Total Projects</p>
                  <h4 className="text-lg font-extrabold text-content-primary">{userProjects.length}</h4>
                </div>
              </div>

              <div className="bg-surface-1 border border-border rounded-xl p-4 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[var(--tag-iot-bg)] border border-border flex items-center justify-center text-[var(--tag-iot-text)]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-content-muted">Pipeline Status</p>
                  <h4 className="text-lg font-extrabold text-[var(--tag-iot-text)]">Active &amp; Guarded</h4>
                </div>
              </div>

              <div className="bg-surface-1 border border-border rounded-xl p-4 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[var(--tag-p2p-bg)] border border-border flex items-center justify-center text-[var(--tag-p2p-text)]">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-content-muted">AI Risk Engine</p>
                  <h4 className="text-lg font-extrabold text-[var(--tag-p2p-text)]">Gemini 1.5 Pro</h4>
                </div>
              </div>

              <div className="bg-surface-1 border border-border rounded-xl p-4 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-[var(--tag-dependencies-bg)] border border-border flex items-center justify-center text-[var(--tag-dependencies-text)]">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.5px] text-content-muted">Connected As</p>
                  <h4 className="text-sm font-bold text-content-primary truncate max-w-[120px]">
                    {userProfile.login || userProfile.name}
                  </h4>
                </div>
              </div>
            </div>

            {/* Authenticated User's Connected Projects */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-content-primary uppercase tracking-[0.5px] flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-brand" />
                  Your Active Engineering Projects ({userProjects.length})
                </h3>
                <Button
                  onClick={() => window.location.href = "/dashboard/repositories"}
                  className="h-8 px-3 text-xs font-bold text-white bg-gradient-to-r from-[#845EC2] via-[#C34A36] to-[#FF8066] dark:from-indigo-600 dark:to-indigo-700 rounded-lg cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </Button>
              </div>

              {userProjects.length === 0 ? (
                <div className="bg-surface-1 border border-dashed border-border rounded-2xl p-10 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-surface-2 border border-border flex items-center justify-center text-brand mx-auto">
                    <FolderPlus className="w-6 h-6" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="text-sm font-bold text-content-primary">No Projects Configured Yet</h4>
                    <p className="text-xs text-content-secondary">
                      Import a repository from your connected GitHub account to configure automated pull request scans and breaking change detection.
                    </p>
                  </div>
                  <Button
                    onClick={() => window.location.href = "/dashboard/repositories"}
                    className="h-10 px-5 text-xs font-bold text-white bg-gradient-to-r from-[#845EC2] via-[#C34A36] to-[#FF8066] dark:from-indigo-600 dark:to-indigo-700 rounded-xl inline-flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Project from GitHub Repositories</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-surface-1 border border-border hover:bg-surface-2 rounded-xl p-5 shadow-xs transition-all duration-150 space-y-3 flex flex-col justify-between text-content-primary"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--tag-p2p-bg)] text-[var(--tag-p2p-text)] border border-border">
                            {proj.team || "Platform Engineering"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-content-secondary bg-surface-2 px-2 py-0.5 rounded-full border border-border">
                            <GitBranch className="w-3 h-3 text-content-muted" />
                            {proj.branch || "main"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-content-primary leading-snug">{proj.name}</h4>
                        <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
                          {proj.description || `Connected repository: ${proj.repository}`}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {proj.securityAnalysis && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--tag-security-bg)] text-[var(--tag-security-text)]">Security</span>
                          )}
                          {proj.dependencyAnalysis && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--tag-iot-bg)] text-[var(--tag-iot-text)]">Dependencies</span>
                          )}
                          {proj.apiAnalysis && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--tag-typescript-bg)] text-[var(--tag-typescript-text)]">API</span>
                          )}
                        </div>
                        <Button
                          onClick={() => window.location.href = "/dashboard/analysis"}
                          className="h-7 px-2.5 text-[11px] font-bold text-brand hover:bg-surface-3 bg-surface-2 border border-border rounded-lg cursor-pointer flex items-center gap-1"
                        >
                          <span>Analyze</span>
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      <div className="flex items-center gap-2 text-content-muted text-xs font-semibold mt-8">
        <Lightbulb className="w-4 h-4 text-brand animate-pulse" />
        <span>ImpactIQ helps engineering teams ship secure, reliable code with zero breaking changes.</span>
      </div>
    </div>
  )
}

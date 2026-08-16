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
    } else if (ghToken) {
      authenticated = true
    }

    setIsGuest(!authenticated)

    // Load projects from scoped storage
    const projectsKey = authenticated 
      ? (ghSaved ? `impact_iq_projects_${(JSON.parse(ghSaved).login || 'auth_user').toLowerCase().replace(/[^a-z0-9_-]/g, '_')}` : 'impact_iq_projects_auth_user')
      : 'impact_iq_projects_guest'

    const savedProjects = localStorage.getItem(projectsKey) || getScopedItem("impact_iq_projects")
    if (savedProjects) {
      try {
        const parsed: Project[] = JSON.parse(savedProjects)
        if (Array.isArray(parsed)) {
          setUserProjects(parsed)
        }
      } catch (e) {}
    }

    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Github className="w-4 h-4 text-indigo-600" />
          <span>Loading workspace...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-6rem)] py-6 select-none relative">
      <div className="w-full max-w-5xl space-y-6 text-left">
        
        {/* ========================================================================= */}
        {/* GUEST MODE VIEW ONLY */}
        {/* ========================================================================= */}
        {isGuest ? (
          <div className="space-y-6">
            {/* Guest Header Banner */}
            <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border border-white/10 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Interactive Guest Workspace</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">Example Demo Repositories</h2>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Explore live deployment risk analysis, PR impact scores, and service dependency maps on pre-loaded example microservices.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 z-10">
                <Button
                  variant="brand"
                  onClick={() => window.location.href = "/dashboard/analysis"}
                  className="h-11 px-5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Run New Analysis</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "http://localhost:8000/api/auth/github/login"}
                  className="h-11 px-4 text-xs font-bold bg-white/10 hover:bg-white/15 border-white/20 text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                  <span>Connect GitHub</span>
                </Button>
              </div>
            </div>

            {/* Sample Repositories for Guest Mode Only */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-600" />
                SAMPLE REPOSITORIES AVAILABLE FOR RISK INSPECTION
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Repo 1 */}
                <div className="bg-white border border-slate-200/80 hover:border-indigo-200 rounded-xl p-5 shadow-xs transition-all space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        TypeScript
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Low Risk (94%)
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Github className="w-4 h-4 text-slate-700" />
                      payment-service
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      Microservices based Stripe & PayPal checkout platform with webhook events.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400">Branch: main</span>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = "/dashboard/analysis"}
                      className="h-8 px-3 text-[11px] font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                    >
                      View Report
                    </Button>
                  </div>
                </div>

                {/* Repo 2 */}
                <div className="bg-white border border-slate-200/80 hover:border-indigo-200 rounded-xl p-5 shadow-xs transition-all space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                        Python FastAPI
                      </span>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        Medium Risk (88%)
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Github className="w-4 h-4 text-slate-700" />
                      auth-gateway
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      OAuth2 JWT token validation and role-based access control service.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400">Branch: develop</span>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = "/dashboard/analysis"}
                      className="h-8 px-3 text-[11px] font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                    >
                      View Report
                    </Button>
                  </div>
                </div>

                {/* Repo 3 */}
                <div className="bg-white border border-slate-200/80 hover:border-indigo-200 rounded-xl p-5 shadow-xs transition-all space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                        Go / Microservice
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Low Risk (96%)
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Github className="w-4 h-4 text-slate-700" />
                      order-processing
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      High-throughput event-driven order processing engine with Kafka queue.
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-400">Branch: main</span>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = "/dashboard/analysis"}
                      className="h-8 px-3 text-[11px] font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                    >
                      View Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Cards Grid (Guest Mode) */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="bg-white rounded-xl p-5 border border-slate-200/80 flex items-start gap-4 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Example Projects</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    Inspect sample microservice codebases with pre-calculated PR risk scores.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200/80 flex items-start gap-4 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Smart Analysis</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                    Automatically analyze pull requests, dependencies, and API contract risks.
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200/80 flex items-start gap-4 shadow-2xs">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Actionable Insights</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
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
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="space-y-2 z-10 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Production Workspace</span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                  Welcome back, {userProfile.name}
                </h2>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Your live deployment risk intelligence pipeline is active. Manage your connected GitHub repositories, run AI-powered PR impact scans, and monitor breaking changes.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0 z-10">
                <Button
                  variant="brand"
                  onClick={() => window.location.href = "/dashboard/analysis"}
                  className="h-11 px-5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Rocket className="w-4 h-4" />
                  <span>Run New Analysis</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/dashboard/repositories"}
                  className="h-11 px-4 text-xs font-bold bg-white/10 hover:bg-white/15 border-white/20 text-white rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Project</span>
                </Button>
              </div>
            </div>

            {/* Quick Metrics Bar for Authenticated User */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Projects</p>
                  <h4 className="text-lg font-bold text-slate-900">{userProjects.length}</h4>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pipeline Status</p>
                  <h4 className="text-lg font-bold text-emerald-600">Active &amp; Guarded</h4>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">AI Risk Engine</p>
                  <h4 className="text-lg font-bold text-purple-600">Gemini 1.5 Pro</h4>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-xs flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Connected As</p>
                  <h4 className="text-sm font-bold text-slate-900 truncate max-w-[120px]">
                    {userProfile.login || userProfile.name}
                  </h4>
                </div>
              </div>
            </div>

            {/* Authenticated User's Connected Projects */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <FolderGit2 className="w-4 h-4 text-indigo-600" />
                  Your Active Engineering Projects ({userProjects.length})
                </h3>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = "/dashboard/repositories"}
                  className="h-8 px-3 text-xs font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50 rounded-lg cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </Button>
              </div>

              {userProjects.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
                    <FolderPlus className="w-6 h-6" />
                  </div>
                  <div className="max-w-md mx-auto space-y-1">
                    <h4 className="text-sm font-bold text-slate-900">No Projects Configured Yet</h4>
                    <p className="text-xs text-slate-500">
                      Import a repository from your connected GitHub account to configure automated pull request scans and breaking change detection.
                    </p>
                  </div>
                  <Button
                    variant="brand"
                    onClick={() => window.location.href = "/dashboard/repositories"}
                    className="h-10 px-5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl inline-flex items-center gap-2 shadow-sm cursor-pointer"
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
                      className="bg-white border border-slate-200/80 hover:border-indigo-300 rounded-xl p-5 shadow-xs transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                            {proj.team || "Platform Engineering"}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                            <GitBranch className="w-3 h-3 text-slate-400" />
                            {proj.branch || "main"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{proj.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {proj.description || `Connected repository: ${proj.repository}`}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {proj.securityAnalysis && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">Security</span>
                          )}
                          {proj.dependencyAnalysis && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">Dependencies</span>
                          )}
                          {proj.apiAnalysis && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">API</span>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => window.location.href = "/dashboard/analysis"}
                          className="h-7 px-2.5 text-[11px] font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50 rounded-lg cursor-pointer flex items-center gap-1"
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

      <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mt-8">
        <Lightbulb className="w-4 h-4 text-indigo-500 animate-pulse" />
        <span>ImpactIQ helps engineering teams ship secure, reliable code with zero breaking changes.</span>
      </div>
    </div>
  )
}

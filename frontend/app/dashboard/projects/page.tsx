"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  FolderGit2, 
  Plus, 
  GitBranch, 
  Github, 
  ShieldCheck, 
  Network, 
  Cpu, 
  Trash2, 
  ExternalLink,
  Search,
  ArrowRight,
  Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

import { fetchProjectsFromNhost } from "@/services/nhostService"
import { getScopedItem, setScopedItem, isGuestMode } from "@/lib/storageScope"

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [userTeams, setUserTeams] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProjects() {
      // 1. Determine user's teams
      const guest = isGuestMode()
      const savedTeams = getScopedItem("impact_iq_teams")
      const savedUser = localStorage.getItem("impact_iq_user")
      let currentEmail = "dev@impactiq.dev"
      let currentName = "Developer"

      if (savedUser) {
        try {
          const u = JSON.parse(savedUser)
          currentEmail = u.email || currentEmail
          currentName = u.name || currentName
        } catch (e) {}
      }

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
                  guest
                )
                if (isMember) {
                  myTeams.push(t.name)
                }
              } else {
                myTeams.push(t.name)
              }
            })
          }
        } catch (e) {}
      }

      if (myTeams.length === 0) {
        myTeams.push("Platform Engineering", "DevOps Core", "Security Ops")
      }
      setUserTeams(myTeams)

      // 2. Load Projects
      const ghToken = localStorage.getItem("github_token")
      if (ghToken) {
        const nhostProjects = await fetchProjectsFromNhost()
        if (nhostProjects && nhostProjects.length > 0) {
          setProjects(nhostProjects)
          setScopedItem("impact_iq_projects", JSON.stringify(nhostProjects))
          setLoading(false)
          return
        }
      }

      const savedProjects = getScopedItem("impact_iq_projects")
      if (savedProjects) {
        try {
          setProjects(JSON.parse(savedProjects))
        } catch (err) {
          console.error("Error parsing saved projects:", err)
        }
      } else {
        setProjects([])
      }
      setLoading(false)
    }

    loadProjects()
  }, [])

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id)
    setProjects(updated)
    setScopedItem("impact_iq_projects", JSON.stringify(updated))
  }

  // Strict team isolation: Team A only sees Team A projects; Team B only sees Team B projects
  const teamIsolatedProjects = projects.filter(p => !p.team || userTeams.includes(p.team))

  const filteredProjects = teamIsolatedProjects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Projects</h1>
          <p className="text-xs text-slate-500 mt-1">Manage connected repositories and configure analysis settings.</p>
        </div>
        
        {projects.length > 0 && (
          <Button
            variant="brand"
            onClick={() => router.push("/dashboard/repositories")}
            className="h-10 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg flex items-center gap-2 transition-all duration-150 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        )}
      </div>

      {/* If No Projects Exist — Empty State */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[55vh] p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-white space-y-5 text-center">
          <div className="w-16 h-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
            <FolderGit2 className="w-8 h-8" />
          </div>
          
          <div className="space-y-1.5 max-w-sm">
            <h3 className="text-base font-bold text-slate-900">No Projects Created Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connect a GitHub repository to create your first engineering analysis project and start tracking deployment risks.
            </p>
          </div>

          <Button
            variant="brand"
            onClick={() => router.push("/dashboard/repositories")}
            className="px-6 h-11 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg flex items-center gap-2 transition-all duration-150 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Project from Repositories
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Button>
        </div>
      ) : (
        /* If Projects Exist — List Grid */
        <div className="space-y-5">
          {/* Search & Filter Row */}
          <div className="flex items-center justify-between">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">Total: {filteredProjects.length} projects</span>
          </div>

          {/* Projects Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <div 
                key={project.id}
                className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-200 text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100/60 flex items-center justify-center text-indigo-600 flex-shrink-0">
                        <FolderGit2 className="w-4.5 h-4.5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug hover:text-indigo-600 transition-colors">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mt-0.5">
                          <Github className="w-3 h-3 text-slate-400" />
                          <span>{project.repository}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                      <Building2 className="w-3 h-3 text-purple-600" />
                      {project.team || "Platform Engineering"}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      <GitBranch className="w-3 h-3" />
                      {project.branch}
                    </span>

                    {project.securityAnalysis && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100/60">
                        Security
                      </span>
                    )}

                    {project.dependencyAnalysis && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100/60">
                        Dependencies
                      </span>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => window.location.href = "/dashboard/analysis"}
                    className="h-8 px-3 text-xs font-bold text-indigo-600 border-indigo-200 hover:bg-indigo-50 flex items-center gap-1 rounded-lg"
                  >
                    <span>Analyze</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

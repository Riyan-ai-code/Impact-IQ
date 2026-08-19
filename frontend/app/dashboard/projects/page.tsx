"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { 
  FolderGit2, 
  GitBranch, 
  Github, 
  Trash2, 
  ExternalLink, 
  Search, 
  Building2, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { fetchProjectsFromNhost } from "@/services/nhostService"
import { getScopedItem, setScopedItem, isGuestMode } from "@/lib/storageScope"

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

const ITEMS_PER_PAGE = 50

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [userTeams, setUserTeams] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProjects() {
      // 1. Determine user's teams dynamically
      const guest = isGuestMode()
      const savedTeams = getScopedItem("impact_iq_teams") || localStorage.getItem("impact_iq_teams")
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
              } else if (t.name) {
                myTeams.push(t.name)
              }
            })
          }
        } catch (e) {}
      }
      setUserTeams(myTeams)

      // 2. Load Projects purely dynamically from live sources
      let loadedProjects: Project[] = []

      // Try Nhost GraphQL if authenticated
      const ghToken = localStorage.getItem("github_token")
      if (ghToken) {
        try {
          const nhostProjects = await fetchProjectsFromNhost()
          if (nhostProjects && nhostProjects.length > 0) {
            loadedProjects = nhostProjects
          }
        } catch (e) {
          console.warn("Could not fetch Nhost projects:", e)
        }
      }

      // Check scoped storage
      if (loadedProjects.length === 0) {
        const scoped = getScopedItem("impact_iq_projects")
        if (scoped) {
          try {
            const parsed = JSON.parse(scoped)
            if (Array.isArray(parsed) && parsed.length > 0) {
              loadedProjects = parsed.filter((p: any) => !p.id?.startsWith("proj-") || p.userRole)
            }
          } catch (e) {}
        }
      }

      // Check global/unscoped storage keys
      if (loadedProjects.length === 0) {
        const directKeys = [
          "impact_iq_projects",
          "impact_iq_projects_guest",
          "impact_iq_projects_auth_user"
        ]

        for (const k of directKeys) {
          const val = localStorage.getItem(k)
          if (val) {
            try {
              const parsed = JSON.parse(val)
              if (Array.isArray(parsed) && parsed.length > 0) {
                const valid = parsed.filter((p: any) => !p.id?.startsWith("proj-") || p.userRole)
                if (valid.length > 0) {
                  loadedProjects = valid
                  break
                }
              }
            } catch (e) {}
          }
        }
      }

      // Check any other impact_iq_projects_* keys in localStorage
      if (loadedProjects.length === 0) {
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.startsWith("impact_iq_projects_")) {
              const val = localStorage.getItem(key)
              if (val) {
                const parsed = JSON.parse(val)
                if (Array.isArray(parsed) && parsed.length > 0) {
                  const valid = parsed.filter((p: any) => !p.id?.startsWith("proj-") || p.userRole)
                  if (valid.length > 0) {
                    loadedProjects = valid
                    break
                  }
                }
              }
            }
          }
        } catch (e) {}
      }

      // Clean storage if only dummy projects were stored
      if (loadedProjects.length === 0) {
        setScopedItem("impact_iq_projects", JSON.stringify([]))
        localStorage.setItem("impact_iq_projects", JSON.stringify([]))
      }

      setProjects(loadedProjects)
      setLoading(false)
    }

    loadProjects()

    window.addEventListener("impact_iq_projects_updated", loadProjects)
    return () => {
      window.removeEventListener("impact_iq_projects_updated", loadProjects)
    }
  }, [])

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id)
    setProjects(updated)
    setScopedItem("impact_iq_projects", JSON.stringify(updated))
    localStorage.setItem("impact_iq_projects", JSON.stringify(updated))
    window.dispatchEvent(new Event("impact_iq_projects_updated"))
  }

  // Strictly filter projects by assigned team membership
  const teamFilteredProjects = useMemo(() => {
    return projects.filter(p => {
      if (!p.team) return true
      return userTeams.includes(p.team) || isGuestMode()
    })
  }, [projects, userTeams])

  const filteredProjects = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return teamFilteredProjects

    return teamFilteredProjects.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.repository.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      (p.team && p.team.toLowerCase().includes(query))
    )
  }, [teamFilteredProjects, searchQuery])

  // Pagination calculation: 50 projects per page
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE) || 1
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredProjects.length)
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-surface-1 border border-border rounded-2xl shadow-xs space-y-4">
        <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-content-secondary">Loading projects...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 text-content-primary">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <h1 className="text-xl font-extrabold text-content-primary leading-tight">Projects</h1>
          <p className="text-xs text-content-secondary mt-1">Manage connected repositories and configure analysis settings.</p>
        </div>
        
        {/* Total Projects Dynamic Badge */}
        <div className="flex items-center gap-2.5 px-4 py-2 bg-white dark:bg-[#141829] border border-[#845EC2]/25 rounded-2xl shadow-xs self-start sm:self-auto">
          <FolderGit2 className="w-4.5 h-4.5 text-[#845EC2]" />
          <span className="text-xs font-bold text-[#4B4453] dark:text-[#9ca3b8]">Total Projects:</span>
          <span className="text-xs font-extrabold text-white bg-[#FF8066] px-2.5 py-0.5 rounded-lg shadow-xs">
            {filteredProjects.length}
          </span>
        </div>
      </div>

      {/* Projects Container */}
      <div className="space-y-5">
        {/* Search & Counter Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A8B9]" />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full sm:w-72 pl-9 pr-4 py-2 text-xs bg-white dark:bg-[#141829] border border-[#845EC2]/20 dark:border-white/10 rounded-xl focus:outline-none focus:border-[#845EC2] shadow-xs text-[#4B4453] dark:text-[#f1f5ff] font-medium"
            />
          </div>
          <div className="flex items-center gap-3 text-xs text-[#6E6678] dark:text-[#9ca3b8] font-medium">
            <span>
              Showing {filteredProjects.length > 0 ? startIndex + 1 : 0}–{endIndex} of {filteredProjects.length} projects (50 per page)
            </span>
          </div>
        </div>

        {/* Empty State when no real projects exist or match search */}
        {filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[45vh] p-8 border-2 border-dashed border-[#845EC2]/30 rounded-3xl bg-white dark:bg-[#141829] space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#FF8066] text-white flex items-center justify-center shadow-md">
              <FolderGit2 className="w-7 h-7" />
            </div>
            
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-base font-bold text-[#4B4453] dark:text-[#f1f5ff]">
                {searchQuery ? "No Matching Projects" : "No Projects Created Yet"}
              </h3>
              <p className="text-xs text-[#6E6678] dark:text-[#9ca3b8] leading-relaxed">
                {searchQuery 
                  ? `No projects matched your query "${searchQuery}". Clear your search to see all projects.`
                  : "Connect a GitHub repository to create an engineering analysis project and start tracking deployment risks."}
              </p>
            </div>

            {searchQuery ? (
              <Button
                onClick={() => setSearchQuery("")}
                className="mt-2 text-xs font-bold text-[#845EC2] border border-[#845EC2]/30 hover:bg-[#845EC2]/10 bg-white dark:bg-[#141829] cursor-pointer rounded-xl"
              >
                Clear Search
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/dashboard/repositories")}
                className="px-5 h-10 text-xs font-bold bg-[#FF8066] hover:bg-[#ff6c4a] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Connect Repositories</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </Button>
            )}
          </div>
        ) : (
          /* Projects Cards Grid — Displaying up to 50 projects per page */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedProjects.map((project) => (
              <div 
                key={project.id}
                className="bg-white dark:bg-[#141829] border border-[#845EC2]/20 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#845EC2]/40 transition-all duration-200 flex flex-col justify-between space-y-4 text-left group relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FF8066] text-white flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                        <FolderGit2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-[#4B4453] dark:text-[#f1f5ff] leading-snug group-hover:text-[#845EC2] transition-colors">
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-[#B0A8B9] font-mono mt-0.5">
                          <Github className="w-3.5 h-3.5 text-[#B0A8B9]" />
                          <span>{project.repository}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="p-1.5 rounded-lg text-[#B0A8B9] hover:text-[#C34A36] hover:bg-[#C34A36]/10 transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-[#6E6678] dark:text-[#9ca3b8] leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#845EC2]/10 dark:border-white/5 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#845EC2]/10 text-[#845EC2] border border-[#845EC2]/25">
                      <Building2 className="w-3 h-3 text-[#845EC2]" />
                      {project.team || "Engineering"}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#4B4453]/5 dark:bg-white/5 text-[#4B4453] dark:text-[#f1f5ff] border border-[#B0A8B9]/30 font-mono">
                      <GitBranch className="w-3 h-3 text-[#B0A8B9]" />
                      {project.branch}
                    </span>

                    {project.securityAnalysis && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#C34A36]/15 text-[#C34A36] border border-[#C34A36]/30">
                        Security
                      </span>
                    )}

                    {project.dependencyAnalysis && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF8066]/15 text-[#FF8066] border border-[#FF8066]/30">
                        Dependencies
                      </span>
                    )}

                    {project.apiAnalysis && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#845EC2]/15 text-[#845EC2] border border-[#845EC2]/30">
                        API
                      </span>
                    )}
                  </div>

                  <Button
                    onClick={() => router.push(`/dashboard/analysis`)}
                    className="h-8 px-4 text-xs font-bold text-white bg-[#FF8066] hover:bg-[#ff6c4a] dark:bg-indigo-600 dark:hover:bg-indigo-500 flex items-center gap-1.5 rounded-xl cursor-pointer shadow-xs transition-all flex-shrink-0"
                  >
                    <span>Analyze</span>
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-xs text-content-secondary font-medium">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-8 px-3 text-xs font-semibold bg-surface-1 border border-border text-content-primary disabled:opacity-40"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Previous
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={cn(
                      "w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer",
                      currentPage === page
                        ? "bg-[#FF8066] dark:bg-indigo-600 text-white shadow-xs"
                        : "bg-surface-1 text-content-secondary hover:bg-surface-2 border border-border"
                    )}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <Button
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-8 px-3 text-xs font-semibold bg-surface-1 border border-border text-content-primary disabled:opacity-40"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

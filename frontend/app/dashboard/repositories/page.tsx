"use client"

import { useState, useEffect } from "react"
import { 
  Github, 
  ShieldCheck, 
  GitBranch, 
  FolderPlus,
  Shield,
  Network,
  Cpu,
  Search,
  SlidersHorizontal,
  ChevronRight,
  RefreshCw,
  Check,
  X,
  Plus,
  Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Repository {
  name: string
  owner: string
  isPrivate: boolean
  language: string
  description: string
  branch: string
}

export default function RepositoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [isCreatingProject, setIsCreatingProject] = useState(false)

  // Filter states
  const [selectedVisibility, setSelectedVisibility] = useState<"all" | "public" | "private">("all")
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  
  // Team Assignment states
  const [userTeams, setUserTeams] = useState<{ id: string; name: string }[]>([
    { id: "default-1", name: "Platform Engineering" },
    { id: "default-2", name: "DevOps Core" },
    { id: "default-3", name: "Security Ops" }
  ])
  const [selectedTeam, setSelectedTeam] = useState("Platform Engineering")
  
  // OAuth and fetching states
  const [token, setToken] = useState<string | null>(null)
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form states for project creation
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedRepo, setSelectedRepo] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("main")
  
  // Dynamic branches state
  const [branches, setBranches] = useState<string[]>([])
  const [loadingBranches, setLoadingBranches] = useState(false)

  const fetchBranchesForRepo = async (ownerName: string, repoName: string) => {
    const savedToken = localStorage.getItem("github_token") || token
    if (!savedToken) return
    setLoadingBranches(true)
    try {
      const response = await fetch(`http://localhost:8000/api/auth/github/repos/${ownerName}/${repoName}/branches`, {
        headers: {
          "Authorization": `Bearer ${savedToken}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setBranches(data)
        if (data.length > 0) {
          setSelectedBranch(data[0]) // select first branch by default
        }
      } else {
        setBranches(["main"])
        setSelectedBranch("main")
      }
    } catch (err) {
      console.error("Error fetching branches:", err)
      setBranches(["main"])
      setSelectedBranch("main")
    } finally {
      setLoadingBranches(false)
    }
  }
  
  // Toggles state
  const [securityAnalysis, setSecurityAnalysis] = useState(true)
  const [dependencyAnalysis, setDependencyAnalysis] = useState(true)
  const [apiAnalysis, setApiAnalysis] = useState(true)

  const steps = [
    { number: 1, name: "General", active: true, completed: false },
    { number: 2, name: "Repository", active: false, completed: false },
    { number: 3, name: "Branch", active: false, completed: false },
    { number: 4, name: "Analysis Settings", active: false, completed: false },
    { number: 5, name: "Review", active: false, completed: false },
  ]

  // Retrieve token & teams from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("github_token")
    setToken(savedToken)
    if (!savedToken) {
      setLoading(false)
    }

    const savedTeams = localStorage.getItem("impact_iq_teams")
    if (savedTeams) {
      try {
        const parsed = JSON.parse(savedTeams)
        if (parsed.length > 0) {
          setUserTeams(parsed.map((t: any) => ({ id: t.id, name: t.name })))
          setSelectedTeam(parsed[0].name)
        }
      } catch (err) {
        console.error("Error reading teams:", err)
      }
    }
  }, [])

  // Fetch repositories from backend
  useEffect(() => {
    if (!token) return

    const fetchRepos = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("http://localhost:8000/api/auth/github/repos", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })

        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("github_token")
          setToken(null)
          throw new Error("GitHub session expired. Please connect again.")
        }

        if (!response.ok) {
          throw new Error("Failed to fetch repositories.")
        }

        const data = await response.json()
        const mappedRepos = data.map((r: any) => ({
          name: r.name,
          owner: r.owner?.login || "Riyanshah",
          isPrivate: r.private !== undefined ? r.private : r.is_private,
          language: r.language || "Unknown",
          description: r.description || "No description provided.",
          branch: r.default_branch || "main"
        }))
        setRepositories(mappedRepos)
      } catch (err: any) {
        setError(err.message || "Something went wrong.")
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [token])

  const availableLanguages = Array.from(
    new Set(repositories.map(r => r.language).filter(Boolean))
  )

  const filteredRepos = repositories.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesVisibility = selectedVisibility === "all" ||
      (selectedVisibility === "private" ? repo.isPrivate : !repo.isPrivate)

    const matchesLanguage = selectedLanguage === "all" ||
      repo.language.toLowerCase() === selectedLanguage.toLowerCase()

    return matchesSearch && matchesVisibility && matchesLanguage
  })

  const totalPages = Math.ceil(filteredRepos.length / itemsPerPage) || 1
  const paginatedRepos = filteredRepos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleOpenCreateModal = (repoName: string) => {
    const repo = repositories.find(r => r.name === repoName)
    const ownerName = repo ? repo.owner : "Riyanshah"
    const repoDesc = repo ? repo.description : `AI-powered engineering analysis platform for ${repoName}.`
    const defaultBranch = repo ? repo.branch : "main"

    setSelectedRepo(`${ownerName} / ${repoName}`)
    const formattedName = repoName
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    setProjectName(formattedName)
    setDescription(repoDesc)
    setSelectedBranch(defaultBranch)
    setIsModalOpen(true)

    if (ownerName && repoName) {
      fetchBranchesForRepo(ownerName, repoName)
    }
  }

  const handleCreateProject = () => {
    setIsCreatingProject(true)
    const finalProjectName = projectName.trim() || selectedRepo.split(" / ")[1] || "New Project"

    const newProject = {
      id: Date.now().toString(),
      name: finalProjectName,
      description: description || `AI-powered engineering analysis platform for ${finalProjectName}.`,
      repository: selectedRepo,
      branch: selectedBranch || "main",
      team: selectedTeam,
      securityAnalysis,
      dependencyAnalysis,
      apiAnalysis,
      createdAt: new Date().toISOString()
    }

    try {
      const existingProjects = JSON.parse(localStorage.getItem("impact_iq_projects") || "[]")
      const updatedProjects = [newProject, ...existingProjects]
      localStorage.setItem("impact_iq_projects", JSON.stringify(updatedProjects))
    } catch (err) {
      console.error("Error saving project:", err)
    }

    setTimeout(() => {
      setIsModalOpen(false)
      setIsCreatingProject(false)
      window.location.href = "/dashboard/projects"
    }, 400)
  }

  const handleConnectGithub = () => {
    window.location.href = "http://localhost:8000/api/auth/github/login"
  }

  const handleDisconnect = () => {
    localStorage.removeItem("github_token")
    setToken(null)
    setRepositories([])
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500">Fetching GitHub repositories...</p>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 border border-dashed border-slate-200 rounded-2xl bg-white space-y-6">
        <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700">
          <Github className="w-8 h-8" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-slate-900">Connect your GitHub Account</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Connect your GitHub account to import repositories and start engineering analysis on your codebases.
          </p>
        </div>
        <Button
          variant="brand"
          onClick={handleConnectGithub}
          className="px-6 h-11 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg flex items-center gap-2 transition-all duration-150 shadow-sm"
        >
          <Github className="w-4 h-4 fill-white" />
          Connect GitHub
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
              <X className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900 leading-snug">Connection Error</h3>
              <p className="text-xs text-rose-500 mt-0.5">{error}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleConnectGithub}
            className="h-9 px-4 border-rose-200 bg-white hover:bg-rose-50 text-rose-700 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all"
          >
            Reconnect GitHub
          </Button>
        </div>
      )}

      {/* GitHub Connected Banner */}
      <div className="bg-[#ecfdf5]/80 border border-emerald-200/60 rounded-xl p-4 flex items-center justify-between shadow-sm text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">GitHub Connected Successfully</h3>
            <p className="text-xs text-slate-500 mt-0.5">We found {repositories.length} repositories in your account.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleConnectGithub}
            className="h-9 px-4 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all duration-150"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reconnect
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDisconnect}
            className="h-9 px-4 border-rose-200 hover:bg-rose-50/50 text-rose-600 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all duration-150"
          >
            Disconnect
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="flex items-center justify-between mt-6">
        <h2 className="text-sm font-bold text-slate-800">
          All Repositories ({filteredRepos.length})
        </h2>
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search repositories..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="w-64 pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
            />
          </div>
          {/* Filter button + Popover */}
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={cn(
                "px-3.5 py-2 border text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all duration-150 cursor-pointer",
                (selectedVisibility !== "all" || selectedLanguage !== "all")
                  ? "border-indigo-600 bg-indigo-50/60 text-indigo-700 font-bold"
                  : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter</span>
              {(selectedVisibility !== "all" || selectedLanguage !== "all") && (
                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              )}
            </button>

            {/* Filter Popover Dropdown */}
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 shadow-xl rounded-xl p-4 z-30 space-y-4 text-left animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Filter Repositories</span>
                  {(selectedVisibility !== "all" || selectedLanguage !== "all") && (
                    <button
                      onClick={() => {
                        setSelectedVisibility("all")
                        setSelectedLanguage("all")
                        setCurrentPage(1)
                      }}
                      className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {/* Visibility Filter */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Visibility</label>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg">
                    {(["all", "public", "private"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          setSelectedVisibility(v)
                          setCurrentPage(1)
                        }}
                        className={cn(
                          "py-1 text-[11px] font-bold rounded-md capitalize transition-all cursor-pointer",
                          selectedVisibility === v
                            ? "bg-white text-indigo-600 shadow-sm"
                            : "text-slate-500 hover:text-slate-800"
                        )}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Filter */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => {
                      setSelectedLanguage(e.target.value)
                      setCurrentPage(1)
                    }}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer font-medium"
                  >
                    <option value="all">All Languages</option>
                    {availableLanguages.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Repository Cards List */}
      <div className="flex flex-col gap-4">
        {paginatedRepos.map((repo, idx) => (
          <div 
            key={idx}
            className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] flex flex-col gap-2.5 hover:shadow-md transition-shadow duration-200"
          >
            {/* Top Header Row: Icon + Name + Badges on left | Create Project button on top right */}
            <div className="flex items-center justify-between w-full gap-4">
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                  <Github className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug hover:text-indigo-600 transition-colors cursor-pointer">
                    {repo.name}
                  </h3>
                  
                  {/* Badges */}
                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                    repo.isPrivate 
                      ? "bg-purple-50 text-purple-600 border-purple-100/50" 
                      : "bg-emerald-50 text-emerald-600 border-emerald-100/50"
                  )}>
                    {repo.isPrivate ? "Private" : "Public"}
                  </span>

                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                    repo.language === "JavaScript" && "bg-amber-50 text-amber-700 border-amber-100/50",
                    repo.language === "TypeScript" && "bg-blue-50 text-blue-600 border-blue-100/50",
                    repo.language === "Python" && "bg-sky-50 text-sky-700 border-sky-100/50",
                    repo.language === "Go" && "bg-cyan-50 text-cyan-600 border-cyan-100/50"
                  )}>
                    {repo.language}
                  </span>
                </div>
              </div>

              {/* Action Button on top right */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                  onClick={() => handleOpenCreateModal(repo.name)}
                  className="px-3.5 py-1.5 border border-indigo-600 text-indigo-600 hover:bg-indigo-50/50 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all duration-150 active:scale-95 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Project
                </button>
                <ChevronRight className="w-4 h-4 text-slate-300 ml-1 cursor-pointer hover:text-slate-400" />
              </div>
            </div>

            {/* Description - Full width below */}
            <p className="text-xs text-slate-500 leading-relaxed text-left pl-12 pr-4">
              {repo.description}
            </p>

            {/* Branch Metadata */}
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium text-left pl-12">
              <GitBranch className="w-3.5 h-3.5" />
              <span>{repo.branch}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 mt-4">
          <p className="text-xs text-slate-500 font-medium">
            Showing <span className="font-semibold text-slate-700">{filteredRepos.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-semibold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredRepos.length)}</span> of{" "}
            <span className="font-semibold text-slate-700">{filteredRepos.length}</span> repositories
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="h-8 px-3 text-xs font-semibold rounded-lg border-slate-200 disabled:opacity-40"
            >
              Previous
            </Button>

            <div className="flex items-center gap-1 px-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-7 h-7 text-xs font-bold rounded-md transition-all duration-150",
                    currentPage === page
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="h-8 px-3 text-xs font-semibold rounded-lg border-slate-200 disabled:opacity-40"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* CREATE NEW PROJECT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl w-full max-w-4xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900">Create New Project</h3>
                <p className="text-xs text-gray-500">Connect a GitHub repository and configure analysis settings.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex flex-1 min-h-[420px]">
              
              {/* Left Column: Stepper */}
              <div className="w-1/4 bg-slate-50 border-r border-gray-100 p-6 flex flex-col justify-start">
                <div className="relative flex flex-col gap-8">
                  {/* Vertical Line Connector */}
                  <div className="absolute left-[13px] top-[14px] bottom-[14px] w-0.5 bg-gray-200 z-0" />
                  
                  {steps.map((step) => (
                    <div key={step.number} className="flex items-center gap-3.5 z-10 relative">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200",
                        step.active 
                          ? "bg-indigo-600 text-white shadow-sm ring-4 ring-indigo-100" 
                          : "bg-white border border-gray-300 text-gray-500"
                      )}>
                        {step.number}
                      </div>
                      <span className={cn(
                        "text-xs font-semibold",
                        step.active ? "text-indigo-600 font-bold" : "text-gray-400"
                      )}>
                        {step.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Form Controls */}
              <div className="w-3/4 p-6 space-y-5 overflow-y-auto max-h-[500px]">
                
                {/* Project Name Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                    Project Name <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-gray-400">Choose a name that represents your project.</p>
                </div>

                {/* Description Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">
                    Description <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your microservices/project"
                    rows={2.5}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  />
                  <p className="text-[10px] text-gray-400">Add a short description about your project.</p>
                </div>

                {/* Team Assignment Field */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                    Assign to Team <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <select
                      value={selectedTeam}
                      onChange={(e) => setSelectedTeam(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer font-medium"
                    >
                      {userTeams.map((t) => (
                        <option key={t.id} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                      <Plus className="w-3.5 h-3.5 rotate-45" />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400">Select which engineering team owns this project.</p>
                </div>

                {/* Grid for Dropdowns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Repo Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                      GitHub Repository <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Github className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <select 
                        value={selectedRepo}
                        onChange={(e) => {
                          const fullValue = e.target.value
                          setSelectedRepo(fullValue)
                          const parts = fullValue.split(" / ")
                          const ownerName = parts[0]
                          const repoName = parts[1]
                          
                          const repo = repositories.find(r => r.name === repoName)
                          if (repo) {
                            setProjectName(repo.name.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "))
                            setDescription(repo.description)
                            setSelectedBranch(repo.branch)
                            fetchBranchesForRepo(ownerName, repoName)
                          }
                        }}
                        className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                      >
                        {repositories.length === 0 ? (
                          <option value={selectedRepo}>{selectedRepo}</option>
                        ) : (
                          repositories.map((repo) => (
                            <option key={`${repo.owner}/${repo.name}`} value={`${repo.owner} / ${repo.name}`}>
                              {repo.owner} / {repo.name}
                            </option>
                          ))
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                        <Plus className="w-3.5 h-3.5 rotate-45" />
                      </div>
                    </div>
                  </div>
 
                  {/* Branch Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1">
                      Default Branch <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <GitBranch className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <select 
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                        disabled={loadingBranches}
                      >
                        {loadingBranches ? (
                          <option value="">Loading branches...</option>
                        ) : branches.length === 0 ? (
                          <>
                            <option value="main">main</option>
                            <option value="develop">develop</option>
                            <option value="staging">staging</option>
                          </>
                        ) : (
                          branches.map((branch) => (
                            <option key={branch} value={branch}>
                              {branch}
                            </option>
                          ))
                        )}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                        <Plus className="w-3.5 h-3.5 rotate-45" />
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400">This will be the base branch for comparisons.</p>
                  </div>
                </div>

                {/* Analysis Settings Switches */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Analysis Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    
                    {/* Security Analysis Toggle */}
                    <div className="border border-gray-100 rounded-xl p-3.5 bg-[#fbfbfe] flex flex-col justify-between h-[100px] hover:border-indigo-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Shield className="w-4 h-4" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setSecurityAnalysis(!securityAnalysis)}
                          className={cn(
                            "relative inline-flex h-4.5 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                            securityAnalysis ? "bg-indigo-600" : "bg-gray-200"
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition duration-200 ease-in-out",
                              securityAnalysis ? "translate-x-3.5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>
                      <div className="text-left mt-2">
                        <h5 className="text-[10px] font-bold text-gray-900">Security Analysis</h5>
                        <p className="text-[8px] text-gray-400 leading-normal mt-0.5">Scan for security vulnerabilities in code changes.</p>
                      </div>
                    </div>

                    {/* Dependency Analysis Toggle */}
                    <div className="border border-gray-100 rounded-xl p-3.5 bg-[#fbfbfe] flex flex-col justify-between h-[100px] hover:border-indigo-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Network className="w-4 h-4" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setDependencyAnalysis(!dependencyAnalysis)}
                          className={cn(
                            "relative inline-flex h-4.5 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                            dependencyAnalysis ? "bg-indigo-600" : "bg-gray-200"
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition duration-200 ease-in-out",
                              dependencyAnalysis ? "translate-x-3.5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>
                      <div className="text-left mt-2">
                        <h5 className="text-[10px] font-bold text-gray-900">Dependency Analysis</h5>
                        <p className="text-[8px] text-gray-400 leading-normal mt-0.5">Analyze impact on dependent services and modules.</p>
                      </div>
                    </div>

                    {/* API Analysis Toggle */}
                    <div className="border border-gray-100 rounded-xl p-3.5 bg-[#fbfbfe] flex flex-col justify-between h-[100px] hover:border-indigo-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                          <Cpu className="w-4 h-4" />
                        </div>
                        <button
                          type="button"
                          onClick={() => setApiAnalysis(!apiAnalysis)}
                          className={cn(
                            "relative inline-flex h-4.5 w-8 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                            apiAnalysis ? "bg-indigo-600" : "bg-gray-200"
                          )}
                        >
                          <span
                            className={cn(
                              "pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition duration-200 ease-in-out",
                              apiAnalysis ? "translate-x-3.5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>
                      <div className="text-left mt-2">
                        <h5 className="text-[10px] font-bold text-gray-900">API Analysis</h5>
                        <p className="text-[8px] text-gray-400 leading-normal mt-0.5">Detect breaking changes in API contracts.</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-slate-50">
              <Button 
                variant="outline" 
                onClick={() => setIsModalOpen(false)}
                className="h-10 text-xs font-bold border-gray-200 text-gray-700 bg-white hover:bg-gray-50 px-5 rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                variant="brand" 
                disabled={isCreatingProject}
                onClick={handleCreateProject}
                className="h-10 text-xs font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] flex items-center gap-2 px-5 rounded-lg disabled:opacity-75"
              >
                {isCreatingProject ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Project...</span>
                  </>
                ) : (
                  <>
                    <FolderPlus className="w-4 h-4" />
                    <span>Create Project</span>
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

"use client"

import { useState } from "react"
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
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Repository {
  name: string
  isPrivate: boolean
  language: string
  description: string
  branch: string
  updatedAt: string
}

export default function RepositoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Form states for project creation
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedRepo, setSelectedRepo] = useState("")
  const [selectedBranch, setSelectedBranch] = useState("main")
  
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

  const mockRepositories: Repository[] = [
    {
      name: "payment-service",
      isPrivate: true,
      language: "JavaScript",
      description: "Microservice for handling payments, invoices, and transactions.",
      branch: "main",
      updatedAt: "Updated 2 hours ago"
    },
    {
      name: "auth-service",
      isPrivate: true,
      language: "TypeScript",
      description: "Authentication and authorization service with OAuth and JWT.",
      branch: "main",
      updatedAt: "Updated yesterday"
    },
    {
      name: "inventory-service",
      isPrivate: false,
      language: "Python",
      description: "Inventory management and stock tracking service.",
      branch: "main",
      updatedAt: "Updated 3 days ago"
    },
    {
      name: "notification-service",
      isPrivate: true,
      language: "Go",
      description: "Handles email, SMS, and push notifications.",
      branch: "main",
      updatedAt: "Updated 5 days ago"
    }
  ]

  const filteredRepos = mockRepositories.filter(repo =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    repo.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleOpenCreateModal = (repoName: string) => {
    setSelectedRepo(`Riyanshah / ${repoName}`)
    // Generate a default project name based on repo
    const formattedName = repoName
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
    setProjectName(formattedName)
    setDescription(`AI-powered engineering analysis platform for ${repoName}.`)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* GitHub Connected Banner */}
      <div className="bg-[#ecfdf5]/80 border border-emerald-200/60 rounded-xl p-4 flex items-center justify-between shadow-sm text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">GitHub Connected Successfully</h3>
            <p className="text-xs text-slate-500 mt-0.5">We found 12 repositories in your account.</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="h-9 px-4 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all duration-150"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reconnect GitHub
        </Button>
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm"
            />
          </div>
          {/* Filter button */}
          <button className="px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-2 shadow-sm transition-all duration-150">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span>Filter</span>
            <Plus className="w-3 h-3 rotate-45 text-slate-400 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Repository Cards List */}
      <div className="flex flex-col gap-4">
        {filteredRepos.map((repo, idx) => (
          <div 
            key={idx}
            className="bg-white border border-slate-100 rounded-xl p-5 md:p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] flex items-center justify-between hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-start gap-4 text-left">
              <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 flex-shrink-0">
                <Github className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
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

                <p className="text-xs text-slate-500 leading-relaxed">
                  {repo.description}
                </p>

                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-2 font-medium">
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>{repo.branch}</span>
                  <span>•</span>
                  <span>{repo.updatedAt}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleOpenCreateModal(repo.name)}
                className="px-4 py-2 border border-indigo-600 text-indigo-600 hover:bg-indigo-50/50 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all duration-150 active:scale-95 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Project
              </button>
              <ChevronRight className="w-4 h-4 text-slate-300 ml-1 cursor-pointer hover:text-slate-400" />
            </div>
          </div>
        ))}
      </div>

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
                        onChange={(e) => setSelectedRepo(e.target.value)}
                        className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
                      >
                        <option value={`Riyanshah / ${selectedRepo.split("/ ").pop()}`}>{selectedRepo}</option>
                        <option value="Riyanshah / payment-service">Riyanshah / payment-service</option>
                        <option value="Riyanshah / auth-service">Riyanshah / auth-service</option>
                        <option value="Riyanshah / order-service">Riyanshah / order-service</option>
                        <option value="Riyanshah / inventory-service">Riyanshah / inventory-service</option>
                        <option value="Riyanshah / notification-service">Riyanshah / notification-service</option>
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
                      >
                        <option value="main">main</option>
                        <option value="develop">develop</option>
                        <option value="staging">staging</option>
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
                onClick={() => {
                  setIsModalOpen(false)
                }}
                className="h-10 text-xs font-bold bg-brand text-white hover:bg-indigo-700 flex items-center gap-1.5 px-5 rounded-lg"
              >
                <FolderPlus className="w-4 h-4" />
                Create Project
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

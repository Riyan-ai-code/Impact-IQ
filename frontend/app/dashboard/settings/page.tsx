"use client"

import { useState, useEffect } from "react"
import { 
  Settings, 
  FolderGit2, 
  Building2, 
  GitBranch, 
  Check, 
  Save, 
  Trash2, 
  AlertTriangle, 
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProjectSetting {
  id: string
  name: string
  description: string
  branch: string
  team: string
}

const DEFAULT_PROJECTS: ProjectSetting[] = [
  {
    id: "p-1",
    name: "Payment Platform",
    description: "Microservices based payment platform and checkout processing service.",
    branch: "main",
    team: "Platform Engineering"
  },
  {
    id: "p-2",
    name: "Auth Service",
    description: "OAuth 2.0 and JWT authentication identity management service.",
    branch: "main",
    team: "Security Ops"
  }
]

export default function SettingsPage() {
  const [projects, setProjects] = useState<ProjectSetting[]>(DEFAULT_PROJECTS)
  const [selectedProjectId, setSelectedProjectId] = useState<string>("p-1")

  // Form states
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [defaultBranch, setDefaultBranch] = useState("main")
  const [teamOwnership, setTeamOwnership] = useState("Platform Engineering")

  const [teams, setTeams] = useState<{ id: string; name: string }[]>([
    { id: "t-1", name: "Platform Engineering" },
    { id: "t-2", name: "DevOps Core" },
    { id: "t-3", name: "Security Ops" }
  ])

  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  // Load projects from storage
  useEffect(() => {
    const savedProjects = localStorage.getItem("impact_iq_projects")
    const savedTeams = localStorage.getItem("impact_iq_teams")

    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams)
        if (parsedTeams.length > 0) {
          setTeams(parsedTeams.map((t: any) => ({ id: t.id, name: t.name })))
        }
      } catch (e) {
        console.error("Error reading teams:", e)
      }
    }

    if (savedProjects) {
      try {
        const parsed: any[] = JSON.parse(savedProjects)
        if (parsed.length > 0) {
          const mapped: ProjectSetting[] = parsed.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description || "",
            branch: p.branch || "main",
            team: p.team || "Platform Engineering"
          }))
          setProjects(mapped)
          setSelectedProjectId(mapped[0].id)
          populateForm(mapped[0])
          return
        }
      } catch (e) {
        console.error("Error reading projects:", e)
      }
    }

    setProjects(DEFAULT_PROJECTS)
    setSelectedProjectId(DEFAULT_PROJECTS[0].id)
    populateForm(DEFAULT_PROJECTS[0])
  }, [])

  const populateForm = (project: ProjectSetting) => {
    setProjectName(project.name)
    setProjectDescription(project.description)
    setDefaultBranch(project.branch)
    setTeamOwnership(project.team)
  }

  const handleSelectProject = (id: string) => {
    setSelectedProjectId(id)
    const target = projects.find(p => p.id === id)
    if (target) {
      populateForm(target)
    }
  }

  const handleSaveSettings = () => {
    const updated = projects.map(p => {
      if (p.id === selectedProjectId) {
        return {
          ...p,
          name: projectName,
          description: projectDescription,
          branch: defaultBranch,
          team: teamOwnership
        }
      }
      return p
    })

    setProjects(updated)
    localStorage.setItem("impact_iq_projects", JSON.stringify(updated))

    setSaveSuccessMsg(`Settings saved successfully for ${projectName}!`)
    setTimeout(() => setSaveSuccessMsg(null), 4000)
  }

  const handleDeleteProject = () => {
    const updated = projects.filter(p => p.id !== selectedProjectId)
    setProjects(updated)
    localStorage.setItem("impact_iq_projects", JSON.stringify(updated))
    setIsDeleteModalOpen(false)

    if (updated.length > 0) {
      setSelectedProjectId(updated[0].id)
      populateForm(updated[0])
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Project Settings</h1>
          <p className="text-xs text-slate-500 mt-1">Configure general project options, branch defaults, and team ownership.</p>
        </div>

        <Button
          variant="brand"
          onClick={handleSaveSettings}
          className="h-10 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg flex items-center gap-2 shadow-sm transition-all duration-150 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between text-left animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-emerald-900">{saveSuccessMsg}</p>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Project Switcher Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm flex items-center justify-between">
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
      </div>

      {/* GENERAL SETTINGS CARD */}
      <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-5 text-left">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Settings className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">General Settings</h2>
            <p className="text-[11px] text-slate-500">Project metadata, branch configurations, and team ownership.</p>
          </div>
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
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
              Description
            </label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe your service or repository..."
              rows={3}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Default Branch */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                Default Branch
              </label>
              <select
                value={defaultBranch}
                onChange={(e) => setDefaultBranch(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer font-medium"
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
                onChange={(e) => setTeamOwnership(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer font-medium"
              >
                {teams.map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="pt-4 border-t border-slate-100">
            <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-rose-900">Danger Zone</h4>
                <p className="text-[11px] text-rose-600">Permanently delete this project and clear its analysis metrics.</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(true)}
                className="h-8 px-3 text-xs font-bold border-rose-200 text-rose-600 hover:bg-rose-100/60 rounded-lg cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            </div>
          </div>

        </div>
      </div>

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

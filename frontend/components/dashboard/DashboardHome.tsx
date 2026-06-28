"use client"

import { useState } from "react"
import {
  Rocket,
  ShieldCheck,
  BarChart2,
  Plus,
  Github,
  Lightbulb,
  X,
  GitBranch,
  FolderPlus,
  Shield,
  Network,
  Cpu,
  Lock,
  Link2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function DashboardHome() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [projectName, setProjectName] = useState("Payment Platform")
  const [description, setDescription] = useState("Microservices based payment platform.")
  const [selectedRepo, setSelectedRepo] = useState("Riyanshah / payment-service")
  const [selectedBranch, setSelectedBranch] = useState("main")

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

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-6rem)] py-6 select-none relative">
      <div className="w-full max-w-5xl bg-white border border-gray-100 rounded-2xl p-8 md:p-12 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03)] flex flex-col items-center text-center space-y-8">
        <div className="relative w-64 h-48 flex items-center justify-center">
          <div className="absolute top-2 left-[55%] text-indigo-300 animate-pulse">
            <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" />
            </svg>
          </div>
          <div className="absolute top-24 left-10 text-indigo-300 animate-pulse">
            <svg className="w-3.5 h-3.5" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" />
            </svg>
          </div>
          <div className="absolute top-12 right-12 text-indigo-200">
            <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5Z" />
            </svg>
          </div>

          <svg className="absolute left-6 top-8 w-16 h-10 text-slate-200" viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 32a10 10 0 0 1-2-19.8A12 12 0 0 1 38 10a10 10 0 0 1 17.8 8.8A8 8 0 0 1 52 32H18z" />
          </svg>

          <svg className="absolute right-4 bottom-14 w-20 h-12 text-slate-200" viewBox="0 0 64 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 32a10 10 0 0 1-2-19.8A12 12 0 0 1 38 10a10 10 0 0 1 17.8 8.8A8 8 0 0 1 52 32H18z" />
          </svg>

          <div className="relative w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-200 flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <svg className="w-16 h-16 text-indigo-500" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 5C9.9 5 5 9.9 5 16C5 20.9 8.2 24.9 12.6 26.4C13.2 26.5 13.4 26.1 13.4 25.8C13.4 25.5 13.4 24.6 13.4 23.6C10.3 24.3 9.7 22.1 9.7 22.1C9.2 20.8 8.4 20.4 8.4 20.4C7.4 19.7 8.5 19.7 8.5 19.7C9.6 19.8 10.2 20.8 10.2 20.8C11.2 22.5 12.8 22 13.4 21.7C13.5 21 13.8 20.5 14.1 20.2C11.6 19.9 9 18.9 9 14.6C9 13.4 9.4 12.4 10.1 11.6C10 11.3 9.6 10.2 10.2 8.8C10.2 8.8 11.1 8.5 13.2 10C14.1 9.7 15 9.6 16 9.6C17 9.6 17.9 9.7 18.8 10C20.8 8.5 21.7 8.8 21.7 8.8C22.3 10.2 21.9 11.3 21.8 11.6C22.5 12.4 22.9 13.4 22.9 14.6C22.9 18.9 20.3 19.9 17.8 20.2C18.2 20.5 18.6 21.2 18.6 22.3C18.6 23.9 18.6 25.2 18.6 25.6C18.6 26 18.8 26.4 19.4 26.3C23.8 24.8 27 20.8 27 16C27 9.9 22.1 5 16 5Z" />
            </svg>

            <div className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[#4f46e5] border-[3px] border-white flex items-center justify-center text-white shadow-md">
              <Link2 className="w-4 h-4 rotate-45" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            No Projects Yet
          </h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            Connect your GitHub account to import repositories and create your first project.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 w-full max-w-sm">
          <Button
            variant="brand"
            onClick={() => setIsModalOpen(true)}
            className="w-full h-11 text-xs font-bold flex items-center justify-center gap-2 shadow-sm rounded-lg bg-[#4f46e5] hover:bg-[#4338ca] text-white transition-all duration-200"
          >
            <Github className="w-4 h-4 fill-white" />
            Connect GitHub
          </Button>

          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] font-medium mt-1">
            <Lock className="w-3.5 h-3.5" />
            <span>We only read your public information and repositories.</span>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-100/80">
          <div
            onClick={() => setIsModalOpen(true)}
            className="bg-slate-50/50 hover:bg-slate-50 rounded-xl p-5 border border-slate-100 flex items-start gap-4 transition-all duration-200 cursor-pointer text-left"
          >
            <div className="w-11 h-11 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Import Repositories</h4>
              <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                Fetch all your repositories from GitHub in one click.
              </p>
            </div>
          </div>

          <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 flex items-start gap-4 text-left">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100/50 flex items-center justify-center text-emerald-600 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Smart Analysis</h4>
              <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                Automatically analyze pull requests, dependencies, and code quality.
              </p>
            </div>
          </div>

          <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 flex items-start gap-4 text-left">
            <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100/50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900">Actionable Insights</h4>
              <p className="text-[10px] text-gray-500 mt-1 leading-normal">
                Get detailed insights and fix risks before they impact your code.
              </p>
            </div>
          </div>
        </div>
      </div>

      

      <div className="flex items-center gap-2 text-gray-400 text-[10px] font-semibold mt-8">
        <Lightbulb className="w-4 h-4 text-indigo-400 animate-pulse" />
        <span>ImpactIQ helps you ship secure, reliable and high-quality code.</span>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl w-full max-w-4xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
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

            <div className="flex flex-1 min-h-[420px]">
              <div className="w-1/4 bg-slate-50 border-r border-gray-100 p-6 flex flex-col justify-start">
                <div className="relative flex flex-col gap-8">
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

              <div className="w-3/4 p-6 space-y-5 overflow-y-auto max-h-[500px]">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <option value="Riyanshah / payment-service">Riyanshah / payment-service</option>
                        <option value="Riyanshah / auth-service">Riyanshah / auth-service</option>
                        <option value="Riyanshah / order-service">Riyanshah / order-service</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-gray-500">
                        <Plus className="w-3.5 h-3.5 rotate-45" />
                      </div>
                    </div>
                  </div>

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

                <div className="space-y-3 pt-2">
                  <h4 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider">Analysis Settings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
          </div>
        </div>
      )}
    </div>
  )
}

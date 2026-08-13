"use client"

import { useState, useEffect } from "react"
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
  const [isConnected, setIsConnected] = useState(() => {
    if (typeof window !== "undefined") {
      return !!(localStorage.getItem("github_token") || localStorage.getItem("github_connected") || localStorage.getItem("github_connected_user"))
    }
    return false
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("github_token") || localStorage.getItem("github_connected") || localStorage.getItem("github_connected_user")
    setIsConnected(!!token)
    setIsLoading(false)
  }, [])

  const [projectName, setProjectName] = useState("Payment Platform")
  const [description, setDescription] = useState("Microservices based payment platform.")
  const [selectedRepo, setSelectedRepo] = useState("Riyanshah / payment-service")
  const [selectedBranch, setSelectedBranch] = useState("main")

  const [securityAnalysis, setSecurityAnalysis] = useState(true)
  const [dependencyAnalysis, setDependencyAnalysis] = useState(true)
  const [apiAnalysis, setApiAnalysis] = useState(true)

  const handleConnectGithub = () => {
    const token = localStorage.getItem("github_token")
    if (token) {
      window.location.href = "/dashboard/repositories"
    } else {
      window.location.href = "http://localhost:8000/api/auth/github/login"
    }
  }

  const steps = [
    { number: 1, name: "General", active: true, completed: false },
    { number: 2, name: "Repository", active: false, completed: false },
    { number: 3, name: "Branch", active: false, completed: false },
    { number: 4, name: "Analysis Settings", active: false, completed: false },
    { number: 5, name: "Review", active: false, completed: false },
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Github className="w-4 h-4 text-indigo-600" />
          <span>Fetching GitHub account details...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-6rem)] py-6 select-none relative">
      <div className="w-full max-w-5xl space-y-6 text-left">
        {/* Header banner for Guest / Dashboard */}
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

          <Button
            variant="brand"
            onClick={() => window.location.href = "/dashboard/analysis"}
            className="h-11 px-5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 shadow-lg transition-all flex-shrink-0 cursor-pointer z-10"
          >
            <Rocket className="w-4 h-4" />
            <span>Run New Analysis</span>
          </Button>
        </div>

        {/* Demo Repositories Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-indigo-600" />
            Sample Repositories Available for Risk Inspection
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
                  onClick={() => window.location.href = "/dashboard/reports"}
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
                  onClick={() => window.location.href = "/dashboard/reports"}
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
                  onClick={() => window.location.href = "/dashboard/reports"}
                  className="h-8 px-3 text-[11px] font-bold border-indigo-200 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                >
                  View Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
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

      <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mt-6">
        <Lightbulb className="w-4 h-4 text-indigo-500 animate-pulse" />
        <span>ImpactIQ helps engineering teams ship secure, reliable code with zero breaking changes.</span>
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

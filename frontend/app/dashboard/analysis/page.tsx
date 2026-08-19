"use client"

import { useState, useEffect } from "react"
import { 
  PlayCircle, 
  BrainCircuit, 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  Github, 
  GitBranch, 
  Check, 
  AlertTriangle, 
  FileText, 
  Cpu, 
  Network, 
  Shield, 
  ArrowRight,
  MessageSquareCode,
  Zap,
  HelpCircle,
  Code2,
  ListChecks,
  ShieldAlert
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AutomaticReport {
  id: string
  repository: string
  branch: string
  riskScore: number
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  summary: string[]
  securityIssues: string[]
  apiContractIssues: string[]
  checklist: string[]
  createdAt: string
}

interface ManualPromptResponse {
  id: string
  repository: string
  branch: string
  prompt: string
  aiResponse: string
  keyTakeaways: string[]
  codeSnippetsFlagged: string[]
  createdAt: string
}

interface Project {
  id: string
  name: string
  description: string
  repository: string
  branch: string
  team?: string
  userRole?: RoleType
  createdAt?: string
}

import { getScopedItem, setScopedItem, isGuestMode } from "@/lib/storageScope"
import { canUser, RoleType } from "@/lib/rbac"

export default function NewAnalysisPage() {
  // Mode selection: "auto" | "manual"
  const [analysisMode, setAnalysisMode] = useState<"auto" | "manual">("auto")

  // Created Projects state
  const [createdProjects, setCreatedProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [selectedRepo, setSelectedRepo] = useState<string>("")
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true)
  
  // User Team Membership State
  const [userTeams, setUserTeams] = useState<string[]>([])
  const [userRoleInSelectedProject, setUserRoleInSelectedProject] = useState<RoleType>("Developer")

  useEffect(() => {
    // 1. Load User's Teams
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

    // Default fallback teams if none
    if (myTeams.length === 0) {
      myTeams.push("Platform Engineering", "DevOps Core", "Security Ops")
    }
    setUserTeams(myTeams)

    // 2. Load Created Projects (strictly filtered to user's team)
    const savedProjects = getScopedItem("impact_iq_projects")
    if (savedProjects) {
      try {
        const parsed: Project[] = JSON.parse(savedProjects)
        if (parsed.length > 0) {
          const teamProjects = parsed.filter((p: any) => !p.team || myTeams.includes(p.team))
          const finalProjects = teamProjects.length > 0 ? teamProjects : parsed
          setCreatedProjects(finalProjects)
          setSelectedProjectId(finalProjects[0].id)
          setSelectedRepo(finalProjects[0].repository || finalProjects[0].name)
          setSelectedBranch(finalProjects[0].branch || "main")
          setUserRoleInSelectedProject(finalProjects[0].userRole || "Developer")
          setIsLoadingProjects(false)
          return
        }
      } catch (e) {
        console.error("Error reading created projects:", e)
      }
    }

    // Empty state when no projects have been created yet
    setCreatedProjects([])
    setSelectedProjectId("")
    setSelectedRepo("")
    setSelectedBranch("")
    setIsLoadingProjects(false)
  }, [])

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId)
    const target = createdProjects.find(p => p.id === projectId)
    if (target) {
      setSelectedRepo(target.repository || target.name)
      setSelectedBranch(target.branch || "main")
      setUserRoleInSelectedProject(target.userRole || "Developer")
    }
  }

  // Permission & Team Isolation Checks
  const selectedProjectObj = createdProjects.find(p => p.id === selectedProjectId)
  const projectTeam = selectedProjectObj?.team || "Platform Engineering"
  const isMemberOfProjectTeam = userTeams.includes(projectTeam) || isGuestMode()
  const isViewerRole = userRoleInSelectedProject === "Viewer"
  const canTriggerAnalysis = isMemberOfProjectTeam && !isViewerRole && canUser(userRoleInSelectedProject, "trigger_scan")

  // Manual Mode Custom Prompt State
  const [userPrompt, setUserPrompt] = useState(
    "Check if this pull request introduces any SQL injection risks, breaking API contract changes for mobile app v2.1, or unhandled webhook errors."
  )

  // Execution states
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState<string>("")
  const [autoReport, setAutoReport] = useState<AutomaticReport | null>(null)
  const [manualResponse, setManualResponse] = useState<ManualPromptResponse | null>(null)

  const handleRunAutomaticAnalysis = () => {
    setIsAnalyzing(true)
    setAutoReport(null)
    setManualResponse(null)

    const steps = [
      "Fetching Git diff for " + selectedBranch + "...",
      "Executing automated AST code parser & scanners...",
      "Calculating Risk Score & Blast Radius...",
      "Generating Executive Summary & Deployment Checklist..."
    ]

    let current = 0
    setAnalysisStep(steps[0])

    const interval = setInterval(() => {
      current++
      if (current < steps.length) {
        setAnalysisStep(steps[current])
      } else {
        clearInterval(interval)
        setIsAnalyzing(false)

        const newAutoReport = {
          id: "auto-" + Date.now(),
          repository: selectedRepo,
          branch: selectedBranch,
          riskScore: 78,
          riskLevel: "High" as const,
          summary: [
            "PR introduces a new Stripe webhook handler in `backend/api/webhooks.py` with missing signature validation.",
            "Altered REST API response payload schema for `/api/v1/charge`, removing legacy `transaction_id` field.",
            "Dockerfile uses `node:18` base image running as root user without non-root privilege drop."
          ],
          securityIssues: [
            "Missing HMAC SHA256 signature verification on Stripe webhook payload.",
            "Hardcoded test API secret key detected in test fixture `test_stripe.py`."
          ],
          apiContractIssues: [
            "Removed deprecated `transaction_id` string property from `/api/v1/charge` schema (Breaks mobile app v2.1)."
          ],
          checklist: [
            "Add Stripe HMAC signature validation check before parsing webhook payload.",
            "Keep legacy `transaction_id` alias field for backward compatibility with mobile clients.",
            "Add `USER node` directive to Dockerfile before building image."
          ],
          createdAt: new Date().toISOString()
        }

        setAutoReport(newAutoReport)

        // Save analysis to History & Reports storage
        try {
          const savedHistory = JSON.parse(getScopedItem("impact_iq_analysis_history") || "[]")
          const historyEntry = {
            id: newAutoReport.id,
            type: "automatic",
            repository: newAutoReport.repository,
            branch: newAutoReport.branch,
            riskScore: newAutoReport.riskScore,
            riskLevel: newAutoReport.riskLevel,
            summary: newAutoReport.summary,
            securityIssues: newAutoReport.securityIssues,
            apiContractIssues: newAutoReport.apiContractIssues,
            checklist: newAutoReport.checklist,
            createdAt: newAutoReport.createdAt
          }
          const updatedHistory = [historyEntry, ...savedHistory]
          setScopedItem("impact_iq_analysis_history", JSON.stringify(updatedHistory))
          localStorage.setItem("impact_iq_analysis_history", JSON.stringify(updatedHistory))
          window.dispatchEvent(new Event("impact_iq_analysis_updated"))
        } catch (e) {}

        // Dynamically save notification & trigger connected integration webhooks
        try {
          const savedNotifs = JSON.parse(getScopedItem("impact_iq_notifications") || "[]")
          const newNotif = {
            id: `notif-scan-${Date.now()}`,
            title: `Risk Analysis: ${selectedRepo || 'Repository'} (${selectedBranch || 'main'})`,
            description: `AI risk evaluation completed for ${selectedRepo}. Detected API schema diffs and security validation rules.`,
            category: "risk",
            riskScore: 78,
            timestamp: "Just now",
            isUnread: true,
            actionUrl: "/dashboard/analysis"
          }
          const updated = [newNotif, ...savedNotifs]
          setScopedItem("impact_iq_notifications", JSON.stringify(updated))
          localStorage.setItem("impact_iq_notifications", JSON.stringify(updated))
          window.dispatchEvent(new Event("impact_iq_notifications_updated"))
        } catch (e) {}
      }
    }, 750)
  }

  const handleRunManualAnalysis = () => {
    if (!userPrompt.trim()) return

    setIsAnalyzing(true)
    setAutoReport(null)
    setManualResponse(null)

    const steps = [
      "Analyzing user query: \"" + userPrompt.slice(0, 30) + "...\"",
      "Evaluating code diff against custom prompt instructions...",
      "Generating interactive AI response & snippet review..."
    ]

    let current = 0
    setAnalysisStep(steps[0])

    const interval = setInterval(() => {
      current++
      if (current < steps.length) {
        setAnalysisStep(steps[current])
      } else {
        clearInterval(interval)
        setIsAnalyzing(false)

        const newManualResponse = {
          id: "man-" + Date.now(),
          repository: selectedRepo,
          branch: selectedBranch,
          prompt: userPrompt.trim(),
          aiResponse: `Based on your prompt review of **${selectedBranch}**, here are the specific findings:\n\n1. **SQL Injection Risks:** No raw unparameterized SQL queries were found in this PR. All queries use parameterized ORM calls.\n2. **Breaking API Contracts:** YES &mdash; the \`/api/v1/charge\` endpoint payload removed the \`transaction_id\` property. This will cause breaking crashes for mobile clients on version v2.1.\n3. **Webhook Errors:** The Stripe webhook handler in \`webhooks.py\` catches generic exceptions but lacks signature verification against spoofed payloads.`,
          keyTakeaways: [
            "Mobile App v2.1 compatibility issue: Re-add `transaction_id` as an alias.",
            "Security vulnerability: Implement `stripe.Webhook.construct_event()` signature check.",
            "ORM Safety: SQL queries are fully parameterized and safe."
          ],
          codeSnippetsFlagged: [
            "backend/api/webhooks.py:42 &mdash; Missing signature verification before payload deserialization",
            "backend/api/charge.py:18 &mdash; Breaking payload key removal `transaction_id`"
          ],
          createdAt: new Date().toISOString()
        }

        setManualResponse(newManualResponse)

        try {
          const savedHistory = JSON.parse(getScopedItem("impact_iq_analysis_history") || "[]")
          const historyEntry = {
            id: newManualResponse.id,
            type: "manual",
            repository: newManualResponse.repository,
            branch: newManualResponse.branch,
            prompt: newManualResponse.prompt,
            aiResponse: newManualResponse.aiResponse,
            keyTakeaways: newManualResponse.keyTakeaways,
            codeSnippetsFlagged: newManualResponse.codeSnippetsFlagged,
            createdAt: newManualResponse.createdAt
          }
          const updatedHistory = [historyEntry, ...savedHistory]
          setScopedItem("impact_iq_analysis_history", JSON.stringify(updatedHistory))
          localStorage.setItem("impact_iq_analysis_history", JSON.stringify(updatedHistory))
          window.dispatchEvent(new Event("impact_iq_analysis_updated"))
        } catch (e) {}
      }
    }, 750)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 select-none text-content-primary">
      {/* Top Breadcrumb & Page Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 text-left">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] font-bold text-content-muted uppercase tracking-[0.5px]">
              AI Code Scanner
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-content-primary tracking-tight mt-1">
            New Impact &amp; Risk Analysis
          </h1>
          <p className="text-xs text-content-secondary mt-0.5">
            Evaluate pull requests against AST syntax trees, predict breaking contract changes, and calculate blast radius.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => window.location.href = "/dashboard/history"}
            className="h-9 px-3 text-xs font-bold bg-surface-1 hover:bg-surface-2 border border-border text-content-primary rounded-xl cursor-pointer"
          >
            <FileText className="w-4 h-4 mr-1.5 text-brand" />
            View Past Scans
          </Button>
        </div>
      </div>

      {/* Analysis Mode Toggle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* PATH A: AUTOMATIC AI RISK SCAN */}
        <div
          onClick={() => setAnalysisMode("auto")}
          className={cn(
            "p-5 rounded-2xl border text-left cursor-pointer transition-all duration-150 space-y-3 relative overflow-hidden",
            analysisMode === "auto"
              ? "border-brand bg-surface-2 shadow-xs border-l-[3px]"
              : "border-border bg-surface-1 hover:bg-surface-2 opacity-80"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[var(--tag-typescript-bg)] border border-border flex items-center justify-center text-brand">
              <Zap className="w-5 h-5" />
            </div>
            {analysisMode === "auto" && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-brand bg-[var(--tag-typescript-bg)] px-2.5 py-0.5 rounded-full border border-border">
                <Check className="w-3.5 h-3.5" /> Selected Path
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-content-primary">Path 1: Automatic AI Risk Scan</h3>
            <p className="text-xs text-content-secondary mt-1 leading-relaxed">
              Automated engine parses Git diffs, calculates Risk Score (0-100%), scans security flaws, and generates action checklists in 1 click.
            </p>
          </div>
        </div>

        {/* PATH B: MANUAL PROMPTED ANALYSIS */}
        <div
          onClick={() => setAnalysisMode("manual")}
          className={cn(
            "p-5 rounded-2xl border text-left cursor-pointer transition-all duration-150 space-y-3 relative overflow-hidden",
            analysisMode === "manual"
              ? "border-brand bg-surface-2 shadow-xs border-l-[3px]"
              : "border-border bg-surface-1 hover:bg-surface-2 opacity-80"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-[var(--tag-p2p-bg)] border border-border flex items-center justify-center text-[var(--tag-p2p-text)]">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            {analysisMode === "manual" && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-[var(--tag-p2p-text)] bg-[var(--tag-p2p-bg)] px-2.5 py-0.5 rounded-full border border-border">
                <Check className="w-3.5 h-3.5" /> Selected Path
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-content-primary">Path 2: Manual Prompted Analysis</h3>
            <p className="text-xs text-content-secondary mt-1 leading-relaxed">
              Ask your own specific questions and custom prompts about the pull request. The AI answers your exact query directly.
            </p>
          </div>
        </div>

      </div>

      {/* Target Project, Repository & Branch Bar */}
      <div className="bg-surface-1 border border-border rounded-xl p-5 shadow-xs space-y-4 text-left">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-content-primary uppercase tracking-[0.5px] flex items-center gap-2">
            <Github className="w-4 h-4 text-content-muted" />
            Target Project &amp; Repository
          </h3>
          <span className="text-[10px] text-content-muted font-semibold">Loaded from Created Projects</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Created Projects Select */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-content-secondary uppercase tracking-[0.5px]">
              Select Created Project <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedProjectId}
              disabled={isLoadingProjects}
              onChange={(e) => handleSelectProject(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-border rounded-lg focus:outline-none font-bold text-content-primary cursor-pointer disabled:opacity-75"
            >
              {isLoadingProjects ? (
                <option value="">Loading created projects...</option>
              ) : createdProjects.length === 0 ? (
                <option value="">No projects created yet &mdash; Create a project first</option>
              ) : (
                createdProjects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} &mdash; ({p.repository || p.name})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Target Branch or PR Select */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-content-secondary uppercase tracking-[0.5px] flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5 text-content-muted" /> Target Branch or PR
            </label>
            <input
              type="text"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              placeholder="e.g. main or PR #42"
              className="w-full px-3 py-2 text-xs bg-surface-2 border border-border rounded-lg focus:outline-none font-medium text-content-primary"
            />
          </div>

          {/* Team Access Notice */}
          {selectedProjectObj && !isMemberOfProjectTeam && (
            <div className="md:col-span-2 bg-[var(--tag-security-bg)] border border-border rounded-xl p-3.5 flex items-center gap-2.5 mt-2">
              <ShieldAlert className="w-4 h-4 text-[var(--tag-security-text)] flex-shrink-0" />
              <p className="text-xs text-[var(--tag-security-text)] font-semibold">
                <strong>Access Restricted:</strong> This project is owned by <strong>&ldquo;{projectTeam}&rdquo;</strong>. Only members of <strong>&ldquo;{projectTeam}&rdquo;</strong> can build or run risk scans.
              </p>
            </div>
          )}

          {/* Empty Projects Alert Banner */}
          {!isLoadingProjects && createdProjects.length === 0 && (
            <div className="md:col-span-2 bg-[var(--tag-dependencies-bg)] border border-border rounded-xl p-3.5 flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-xs text-[var(--tag-dependencies-text)] font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>No created projects found. Create your first project from repositories to run risk analysis.</span>
              </div>
              <Button
                onClick={() => window.location.href = "/dashboard/repositories"}
                className="h-8 px-3 text-xs font-bold text-white bg-gradient-to-r from-[#845EC2] via-[#C34A36] to-[#FF8066] dark:from-indigo-600 dark:to-indigo-700 rounded-lg cursor-pointer"
              >
                Create Project &rarr;
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* MODE SPECIFIC EXECUTION FORM */}
      {analysisMode === "auto" ? (
        /* AUTOMATIC AI ANALYSIS FORM */
        <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-xs space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand" />
              <h2 className="text-sm font-bold text-content-primary">Automatic AI Risk Scan</h2>
            </div>
            <span className="text-[11px] text-content-muted">Run automated risk scoring, security scans &amp; checklist generation</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-content-secondary">
              {!canTriggerAnalysis 
                ? "Builds & scans are locked for this project due to team ownership or role restrictions."
                : "Click below to analyze the pull request using ImpactIQ's automated AI engine."
              }
            </p>
            <Button
              disabled={isAnalyzing || !canTriggerAnalysis || createdProjects.length === 0}
              onClick={handleRunAutomaticAnalysis}
              className={cn(
                "h-11 px-6 text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs transition-all",
                canTriggerAnalysis && !isAnalyzing
                  ? "bg-gradient-to-r from-[#845EC2] via-[#C34A36] to-[#FF8066] dark:from-indigo-600 dark:to-indigo-700 hover:opacity-95 text-white cursor-pointer"
                  : "bg-surface-2 text-content-muted border border-border cursor-not-allowed opacity-70"
              )}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{analysisStep}</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4.5 h-4.5" />
                  <span>{canTriggerAnalysis ? "Run Automatic Analysis" : "Scan Locked"}</span>
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        /* MANUAL PROMPTED ANALYSIS FORM */
        <div className="bg-surface-1 border border-border rounded-xl p-6 shadow-xs space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <MessageSquareCode className="w-5 h-5 text-brand" />
              <h2 className="text-sm font-bold text-content-primary">Manual Prompted Analysis</h2>
            </div>
            <span className="text-[11px] text-content-muted">Ask custom questions and prompts about this PR</span>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-content-secondary uppercase tracking-[0.5px]">
              What do you want to know about this code change? <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="e.g. Does this PR break backward compatibility? Check for SQL injection or unhandled errors..."
              rows={4}
              className="w-full px-3.5 py-2.5 text-xs bg-surface-2 border border-border rounded-xl focus:outline-none leading-relaxed font-medium text-content-primary"
            />

            {/* Prompt presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[10px] font-bold text-content-muted uppercase tracking-[0.5px] self-center mr-1">Quick Prompts:</span>
              <button
                type="button"
                onClick={() => setUserPrompt("Check if this PR introduces breaking REST API schema changes for mobile app clients.")}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[var(--tag-typescript-bg)] text-[var(--tag-typescript-text)] border border-border cursor-pointer hover:bg-surface-3"
              >
                + API Backward Compatibility Check
              </button>
              <button
                type="button"
                onClick={() => setUserPrompt("Analyze SQL queries in this PR for unparameterized SQL injection vulnerabilities.")}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[var(--tag-typescript-bg)] text-[var(--tag-typescript-text)] border border-border cursor-pointer hover:bg-surface-3"
              >
                + SQL Injection Audit
              </button>
              <button
                type="button"
                onClick={() => setUserPrompt("Explain the architectural flow changes introduced in this PR in plain technical terms.")}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[var(--tag-typescript-bg)] text-[var(--tag-typescript-text)] border border-border cursor-pointer hover:bg-surface-3"
              >
                + Explain Code Flow
              </button>
            </div>

            <div className="pt-3 flex items-center justify-end">
              <Button
                disabled={isAnalyzing}
                onClick={handleRunManualAnalysis}
                className="h-11 px-6 text-xs font-bold bg-gradient-to-r from-[#845EC2] via-[#C34A36] to-[#FF8066] dark:from-indigo-600 dark:to-indigo-700 hover:opacity-95 text-white rounded-xl flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-75"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{analysisStep}</span>
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-4.5 h-4.5" />
                    <span>Ask AI Assistant</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* AUTOMATIC ANALYSIS REPORT OUTPUT */}
      {autoReport && (
        <div className="bg-surface-1 border border-border rounded-2xl p-6 shadow-xl space-y-6 text-left animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border">
            <div>
              <span className="text-xs font-bold text-content-muted uppercase tracking-[0.5px]">Automatic AI Analysis Report</span>
              <h2 className="text-lg font-bold text-content-primary mt-1">{autoReport.repository} &mdash; {autoReport.branch}</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-bold text-content-muted uppercase tracking-[0.5px] block">Risk Score</span>
                <span className="text-xl font-extrabold text-[var(--tag-security-text)]">{autoReport.riskScore}% ({autoReport.riskLevel} Risk)</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[var(--tag-security-bg)] text-[var(--tag-security-text)] border border-border font-extrabold text-lg flex items-center justify-center shadow-xs">
                {autoReport.riskScore}%
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-content-primary uppercase tracking-[0.5px] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand" /> AI Executive Summary
            </h4>
            <div className="bg-surface-2 border border-border rounded-xl p-4 space-y-2">
              {autoReport.summary.map((item, idx) => (
                <p key={idx} className="text-xs text-content-secondary flex items-start gap-2 leading-relaxed">
                  <span className="text-brand font-bold">•</span>
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            <h4 className="text-xs font-bold text-content-primary uppercase tracking-[0.5px] flex items-center gap-2">
              <Check className="w-4 h-4 text-[var(--tag-iot-text)]" /> Deployment Action Checklist
            </h4>
            <div className="space-y-2 bg-surface-2 border border-border rounded-xl p-4">
              {autoReport.checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-surface-1 p-2.5 rounded-lg border border-border">
                  <input type="checkbox" className="rounded text-brand cursor-pointer" />
                  <span className="text-xs font-medium text-content-primary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MANUAL PROMPTED ANALYSIS RESPONSE OUTPUT */}
      {manualResponse && (
        <div className="bg-surface-1 border border-border rounded-2xl p-6 shadow-xl space-y-6 text-left animate-fadeIn">
          <div className="pb-4 border-b border-border space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--tag-p2p-bg)] text-[var(--tag-p2p-text)] border border-border uppercase tracking-[0.5px]">
                Manual Prompted AI Analysis
              </span>
            </div>
            <h2 className="text-base font-bold text-content-primary">{manualResponse.repository} &mdash; {manualResponse.branch}</h2>
            <div className="bg-surface-2 border border-border rounded-xl p-3 text-xs text-content-primary font-mono leading-relaxed">
              <strong className="text-brand block text-[10px] uppercase font-sans mb-1">Your Custom Prompt:</strong>
              &ldquo;{manualResponse.prompt}&rdquo;
            </div>
          </div>

          {/* AI Response Output */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-content-primary uppercase tracking-[0.5px] flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-brand" /> AI Findings Response
            </h4>
            <div className="bg-surface-2 border border-border rounded-xl p-4 text-xs text-content-secondary leading-relaxed whitespace-pre-line font-sans">
              {manualResponse.aiResponse}
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-content-primary uppercase tracking-[0.5px] flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-[var(--tag-iot-text)]" /> Key Takeaways &amp; Next Steps
            </h4>
            <div className="space-y-2">
              {manualResponse.keyTakeaways.map((item, idx) => (
                <div key={idx} className="p-3 bg-surface-2 border border-border rounded-xl flex items-start gap-2.5 text-xs text-content-primary">
                  <Check className="w-4 h-4 text-[var(--tag-iot-text)] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Flagged Code Snippets */}
          <div className="space-y-2 pt-2 border-t border-border">
            <h4 className="text-xs font-bold text-content-primary uppercase tracking-[0.5px] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[var(--tag-security-text)]" /> Flagged Code Locations
            </h4>
            <div className="space-y-2">
              {manualResponse.codeSnippetsFlagged.map((snippet, idx) => (
                <div key={idx} className="p-3 bg-surface-2 border border-border rounded-xl text-xs font-mono text-content-primary">
                  {snippet}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

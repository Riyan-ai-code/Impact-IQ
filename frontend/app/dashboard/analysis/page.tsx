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
  ListChecks
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
  createdAt?: string
}

export default function NewAnalysisPage() {
  // Mode selection: "auto" | "manual"
  const [analysisMode, setAnalysisMode] = useState<"auto" | "manual">("auto")

  // Created Projects state
  const [createdProjects, setCreatedProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [selectedRepo, setSelectedRepo] = useState<string>("Riyanshah / payment-service")
  const [selectedBranch, setSelectedBranch] = useState<string>("main")

  useEffect(() => {
    const savedProjects = localStorage.getItem("impact_iq_projects")
    if (savedProjects) {
      try {
        const parsed: Project[] = JSON.parse(savedProjects)
        if (parsed.length > 0) {
          setCreatedProjects(parsed)
          setSelectedProjectId(parsed[0].id)
          setSelectedRepo(parsed[0].repository || parsed[0].name)
          setSelectedBranch(parsed[0].branch || "main")
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
  }, [])

  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId)
    const target = createdProjects.find(p => p.id === projectId)
    if (target) {
      setSelectedRepo(target.repository || target.name)
      setSelectedBranch(target.branch || "main")
    }
  }

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

        setAutoReport({
          id: "auto-" + Date.now(),
          repository: selectedRepo,
          branch: selectedBranch,
          riskScore: 78,
          riskLevel: "High",
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
        })
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

        setManualResponse({
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
            "backend/api/webhooks.py: L42 - missing stripe.Webhook.construct_event(payload, sig, endpoint_secret)",
            "backend/api/charge.py: L18 - removed 'transaction_id' key from JSON response"
          ],
          createdAt: new Date().toISOString()
        })
      }
    }, 800)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Run Code Analysis</h1>
          <p className="text-xs text-slate-500 mt-1">Choose between Automatic AI Risk Analysis or Manual Prompted Analysis.</p>
        </div>
      </div>

      {/* Execution Path Switcher Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* PATH A: AUTOMATIC AI ANALYSIS */}
        <div
          onClick={() => setAnalysisMode("auto")}
          className={cn(
            "p-5 rounded-2xl border text-left cursor-pointer transition-all space-y-3 relative overflow-hidden",
            analysisMode === "auto"
              ? "border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-md"
              : "border-slate-200 bg-white hover:bg-slate-50 opacity-80"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Zap className="w-5 h-5" />
            </div>
            {analysisMode === "auto" && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                <Check className="w-3.5 h-3.5" /> Selected Path
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Path 1: Automatic AI Analysis</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Automated engine parses Git diffs, calculates Risk Score (0-100%), scans security flaws, and generates action checklists in 1 click.
            </p>
          </div>
        </div>

        {/* PATH B: MANUAL PROMPTED ANALYSIS */}
        <div
          onClick={() => setAnalysisMode("manual")}
          className={cn(
            "p-5 rounded-2xl border text-left cursor-pointer transition-all space-y-3 relative overflow-hidden",
            analysisMode === "manual"
              ? "border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-md"
              : "border-slate-200 bg-white hover:bg-slate-50 opacity-80"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <MessageSquareCode className="w-5 h-5" />
            </div>
            {analysisMode === "manual" && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
                <Check className="w-3.5 h-3.5" /> Selected Path
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Path 2: Manual Prompted Analysis</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Ask your own specific questions and custom prompts about the pull request. The AI answers your exact query directly.
            </p>
          </div>
        </div>

      </div>

      {/* Target Project, Repository & Branch Bar */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4 text-left">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Github className="w-4 h-4 text-slate-700" />
            Target Project &amp; Repository
          </h3>
          <span className="text-[10px] text-slate-400 font-semibold">Loaded from Created Projects</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Created Projects Select */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
              Select Created Project <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => handleSelectProject(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-bold text-slate-900 cursor-pointer"
            >
              {createdProjects.length === 0 ? (
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
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5 text-slate-400" /> Target Branch or PR
            </label>
            <input
              type="text"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              placeholder="e.g. main or PR #42"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
            />
          </div>

          {/* Empty Projects Alert Banner */}
          {createdProjects.length === 0 && (
            <div className="md:col-span-2 bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-center justify-between mt-2">
              <div className="flex items-center gap-2 text-xs text-amber-900 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>No created projects found. Create your first project from repositories to run risk analysis.</span>
              </div>
              <Button
                variant="outline"
                onClick={() => window.location.href = "/dashboard/repositories"}
                className="h-8 px-3 text-xs font-bold border-amber-300 text-amber-900 bg-white hover:bg-amber-100/60 rounded-lg cursor-pointer"
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
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Automatic AI Risk Scan</h2>
            </div>
            <span className="text-[11px] text-slate-500">Run automated risk scoring, security scans &amp; checklist generation</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-500">Click below to analyze the pull request using ImpactIQ&apos;s automated AI engine.</p>
            <Button
              variant="brand"
              disabled={isAnalyzing}
              onClick={handleRunAutomaticAnalysis}
              className="h-11 px-6 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-75"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{analysisStep}</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4.5 h-4.5" />
                  <span>Run Automatic Analysis</span>
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        /* MANUAL PROMPTED ANALYSIS FORM */
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-sm space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageSquareCode className="w-5 h-5 text-purple-600" />
              <h2 className="text-sm font-bold text-slate-900">Manual Prompted Analysis</h2>
            </div>
            <span className="text-[11px] text-slate-500">Ask custom questions and prompts about this PR</span>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
              What do you want to know about this code change? <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="e.g. Does this PR break backward compatibility? Check for SQL injection or unhandled errors..."
              rows={4}
              className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 leading-relaxed font-medium"
            />

            {/* Prompt presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider self-center mr-1">Quick Prompts:</span>
              <button
                type="button"
                onClick={() => setUserPrompt("Check if this PR introduces breaking REST API schema changes for mobile app clients.")}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100 cursor-pointer"
              >
                + API Backward Compatibility Check
              </button>
              <button
                type="button"
                onClick={() => setUserPrompt("Analyze SQL queries in this PR for unparameterized SQL injection vulnerabilities.")}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100 cursor-pointer"
              >
                + SQL Injection Audit
              </button>
              <button
                type="button"
                onClick={() => setUserPrompt("Explain the architectural flow changes introduced in this PR in plain technical terms.")}
                className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100 cursor-pointer"
              >
                + Explain Code Flow
              </button>
            </div>

            <div className="pt-3 flex items-center justify-end">
              <Button
                variant="brand"
                disabled={isAnalyzing}
                onClick={handleRunManualAnalysis}
                className="h-11 px-6 text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-75"
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
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg space-y-6 text-left animate-in fade-in zoom-in-95 duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Automatic AI Analysis Report</span>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{autoReport.repository} &mdash; {autoReport.branch}</h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Risk Score</span>
                <span className="text-xl font-extrabold text-rose-600">{autoReport.riskScore}% ({autoReport.riskLevel} Risk)</span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white font-extrabold text-lg flex items-center justify-center shadow-md">
                {autoReport.riskScore}%
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" /> AI Executive Summary
            </h4>
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-2">
              {autoReport.summary.map((item, idx) => (
                <p key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" /> Deployment Action Checklist
            </h4>
            <div className="space-y-2 bg-emerald-50/40 border border-emerald-100 rounded-xl p-4">
              {autoReport.checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-emerald-100">
                  <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                  <span className="text-xs font-medium text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MANUAL PROMPTED ANALYSIS RESPONSE OUTPUT */}
      {manualResponse && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg space-y-6 text-left animate-in fade-in zoom-in-95 duration-300">
          <div className="pb-4 border-b border-slate-100 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wider">
                Manual Prompted AI Analysis
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900">{manualResponse.repository} &mdash; {manualResponse.branch}</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-mono leading-relaxed">
              <strong className="text-slate-900 block text-[10px] uppercase font-sans mb-1">Your Custom Prompt:</strong>
              &ldquo;{manualResponse.prompt}&rdquo;
            </div>
          </div>

          {/* AI Response Output */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-purple-600" /> AI Findings Response
            </h4>
            <div className="bg-purple-50/40 border border-purple-100 rounded-xl p-4 text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans">
              {manualResponse.aiResponse}
            </div>
          </div>

          {/* Key Takeaways */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-emerald-600" /> Key Takeaways &amp; Next Steps
            </h4>
            <div className="space-y-2">
              {manualResponse.keyTakeaways.map((item, idx) => (
                <div key={idx} className="p-3 bg-white border border-slate-200/80 rounded-xl flex items-start gap-2.5 text-xs text-slate-700">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Flagged Code Snippets */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-rose-600" /> Flagged Code Locations
            </h4>
            <div className="space-y-2">
              {manualResponse.codeSnippetsFlagged.map((snippet, idx) => (
                <div key={idx} className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs font-mono">
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

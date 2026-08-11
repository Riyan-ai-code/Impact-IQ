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
  RefreshCw,
  SlidersHorizontal,
  Code
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnalysisReport {
  id: string
  repository: string
  branch: string
  aiModel: string
  riskScore: number
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  summary: string[]
  securityIssues: string[]
  apiContractIssues: string[]
  dependencyIssues: string[]
  dockerIssues: string[]
  checklist: string[]
  createdAt: string
}

export default function NewAnalysisPage() {
  // Form states
  const [selectedRepo, setSelectedRepo] = useState("Riyanshah / payment-service")
  const [selectedBranch, setSelectedBranch] = useState("PR #42 - Add Stripe Webhook Handler")
  const [aiModel, setAiModel] = useState<"gemini-1.5-pro" | "gpt-4o" | "claude-3.5-sonnet">("gemini-1.5-pro")
  const [customRules, setCustomRules] = useState("Flag unparameterized SQL queries.\nEnsure Dockerfile runs as non-root user.\nDetect breaking changes in REST API schemas.")

  // Analysis Toggles
  const [securityAnalysis, setSecurityAnalysis] = useState(true)
  const [dependencyAnalysis, setDependencyAnalysis] = useState(true)
  const [apiAnalysis, setApiAnalysis] = useState(true)

  // Execution states
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState<string>("")
  const [report, setReport] = useState<AnalysisReport | null>(null)

  const handleRunAnalysis = () => {
    setIsAnalyzing(true)
    setReport(null)

    const steps = [
      "Fetching Git diff for " + selectedBranch + "...",
      "Executing static code analysis & parsing AST...",
      "Querying " + (aiModel === "gemini-1.5-pro" ? "Gemini 1.5 Pro" : aiModel === "gpt-4o" ? "GPT-4o" : "Claude 3.5 Sonnet") + " AI Engine...",
      "Evaluating Custom Audit Rules...",
      "Generating Risk Score & Deployment Checklist..."
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

        // Generate dynamic analysis report based on AI model
        const mockReport: AnalysisReport = {
          id: "rep-" + Date.now(),
          repository: selectedRepo,
          branch: selectedBranch,
          aiModel: aiModel === "gemini-1.5-pro" ? "Gemini 1.5 Pro" : aiModel === "gpt-4o" ? "GPT-4o" : "Claude 3.5 Sonnet",
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
          dependencyIssues: [
            "Added `stripe-python@v8.2.0` dependency with 1 known low severity advisory."
          ],
          dockerIssues: [
            "Dockerfile container process executes as root (`UID 0`)."
          ],
          checklist: [
            "Add Stripe HMAC signature validation check before parsing webhook payload.",
            "Keep legacy `transaction_id` alias field for backward compatibility with mobile clients.",
            "Add `USER node` directive to Dockerfile before building image."
          ],
          createdAt: new Date().toISOString()
        }

        setReport(mockReport)
      }
    }, 800)
  }

  const handleAddTemplateRule = (ruleText: string) => {
    if (customRules.includes(ruleText)) return
    setCustomRules(prev => prev ? `${prev}\n${ruleText}` : ruleText)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">New AI Risk Analysis</h1>
          <p className="text-xs text-slate-500 mt-1">Select a repository branch, choose your preferred AI Engine, and run on-demand code risk analysis.</p>
        </div>
      </div>

      {/* Main Analysis Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Repository & Branch Selection */}
        <div className="lg:col-span-1 space-y-5 bg-white border border-slate-100 rounded-xl p-5 shadow-sm text-left">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Github className="w-4 h-4 text-slate-700" />
            Target Repository &amp; Branch
          </h3>

          <div className="space-y-4">
            {/* Repository Select */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Repository <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer font-medium"
              >
                <option value="Riyanshah / payment-service">Riyanshah / payment-service</option>
                <option value="Riyanshah / auth-service">Riyanshah / auth-service</option>
                <option value="Riyanshah / order-service">Riyanshah / order-service</option>
              </select>
            </div>

            {/* Branch / PR Select */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                Branch or PR <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer font-medium"
              >
                <option value="PR #42 - Add Stripe Webhook Handler">PR #42 - Add Stripe Webhook Handler</option>
                <option value="PR #39 - Upgrade Node.js & Dockerfile">PR #39 - Upgrade Node.js &amp; Dockerfile</option>
                <option value="main">main (Base Branch)</option>
                <option value="develop">develop</option>
              </select>
            </div>

            {/* Analysis Engine Scope Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide block">
                Enabled Scanners
              </label>

              <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-indigo-600" /> Security Scanner
                  </span>
                  <input
                    type="checkbox"
                    checked={securityAnalysis}
                    onChange={(e) => setSecurityAnalysis(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="flex items-center gap-2">
                    <Network className="w-3.5 h-3.5 text-emerald-600" /> Dependency Graph
                  </span>
                  <input
                    type="checkbox"
                    checked={dependencyAnalysis}
                    onChange={(e) => setDependencyAnalysis(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs font-semibold text-slate-700 cursor-pointer p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-purple-600" /> API Contract Check
                  </span>
                  <input
                    type="checkbox"
                    checked={apiAnalysis}
                    onChange={(e) => setApiAnalysis(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (2 Cols): AI Engine & Custom Audit Rules */}
        <div className="lg:col-span-2 space-y-5 bg-white border border-slate-100 rounded-xl p-5 shadow-sm text-left">
          
          {/* AI Engine Selection Cards */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
              <span>Select AI Intelligence Engine</span>
              <span className="text-[10px] text-indigo-600 font-bold">Routes analysis to target LLM API</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Gemini 1.5 Pro */}
              <div
                onClick={() => setAiModel("gemini-1.5-pro")}
                className={cn(
                  "p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all min-h-[100px]",
                  aiModel === "gemini-1.5-pro"
                    ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  {aiModel === "gemini-1.5-pro" && <Check className="w-4 h-4 text-indigo-600 font-bold" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Gemini 1.5 Pro</h4>
                  <p className="text-[9px] text-slate-500 leading-tight mt-0.5">Fast code diff reasoning &amp; 1M token context.</p>
                </div>
              </div>

              {/* GPT-4o */}
              <div
                onClick={() => setAiModel("gpt-4o")}
                className={cn(
                  "p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all min-h-[100px]",
                  aiModel === "gpt-4o"
                    ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <Bot className="w-4 h-4 text-emerald-600" />
                  {aiModel === "gpt-4o" && <Check className="w-4 h-4 text-indigo-600 font-bold" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">GPT-4o</h4>
                  <p className="text-[9px] text-slate-500 leading-tight mt-0.5">OpenAI high-precision security analysis.</p>
                </div>
              </div>

              {/* Claude 3.5 Sonnet */}
              <div
                onClick={() => setAiModel("claude-3.5-sonnet")}
                className={cn(
                  "p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all min-h-[100px]",
                  aiModel === "claude-3.5-sonnet"
                    ? "border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <BrainCircuit className="w-4 h-4 text-purple-600" />
                  {aiModel === "claude-3.5-sonnet" && <Check className="w-4 h-4 text-indigo-600 font-bold" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Claude 3.5</h4>
                  <p className="text-[9px] text-slate-500 leading-tight mt-0.5">Anthropic deep code syntax understanding.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Audit Rules Textarea */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                Custom Code Audit Rules &amp; Prompts
              </label>
              <span className="text-[10px] text-slate-400">1 rule per line</span>
            </div>

            <textarea
              value={customRules}
              onChange={(e) => setCustomRules(e.target.value)}
              placeholder="Enter custom prompt rules (e.g. Flag unparameterized SQL queries...)"
              rows={4}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono"
            />

            {/* Quick Add Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleAddTemplateRule("Flag raw SQL queries without parameterization.")}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/60 cursor-pointer"
              >
                + SQL Audit
              </button>
              <button
                type="button"
                onClick={() => handleAddTemplateRule("Verify Dockerfile does not run as root user.")}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/60 cursor-pointer"
              >
                + Non-Root Docker
              </button>
              <button
                type="button"
                onClick={() => handleAddTemplateRule("Detect breaking changes in REST API endpoint schemas.")}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200/60 cursor-pointer"
              >
                + Breaking API Check
              </button>
            </div>
          </div>

          {/* Trigger Button */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <Button
              variant="brand"
              disabled={isAnalyzing}
              onClick={handleRunAnalysis}
              className="h-11 px-6 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg flex items-center gap-2 transition-all duration-150 shadow-md cursor-pointer disabled:opacity-75"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{analysisStep}</span>
                </>
              ) : (
                <>
                  <PlayCircle className="w-4.5 h-4.5" />
                  <span>Run AI Risk Analysis</span>
                </>
              )}
            </Button>
          </div>

        </div>

      </div>

      {/* REPORT RESULTS DISPLAY */}
      {report && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-lg space-y-6 text-left animate-in fade-in zoom-in-95 duration-300">
          
          {/* Report Top Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Analysis Report</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {report.aiModel}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mt-1">{report.repository} &mdash; {report.branch}</h2>
            </div>

            {/* Risk Score Badge */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Deployment Risk Score</span>
                <span className={cn(
                  "text-xl font-extrabold",
                  report.riskScore > 70 ? "text-rose-600" : report.riskScore > 40 ? "text-amber-600" : "text-emerald-600"
                )}>
                  {report.riskScore}% ({report.riskLevel} Risk)
                </span>
              </div>

              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-lg shadow-md",
                report.riskScore > 70 ? "bg-rose-600" : report.riskScore > 40 ? "bg-amber-500" : "bg-emerald-600"
              )}>
                {report.riskScore}%
              </div>
            </div>
          </div>

          {/* AI Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              AI Executive Summary
            </h4>
            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 space-y-2">
              {report.summary.map((item, idx) => (
                <p key={idx} className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Findings Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Security Findings */}
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-2">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-600" /> Security Vulnerabilities ({report.securityIssues.length})
              </h5>
              {report.securityIssues.map((issue, i) => (
                <p key={i} className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </p>
              ))}
            </div>

            {/* API Contract Findings */}
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-2">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-600" /> Breaking API Contracts ({report.apiContractIssues.length})
              </h5>
              {report.apiContractIssues.map((issue, i) => (
                <p key={i} className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/60 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{issue}</span>
                </p>
              ))}
            </div>

          </div>

          {/* Deployment Checklist */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              Recommended Deployment Action Checklist
            </h4>
            <div className="space-y-2 bg-emerald-50/40 border border-emerald-100 rounded-xl p-4">
              {report.checklist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-emerald-100">
                  <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                  <span className="text-xs font-medium text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

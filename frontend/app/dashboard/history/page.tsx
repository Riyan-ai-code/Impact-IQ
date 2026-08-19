"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  History, 
  Search, 
  Filter, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  ShieldAlert, 
  GitBranch, 
  FolderGit2, 
  ArrowRight, 
  Download, 
  Eye, 
  Trash2, 
  Sparkles, 
  Terminal, 
  Calendar,
  X,
  FileSpreadsheet,
  Activity,
  Layers,
  ChevronRight,
  ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getScopedItem, setScopedItem } from "@/lib/storageScope"

interface AnalysisRecord {
  id: string
  type: "automatic" | "manual"
  repository: string
  branch: string
  riskScore: number
  riskLevel: "Critical" | "High" | "Medium" | "Low"
  summary?: string[]
  securityIssues?: string[]
  apiContractIssues?: string[]
  checklist?: string[]
  prompt?: string
  aiResponse?: string
  keyTakeaways?: string[]
  codeSnippetsFlagged?: string[]
  createdAt: string
}

export default function AnalysisHistoryPage() {
  const [history, setHistory] = useState<AnalysisRecord[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>("all")
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("all")
  const [selectedRecord, setSelectedRecord] = useState<AnalysisRecord | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Load analysis history from storage
  const loadHistory = () => {
    try {
      const raw = getScopedItem("impact_iq_analysis_history") || localStorage.getItem("impact_iq_analysis_history")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          setHistory(parsed)
          return
        }
      }
    } catch (e) {}

    // Initial default seed if empty
    const seed: AnalysisRecord[] = [
      {
        id: "seed-1",
        type: "automatic",
        repository: "Payment-Gateway-Service",
        branch: "feature/stripe-v3-upgrade",
        riskScore: 78,
        riskLevel: "High",
        summary: [
          "PR introduces a new Stripe webhook handler in backend/api/webhooks.py with missing signature validation.",
          "Altered REST API response payload schema for /api/v1/charge, removing legacy transaction_id field.",
          "Dockerfile uses node:18 base image running as root user without non-root privilege drop."
        ],
        securityIssues: [
          "Missing HMAC SHA256 signature verification on Stripe webhook payload.",
          "Hardcoded test API secret key detected in test fixture test_stripe.py."
        ],
        apiContractIssues: [
          "Removed deprecated transaction_id string property from /api/v1/charge schema (Breaks mobile app v2.1)."
        ],
        checklist: [
          "Add Stripe HMAC signature validation check before parsing webhook payload.",
          "Keep legacy transaction_id alias field for backward compatibility with mobile clients.",
          "Add USER node directive to Dockerfile before building image."
        ],
        createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
      },
      {
        id: "seed-2",
        type: "manual",
        repository: "auth-identity-service",
        branch: "fix/jwt-expiry-refresh",
        riskScore: 42,
        riskLevel: "Medium",
        prompt: "Check JWT refresh token rotation and database migration schema locks.",
        aiResponse: "Evaluated JWT refresh logic. Migration script adds non-concurrent index which might briefly lock the sessions table under peak load.",
        keyTakeaways: [
          "Add CREATE INDEX CONCURRENTLY to PostgreSQL migration script.",
          "Token revocation blacklist uses Redis with TTL properly."
        ],
        codeSnippetsFlagged: [
          "migrations/004_jwt_sessions.sql: L12 - non-concurrent index addition"
        ],
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      },
      {
        id: "seed-3",
        type: "automatic",
        repository: "Frontend-NextJS-App",
        branch: "chore/tailwind-v4-migration",
        riskScore: 18,
        riskLevel: "Low",
        summary: [
          "Stylesheet refactor updating CSS theme tokens.",
          "Zero breaking API contract modifications.",
          "No external egress network calls introduced."
        ],
        securityIssues: [],
        apiContractIssues: [],
        checklist: [
          "Verify visual regression across Chrome and Safari.",
          "Ensure bundle size gzip delta is under 50KB."
        ],
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      }
    ]

    setHistory(seed)
    setScopedItem("impact_iq_analysis_history", JSON.stringify(seed))
    localStorage.setItem("impact_iq_analysis_history", JSON.stringify(seed))
  }

  useEffect(() => {
    loadHistory()
    window.addEventListener("impact_iq_analysis_updated", loadHistory)
    window.addEventListener("storage", loadHistory)
    return () => {
      window.removeEventListener("impact_iq_analysis_updated", loadHistory)
      window.removeEventListener("storage", loadHistory)
    }
  }, [])

  // Delete an individual record
  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = history.filter(item => item.id !== id)
    setHistory(updated)
    setScopedItem("impact_iq_analysis_history", JSON.stringify(updated))
    localStorage.setItem("impact_iq_analysis_history", JSON.stringify(updated))
  }

  // Clear all history
  const handleClearAll = () => {
    if (confirm("Are you sure you want to clear your entire analysis history?")) {
      setHistory([])
      setScopedItem("impact_iq_analysis_history", JSON.stringify([]))
      localStorage.setItem("impact_iq_analysis_history", JSON.stringify([]))
    }
  }

  // Filtered list
  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      item.repository.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.prompt && item.prompt.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRisk = 
      selectedRiskFilter === "all" ||
      item.riskLevel.toLowerCase() === selectedRiskFilter.toLowerCase()

    const matchesType = 
      selectedTypeFilter === "all" ||
      item.type.toLowerCase() === selectedTypeFilter.toLowerCase()

    return matchesSearch && matchesRisk && matchesType
  })

  // Statistics
  const totalScans = history.length
  const highCriticalCount = history.filter(h => h.riskScore >= 70).length
  const avgRiskScore = totalScans > 0 
    ? Math.round(history.reduce((acc, curr) => acc + curr.riskScore, 0) / totalScans) 
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Analysis History</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {totalScans} Scan Records
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Historical audit log of all AI automated risk scans and manual prompt evaluations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/dashboard/analysis">
            <Button
              variant="brand"
              className="h-9 px-4 text-xs font-bold bg-gradient-to-r from-[#845EC2] via-[#C34A36] to-[#FF8066] dark:from-indigo-600 dark:to-indigo-700 hover:opacity-95 text-white rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Run New Analysis</span>
            </Button>
          </Link>
          {history.length > 0 && (
            <Button
              variant="outline"
              onClick={handleClearAll}
              className="h-9 px-3 text-xs font-bold border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer text-slate-600"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </Button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total Evaluations</span>
            <div className="text-2xl font-black text-slate-900">{totalScans}</div>
            <p className="text-[10px] text-slate-400">All automated &amp; prompt scans</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">High / Critical Flags</span>
            <div className="text-2xl font-black text-rose-600">{highCriticalCount}</div>
            <p className="text-[10px] text-slate-400">Required senior gate sign-off</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Flame className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Avg Risk Exposure</span>
            <div className="text-2xl font-black text-amber-600">{avgRiskScore}%</div>
            <p className="text-[10px] text-slate-400">Across active repositories</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by repository name, branch, or prompt query..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white font-medium"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">Risk:</span>
              {["all", "critical", "high", "medium", "low"].map(risk => (
                <button
                  key={risk}
                  onClick={() => setSelectedRiskFilter(risk)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer",
                    selectedRiskFilter === risk 
                      ? "bg-white text-indigo-600 shadow-2xs" 
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {risk}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">Type:</span>
              {[
                { id: "all", label: "All" },
                { id: "automatic", label: "Auto AI" },
                { id: "manual", label: "Manual" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTypeFilter(t.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer",
                    selectedTypeFilter === t.id 
                      ? "bg-white text-indigo-600 shadow-2xs" 
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* History List Table / Cards */}
      {filteredHistory.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Analysis Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery || selectedRiskFilter !== "all" || selectedTypeFilter !== "all"
              ? "No scan history matches your filter criteria. Try resetting filters."
              : "You have not executed any risk analyses yet. Run your first scan to populate this history."}
          </p>
          <div className="pt-2">
            <Link href="/dashboard/analysis">
              <Button variant="brand" className="h-8 px-4 text-xs font-bold bg-gradient-to-r from-[#845EC2] via-[#C34A36] to-[#FF8066] dark:from-indigo-600 dark:to-indigo-700 hover:opacity-95 text-white rounded-lg">
                Run First Analysis
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => {
            const isHigh = item.riskScore >= 70
            const isMed = item.riskScore >= 40 && item.riskScore < 70
            const isLow = item.riskScore < 40

            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedRecord(item)
                  setIsModalOpen(true)
                }}
                className="bg-white border border-slate-200/80 hover:border-indigo-300 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all cursor-pointer group space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                      <FolderGit2 className="w-4 h-4 text-indigo-600" />
                      <span>{item.repository}</span>
                    </div>

                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono font-medium">
                      <GitBranch className="w-3 h-3 text-slate-400" />
                      <span>{item.branch}</span>
                    </div>

                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      item.type === "automatic" 
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200" 
                        : "bg-purple-50 text-purple-700 border border-purple-200"
                    )}>
                      {item.type === "automatic" ? "🤖 Automated AI Scan" : "💬 Custom Prompt"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.createdAt).toLocaleString(undefined, { 
                        month: "short", 
                        day: "numeric", 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </span>

                    <button
                      onClick={(e) => handleDeleteRecord(item.id, e)}
                      title="Delete record"
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    {item.type === "automatic" && item.summary && item.summary.length > 0 ? (
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {item.summary[0]}
                      </p>
                    ) : item.type === "manual" && item.prompt ? (
                      <p className="text-xs text-slate-600 line-clamp-2 italic">
                        &ldquo;{item.prompt}&rdquo;
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500">Evaluation complete.</p>
                    )}

                    <div className="flex items-center gap-3 pt-1 text-[11px]">
                      {item.securityIssues && item.securityIssues.length > 0 && (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {item.securityIssues.length} Security {item.securityIssues.length === 1 ? 'Flaw' : 'Flaws'}
                        </span>
                      )}
                      {item.apiContractIssues && item.apiContractIssues.length > 0 && (
                        <span className="text-amber-600 font-semibold flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          {item.apiContractIssues.length} Breaking Schema Diff
                        </span>
                      )}
                      {item.checklist && item.checklist.length > 0 && (
                        <span className="text-indigo-600 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          {item.checklist.length} Gate Checks
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Risk Badge & Action */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className={cn(
                      "px-3 py-1.5 rounded-xl border flex items-center gap-2",
                      isHigh ? "bg-rose-50 border-rose-200 text-rose-700" :
                      isMed ? "bg-amber-50 border-amber-200 text-amber-700" :
                      "bg-emerald-50 border-emerald-200 text-emerald-700"
                    )}>
                      <Flame className="w-4 h-4" />
                      <div className="text-left leading-tight">
                        <span className="text-[10px] font-bold uppercase block">{item.riskLevel} Risk</span>
                        <span className="text-xs font-black">{item.riskScore}% Score</span>
                      </div>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors text-slate-400">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* INSPECTION MODAL */}
      {isModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-left">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-indigo-600" />
                    {selectedRecord.repository}
                  </h3>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] text-slate-600">
                    {selectedRecord.branch}
                  </span>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase",
                    selectedRecord.riskScore >= 70 ? "bg-rose-50 text-rose-700 border border-rose-200" :
                    selectedRecord.riskScore >= 40 ? "bg-amber-50 text-amber-700 border border-amber-200" :
                    "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  )}>
                    {selectedRecord.riskLevel} ({selectedRecord.riskScore}%)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Scan generated on {new Date(selectedRecord.createdAt).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Findings Content */}
            {selectedRecord.type === "automatic" ? (
              <div className="space-y-4">
                {/* Executive Summary */}
                {selectedRecord.summary && (
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Executive Analysis Summary
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {selectedRecord.summary.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Security Issues */}
                {selectedRecord.securityIssues && selectedRecord.securityIssues.length > 0 && (
                  <div className="p-4 bg-rose-50/70 border border-rose-200/80 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      Security Vulnerabilities Flagged
                    </h4>
                    <ul className="space-y-1.5 text-xs text-rose-950">
                      {selectedRecord.securityIssues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-600 font-bold">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* API Contract Issues */}
                {selectedRecord.apiContractIssues && selectedRecord.apiContractIssues.length > 0 && (
                  <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-amber-600" />
                      Breaking API Contract Changes
                    </h4>
                    <ul className="space-y-1.5 text-xs text-amber-950">
                      {selectedRecord.apiContractIssues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold">•</span>
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pre-Deployment Checklist */}
                {selectedRecord.checklist && (
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Pre-Merge Release Gate Checklist
                    </h4>
                    <ul className="space-y-1.5 text-xs text-emerald-950">
                      {selectedRecord.checklist.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Prompt Evaluated:</span>
                  <p className="text-xs font-semibold text-slate-800 italic">&ldquo;{selectedRecord.prompt}&rdquo;</p>
                </div>

                <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl space-y-2">
                  <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">AI Interactive Review:</span>
                  <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">{selectedRecord.aiResponse}</p>
                </div>

                {selectedRecord.keyTakeaways && (
                  <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Key Takeaways:</span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {selectedRecord.keyTakeaways.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <Link href={`/dashboard/analysis?repo=${encodeURIComponent(selectedRecord.repository)}&branch=${encodeURIComponent(selectedRecord.branch)}`}>
                <Button variant="outline" className="h-9 px-4 text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Rerun In Analysis Studio</span>
                </Button>
              </Link>

              <Button
                variant="brand"
                onClick={() => setIsModalOpen(false)}
                className="h-9 px-5 text-xs font-bold bg-gradient-to-r from-[#845EC2] via-[#C34A36] to-[#FF8066] dark:from-indigo-600 dark:to-indigo-700 hover:opacity-95 text-white rounded-xl"
              >
                Close
              </Button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

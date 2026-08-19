"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { 
  FileSpreadsheet, 
  Download, 
  FileText, 
  ShieldAlert, 
  ShieldCheck, 
  Flame, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  FolderGit2, 
  GitBranch, 
  Calendar, 
  Share2, 
  Printer, 
  RefreshCw, 
  Sparkles, 
  Filter,
  Check,
  TrendingDown,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getScopedItem } from "@/lib/storageScope"

interface ReportItem {
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
  createdAt: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [activeTimeRange, setActiveTimeRange] = useState<"7d" | "30d" | "all">("7d")
  const [exportNotice, setExportNotice] = useState<string | null>(null)

  const loadReports = () => {
    try {
      const raw = getScopedItem("impact_iq_analysis_history") || localStorage.getItem("impact_iq_analysis_history")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReports(parsed)
          return
        }
      }
    } catch (e) {}

    // Fallback seed
    setReports([
      {
        id: "rep-1",
        type: "automatic",
        repository: "Payment-Gateway-Service",
        branch: "feature/stripe-v3-upgrade",
        riskScore: 78,
        riskLevel: "High",
        summary: [
          "PR introduces a new Stripe webhook handler in backend/api/webhooks.py with missing signature validation.",
          "Altered REST API response payload schema for /api/v1/charge, removing legacy transaction_id field."
        ],
        securityIssues: [
          "Missing HMAC SHA256 signature verification on Stripe webhook payload.",
          "Hardcoded test API secret key in test_stripe.py."
        ],
        apiContractIssues: [
          "Removed deprecated transaction_id string property from /api/v1/charge schema."
        ],
        checklist: [
          "Add Stripe HMAC signature validation check before parsing webhook payload.",
          "Keep legacy transaction_id alias field for backward compatibility."
        ],
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        id: "rep-2",
        type: "automatic",
        repository: "auth-identity-service",
        branch: "fix/jwt-expiry-refresh",
        riskScore: 42,
        riskLevel: "Medium",
        summary: [
          "Updated token rotation interval from 15m to 60m.",
          "PostgreSQL migration script creates new token revocation index."
        ],
        securityIssues: [],
        apiContractIssues: [],
        checklist: [
          "Verify DB index creation concurrency."
        ],
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
      },
      {
        id: "rep-3",
        type: "automatic",
        repository: "Frontend-NextJS-App",
        branch: "chore/tailwind-v4-migration",
        riskScore: 18,
        riskLevel: "Low",
        summary: [
          "Updated stylesheet and theme tokens with zero breaking contract issues."
        ],
        securityIssues: [],
        apiContractIssues: [],
        checklist: [
          "Verify visual regression test suite."
        ],
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
      }
    ])
  }

  useEffect(() => {
    loadReports()
    window.addEventListener("impact_iq_analysis_updated", loadReports)
    window.addEventListener("storage", loadReports)
    return () => {
      window.removeEventListener("impact_iq_analysis_updated", loadReports)
      window.removeEventListener("storage", loadReports)
    }
  }, [])

  // Aggregate stats
  const totalAudits = reports.length
  const highRiskCount = reports.filter(r => r.riskScore >= 70).length
  const mediumRiskCount = reports.filter(r => r.riskScore >= 40 && r.riskScore < 70).length
  const lowRiskCount = reports.filter(r => r.riskScore < 40).length
  const totalSecIssues = reports.reduce((acc, r) => acc + (r.securityIssues?.length || 0), 0)
  const totalContractIssues = reports.reduce((acc, r) => acc + (r.apiContractIssues?.length || 0), 0)

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["ID,Repository,Branch,Type,Risk Score,Risk Level,Security Flaws,API Contract Diffs,Date\n"]
    const rows = reports.map(r => 
      `"${r.id}","${r.repository}","${r.branch}","${r.type}",${r.riskScore},"${r.riskLevel}",${r.securityIssues?.length || 0},${r.apiContractIssues?.length || 0},"${new Date(r.createdAt).toISOString()}"`
    )
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `Impact_IQ_Risk_Report_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setExportNotice("CSV Compliance Audit Report downloaded successfully.")
    setTimeout(() => setExportNotice(null), 3500)
  }

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reports, null, 2))
    const link = document.createElement("a")
    link.setAttribute("href", dataStr)
    link.setAttribute("download", `Impact_IQ_Analysis_Report_${new Date().toISOString().slice(0, 10)}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setExportNotice("JSON Data Audit Log exported successfully.")
    setTimeout(() => setExportNotice(null), 3500)
  }

  // Print / PDF
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Executive Risk &amp; Compliance Reports</h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Audit Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Synthesized engineering blast radius evaluations, security findings, and release sign-off compliance.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="h-9 px-3.5 text-xs font-bold border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1.5 text-slate-700 shadow-2xs cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleExportJSON}
            className="h-9 px-3.5 text-xs font-bold border-slate-200 hover:bg-slate-50 rounded-xl flex items-center gap-1.5 text-slate-700 shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600" />
            <span>Export JSON</span>
          </Button>

          <Button
            variant="brand"
            onClick={handlePrint}
            className="h-9 px-4 text-xs font-bold bg-gradient-to-r from-[#845EC2] via-[#C34A36] to-[#FF8066] dark:from-indigo-600 dark:to-indigo-700 hover:opacity-95 text-white rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </Button>
        </div>
      </div>

      {/* Export Success Notification */}
      {exportNotice && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2.5 text-emerald-900 text-xs font-semibold animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Executive Overview KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Scanned PRs</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900">{totalAudits}</div>
          <p className="text-[10px] text-slate-400">Continuous deployment pipeline gates</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">High Risk Gates</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-600">{highRiskCount}</div>
          <p className="text-[10px] text-slate-400">Requiring Tier 2/3 peer approval</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Security Flaws</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{totalSecIssues}</div>
          <p className="text-[10px] text-slate-400">Discovered across all evaluated diffs</p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">API Contract Diffs</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-600">{totalContractIssues}</div>
          <p className="text-[10px] text-slate-400">Potential client/mobile breaking changes</p>
        </div>
      </div>

      {/* Risk Distribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Exposure Bar Card */}
        <div className="lg:col-span-1 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-5 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Risk Severity Distribution</h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Proportion</span>
          </div>

          <div className="space-y-4">
            {/* High */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-rose-700 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> High Risk (70-100%)
                </span>
                <span className="font-bold text-slate-800">{highRiskCount} ({totalAudits > 0 ? Math.round((highRiskCount/totalAudits)*100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full" 
                  style={{ width: `${totalAudits > 0 ? (highRiskCount/totalAudits)*100 : 0}%` }}
                />
              </div>
            </div>

            {/* Medium */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-amber-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Medium Risk (40-69%)
                </span>
                <span className="font-bold text-slate-800">{mediumRiskCount} ({totalAudits > 0 ? Math.round((mediumRiskCount/totalAudits)*100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full" 
                  style={{ width: `${totalAudits > 0 ? (mediumRiskCount/totalAudits)*100 : 0}%` }}
                />
              </div>
            </div>

            {/* Low */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Low Risk (&lt;40%)
                </span>
                <span className="font-bold text-slate-800">{lowRiskCount} ({totalAudits > 0 ? Math.round((lowRiskCount/totalAudits)*100) : 0}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${totalAudits > 0 ? (lowRiskCount/totalAudits)*100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-[11px] text-slate-500 leading-relaxed">
            💡 High-risk deployments automatically trigger active Slack and Microsoft Teams alerts with sign-off gates.
          </div>
        </div>

        {/* Repository Risk Matrix Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xs space-y-4 text-left">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Repository Blast Radius Matrix</h3>
              <p className="text-[11px] text-slate-500">Breakdown of latest evaluated branches across connected services.</p>
            </div>

            <Link href="/dashboard/history">
              <Button variant="outline" className="h-8 px-3 text-xs font-bold text-indigo-600 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 rounded-lg">
                <span>View Full History</span>
              </Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2.5">Repository</th>
                  <th className="pb-2.5">Target Branch</th>
                  <th className="pb-2.5">Risk Score</th>
                  <th className="pb-2.5">Security &amp; API Flaws</th>
                  <th className="pb-2.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reports.slice(0, 5).map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-bold text-slate-900 flex items-center gap-2">
                      <FolderGit2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                      <span>{r.repository}</span>
                    </td>
                    <td className="py-3 font-mono text-[11px] text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100">{r.branch}</span>
                    </td>
                    <td className="py-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-extrabold",
                        r.riskScore >= 70 ? "bg-rose-50 text-rose-700 border border-rose-200" :
                        r.riskScore >= 40 ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      )}>
                        {r.riskScore}% ({r.riskLevel})
                      </span>
                    </td>
                    <td className="py-3 text-slate-500 text-[11px]">
                      {(r.securityIssues?.length || 0) + (r.apiContractIssues?.length || 0)} issues detected
                    </td>
                    <td className="py-3 text-right text-[11px] text-slate-400">
                      {new Date(r.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  )
}

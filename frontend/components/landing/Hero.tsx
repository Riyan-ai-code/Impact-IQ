"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  ArrowRight, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  Layers, 
  BarChart2, 
  Plus, 
  Search, 
  Bell, 
  GitFork, 
  PlusCircle, 
  FileText, 
  Layers2, 
  Users, 
  Code2, 
  CheckCircle2, 
  ShieldAlert, 
  Terminal, 
  Sparkles, 
  GitBranch, 
  FolderGit2, 
  History, 
  Settings, 
  UserCheck
} from "lucide-react"

export default function Hero() {
  const [activeTab, setActiveTab] = useState<string>("dashboard")

  const handleLaunch = () => {
    const savedUserStr = localStorage.getItem("impact_iq_user")
    const ghUser = localStorage.getItem("github_connected_user")
    const ghToken = localStorage.getItem("github_token")

    let isGuest = false
    let isAuth = false

    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr)
        if (parsed && parsed.isGuest) {
          isGuest = true
        } else if (parsed && (parsed.name || parsed.displayName)) {
          isAuth = true
        }
      } catch (e) {}
    }

    if (!isGuest && (ghUser || (ghToken && !ghToken.startsWith("guest") && ghToken !== "true"))) {
      isAuth = true
    }

    if (isAuth) {
      window.location.href = "/dashboard"
    } else {
      window.dispatchEvent(new Event("open_sign_in_modal"))
    }
  }

  const handleGuestEntry = () => {
    localStorage.setItem("impact_iq_user", JSON.stringify({
      name: "Guest Developer",
      email: "guest@impactiq.dev",
      role: "Guest User",
      isGuest: true
    }))
    window.location.href = "/dashboard"
  }

  return (
    <section className="relative w-full bg-[#fafbff] dark:bg-[#0a0e27] pt-14 pb-16 px-4 md:px-12 flex flex-col items-center overflow-hidden transition-colors duration-150 text-content-primary">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[55%] h-[60%] rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[45%] h-[50%] rounded-full bg-purple-500/10 dark:bg-brand/10 blur-[130px] pointer-events-none" />

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Copy Column */}
        <div className="lg:col-span-5 flex flex-col items-start text-left space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-surface-2 text-xs text-brand font-semibold uppercase tracking-[0.5px]">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Engineering Intelligence
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-5.5xl font-extrabold tracking-tight text-content-primary leading-[1.12]">
            Predict. Prioritize. <br />
            Deploy with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#845EC2] via-[#C34A36] to-[#FF8066] dark:from-indigo-400 dark:via-indigo-300 dark:to-teal-300">Absolute Confidence.</span>
          </h1>

          <p className="text-base sm:text-lg text-content-secondary leading-relaxed max-w-xl">
            ImpactIQ scans your pull requests and AST syntax trees to predict blast radius, catch breaking API changes, and enforce automated deployment guardrails.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto pt-2">
            <button 
              onClick={handleLaunch}
              className="w-full sm:w-auto bg-gradient-to-r from-[#845EC2] via-[#C34A36] to-[#FF8066] dark:from-indigo-600 dark:to-indigo-700 hover:opacity-95 text-white text-sm font-semibold py-3.5 px-7 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer group"
            >
              Launch Platform
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button 
              onClick={handleGuestEntry}
              className="w-full sm:w-auto border border-border hover:bg-surface-2 bg-surface-1 text-content-secondary hover:text-content-primary text-sm font-medium py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-teal-500" />
              Explore as Guest
            </button>
          </div>

          {/* Key Value Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 w-full border-t border-border">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-1 border border-border">
              <div className="w-8 h-8 rounded-lg bg-[var(--tag-security-bg)] flex items-center justify-center text-[var(--tag-security-text)] shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-content-primary">Risk Scoring</h4>
                <p className="text-[11px] text-content-muted">AST diff analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-1 border border-border">
              <div className="w-8 h-8 rounded-lg bg-[var(--tag-iot-bg)] flex items-center justify-center text-[var(--tag-iot-text)] shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-content-primary">Blast Radius</h4>
                <p className="text-[11px] text-content-muted">Service topology</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-surface-1 border border-border">
              <div className="w-8 h-8 rounded-lg bg-[var(--tag-p2p-bg)] flex items-center justify-center text-[var(--tag-p2p-text)] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-content-primary">CI/CD Guard</h4>
                <p className="text-[11px] text-content-muted">Automated gates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Embedded Interactive Workspace */}
        <div className="lg:col-span-7 w-full relative z-10">
          <div className="w-full border border-border bg-surface-1 rounded-2xl overflow-hidden shadow-xl text-content-primary">
            {/* Top Workspace Header Bar */}
            <div className="w-full bg-[#f3f4ff] dark:bg-[#0f1219] border-b border-border px-4 py-3 flex items-center justify-between text-xs text-content-muted">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                </div>
                <span className="text-content-primary font-semibold text-xs tracking-tight flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand" />
                  ImpactIQ Interactive Platform
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-content-secondary">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Demo</span>
              </div>
            </div>

            {/* Main Application Layout with Internal Tabs on Left */}
            <div className="grid grid-cols-12 min-h-[460px] text-xs bg-surface-1">
              {/* Internal Sidebar Tabs */}
              <div className="col-span-4 bg-[#f3f4ff] dark:bg-[#0f1219] border-r border-border p-3 flex flex-col justify-between select-none">
                <div className="space-y-4">
                  {/* Analysis Section */}
                  <div className="space-y-1">
                    <div className="text-[9px] font-bold text-content-muted uppercase tracking-[0.5px] px-2">Analysis</div>
                    <button 
                      onClick={() => setActiveTab("dashboard")}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center gap-2 text-[11px] transition-all cursor-pointer ${activeTab === "dashboard" ? "bg-surface-2 dark:bg-[#1a1f3a] text-content-primary border-l-[3px] border-brand font-semibold" : "text-content-secondary hover:bg-surface-2 hover:text-content-primary"}`}
                    >
                      <BarChart2 className="w-3.5 h-3.5 text-brand" /> Dashboard
                    </button>
                    <button 
                      onClick={() => setActiveTab("analysis")}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center gap-2 text-[11px] transition-all cursor-pointer ${activeTab === "analysis" ? "bg-surface-2 dark:bg-[#1a1f3a] text-content-primary border-l-[3px] border-brand font-semibold" : "text-content-secondary hover:bg-surface-2 hover:text-content-primary"}`}
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-brand" /> New Analysis
                    </button>
                    <button 
                      onClick={() => setActiveTab("history")}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center gap-2 text-[11px] transition-all cursor-pointer ${activeTab === "history" ? "bg-surface-2 dark:bg-[#1a1f3a] text-content-primary border-l-[3px] border-brand font-semibold" : "text-content-secondary hover:bg-surface-2 hover:text-content-primary"}`}
                    >
                      <History className="w-3.5 h-3.5 text-brand" /> Analysis History
                    </button>
                    <button 
                      onClick={() => setActiveTab("reports")}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center gap-2 text-[11px] transition-all cursor-pointer ${activeTab === "reports" ? "bg-surface-2 dark:bg-[#1a1f3a] text-content-primary border-l-[3px] border-brand font-semibold" : "text-content-secondary hover:bg-surface-2 hover:text-content-primary"}`}
                    >
                      <FileText className="w-3.5 h-3.5 text-brand" /> Reports
                    </button>
                  </div>

                  {/* Manage Section */}
                  <div className="space-y-1">
                    <div className="text-[9px] font-bold text-content-muted uppercase tracking-[0.5px] px-2">Manage</div>
                    <button 
                      onClick={() => setActiveTab("repositories")}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center gap-2 text-[11px] transition-all cursor-pointer ${activeTab === "repositories" ? "bg-surface-2 dark:bg-[#1a1f3a] text-content-primary border-l-[3px] border-brand font-semibold" : "text-content-secondary hover:bg-surface-2 hover:text-content-primary"}`}
                    >
                      <GitFork className="w-3.5 h-3.5 text-teal-500" /> Repositories
                    </button>
                    <button 
                      onClick={() => setActiveTab("projects")}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center gap-2 text-[11px] transition-all cursor-pointer ${activeTab === "projects" ? "bg-surface-2 dark:bg-[#1a1f3a] text-content-primary border-l-[3px] border-brand font-semibold" : "text-content-secondary hover:bg-surface-2 hover:text-content-primary"}`}
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-teal-500" /> Projects
                    </button>
                    <button 
                      onClick={() => setActiveTab("integrations")}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center gap-2 text-[11px] transition-all cursor-pointer ${activeTab === "integrations" ? "bg-surface-2 dark:bg-[#1a1f3a] text-content-primary border-l-[3px] border-brand font-semibold" : "text-content-secondary hover:bg-surface-2 hover:text-content-primary"}`}
                    >
                      <Layers2 className="w-3.5 h-3.5 text-amber-500" /> Integrations
                    </button>
                  </div>

                  {/* Settings Section */}
                  <div className="space-y-1">
                    <div className="text-[9px] font-bold text-content-muted uppercase tracking-[0.5px] px-2">Settings</div>
                    <button 
                      onClick={() => setActiveTab("team")}
                      className={`w-full px-2.5 py-1.5 rounded-lg text-left flex items-center gap-2 text-[11px] transition-all cursor-pointer ${activeTab === "team" ? "bg-surface-2 dark:bg-[#1a1f3a] text-content-primary border-l-[3px] border-brand font-semibold" : "text-content-secondary hover:bg-surface-2 hover:text-content-primary"}`}
                    >
                      <Users className="w-3.5 h-3.5 text-rose-500" /> Team & Access
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-border text-[9px] text-content-muted px-1">
                  Click any tab to preview
                </div>
              </div>

              {/* Tab Display Area */}
              <div className="col-span-8 p-4 flex flex-col justify-between overflow-y-auto max-h-[480px] bg-surface-1">
                {/* 1. DASHBOARD OVERVIEW TAB */}
                {activeTab === "dashboard" && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-content-primary flex items-center gap-1.5">
                          Deployment Risk Radar
                          <span className="bg-[var(--tag-iot-bg)] text-[var(--tag-iot-text)] text-[9px] font-semibold px-2 py-0.5 rounded-full border border-border">Operational</span>
                        </h3>
                        <p className="text-[10px] text-content-muted">Real-time health score across 8 active services</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-surface-2 border border-border p-2.5 rounded-xl">
                        <span className="text-[9px] text-content-muted uppercase tracking-[0.5px] font-semibold">Overall Risk</span>
                        <div className="text-base font-extrabold text-content-primary mt-0.5">72 <span className="text-content-muted text-[10px]">/100</span></div>
                        <div className="w-full bg-surface-3 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full" style={{ width: '72%' }} />
                        </div>
                      </div>

                      <div className="bg-surface-2 border border-border p-2.5 rounded-xl">
                        <span className="text-[9px] text-content-muted uppercase tracking-[0.5px] font-semibold">Tracked Repos</span>
                        <div className="text-base font-extrabold text-content-primary mt-0.5">156</div>
                        <span className="text-[9px] text-[var(--tag-iot-text)] mt-1 block font-semibold">68% clean & healthy</span>
                      </div>
                    </div>

                    <div className="bg-surface-2 border border-border p-2.5 rounded-xl space-y-1.5 text-[10px]">
                      <span className="font-semibold text-content-primary text-[10px]">High-Risk Repositories</span>
                      <div className="flex justify-between items-center p-1.5 rounded-lg bg-surface-1 border border-border">
                        <span className="text-content-primary font-medium">payment-gateway</span>
                        <span className="text-[var(--tag-security-text)] bg-[var(--tag-security-bg)] font-bold px-1.5 py-0.5 rounded">Risk 92</span>
                      </div>
                      <div className="flex justify-between items-center p-1.5 rounded-lg bg-surface-1 border border-border">
                        <span className="text-content-primary font-medium">auth-service</span>
                        <span className="text-[var(--tag-security-text)] bg-[var(--tag-security-bg)] font-bold px-1.5 py-0.5 rounded">Risk 85</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. NEW ANALYSIS TAB */}
                {activeTab === "analysis" && (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-content-primary flex items-center gap-1.5">
                          <PlusCircle className="w-3.5 h-3.5 text-brand" />
                          Code Scanner & AST Diff
                        </h3>
                        <p className="text-[10px] text-content-muted">PR #142: <code>feature/token-refresh</code></p>
                      </div>
                      <span className="text-[10px] font-bold text-[var(--tag-security-text)] bg-[var(--tag-security-bg)] border border-border px-2 py-0.5 rounded">
                        High Risk: 88/100
                      </span>
                    </div>

                    <div className="bg-surface-2 border border-border rounded-lg p-2.5 font-mono text-[10px] leading-relaxed">
                      <div className="text-content-muted">// services/auth/tokenVerifier.ts</div>
                      <div className="text-rose-500 bg-[var(--tag-security-bg)] px-1.5 py-0.5 rounded">- function verifySession(token: string, secret: string)</div>
                      <div className="text-emerald-500 bg-[var(--tag-iot-bg)] px-1.5 py-0.5 rounded">+ function verifySession(token: string, opts: Opts)</div>
                    </div>

                    <div className="bg-surface-2 border border-border p-2 rounded-lg text-[10px] text-content-secondary">
                      <strong className="text-brand">AST Blast Radius:</strong> Parameter removal breaks 14 dependent calls across <code>api-gateway</code>.
                    </div>
                  </div>
                )}

                {/* 3. HISTORY TAB */}
                {activeTab === "history" && (
                  <div className="space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-content-primary flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5 text-brand" />
                        Analysis Scan History
                      </h3>
                    </div>

                    <div className="space-y-1.5 text-[10px]">
                      <div className="bg-surface-2 border border-border p-2 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="text-content-primary font-medium">Scan #882 • auth-service</div>
                          <div className="text-content-muted text-[9px]">2 hours ago by @sarah</div>
                        </div>
                        <span className="text-[var(--tag-security-text)] bg-[var(--tag-security-bg)] font-bold px-1.5 py-0.5 rounded">Risk 85</span>
                      </div>
                      <div className="bg-surface-2 border border-border p-2 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="text-content-primary font-medium">Scan #881 • billing-worker</div>
                          <div className="text-content-muted text-[9px]">4 hours ago by @alex</div>
                        </div>
                        <span className="text-[var(--tag-iot-text)] bg-[var(--tag-iot-bg)] font-bold px-1.5 py-0.5 rounded">Risk 18</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. REPORTS TAB */}
                {activeTab === "reports" && (
                  <div className="space-y-2.5 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-content-primary flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-brand" />
                        Audit & Security Reports
                      </h3>
                    </div>

                    <div className="bg-surface-2 border border-border p-2.5 rounded-lg space-y-1.5 text-[10px]">
                      <div className="text-content-primary font-semibold">Weekly Engineering Compliance Summary</div>
                      <div className="text-content-muted text-[9px]">Generated for SOC2 & ISO 27001 readiness</div>
                      <div className="grid grid-cols-2 gap-1.5 mt-1">
                        <div className="bg-surface-1 border border-border p-1.5 rounded text-center">
                          <span className="text-content-muted block text-[8px]">Scanned PRs</span>
                          <span className="text-content-primary font-bold text-xs">142</span>
                        </div>
                        <div className="bg-surface-1 border border-border p-1.5 rounded text-center">
                          <span className="text-content-muted block text-[8px]">Blocked Breaches</span>
                          <span className="text-[var(--tag-iot-text)] font-bold text-xs">38</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. REPOSITORIES TAB */}
                {activeTab === "repositories" && (
                  <div className="space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-content-primary flex items-center gap-1.5">
                        <GitFork className="w-3.5 h-3.5 text-teal-500" />
                        Connected Repositories
                      </h3>
                    </div>

                    <div className="space-y-1.5 text-[10px]">
                      <div className="bg-surface-2 border border-border p-2 rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-3.5 h-3.5 text-teal-500" />
                          <span className="text-content-primary font-medium">core-engine</span>
                        </div>
                        <span className="text-[var(--tag-iot-text)] font-bold">98% Healthy</span>
                      </div>
                      <div className="bg-surface-2 border border-border p-2 rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <GitBranch className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-content-primary font-medium">payment-service</span>
                        </div>
                        <span className="text-amber-500 font-bold">At Risk</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. PROJECTS TAB */}
                {activeTab === "projects" && (
                  <div className="space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-content-primary flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-teal-500" />
                        Microservice Projects
                      </h3>
                    </div>

                    <div className="space-y-1.5 text-[10px]">
                      <div className="bg-surface-2 border border-border p-2 rounded-lg">
                        <div className="text-content-primary font-medium">Core Checkout & Billing</div>
                        <div className="text-content-muted text-[9px]">4 repositories • 2 active teams</div>
                      </div>
                      <div className="bg-surface-2 border border-border p-2 rounded-lg">
                        <div className="text-content-primary font-medium">Authentication & Identity</div>
                        <div className="text-content-muted text-[9px]">2 repositories • 1 active team</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. INTEGRATIONS TAB */}
                {activeTab === "integrations" && (
                  <div className="space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-content-primary flex items-center gap-1.5">
                        <Layers2 className="w-3.5 h-3.5 text-amber-500" />
                        Automated CI/CD Webhooks
                      </h3>
                    </div>

                    <div className="space-y-1.5 text-[10px]">
                      <div className="bg-surface-2 border border-border p-2 rounded-lg flex justify-between items-center">
                        <span className="text-content-primary font-medium">GitHub Actions Quality Gate</span>
                        <span className="text-[var(--tag-iot-text)] font-bold">Passing</span>
                      </div>
                      <div className="bg-surface-2 border border-border p-2 rounded-lg flex justify-between items-center">
                        <span className="text-content-primary font-medium">Slack Alert Bot (#deploys)</span>
                        <span className="text-[var(--tag-iot-text)] font-bold">Active</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 8. TEAM TAB */}
                {activeTab === "team" && (
                  <div className="space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-content-primary flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-rose-500" />
                        Role-Based Access Control
                      </h3>
                    </div>

                    <div className="space-y-1.5 text-[10px]">
                      <div className="bg-surface-2 border border-border p-2 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="text-content-primary font-medium">Arjun Dev</div>
                          <div className="text-content-muted text-[9px]">arjun@impactiq.dev</div>
                        </div>
                        <span className="text-brand font-semibold bg-surface-3 px-1.5 py-0.5 rounded">Owner</span>
                      </div>
                      <div className="bg-surface-2 border border-border p-2 rounded-lg flex justify-between items-center">
                        <div>
                          <div className="text-content-primary font-medium">Engineering Roster</div>
                          <div className="text-content-muted text-[9px]">12 Active Collaborators</div>
                        </div>
                        <span className="text-content-muted bg-surface-3 px-1.5 py-0.5 rounded">Developers</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Status */}
                <div className="pt-2 border-t border-border flex items-center justify-between text-[9px] text-content-muted">
                  <span>ImpactIQ Workspace Simulator</span>
                  <span className="text-brand font-medium">Active Module: {activeTab}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

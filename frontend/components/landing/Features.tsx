"use client"

import { useState } from "react"
import Link from "next/link"
import { 
  GitFork, 
  PlusCircle, 
  FileText, 
  Layers2, 
  Users, 
  BarChart2, 
  ShieldAlert, 
  Terminal, 
  Sparkles, 
  Layers, 
  GitBranch, 
  FolderGit2, 
  CheckCircle2,
  ChevronRight,
  BrainCircuit,
  Lock,
  ArrowUpRight
} from "lucide-react"

export default function Features() {
  const [activeTab, setActiveTab] = useState<number>(0)

  const modules = [
    {
      id: "analysis-module",
      name: "Analysis & Code Scanner",
      tabName: "Analysis",
      icon: PlusCircle,
      badge: "Deep AST Parsing",
      title: "Predict Breaking API Contracts & Security Flaws",
      description: "Static code analyzers only read syntax. ImpactIQ's AST engine builds a dependency graph of your functions, endpoints, and schemas to predict downstream failures before code merge.",
      bullets: [
        "Abstract Syntax Tree (AST) deterministic parsing",
        "Breaking API contract detection for REST & GraphQL",
        "Automated security flaw & vulnerability discovery",
        "Blast radius score calculation from 0 to 100"
      ],
      previewType: "analysis"
    },
    {
      id: "dashboard-module",
      name: "Executive Dashboard",
      tabName: "Overview",
      icon: BarChart2,
      badge: "Health Telemetry",
      title: "Live Deployment Risk Radar Across All Repositories",
      description: "Get immediate bird's-eye visibility over your microservice architecture. Monitor which repositories are safe to ship and which contain blocked release candidates.",
      bullets: [
        "Global team risk scoring & trend telemetry",
        "Interactive topology dependency map",
        "Deployment gate status (Approved vs Blocked)",
        "Weekly risk reduction benchmarks"
      ],
      previewType: "dashboard"
    },
    {
      id: "repositories-module",
      name: "Repositories & Projects",
      tabName: "Repositories",
      icon: GitFork,
      badge: "Version Control",
      title: "GitHub Sync & Microservice Grouping",
      description: "Connect your GitHub repositories in seconds with OAuth. Group interrelated microservices into isolated projects for collaborative risk tracking.",
      bullets: [
        "One-click GitHub App & OAuth integration",
        "Automatic branch & PR synchronization",
        "Custom service grouping & project isolation",
        "Multi-repository blast radius cross-referencing"
      ],
      previewType: "repositories"
    },
    {
      id: "reports-module",
      name: "Reports & History",
      tabName: "Reports",
      icon: FileText,
      badge: "Audit & Compliance",
      title: "Executive Summaries & Deployment Checklists",
      description: "Generate boardroom-ready PDF and JSON audit reports. Export step-by-step engineering checklists to ensure zero-downtime database migrations.",
      bullets: [
        "Deterministic audit reports for compliance (SOC2/ISO)",
        "Pre-deployment checklists with mitigation steps",
        "Searchable historical analysis logbook",
        "Automated PR comment summaries"
      ],
      previewType: "reports"
    },
    {
      id: "integrations-module",
      name: "CI/CD & Integrations",
      tabName: "Integrations",
      icon: Layers2,
      badge: "DevOps Automation",
      title: "Automated Quality Gates & Pipeline Webhooks",
      description: "Embed ImpactIQ directly into GitHub Actions, GitLab CI, and Jenkins. Block risky PRs automatically and broadcast real-time alerts to Slack and Jira.",
      bullets: [
        "GitHub Actions automated PR status checks",
        "Configurable risk threshold gates (e.g. block on score > 75)",
        "Instant Slack and Discord alerts with actionable diffs",
        "Automated Jira and Linear ticket generation"
      ],
      previewType: "integrations"
    },
    {
      id: "team-module",
      name: "Team & Role-Based Access",
      tabName: "Team",
      icon: Users,
      badge: "Enterprise Security",
      title: "Granular RBAC & Collaborative Workspaces",
      description: "Manage multi-team access with granular roles (Owner, Lead, Developer, Viewer). Enforce security policies and invite team members with scoped permissions.",
      bullets: [
        "Role-Based Access Control (RBAC) per workspace",
        "Team-scoped analysis policies and custom rules",
        "Encrypted API key and environment management",
        "Activity audit logs for enterprise compliance"
      ],
      previewType: "team"
    }
  ]

  const currentMod = modules[activeTab]

  return (
    <section id="platform-modules" className="w-full bg-[#fafbff] dark:bg-[#0a0e27] py-20 px-4 md:px-12 flex flex-col items-center border-t border-border relative transition-colors duration-150 text-content-primary">
      {/* Background Accent Glow */}
      <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[70%] h-[350px] bg-indigo-500/10 dark:bg-indigo-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="w-full max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-surface-2 text-xs text-brand font-semibold uppercase tracking-[0.5px] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Platform Architecture & Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-content-primary">
            How ImpactIQ Works <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#845EC2] via-[#C34A36] to-[#FF8066] dark:from-indigo-400 dark:via-indigo-300 dark:to-teal-300">Under the Hood</span>
          </h2>
          <p className="mt-4 text-content-secondary max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Explore the core engine, deterministic AST parsers, and automated guardrails that power each internal module.
          </p>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-10">
          <div className="bg-surface-2 border border-border p-1.5 rounded-2xl flex items-center gap-1.5 shadow-sm">
            {modules.map((mod, idx) => {
              const Icon = mod.icon
              const isActive = activeTab === idx
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? "bg-brand text-white shadow-xs" 
                      : "text-content-secondary hover:text-content-primary hover:bg-surface-3"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-content-muted"}`} />
                  <span>{mod.tabName}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Active Tab Showcase Card */}
        <div className="w-full bg-surface-1 border border-border rounded-2xl p-6 sm:p-10 shadow-xl mb-16 text-content-primary">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--tag-p2p-bg)] text-[var(--tag-p2p-text)] border border-border">
                  {currentMod.badge}
                </span>
                <span className="text-xs text-content-muted font-mono">
                  Module: {currentMod.tabName}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-content-primary tracking-tight leading-snug">
                {currentMod.title}
              </h3>

              <p className="text-content-secondary text-sm sm:text-base leading-relaxed">
                {currentMod.description}
              </p>

              <div className="space-y-3 pt-2">
                {currentMod.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-3 text-sm text-content-secondary">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link 
                  href="/docs" 
                  className="text-xs text-brand hover:text-brand-hover flex items-center gap-1.5 font-semibold transition-colors"
                >
                  Learn technical implementation in docs
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Architecture Breakdown */}
            <div className="lg:col-span-6 w-full">
              <div className="w-full bg-surface-2 border border-border rounded-xl p-5 shadow-md space-y-4">
                {/* Simulation Header */}
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
                    <span className="text-xs font-semibold text-content-primary font-mono">{currentMod.name}</span>
                  </div>
                  <span className="text-[10px] text-content-muted font-mono">Internal Logic</span>
                </div>

                {/* Analysis Preview */}
                {currentMod.previewType === "analysis" && (
                  <div className="space-y-3 font-sans">
                    <div className="bg-surface-1 p-3 rounded-lg border border-border space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-brand font-mono">POST /api/v2/checkout/process</span>
                        <span className="text-[var(--tag-security-text)] bg-[var(--tag-security-bg)] px-2 py-0.5 rounded text-[10px] font-bold border border-border">
                          Breaking Change (88/100)
                        </span>
                      </div>
                      <div className="text-[11px] text-content-muted">
                        AST diff detected removed field: <code className="text-rose-500">currency_code: string</code>
                      </div>
                    </div>

                    <div className="bg-surface-1 p-3 rounded-lg border border-border space-y-2">
                      <div className="text-xs font-semibold text-content-primary flex items-center gap-1.5">
                        <BrainCircuit className="w-3.5 h-3.5 text-brand" />
                        Blast Radius Topology
                      </div>
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        <span className="bg-[var(--tag-security-bg)] text-[var(--tag-security-text)] px-2 py-1 rounded border border-border">
                          ⚠️ payment-service (Direct Failure)
                        </span>
                        <span className="bg-[var(--tag-dependencies-bg)] text-[var(--tag-dependencies-text)] px-2 py-1 rounded border border-border">
                          ⚡ billing-cron (Downstream Warning)
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Dashboard Overview Preview */}
                {currentMod.previewType === "dashboard" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-surface-1 p-3 rounded-lg border border-border text-center">
                        <span className="text-[10px] text-content-muted uppercase tracking-[0.5px]">Avg Risk Score</span>
                        <div className="text-xl font-black text-[var(--tag-iot-text)]">24 / 100</div>
                        <span className="text-[9px] text-[var(--tag-iot-text)]">Deployment Gate: PASS</span>
                      </div>
                      <div className="bg-surface-1 p-3 rounded-lg border border-border text-center">
                        <span className="text-[10px] text-content-muted uppercase tracking-[0.5px]">Scanned PRs</span>
                        <div className="text-xl font-black text-content-primary">142</div>
                        <span className="text-[9px] text-content-muted">Last 7 days</span>
                      </div>
                    </div>
                    <div className="bg-surface-1 p-2.5 rounded-lg border border-border flex justify-between items-center text-xs">
                      <span className="text-content-primary font-medium">Release Candidate v2.4.1</span>
                      <span className="bg-[var(--tag-iot-bg)] text-[var(--tag-iot-text)] text-[10px] font-bold px-2 py-0.5 rounded">Ready to Ship</span>
                    </div>
                  </div>
                )}

                {/* Repositories Preview */}
                {currentMod.previewType === "repositories" && (
                  <div className="space-y-2 text-xs">
                    <div className="bg-surface-1 p-2.5 rounded-lg border border-border flex justify-between items-center">
                      <span className="text-content-primary font-mono">github.com/acme/auth-api</span>
                      <span className="text-[10px] text-teal-500 font-semibold">Synced (main)</span>
                    </div>
                    <div className="bg-surface-1 p-2.5 rounded-lg border border-border flex justify-between items-center">
                      <span className="text-content-primary font-mono">github.com/acme/billing-worker</span>
                      <span className="text-[10px] text-teal-500 font-semibold">Synced (staging)</span>
                    </div>
                  </div>
                )}

                {/* Reports Preview */}
                {currentMod.previewType === "reports" && (
                  <div className="space-y-2 text-xs">
                    <div className="bg-surface-1 p-3 rounded-lg border border-border space-y-1">
                      <div className="flex justify-between font-semibold text-content-primary">
                        <span>PR #142 Migration Checklist</span>
                        <span className="text-brand">PDF Export</span>
                      </div>
                      <div className="text-[10px] text-content-muted">1. Verify HMAC secret in env variables</div>
                      <div className="text-[10px] text-content-muted">2. Apply non-breaking column migration before deploy</div>
                    </div>
                  </div>
                )}

                {/* Integrations Preview */}
                {currentMod.previewType === "integrations" && (
                  <div className="space-y-2 text-xs">
                    <div className="bg-surface-1 p-2.5 rounded-lg border border-border flex justify-between items-center">
                      <span className="text-content-primary font-medium">GitHub Action: .github/workflows/impactiq.yml</span>
                      <span className="text-[10px] bg-[var(--tag-iot-bg)] text-[var(--tag-iot-text)] px-1.5 py-0.5 rounded font-bold">Enabled</span>
                    </div>
                    <div className="bg-surface-1 p-2.5 rounded-lg border border-border flex justify-between items-center">
                      <span className="text-content-primary font-medium">Slack Channel: #platform-deploys</span>
                      <span className="text-[10px] bg-[var(--tag-iot-bg)] text-[var(--tag-iot-text)] px-1.5 py-0.5 rounded font-bold">Connected</span>
                    </div>
                  </div>
                )}

                {/* Team Preview */}
                {currentMod.previewType === "team" && (
                  <div className="space-y-2 text-xs">
                    <div className="bg-surface-1 p-2.5 rounded-lg border border-border flex justify-between items-center">
                      <span className="text-content-primary font-medium">Platform Engineering Team</span>
                      <span className="text-[10px] text-rose-500 font-bold">Owner Access</span>
                    </div>
                    <div className="bg-surface-1 p-2.5 rounded-lg border border-border flex justify-between items-center">
                      <span className="text-content-primary font-medium">QA & Security Auditors</span>
                      <span className="text-[10px] text-content-muted font-medium">Viewer Access</span>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

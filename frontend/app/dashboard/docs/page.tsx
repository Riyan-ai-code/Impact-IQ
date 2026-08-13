"use client"

import { useState } from "react"
import { 
  BookOpen, 
  Rocket, 
  ShieldCheck, 
  Cpu, 
  BrainCircuit, 
  Webhook, 
  Terminal, 
  Code2, 
  Zap, 
  Search, 
  Check, 
  ChevronRight, 
  AlertTriangle,
  Github,
  Layers,
  FileCode,
  Lock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("quickstart")
  const [searchQuery, setSearchQuery] = useState("")

  const sections = [
    { id: "quickstart", title: "1. Quickstart Guide", icon: Rocket },
    { id: "risk-engine", title: "2. Risk Scoring Engine", icon: ShieldCheck },
    { id: "api-contracts", title: "3. Breaking API Contracts", icon: Cpu },
    { id: "ai-modes", title: "4. AI Analysis Modes", icon: BrainCircuit },
    { id: "integrations", title: "5. Webhooks & Alerts", icon: Webhook },
    { id: "api-reference", title: "6. REST API Reference", icon: Terminal }
  ]

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Documentation &amp; User Guide</h1>
          <p className="text-xs text-slate-500 mt-1">Everything you need to know about ImpactIQ architecture, risk engines, AI analysis, and API integrations.</p>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm font-medium"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-1 bg-white border border-slate-100 rounded-xl p-4 shadow-sm space-y-2 h-fit">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 mb-2">DOCUMENTATION SECTIONS</span>
          <nav className="space-y-1">
            {sections.map(section => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full px-3 py-2.5 rounded-lg text-xs font-bold flex items-center justify-between transition-all cursor-pointer",
                    isActive 
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100/80 shadow-xs" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("w-4 h-4", isActive ? "text-indigo-600" : "text-slate-400")} />
                    <span>{section.title}</span>
                  </div>
                  <ChevronRight className={cn("w-3.5 h-3.5", isActive ? "text-indigo-600" : "text-slate-300")} />
                </button>
              )
            })}
          </nav>
        </div>

        {/* Right Main Content Panel */}
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-2xl p-6 md:p-8 shadow-sm space-y-8">
          
          {/* SECTION 1: QUICKSTART GUIDE */}
          {activeSection === "quickstart" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">1. Quickstart Guide</h2>
                  <p className="text-xs text-slate-500">Get up and running with ImpactIQ in under 3 minutes.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                    Connect your GitHub Account
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">
                    Click <strong>Connect GitHub</strong> on the dashboard. ImpactIQ requests read-only OAuth permissions to inspect repository code diffs and pull requests.
                  </p>
                </div>

                <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                    Create an Engineering Team &amp; Import Repositories
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">
                    Navigate to <strong>Team</strong> to create your engineering team, then go to <strong>Repositories</strong> and click <strong>Create Project</strong> to link your repositories to your team.
                  </p>
                </div>

                <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 space-y-2">
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">3</span>
                    Run Automatic or Manual AI Risk Analysis
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">
                    Go to <strong>New Analysis</strong>, select your target project and branch, and choose between <strong>Automatic AI Scan</strong> or <strong>Manual Prompted Analysis</strong> to generate immediate risk reports.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: RISK SCORING ENGINE */}
          {activeSection === "risk-engine" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">2. Risk Scoring Engine</h2>
                  <p className="text-xs text-slate-500">How ImpactIQ evaluates deployment safety and calculates risk scores (0-100%).</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  ImpactIQ evaluates pull requests across four weighted dimensions to calculate a final <strong>Deployment Risk Score</strong>:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-slate-200/80 rounded-xl bg-white space-y-1">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">0 - 30% Risk</span>
                    <h4 className="text-xs font-bold text-slate-900">Low Risk Deployment</h4>
                    <p className="text-[11px] text-slate-500">Documentation updates, UI CSS tweaks, internal non-breaking refactors.</p>
                  </div>

                  <div className="p-4 border border-slate-200/80 rounded-xl bg-white space-y-1">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">31 - 60% Risk</span>
                    <h4 className="text-xs font-bold text-slate-900">Medium Risk Deployment</h4>
                    <p className="text-[11px] text-slate-500">Function logic alterations, dependency version bumps, internal API updates.</p>
                  </div>

                  <div className="p-4 border border-slate-200/80 rounded-xl bg-white space-y-1 md:col-span-2">
                    <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">61 - 100% Risk</span>
                    <h4 className="text-xs font-bold text-slate-900">High / Critical Risk Deployment</h4>
                    <p className="text-[11px] text-slate-500">Database schema changes, breaking REST API contract removals, hardcoded secret exposure, or Docker container root execution.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: BREAKING API CONTRACTS */}
          {activeSection === "api-contracts" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">3. Breaking API Contract Detection</h2>
                  <p className="text-xs text-slate-500">Catching silent API schema breaking changes before PRs merge.</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  One of the most common causes of mobile app and frontend crashes is removing or renaming response fields in backend REST APIs. ImpactIQ parses API response schemas and flags backward-incompatible diffs:
                </p>

                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-2">
                  <span className="text-rose-400 font-bold">// ❌ Breaking Change Detected</span>
                  <div className="text-slate-400">
                    <span className="text-rose-400">- &quot;transaction_id&quot;: string</span><br />
                    <span className="text-emerald-400">+ &quot;txn_id&quot;: string</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <strong>ImpactIQ Alert:</strong> Renaming `transaction_id` to `txn_id` breaks mobile client v2.1 compatibility. Re-add `transaction_id` as a deprecated alias.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: AI ANALYSIS MODES */}
          {activeSection === "ai-modes" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">4. AI Analysis Modes</h2>
                  <p className="text-xs text-slate-500">Automatic AI Risk Scans vs Manual Prompted Queries.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 border border-slate-200/80 rounded-xl bg-slate-50/50 space-y-2">
                  <h3 className="text-xs font-bold text-indigo-700 flex items-center gap-2">
                    <Zap className="w-4 h-4" /> Automatic AI Scan
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Automated engine parses Git diffs, calculates Risk Score (0-100%), scans security flaws, and generates action checklists in 1 click.
                  </p>
                </div>

                <div className="p-5 border border-slate-200/80 rounded-xl bg-slate-50/50 space-y-2">
                  <h3 className="text-xs font-bold text-purple-700 flex items-center gap-2">
                    <Code2 className="w-4 h-4" /> Manual Prompted Analysis
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Ask custom questions and prompts about the PR (e.g. <em>&quot;Does this PR break mobile app backwards compatibility?&quot;</em>). The AI answers directly.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: WEBHOOKS & ALERTS */}
          {activeSection === "integrations" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                  <Webhook className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">5. Webhooks &amp; Alerts</h2>
                  <p className="text-xs text-slate-500">Connecting Slack, Jira, GitHub Bot, Discord, and Linear.</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                ImpactIQ integrates directly with your team workflows. Navigate to <strong>Integrations</strong> to configure:
              </p>

              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <strong>Slack:</strong> Send immediate alerts to `#dev-deployments` when a PR exceeds risk thresholds.</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <strong>Jira:</strong> Automatically open bug tickets when Critical security flaws are found.</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> <strong>GitHub PR Bot:</strong> Post AI Executive Summaries directly on GitHub PR discussion threads.</li>
              </ul>
            </div>
          )}

          {/* SECTION 6: REST API REFERENCE */}
          {activeSection === "api-reference" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">6. REST API Reference</h2>
                  <p className="text-xs text-slate-500">Programmatically trigger analyses and retrieve risk reports via HTTP API.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs space-y-2">
                  <span className="text-indigo-400 font-bold">POST /api/analysis/</span>
                  <p className="text-slate-400">// Trigger automated AI risk analysis</p>
                  <pre className="text-emerald-400 text-[11px] overflow-x-auto">
{`{
  "repository": "Riyan-ai-code/payment-service",
  "branch": "PR #42",
  "mode": "auto",
  "ai_model": "gemini-1.5-pro"
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}

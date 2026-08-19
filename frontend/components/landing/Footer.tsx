"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ShieldCheck, 
  Github, 
  Linkedin, 
  Twitter, 
  ArrowRight, 
  PlusCircle, 
  GitFork, 
  Users, 
  Terminal, 
  Copy, 
  Check, 
  Lock, 
  Zap, 
  Sparkles,
  ExternalLink,
  Play,
  RotateCcw,
  Info,
  CheckCircle2,
  AlertTriangle
} from "lucide-react"

export default function Footer() {
  const [copied, setCopied] = useState(false)
  const [activeCliTab, setActiveCliTab] = useState<"scan" | "diff" | "blast-radius" | "report">("scan")
  const [isRunningScan, setIsRunningScan] = useState(false)
  const [scanStep, setScanStep] = useState(4)
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)

  const cliCommands = {
    scan: "npx impact-iq@latest scan --repo main",
    diff: "npx impact-iq@latest diff --branch feature/auth",
    "blast-radius": "npx impact-iq@latest blast-radius --service payment-api",
    report: "npx impact-iq@latest report --format json --output audit.json"
  }

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(cliCommands[activeCliTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRunTerminal = (tab: "scan" | "diff" | "blast-radius" | "report") => {
    setActiveCliTab(tab)
    setIsRunningScan(true)
    setScanStep(1)

    setTimeout(() => setScanStep(2), 600)
    setTimeout(() => setScanStep(3), 1200)
    setTimeout(() => {
      setScanStep(4)
      setIsRunningScan(false)
    }, 1800)
  }

  const badgeDetails: Record<string, { title: string; desc: string }> = {
    retention: {
      title: "Zero Code Retention",
      desc: "All AST diff parsing occurs ephemerally in-memory. Your raw source code is never saved on disk, cached, or used to train third-party AI models."
    },
    soc2: {
      title: "SOC2 Type II Compliance",
      desc: "Cryptographically verified audit trail for every deployment check, role assignment, and AST scan result."
    },
    speed: {
      title: "Under 5s AST Analysis",
      desc: "Ultra-fast deterministic parser evaluates abstract syntax trees and dependency graphs in milliseconds."
    }
  }

  return (
    <footer className="w-full bg-[#02040a] border-t border-white/5 flex flex-col items-center">
      {/* Call to Action Banner Section */}
      <div className="w-full max-w-7xl px-4 md:px-12 pt-16 pb-12">
        <div className="w-full bg-gradient-to-r from-indigo-950/70 via-[#0c1020] to-[#080d1a] border border-indigo-500/20 rounded-3xl p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl ring-1 ring-white/5">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />

          {/* Left Value Proposition & Trust Badges */}
          <div className="space-y-5 z-10 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Automated Release Intelligence
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Ready to eliminate breaking changes forever?
            </h3>

            <p className="text-sm text-gray-300 leading-relaxed">
              Connect your repositories to automate AST code diff risk scoring, predict blast radius, and enforce CI/CD quality gates on every pull request.
            </p>

            {/* Interactive Enterprise Security Badges (Click to inspect) */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-gray-400">
                <button
                  onClick={() => setSelectedBadge(selectedBadge === "retention" ? null : "retention")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    selectedBadge === "retention" 
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" 
                      : "bg-white/[0.03] border-white/10 hover:border-white/20 text-gray-300"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Zero Code Retention</span>
                </button>

                <button
                  onClick={() => setSelectedBadge(selectedBadge === "soc2" ? null : "soc2")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    selectedBadge === "soc2" 
                      ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300" 
                      : "bg-white/[0.03] border-white/10 hover:border-white/20 text-gray-300"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>SOC2 Type II Ready</span>
                </button>

                <button
                  onClick={() => setSelectedBadge(selectedBadge === "speed" ? null : "speed")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                    selectedBadge === "speed" 
                      ? "bg-teal-500/10 border-teal-500/30 text-teal-300" 
                      : "bg-white/[0.03] border-white/10 hover:border-white/20 text-gray-300"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-teal-400" />
                  <span>Under 5s AST Analysis</span>
                </button>
              </div>

              {/* Badge Expanded Details Card */}
              {selectedBadge && badgeDetails[selectedBadge] && (
                <div className="bg-[#05070e] border border-white/10 p-3 rounded-xl text-left text-xs text-gray-300 animate-fadeIn">
                  <div className="font-bold text-white text-[11px] flex items-center gap-1.5 mb-1">
                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                    {badgeDetails[selectedBadge].title}
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    {badgeDetails[selectedBadge].desc}
                  </p>
                </div>
              )}
            </div>

            {/* Action CTA Buttons (No Connect GitHub here) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button 
                onClick={() => handleRunTerminal(activeCliTab)}
                className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs sm:text-sm font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer group"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                Run Interactive Terminal Scan
              </button>

              <Link 
                href="/docs"
                className="w-full sm:w-auto border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs sm:text-sm font-medium py-3 px-5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                Read CLI & API Docs
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Right Live Interactive CLI & AST Terminal Widget */}
          <div className="w-full lg:w-[450px] shrink-0 z-10">
            <div className="bg-[#05070e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/5">
              {/* Terminal Title Bar */}
              <div className="bg-[#070a12] border-b border-white/5 px-4 py-2.5 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-[11px] text-gray-300 font-mono flex items-center gap-1.5 font-semibold">
                    <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                    impact-iq-cli
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleRunTerminal(activeCliTab)}
                    disabled={isRunningScan}
                    className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title="Re-run terminal scan"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${isRunningScan ? "animate-spin text-indigo-400" : ""}`} />
                  </button>

                  <button
                    onClick={handleCopyCmd}
                    className="flex items-center gap-1 text-[10px] text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md transition-all cursor-pointer"
                    title="Copy command"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>

              {/* Interactive Command Tabs */}
              <div className="bg-[#080b14] border-b border-white/5 px-3 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar text-[10px] font-mono">
                <button
                  onClick={() => handleRunTerminal("scan")}
                  className={`px-2 py-1 rounded transition-all cursor-pointer ${
                    activeCliTab === "scan" ? "bg-indigo-600 text-white font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  scan
                </button>
                <button
                  onClick={() => handleRunTerminal("diff")}
                  className={`px-2 py-1 rounded transition-all cursor-pointer ${
                    activeCliTab === "diff" ? "bg-indigo-600 text-white font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  diff
                </button>
                <button
                  onClick={() => handleRunTerminal("blast-radius")}
                  className={`px-2 py-1 rounded transition-all cursor-pointer ${
                    activeCliTab === "blast-radius" ? "bg-indigo-600 text-white font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  blast-radius
                </button>
                <button
                  onClick={() => handleRunTerminal("report")}
                  className={`px-2 py-1 rounded transition-all cursor-pointer ${
                    activeCliTab === "report" ? "bg-indigo-600 text-white font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  report
                </button>
              </div>

              {/* Terminal Code & Real-Time Output Body */}
              <div className="p-4 font-mono text-[11px] leading-relaxed space-y-2 select-text min-h-[160px]">
                <div className="text-indigo-400 flex items-center gap-1.5 font-bold">
                  <span className="text-gray-500">$</span> {cliCommands[activeCliTab]}
                </div>

                {/* Simulated Real-Time Output Lines */}
                <div className="text-gray-300 text-[10.5px] space-y-1.5 pt-1">
                  {scanStep >= 1 && (
                    <div className="flex items-center gap-1.5 text-emerald-400 animate-fadeIn">
                      <span>✔</span> AST syntax tree parsed (12 files checked)
                    </div>
                  )}

                  {scanStep >= 2 && activeCliTab === "scan" && (
                    <div className="flex items-center gap-1.5 text-emerald-400 animate-fadeIn">
                      <span>✔</span> Zero breaking API contracts detected
                    </div>
                  )}

                  {scanStep >= 2 && activeCliTab === "diff" && (
                    <div className="flex items-center gap-1.5 text-amber-300 animate-fadeIn">
                      <span>⚠️</span> 1 schema signature change in <code>tokenVerifier.ts</code>
                    </div>
                  )}

                  {scanStep >= 2 && activeCliTab === "blast-radius" && (
                    <div className="flex items-center gap-1.5 text-teal-300 animate-fadeIn">
                      <span>ℹ</span> Evaluating dependency map across 4 microservices...
                    </div>
                  )}

                  {scanStep >= 2 && activeCliTab === "report" && (
                    <div className="flex items-center gap-1.5 text-purple-300 animate-fadeIn">
                      <span>✔</span> Compiled SOC2 & ISO 27001 readiness audit record
                    </div>
                  )}

                  {scanStep >= 3 && (
                    <div className="flex items-center gap-1.5 text-teal-300 animate-fadeIn">
                      <span>ℹ</span> Blast radius: 3 downstream services evaluated safe
                    </div>
                  )}

                  {scanStep >= 4 && (
                    <div className="flex items-center gap-1.5 text-indigo-300 font-semibold pt-1 border-t border-white/5 animate-fadeIn">
                      <span>🚀</span> Risk Score: 14/100 • Deployment Gate: <strong className="text-emerald-400">PASS</strong>
                    </div>
                  )}

                  {isRunningScan && (
                    <div className="flex items-center gap-1.5 text-gray-500 text-[10px] animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                      Analyzing AST nodes in real-time...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categorized Platform Module Links */}
      <div className="w-full max-w-7xl px-4 md:px-12 py-12 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs">
        {/* Col 1: Analysis */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <PlusCircle className="w-3.5 h-3.5 text-indigo-400" />
            Analysis Modules
          </h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#platform-modules" className="hover:text-white transition-colors">
                Executive Dashboard
              </a>
            </li>
            <li>
              <a href="#platform-modules" className="hover:text-white transition-colors">
                New Code Analysis
              </a>
            </li>
            <li>
              <a href="#platform-modules" className="hover:text-white transition-colors">
                Analysis History
              </a>
            </li>
            <li>
              <a href="#platform-modules" className="hover:text-white transition-colors">
                Security & Audit Reports
              </a>
            </li>
          </ul>
        </div>

        {/* Col 2: Manage */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5 text-teal-400" />
            Manage & Topology
          </h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#platform-modules" className="hover:text-white transition-colors">
                Connected Repositories
              </a>
            </li>
            <li>
              <a href="#platform-modules" className="hover:text-white transition-colors">
                Project Workspaces
              </a>
            </li>
            <li>
              <a href="#platform-modules" className="hover:text-white transition-colors">
                CI/CD Integrations
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Collaboration */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-rose-400" />
            Team & Security
          </h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <a href="#platform-modules" className="hover:text-white transition-colors">
                Team & Role Access
              </a>
            </li>
            <li>
              <a href="#platform-modules" className="hover:text-white transition-colors">
                Alerts & Notifications
              </a>
            </li>
            <li>
              <a href="#platform-modules" className="hover:text-white transition-colors">
                Platform Settings
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Resources */}
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
            Resources & Docs
          </h4>
          <ul className="space-y-2 text-gray-400">
            <li>
              <Link href="/docs" className="hover:text-white transition-colors">
                Documentation & API
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About ImpactIQ
              </Link>
            </li>
            <li>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Socials */}
      <div className="w-full max-w-7xl px-4 md:px-12 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            Impact<span className="text-indigo-400 font-semibold">IQ</span>
          </span>
          <span className="text-[11px] text-gray-500 ml-2">
            © 2026 ImpactIQ. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-4 text-gray-400">
          <a href="#" className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5" title="GitHub">
            <Github className="w-4 h-4" />
          </a>
          <a href="#" className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5" title="LinkedIn">
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="#" className="hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5" title="Twitter">
            <Twitter className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}

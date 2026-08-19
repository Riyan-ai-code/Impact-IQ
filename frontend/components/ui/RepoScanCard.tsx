"use client"

import React from "react"
import { 
  GitBranch, 
  Layers, 
  ArrowUpRight, 
  Zap, 
  Code2, 
  Radio, 
  Cpu, 
  ShieldAlert, 
  PackageCheck 
} from "lucide-react"

interface RepoScanCardProps {
  repoName?: string
  branch?: string
  riskScore?: number
  filesChanged?: number
  breakingChangesCount?: number
  scanTimeAgo?: string
  className?: string
}

export default function RepoScanCard({
  repoName = "acme-cloud/payment-service",
  branch = "feature/v2-charge-endpoint",
  riskScore = 84,
  filesChanged = 14,
  breakingChangesCount = 2,
  scanTimeAgo = "2 mins ago",
  className = ""
}: RepoScanCardProps) {
  const isHigh = riskScore >= 70
  const isMedium = riskScore >= 40 && riskScore < 70

  return (
    <div className={`w-full max-w-xl transition-all duration-150 ease-in-out ${className}`}>
      {/* Surface 1 (S1) Base Container */}
      <div className="bg-surface-1 border border-border hover:bg-surface-2 p-6 rounded-2xl transition-all duration-150 ease-in-out space-y-5 text-content-primary">
        
        {/* Top Header & Risk Badge */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-icon-indigo flex items-center justify-center text-white text-xs">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-mono text-content-muted uppercase tracking-[0.5px] font-bold">
                AST Security Telemetry
              </span>
              <span className="text-[11px] text-content-muted">•</span>
              <span className="text-[11px] text-content-secondary">{scanTimeAgo}</span>
            </div>

            <h3 className="text-lg font-bold text-content-primary tracking-tight flex items-center gap-2">
              {repoName}
            </h3>

            <div className="flex items-center gap-2 text-xs font-mono">
              <GitBranch className="w-3.5 h-3.5 text-brand" />
              <span className="text-brand font-semibold">
                {branch}
              </span>
            </div>
          </div>

          {/* Risk Score Badge */}
          <div className={`flex flex-col items-center justify-center px-3.5 py-2 rounded-xl border border-border ${
            isHigh 
              ? 'bg-[var(--tag-security-bg)] text-[var(--tag-security-text)]' 
              : isMedium
                ? 'bg-[var(--tag-dependencies-bg)] text-[var(--tag-dependencies-text)]'
                : 'bg-[var(--tag-iot-bg)] text-[var(--tag-iot-text)]'
          }`}>
            <span className="text-2xl font-black leading-none font-mono">
              {riskScore}<span className="text-xs font-normal opacity-70">/100</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.5px] mt-1">
              {isHigh ? 'High Risk' : isMedium ? 'Warning' : 'Healthy'}
            </span>
          </div>
        </div>

        {/* Middle Metrics Row (Surface 2) */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-surface-2 hover:bg-surface-3 border border-border p-3 rounded-xl space-y-1 transition-colors duration-150">
            <span className="text-[10px] text-content-muted font-bold uppercase tracking-[0.5px] block">AST Diff</span>
            <span className="text-sm font-bold text-content-primary">{filesChanged} files</span>
          </div>

          <div className="bg-surface-2 hover:bg-surface-3 border border-border p-3 rounded-xl space-y-1 transition-colors duration-150">
            <span className="text-[10px] text-content-muted font-bold uppercase tracking-[0.5px] block">Breaking API</span>
            <span className="text-sm font-bold text-[var(--tag-security-text)]">
              {breakingChangesCount} flagged
            </span>
          </div>

          <div className="bg-surface-2 hover:bg-surface-3 border border-border p-3 rounded-xl space-y-1 transition-colors duration-150">
            <span className="text-[10px] text-content-muted font-bold uppercase tracking-[0.5px] block">CI/CD Gate</span>
            <span className={`text-sm font-bold ${isHigh ? 'text-[var(--tag-security-text)]' : 'text-[var(--tag-iot-text)]'}`}>
              {isHigh ? 'BLOCKED' : 'APPROVED'}
            </span>
          </div>
        </div>

        {/* Semantic Tags Row */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-content-secondary uppercase tracking-[0.5px] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-brand" />
            Detected Stack & Services:
          </span>

          <div className="flex flex-wrap gap-1.5 text-[11px] font-mono font-medium">
            <span className="px-2.5 py-1 rounded-lg bg-[var(--tag-typescript-bg)] text-[var(--tag-typescript-text)] border border-border flex items-center gap-1">
              <Code2 className="w-3 h-3" /> TypeScript
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[var(--tag-p2p-bg)] text-[var(--tag-p2p-text)] border border-border flex items-center gap-1">
              <Radio className="w-3 h-3" /> P2P Sync
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[var(--tag-iot-bg)] text-[var(--tag-iot-text)] border border-border flex items-center gap-1">
              <Cpu className="w-3 h-3" /> IoT Broker
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[var(--tag-security-bg)] text-[var(--tag-security-text)] border border-border flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Security Flag
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-[var(--tag-dependencies-bg)] text-[var(--tag-dependencies-text)] border border-border flex items-center gap-1">
              <PackageCheck className="w-3 h-3" /> Dependencies
            </span>
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-content-secondary">
            <div className="w-2 h-2 rounded-full bg-icon-teal" />
            <span>Telemetry active • 150ms sync</span>
          </div>

          <button className="text-xs font-semibold text-white bg-brand hover:bg-brand-hover px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all duration-150 ease-in-out cursor-pointer">
            Inspect AST Diff
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

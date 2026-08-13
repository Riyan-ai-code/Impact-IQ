"use client"

import { 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  BrainCircuit, 
  Zap, 
  Users, 
  Github, 
  Layers, 
  Lock, 
  Check, 
  ArrowRight,
  Globe,
  Database,
  Cpu,
  Heart
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="space-y-10 text-left max-w-5xl mx-auto py-2">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          About ImpactIQ
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight max-w-2xl">
          Know what could break. <br />
          <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
            Before it breaks.
          </span>
        </h1>

        <p className="text-sm md:text-base text-slate-300 max-w-2xl leading-relaxed">
          ImpactIQ is an AI-powered Engineering Intelligence &amp; Risk Governance Platform designed to inspect code changes, map microservice dependency blast radius, detect breaking API contracts, and eliminate production outages before deployment.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4">
          <Button
            variant="brand"
            onClick={() => window.location.href = "/dashboard/analysis"}
            className="h-11 px-6 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center gap-2 shadow-md cursor-pointer"
          >
            <span>Try AI Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => window.location.href = "/dashboard/docs"}
            className="h-11 px-6 text-xs font-bold border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <span>Read Documentation</span>
          </Button>
        </div>
      </div>

      {/* The Problem We Solve */}
      <div className="space-y-4">
        <div className="text-center space-y-1 max-w-xl mx-auto">
          <h2 className="text-xl font-bold text-slate-900">Why ImpactIQ Was Built</h2>
          <p className="text-xs text-slate-500">Traditional CI/CD tools check if code compiles. ImpactIQ predicts if code breaks production.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Silent API Breaking Changes</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Renaming or removing response fields in backend REST APIs silently crashes mobile apps and frontend clients. ImpactIQ detects schema diffs instantly.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Microservice Blast Radius</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              In complex microservices, changing an internal service payload cascades failures across upstream services. ImpactIQ maps dependency blast radius.
            </p>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Security &amp; Secret Exposure</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Hardcoded API test keys, unparameterized SQL queries, and root Docker containers escape standard tests. ImpactIQ audits code security before merge.
            </p>
          </div>
        </div>
      </div>

      {/* Engineering Architecture */}
      <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Platform Technology Architecture</h3>
            <p className="text-xs text-slate-500">Built with modern, open, enterprise-grade engineering stack.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">FRONTEND</span>
            <h4 className="text-xs font-bold text-slate-900">Next.js 15 &amp; React 19</h4>
            <p className="text-[10px] text-slate-500">App Router &amp; TailwindCSS</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">BACKEND</span>
            <h4 className="text-xs font-bold text-slate-900">FastAPI &amp; Python 3.12</h4>
            <p className="text-[10px] text-slate-500">Async API &amp; AST Parsers</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider block">DATABASE &amp; STORAGE</span>
            <h4 className="text-xs font-bold text-slate-900">Nhost &amp; Hasura GraphQL</h4>
            <p className="text-[10px] text-slate-500">Managed Cloud PostgreSQL</p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">AI ENGINES</span>
            <h4 className="text-xs font-bold text-slate-900">Multi-LLM Routing</h4>
            <p className="text-[10px] text-slate-500">Gemini 1.5, GPT-4o, Claude 3.5</p>
          </div>
        </div>
      </div>

    </div>
  )
}

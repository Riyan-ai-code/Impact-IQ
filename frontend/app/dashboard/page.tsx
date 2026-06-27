"use client"

import { Rocket, ShieldCheck, BarChart2, Plus, Github, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-6 select-none">
      {/* Central Illustration and Call-to-Action Card */}
      <div className="w-full max-w-4xl bg-white border border-gray-200/80 rounded-2xl p-8 md:p-12 shadow-sm flex flex-col items-center text-center space-y-6">
        
        {/* SVG Illustration Container */}
        <div className="relative w-64 h-48 flex items-center justify-center">
          {/* Sparkles / Decors */}
          <div className="absolute top-4 left-6 text-indigo-400 animate-pulse text-lg">✦</div>
          <div className="absolute top-12 right-6 text-indigo-400 animate-pulse text-sm">✦</div>
          <div className="absolute bottom-10 left-12 text-indigo-300 text-xs">✦</div>
          <div className="absolute top-24 left-2 text-indigo-300 text-base">✦</div>

          <svg className="w-full h-full" viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background floating card: Document with lines */}
            <g opacity="0.8">
              <rect x="52" y="30" width="40" height="52" rx="4" fill="white" stroke="#e0e7ff" strokeWidth="1.5" />
              <rect x="58" y="38" width="16" height="3" rx="1.5" fill="#c7d2fe" />
              <circle cx="60" cy="48" r="2" fill="#818cf8" />
              <rect x="66" y="47" width="20" height="2.5" rx="1" fill="#e2e8f0" />
              <circle cx="60" cy="56" r="2" fill="#818cf8" />
              <rect x="66" y="55" width="20" height="2.5" rx="1" fill="#e2e8f0" />
              <circle cx="60" cy="64" r="2" fill="#818cf8" />
              <rect x="66" y="63" width="14" height="2.5" rx="1" fill="#e2e8f0" />
            </g>

            {/* Background floating card: Analytics Chart */}
            <g opacity="0.8">
              <rect x="144" y="38" width="52" height="40" rx="4" fill="white" stroke="#e0e7ff" strokeWidth="1.5" />
              <path d="M152 64 L164 54 L176 59 L188 48" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="152" cy="64" r="2.5" fill="#4f46e5" />
              <circle cx="164" cy="54" r="2.5" fill="#4f46e5" />
              <circle cx="176" cy="59" r="2.5" fill="#4f46e5" />
              <circle cx="188" cy="48" r="2.5" fill="#4f46e5" />
            </g>

            {/* Open Box Container */}
            {/* Box Back */}
            <path d="M72 108 L120 86 L168 108 L120 128 Z" fill="#c7d2fe" opacity="0.7" />
            
            {/* GitHub Logo Floating */}
            <g transform="translate(104, 76)">
              <circle cx="16" cy="16" r="16" fill="#1f2937" />
              <path d="M16 5C9.9 5 5 9.9 5 16C5 20.9 8.2 24.9 12.6 26.4C13.2 26.5 13.4 26.1 13.4 25.8C13.4 25.5 13.4 24.6 13.4 23.6C10.3 24.3 9.7 22.1 9.7 22.1C9.2 20.8 8.4 20.4 8.4 20.4C7.4 19.7 8.5 19.7 8.5 19.7C9.6 19.8 10.2 20.8 10.2 20.8C11.2 22.5 12.8 22 13.4 21.7C13.5 21 13.8 20.5 14.1 20.2C11.6 19.9 9 18.9 9 14.6C9 13.4 9.4 12.4 10.1 11.6C10 11.3 9.6 10.2 10.2 8.8C10.2 8.8 11.1 8.5 13.2 10C14.1 9.7 15 9.6 16 9.6C17 9.6 17.9 9.7 18.8 10C20.8 8.5 21.7 8.8 21.7 8.8C22.3 10.2 21.9 11.3 21.8 11.6C22.5 12.4 22.9 13.4 22.9 14.6C22.9 18.9 20.3 19.9 17.8 20.2C18.2 20.5 18.6 21.2 18.6 22.3C18.6 23.9 18.6 25.2 18.6 25.6C18.6 26 18.8 26.4 19.4 26.3C23.8 24.8 27 20.8 27 16C27 9.9 22.1 5 16 5Z" fill="white" />
            </g>

            {/* Box Front Panels (Isometric) */}
            <path d="M72 108 L120 128 L120 148 L72 128 Z" fill="#818cf8" />
            <path d="M120 128 L168 108 L168 128 L120 148 Z" fill="#6366f1" />
            
            {/* Box Left Flap */}
            <path d="M72 108 L120 86 L108 81 L60 103 Z" fill="#a5b4fc" />
            {/* Box Right Flap */}
            <path d="M168 108 L120 86 L132 81 L180 103 Z" fill="#a5b4fc" opacity="0.9" />
          </svg>
        </div>

        {/* Heading & Paragraph */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            No Projects Yet
          </h2>
          <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
            You don't have any projects connected yet. Create your first project to start analyzing your codebase and uncover insights.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center gap-3.5 w-full max-w-sm">
          <Button variant="brand" className="w-full h-11 text-xs font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/10 rounded-lg">
            <Plus className="w-4 h-4" />
            Create Your First Project
          </Button>

          <div className="flex items-center gap-3 w-full">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OR</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <Button variant="outline" className="w-full h-11 text-xs font-bold border-gray-200 text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 rounded-lg">
            <Github className="w-4 h-4 fill-gray-700" />
            Connect GitHub Account
          </Button>
        </div>
      </div>

      {/* Feature Step Progression Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        
        {/* Step 1 */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
          <div className="w-11 h-11 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
            <Rocket className="w-5 h-5" />
          </div>
          <div className="text-left leading-tight">
            <h4 className="text-xs font-bold text-gray-900">Create a Project</h4>
            <p className="text-[10px] text-gray-500 mt-1 leading-normal">
              Connect a GitHub repository in a few simple steps.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-left leading-tight">
            <h4 className="text-xs font-bold text-gray-900">Run Smart Analysis</h4>
            <p className="text-[10px] text-gray-500 mt-1 leading-normal">
              Detect risks, dependencies and API issues automatically.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white border border-gray-200/80 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
          <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div className="text-left leading-tight">
            <h4 className="text-xs font-bold text-gray-900">Get Actionable Insights</h4>
            <p className="text-[10px] text-gray-500 mt-1 leading-normal">
              Make better engineering decisions with clear reports.
            </p>
          </div>
        </div>
      </div>

      {/* Lightbulb Banner Caption */}
      <div className="flex items-center gap-2 text-gray-400 text-[10px] font-semibold mt-8">
        <Lightbulb className="w-4 h-4 text-indigo-400 animate-pulse" />
        <span>ImpactIQ helps you ship secure, reliable and high-quality code.</span>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { ArrowRight, Play, AlertTriangle, ShieldCheck, Zap, Layers, RefreshCw, BarChart2, Plus, ArrowUpRight, Search, Bell } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative w-full bg-[#030712] pt-16 pb-12 px-6 md:px-12 flex flex-col items-center overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[60%] rounded-full bg-brand/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Copy Column */}
        <div className="lg:col-span-5 flex flex-col items-start text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand/20 bg-brand/5 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            AI-Powered Deployment Intelligence
          </div>
          
          <h1 className="text-4xl md:text-5.5xl font-extrabold tracking-tight text-white leading-tight">
            Predict. Prioritize. <br />
            Deploy with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-brand to-indigo-300">Confidence.</span>
          </h1>

          <p className="text-base md:text-lg text-gray-400 leading-relaxed max-w-lg">
            ImpactIQ analyzes code changes, dependencies, and APIs to predict deployment risks, surface breaking changes, and help engineering teams ship safely.
          </p>

          <div className="flex flex-row gap-4 w-full sm:w-auto">
            <Link href="/dashboard" className="flex-1 sm:flex-initial">
              <button className="w-full sm:w-auto bg-brand hover:bg-brand-hover text-white text-sm font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-brand/20 transition-all">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/dashboard" className="flex-1 sm:flex-initial">
              <button className="w-full sm:w-auto border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all">
                See How It Works
                <Play className="w-4 h-4 fill-white" />
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-6 w-full">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Reduce Deployment Risk</h4>
                <p className="text-xs text-gray-400">Catch breaking changes early</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-teal-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Understand Impact</h4>
                <p className="text-xs text-gray-400">Visualize blast radius</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">AI-Powered Insights</h4>
                <p className="text-xs text-gray-400">Get clear explanations</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Embedded Dashboard Mock Column */}
        <div className="lg:col-span-7 w-full relative">
          <Link href="/dashboard" className="block group">
            <div className="w-full border border-white/10 bg-[#0d0f17] rounded-xl overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-brand/40 group-hover:shadow-brand/5 relative">
              {/* Dashboard Frame Bar */}
              <div className="w-full bg-[#080a10] border-b border-white/5 px-4 py-3 flex items-center justify-between text-xs text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand to-indigo-400 flex items-center justify-center text-white font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-white tracking-wide">ImpactIQ</span>
                </div>
                {/* Mock Search Bar */}
                <div className="relative max-w-xs w-48 md:w-64 hidden sm:block">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <div className="w-full bg-[#11131e] border border-white/5 rounded-md py-1 px-8 text-left text-gray-500 text-[11px]">
                    Search anything...
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-gray-500" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-brand/30 border border-brand/50 text-[10px] text-brand-light flex items-center justify-center font-bold">
                      AD
                    </div>
                    <span className="text-[11px] text-gray-300 font-medium">Arjun Dev</span>
                  </div>
                </div>
              </div>

              {/* Main App Layout Grid */}
              <div className="grid grid-cols-12 min-h-[460px] text-[11px] text-gray-300">
                {/* Mock Sidebar */}
                <div className="col-span-3 bg-[#090b11] border-r border-white/5 p-3 flex flex-col justify-between hidden sm:flex">
                  <div className="space-y-4">
                    <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-white font-semibold flex items-center gap-1.5">
                      <BarChart2 className="w-3.5 h-3.5 text-brand" />
                      Dashboard
                    </div>
                    <div>
                      <div className="px-2 py-1 text-[10px] font-bold text-gray-600 uppercase tracking-wider">Analysis</div>
                      <div className="space-y-1 mt-1">
                        <div className="px-2 py-1 rounded text-gray-400 hover:text-white flex items-center gap-1.5">New Analysis</div>
                        <div className="px-2 py-1 rounded text-gray-400 hover:text-white flex items-center gap-1.5">Analysis History</div>
                        <div className="px-2 py-1 rounded text-gray-400 hover:text-white flex items-center gap-1.5">Saved Reports</div>
                      </div>
                    </div>
                    <div>
                      <div className="px-2 py-1 text-[10px] font-bold text-gray-600 uppercase tracking-wider">Repositories</div>
                      <div className="space-y-1 mt-1">
                        <div className="px-2 py-1 rounded text-gray-400 hover:text-white">All Repositories</div>
                        <div className="px-2 py-1 rounded text-gray-400 hover:text-white">Health</div>
                        <div className="px-2 py-1 rounded text-gray-400 hover:text-white">Open Findings</div>
                      </div>
                    </div>
                    <div>
                      <div className="px-2 py-1 text-[10px] font-bold text-gray-600 uppercase tracking-wider">Intelligence</div>
                      <div className="space-y-1 mt-1">
                        <div className="px-2 py-1 rounded text-gray-400 hover:text-white">Dependency Graph</div>
                        <div className="px-2 py-1 rounded text-gray-400 hover:text-white">Blast Radius</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-600 border-t border-white/5 pt-2">
                    ImpactIQ Platform v1.0
                  </div>
                </div>

                {/* Mock Main Dashboard View */}
                <div className="col-span-12 sm:col-span-9 bg-[#0b0c14] p-4 flex flex-col gap-4 overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1">
                        Executive Prioritize
                        <span className="w-3.5 h-3.5 rounded-full bg-white/5 flex items-center justify-center text-[8px] text-gray-500">i</span>
                      </h3>
                      <p className="text-[10px] text-gray-500">Real-time insights into your engineering ecosystem</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="bg-brand text-white font-semibold py-1 px-2.5 rounded flex items-center gap-1 hover:bg-brand-hover">
                        <Plus className="w-3 h-3" /> New Analysis
                      </div>
                      <div className="border border-white/10 bg-white/5 px-2 py-1 rounded text-gray-400 flex items-center gap-1">
                        Export <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Mock KPI Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <div className="bg-[#121420] border border-white/5 p-2 rounded-lg flex flex-col justify-between">
                      <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Overall Risk</span>
                      <div className="my-1 text-base font-bold text-white">72 <span className="text-gray-600 text-[10px]">/100</span></div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-brand h-full rounded-full" style={{ width: '72%' }} />
                      </div>
                      <span className="text-[8px] text-red-400 mt-1">↑ 8 vs last 7d</span>
                    </div>

                    <div className="bg-[#121420] border border-white/5 p-2 rounded-lg">
                      <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Deployments (7d)</span>
                      <div className="my-1 text-base font-bold text-white">24</div>
                      {/* Simple Sparkline SVG */}
                      <svg className="w-full h-4 text-emerald-400" viewBox="0 0 100 20" fill="none">
                        <path d="M0,15 L20,12 L40,16 L60,8 L80,14 L100,3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-[8px] text-emerald-400 mt-1">↑ 14% vs last 7d</span>
                    </div>

                    <div className="bg-[#121420] border border-white/5 p-2 rounded-lg">
                      <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Repositories</span>
                      <div className="my-1 text-base font-bold text-white">156</div>
                      <svg className="w-full h-4 text-blue-400" viewBox="0 0 100 20" fill="none">
                        <path d="M0,10 L20,9 L40,14 L60,12 L80,10 L100,5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-[8px] text-blue-400 mt-1">↑ 6% vs last 7d</span>
                    </div>

                    <div className="bg-[#121420] border border-white/5 p-2 rounded-lg">
                      <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Open Findings</span>
                      <div className="my-1 text-base font-bold text-white">189</div>
                      <svg className="w-full h-4 text-amber-500" viewBox="0 0 100 20" fill="none">
                        <path d="M0,8 L20,14 L40,9 L60,15 L80,7 L100,12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-[8px] text-amber-400 mt-1">↑ 12% vs last 7d</span>
                    </div>

                    <div className="bg-[#121420] border border-white/5 p-2 rounded-lg col-span-2 md:col-span-1">
                      <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Critical Findings</span>
                      <div className="my-1 text-base font-bold text-red-500">23</div>
                      <svg className="w-full h-4 text-red-500" viewBox="0 0 100 20" fill="none">
                        <path d="M0,16 L20,10 L40,14 L60,18 L80,8 L100,12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-[8px] text-red-500 mt-1">↑ 4 vs last 7d</span>
                    </div>
                  </div>

                  {/* Mock Charts and Table Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {/* Deployment Status */}
                    <div className="bg-[#121420] border border-white/5 p-3 rounded-lg flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-white text-[10px]">Deployment Status</span>
                        <span className="text-indigo-400 font-medium text-[8px] cursor-pointer">View all</span>
                      </div>
                      <div className="flex items-center gap-4">
                        {/* Custom SVG Donut */}
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-white/5" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            {/* Successful (50%) */}
                            <path className="text-emerald-500" stroke="currentColor" strokeWidth="3.2" strokeDasharray="50, 100" strokeDashoffset="0" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            {/* Warning (25%) */}
                            <path className="text-amber-500" stroke="currentColor" strokeWidth="3.2" strokeDasharray="25, 100" strokeDashoffset="-50" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            {/* Failed (12.5%) */}
                            <path className="text-red-500" stroke="currentColor" strokeWidth="3.2" strokeDasharray="12.5, 100" strokeDashoffset="-75" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            {/* In Progress (12.5%) */}
                            <path className="text-blue-500" stroke="currentColor" strokeWidth="3.2" strokeDasharray="12.5, 100" strokeDashoffset="-87.5" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-[12px] font-bold text-white">24</span>
                            <span className="text-[7px] text-gray-500">Total</span>
                          </div>
                        </div>
                        <div className="flex-1 space-y-1 text-[8px] text-gray-400">
                          <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Successful</span> <span className="font-bold text-white">12 (50%)</span></div>
                          <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Warning</span> <span className="font-bold text-white">6 (25%)</span></div>
                          <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Failed</span> <span className="font-bold text-white">3 (12.5%)</span></div>
                          <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> In Progress</span> <span className="font-bold text-white">3 (12.5%)</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Repository Health */}
                    <div className="bg-[#121420] border border-white/5 p-3 rounded-lg flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-white text-[10px]">Repository Health</span>
                        <span className="text-indigo-400 font-medium text-[8px] cursor-pointer">View all</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path className="text-white/5" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="text-emerald-500" stroke="currentColor" strokeWidth="3.2" strokeDasharray="68, 100" strokeDashoffset="0" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="text-amber-500" stroke="currentColor" strokeWidth="3.2" strokeDasharray="24, 100" strokeDashoffset="-68" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path className="text-red-500" stroke="currentColor" strokeWidth="3.2" strokeDasharray="8, 100" strokeDashoffset="-92" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                          </svg>
                          <div className="absolute flex flex-col items-center justify-center">
                            <span className="text-[12px] font-bold text-white">68%</span>
                            <span className="text-[7px] text-gray-500">Healthy</span>
                          </div>
                        </div>
                        <div className="flex-1 space-y-1 text-[8px] text-gray-400">
                          <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Healthy</span> <span className="font-bold text-white">106 (68%)</span></div>
                          <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> At Risk</span> <span className="font-bold text-white">38 (24%)</span></div>
                          <div className="flex justify-between items-center"><span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Critical</span> <span className="font-bold text-white">12 (8%)</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Top Risky Repositories */}
                    <div className="bg-[#121420] border border-white/5 p-3 rounded-lg flex flex-col justify-between">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-white text-[10px]">Top Risky Repositories</span>
                        <span className="text-indigo-400 font-medium text-[8px] cursor-pointer">View all</span>
                      </div>
                      <div className="space-y-1.5 text-[8px]">
                        <div className="flex justify-between items-center p-1 rounded bg-white/5 border border-white/5">
                          <span className="text-white font-medium">payment-service</span>
                          <div className="flex gap-1.5 items-center">
                            <span className="text-[8px] text-red-400 font-semibold bg-red-500/10 px-1 rounded border border-red-500/20">92</span>
                            <span className="text-red-500 font-bold uppercase text-[7px]">High</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-1 rounded bg-white/5 border border-white/5">
                          <span className="text-white font-medium">auth-service</span>
                          <div className="flex gap-1.5 items-center">
                            <span className="text-[8px] text-red-400 font-semibold bg-red-500/10 px-1 rounded border border-red-500/20">85</span>
                            <span className="text-red-500 font-bold uppercase text-[7px]">High</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-1 rounded bg-white/5 border border-white/5">
                          <span className="text-white font-medium">order-service</span>
                          <div className="flex gap-1.5 items-center">
                            <span className="text-[8px] text-amber-400 font-semibold bg-amber-500/10 px-1 rounded border border-amber-500/20">74</span>
                            <span className="text-amber-500 font-bold uppercase text-[7px]">Medium</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-1 rounded bg-white/5 border border-white/5">
                          <span className="text-white font-medium">user-service</span>
                          <div className="flex gap-1.5 items-center">
                            <span className="text-[8px] text-amber-400 font-semibold bg-amber-500/10 px-1 rounded border border-amber-500/20">68</span>
                            <span className="text-amber-500 font-bold uppercase text-[7px]">Medium</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-1 rounded bg-white/5 border border-white/5">
                          <span className="text-white font-medium">inventory-service</span>
                          <div className="flex gap-1.5 items-center">
                            <span className="text-[8px] text-emerald-400 font-semibold bg-emerald-500/10 px-1 rounded border border-emerald-500/20">52</span>
                            <span className="text-emerald-500 font-bold uppercase text-[7px]">Low</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Trigger overlay info */}
              <div className="absolute inset-0 bg-brand/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <div className="bg-brand text-white text-xs font-semibold py-2.5 px-5 rounded-lg shadow-xl border border-white/10 flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  Enter Interactive Staging Environment
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Trusted By Engineering Teams Logo Cloud */}
      <div className="w-full max-w-7xl mt-16 pt-10 border-t border-white/5 flex flex-col items-center">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Trusted By Engineering Teams</span>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-sm text-gray-500 font-semibold">
          <div className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
            <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center border border-white/10 text-[10px]">⬡</div>
            Acme Corp
          </div>
          <div className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
            <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center border border-white/10 text-[10px]">❖</div>
            DevStack
          </div>
          <div className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
            <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center border border-white/10 text-[10px]">☁</div>
            CloudNova
          </div>
          <div className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
            <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center border border-white/10 text-[10px]">⚙</div>
            ByteForge
          </div>
          <div className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
            <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center border border-white/10 text-[10px]">◯</div>
            CodeOrbit
          </div>
          <div className="flex items-center gap-1.5 hover:text-gray-300 transition-colors">
            <div className="w-5 h-5 rounded bg-white/5 flex items-center justify-center border border-white/10 text-[10px]">▲</div>
            NextLayer
          </div>
        </div>
      </div>
    </section>
  )
}

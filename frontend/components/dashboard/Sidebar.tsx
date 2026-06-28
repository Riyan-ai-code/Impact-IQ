"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  ShieldCheck, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  FileText, 
  FolderGit2, 
  GitFork, 
  Layers2, 
  Settings, 
  Users, 
  Bell, 
  HelpCircle,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function Sidebar() {
  const pathname = usePathname()

  const sections = [
    {
      title: "Analysis",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "New Analysis", href: "/dashboard/analysis", icon: PlusCircle },
        { name: "Analysis History", href: "/dashboard/history", icon: History },
        { name: "Reports", href: "/dashboard/reports", icon: FileText },
      ]
    },
    {
      title: "Manage",
      items: [
        { name: "Projects", href: "/dashboard/projects", icon: FolderGit2 },
        { name: "Repositories", href: "/dashboard/repositories", icon: GitFork },
        { name: "Integrations", href: "/dashboard/integrations", icon: Layers2 },
      ]
    },
    {
      title: "Settings",
      items: [
        { name: "Project Settings", href: "/dashboard/settings", icon: Settings },
        { name: "Team", href: "/dashboard/team", icon: Users },
        { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
      ]
    }
  ]

  return (
    <aside className="w-64 h-full bg-[#080d1a] text-gray-400 flex flex-col justify-between border-r border-white/5 flex-shrink-0 z-30 select-none">
      {/* Top Brand Block */}
      <div className="p-5 border-b border-white/5 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-[#4f46e5] flex items-center justify-center text-white shadow-md">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white flex items-center">
          Impact<span className="font-medium text-white">IQ</span>
        </span>
      </div>

      {/* Main Nav Items */}
      <div className="flex-1 py-4 overflow-y-auto no-scrollbar px-3 space-y-5">
        {sections.map((section, sectionIdx) => (
          <div key={sectionIdx} className="space-y-1.5">
            <h4 className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              {section.title}
            </h4>
            <ul className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const isDashboard = item.name === "Dashboard"
                const isRepositories = item.name === "Repositories"
                
                const isDashboardActive = isDashboard && (pathname === "/dashboard" || pathname === "/dashboard/repositories")
                const isRepositoriesActive = isRepositories && pathname === "/dashboard/repositories"
                
                const isActive = isDashboardActive || isRepositoriesActive || (!isDashboard && !isRepositories && pathname === item.href)
                const activeClass = isDashboardActive 
                  ? "bg-[#4f46e5] text-white" 
                  : isRepositoriesActive 
                    ? "bg-white/10 text-white" 
                    : "bg-[#4f46e5] text-white"

                const Icon = item.icon
                return (
                  <li key={itemIdx}>
                    <Link href={item.href} className="block">
                      <div className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer",
                        isActive 
                          ? activeClass 
                          : "hover:bg-white/5 hover:text-white"
                      )}>
                        <Icon className={cn("w-4.5 h-4.5", isActive ? "text-white" : "text-gray-500")} />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Profile Block */}
      <div className="p-4 border-t border-white/5 bg-[#050912] flex-shrink-0">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-white/10 hover:bg-slate-900/80 transition-colors cursor-pointer group">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs border border-white/10 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100" 
                  alt="Arjun Dev"
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center bg-indigo-600 font-bold">AD</span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#050912]" />
            </div>
            <div className="text-left leading-tight">
              <h4 className="text-xs font-bold text-white">Arjun Dev</h4>
              <span className="text-[10px] text-gray-500">Admin</span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
        </div>
      </div>
    </aside>
  )
}

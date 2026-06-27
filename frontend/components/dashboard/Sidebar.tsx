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
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-md">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <span className="text-lg font-bold tracking-tight text-white flex items-center">
          Impact<span className="text-indigo-400 font-semibold">IQ</span>
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
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <li key={itemIdx}>
                    <Link href={item.href} className="block">
                      <div className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer",
                        isActive 
                          ? "bg-indigo-600/15 border-l-2 border-indigo-500 text-indigo-200" 
                          : "hover:bg-white/5 hover:text-white"
                      )}>
                        <Icon className={cn("w-4.5 h-4.5", isActive ? "text-indigo-400" : "text-gray-500")} />
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

      {/* Bottom Profile and Help Blocks */}
      <div className="p-4 border-t border-white/5 bg-[#050912] space-y-3 flex-shrink-0">
        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs border border-white/10 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" 
                  alt="Arjun Dev"
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    // Fallback to text initials if image fails to load
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <span className="absolute inset-0 flex items-center justify-center bg-indigo-600 font-bold">AD</span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#050912]" />
            </div>
            <div className="text-left leading-none">
              <h4 className="text-xs font-bold text-white">Arjun Dev</h4>
              <span className="text-[10px] text-gray-500">Admin</span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-hover:text-white transition-colors" />
        </div>

        {/* Support Link */}
        <Link href="/dashboard/support">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-white/5 hover:text-white cursor-pointer transition-colors">
            <HelpCircle className="w-4.5 h-4.5 text-gray-500" />
            <span>Help & Support</span>
          </div>
        </Link>
      </div>
    </aside>
  )
}

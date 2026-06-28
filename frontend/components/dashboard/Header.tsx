"use client"

import { usePathname } from "next/navigation"
import { Menu, Sun, Moon, Bell, ChevronDown } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)

  // Map route path to human-readable page name
  const getPageTitle = () => {
    const parts = pathname.split('/').filter(Boolean)
    if (parts.length <= 1) return "Dashboard"
    
    // Capitalize and format path segments
    return parts.slice(1).map(segment => 
      segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' ')
    ).join(' — ')
  }

  return (
    <header className="h-[4.5rem] border-b border-gray-200 bg-white px-6 flex items-center justify-between flex-shrink-0 select-none">
      {/* Left section: Hamburger menu & Title */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col text-left justify-center">
          <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">
            {getPageTitle()}
          </h1>
          {pathname === "/dashboard/repositories" && (
            <p className="text-xs text-gray-500 mt-0.5">
              Select a repository to create a project
            </p>
          )}
        </div>
      </div>

      {/* Right section: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors relative mr-1" title="Notifications">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-rose-500 text-[9px] text-white flex items-center justify-center font-bold border-2 border-white shadow-sm">
            3
          </span>
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100 hover:opacity-90 transition-opacity cursor-pointer">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100" 
              alt="Arjun Dev"
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col text-left leading-tight">
            <span className="text-xs font-bold text-gray-900">Arjun Dev</span>
            <span className="text-[10px] text-gray-500">Admin</span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </div>
    </header>
  )
}

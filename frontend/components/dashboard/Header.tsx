"use client"

import { usePathname } from "next/navigation"
import { Menu, Sun, Moon, Bell } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

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
    <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between flex-shrink-0 select-none">
      {/* Left section: Hamburger menu & Title */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-gray-900 tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right section: Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <button 
          onClick={() => {
            setIsDark(!isDark)
            document.documentElement.classList.toggle('dark')
          }}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors relative" title="Notifications">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-[9px] text-white flex items-center justify-center font-bold border border-white">
            3
          </span>
        </button>


      </div>
    </header>
  )
}

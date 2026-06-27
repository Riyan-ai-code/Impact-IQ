"use client"

import Link from "next/link"
import { ShieldCheck, Moon, Sun, ArrowRight } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isDark, setIsDark] = useState(true)

  return (
    <header className="w-full border-b border-white/5 bg-[#030712] py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-brand to-indigo-400 flex items-center justify-center text-white shadow-md">
          <ShieldCheck className="w-5.5 h-5.5" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white flex items-center">
          Impact<span className="text-brand font-semibold">IQ</span>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#documentation" className="hover:text-white transition-colors">Documentation</a>
        <a href="#about" className="hover:text-white transition-colors">About Us</a>
      </nav>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => {
            setIsDark(!isDark)
            document.documentElement.classList.toggle('light')
          }}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          title="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <Link href="/dashboard">
          <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/5">
            Log in
          </Button>
        </Link>

        <Link href="/dashboard">
          <Button variant="brand" className="rounded-lg text-white font-medium flex items-center gap-1.5">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </header>
  )
}

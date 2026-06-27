import Link from "next/link"
import { ShieldCheck, Github, Linkedin, Twitter, ArrowRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full bg-[#030712] border-t border-white/5 flex flex-col items-center">
      {/* CTA Banner Section */}
      <div className="w-full max-w-7xl px-6 md:px-12 pt-16 pb-12">
        <div className="w-full bg-brand rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xl shadow-brand/10">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          
          <div className="space-y-3 z-10 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white mx-auto md:mx-0 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Ready to deploy with confidence?
            </h3>
            <p className="text-sm text-indigo-100 max-w-md">
              Join engineering teams using ImpactIQ to ship safer, every day.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 z-10 w-full sm:w-auto">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white hover:bg-indigo-50 text-brand text-sm font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-md transition-all">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto border border-white/20 hover:border-white/40 bg-transparent text-white text-sm font-semibold py-3 px-6 rounded-lg flex items-center justify-center transition-all">
                Book a Demo
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full max-w-7xl px-6 md:px-12 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-brand to-indigo-400 flex items-center justify-center text-white shadow-md">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Impact<span className="text-brand font-semibold">IQ</span>
          </span>
          <span className="text-[10px] text-gray-600 font-medium ml-2">
            © 2026 ImpactIQ. All rights reserved.
          </span>
        </div>

        <div className="flex items-center gap-8 text-xs text-gray-500 font-medium">
          <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-300 transition-colors">Contact Us</a>
        </div>

        <div className="flex items-center gap-4 text-gray-500">
          <a href="#" className="hover:text-white transition-colors" title="GitHub">
            <Github className="w-4.5 h-4.5" />
          </a>
          <a href="#" className="hover:text-white transition-colors" title="LinkedIn">
            <Linkedin className="w-4.5 h-4.5" />
          </a>
          <a href="#" className="hover:text-white transition-colors" title="Twitter">
            <Twitter className="w-4.5 h-4.5" />
          </a>
        </div>
      </div>
    </footer>
  )
}

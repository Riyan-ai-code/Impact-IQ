"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ShieldCheck, 
  Github, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  AlertCircle,
  CheckCircle2,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { nhostSignIn, nhostSignUp, nhostSignInWithGithub } from "@/services/nhostAuthService"

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">("login")

  // Form inputs
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Feedback states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !password) {
      setError("Please fill in both email and password fields.")
      return
    }

    setLoading(true)

    if (mode === "login") {
      const { user, error: authError } = await nhostSignIn(email, password)
      if (authError) {
        setError(authError)
        setLoading(false)
        return
      }

      setSuccess("Authenticated successfully! Redirecting to Dashboard...")
      localStorage.setItem("impact_iq_user", JSON.stringify({
        id: user?.id || "usr-" + Date.now(),
        email,
        displayName: displayName || email.split("@")[0]
      }))

      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)

    } else {
      const { user, error: authError } = await nhostSignUp(email, password, displayName)
      if (authError) {
        setError(authError)
        setLoading(false)
        return
      }

      setSuccess("Account created successfully! Redirecting to Dashboard...")
      localStorage.setItem("impact_iq_user", JSON.stringify({
        id: user?.id || "usr-" + Date.now(),
        email,
        displayName: displayName || email.split("@")[0]
      }))

      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4 text-left select-none relative font-sans">
      
      {/* Background glow overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white flex items-center">
          Impact<span className="text-indigo-400 font-semibold">IQ</span>
        </span>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-md bg-[#0a0f1d] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
        
        {/* Mode Switcher Tabs */}
        <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-xl">
          <button
            type="button"
            onClick={() => { setMode("login"); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "login" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              mode === "signup" ? "bg-indigo-600 text-white shadow-sm" : "text-gray-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Headline */}
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white">
            {mode === "login" ? "Welcome back to ImpactIQ" : "Create your ImpactIQ account"}
          </h2>
          <p className="text-xs text-gray-400">
            {mode === "login" ? "Enter your credentials to access risk engineering dashboard." : "Get started with AI-powered deployment risk governance."}
          </p>
        </div>

        {/* GitHub OAuth Button */}
        <Button
          type="button"
          onClick={nhostSignInWithGithub}
          className="w-full h-11 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Github className="w-4 h-4 fill-white" />
          <span>Continue with GitHub</span>
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">OR EMAIL</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Error / Success Banners */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-center gap-2.5 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center gap-2.5 text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {mode === "signup" && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wide">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Riyan Shah"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-medium"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wide">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="riyan@impactiq.dev"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-300 uppercase tracking-wide">
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 font-medium"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer disabled:opacity-75"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === "login" ? "Sign In to ImpactIQ" : "Create Account"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>

        </form>

      </div>
    </div>
  )
}

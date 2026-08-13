"use client"

import { useState, useEffect } from "react"
import { 
  Github, 
  Slack, 
  MessageSquare, 
  Kanban, 
  Layers2, 
  Container, 
  Check, 
  Plus, 
  X, 
  ExternalLink,
  Settings2,
  ShieldCheck,
  BellRing,
  Bot,
  Box,
  RefreshCw,
  SlidersHorizontal,
  Workflow
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface IntegrationConfig {
  id: string
  name: string
  category: "vcs" | "collaboration" | "project_management" | "container_registry" | "cicd"
  description: string
  icon: string
  connected: boolean
  webhookUrl?: string
  apiKey?: string
  domainUrl?: string
  autoCommentPr?: boolean
  autoCreateJiraBug?: boolean
  minAlertScore?: number
}

const DEFAULT_INTEGRATIONS: IntegrationConfig[] = [
  {
    id: "github",
    name: "GitHub",
    category: "vcs",
    description: "Connect repositories, authorize OAuth access, and receive PR webhook triggers.",
    icon: "github",
    connected: false,
    autoCommentPr: true,
  },
  {
    id: "slack",
    name: "Slack",
    category: "collaboration",
    description: "Post instant PR risk alerts, AI executive summaries, and warnings to Slack channels.",
    icon: "slack",
    connected: false,
    webhookUrl: "",
    minAlertScore: 60,
  },
  {
    id: "github_bot",
    name: "GitHub PR Comment Bot",
    category: "cicd",
    description: "Automatically post AI executive summaries & release checklists as comments on PRs.",
    icon: "bot",
    connected: true,
    autoCommentPr: true,
  },
  {
    id: "jira",
    name: "Jira Software",
    category: "project_management",
    description: "Attach risk scores to Jira tickets and auto-create Jira bug tickets for critical security findings.",
    icon: "kanban",
    connected: false,
    domainUrl: "",
    apiKey: "",
    autoCreateJiraBug: true,
  },
  {
    id: "linear",
    name: "Linear",
    category: "project_management",
    description: "Link pull request risk analysis directly to Linear issues and track deployment gates.",
    icon: "layers",
    connected: false,
    apiKey: "",
  },
  {
    id: "bitbucket",
    name: "Bitbucket Cloud",
    category: "vcs",
    description: "Analyze Bitbucket Cloud repository diffs and pull requests for deployment risk.",
    icon: "vcs",
    connected: false,
    apiKey: "",
  },
  {
    id: "docker_hub",
    name: "Docker Hub & AWS ECR",
    category: "container_registry",
    description: "Audit Dockerfile base image tags and container layers for security vulnerabilities.",
    icon: "container",
    connected: false,
    apiKey: "",
  },
  {
    id: "ms_teams",
    name: "Microsoft Teams",
    category: "collaboration",
    description: "Send adaptive risk notification cards and release readiness reports to Teams channels.",
    icon: "teams",
    connected: false,
    webhookUrl: "",
  },
  {
    id: "discord",
    name: "Discord",
    category: "collaboration",
    description: "Send webhook notifications and AI executive summaries to Discord server channels.",
    icon: "discord",
    connected: false,
    webhookUrl: "",
  }
]

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<IntegrationConfig[]>(DEFAULT_INTEGRATIONS)
  const [hasToken, setHasToken] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [activeModal, setActiveModal] = useState<IntegrationConfig | null>(null)
  const [formWebhookUrl, setFormWebhookUrl] = useState("")
  const [formApiKey, setFormApiKey] = useState("")
  const [formDomainUrl, setFormDomainUrl] = useState("")
  const [formAutoComment, setFormAutoComment] = useState(true)
  const [formAutoJiraBug, setFormAutoJiraBug] = useState(true)
  const [formMinScore, setFormMinScore] = useState(60)
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    // Sync GitHub token status
    const ghToken = localStorage.getItem("github_token")
    setHasToken(!!ghToken)
    const savedConfigs = localStorage.getItem("impact_iq_integrations")

    if (savedConfigs) {
      try {
        const parsed: IntegrationConfig[] = JSON.parse(savedConfigs)
        setIntegrations(parsed.map(i => i.id === "github" ? { ...i, connected: !!ghToken } : i))
      } catch (err) {
        console.error("Error loading saved integrations:", err)
      }
    } else if (ghToken) {
      setIntegrations(prev => prev.map(i => i.id === "github" ? { ...i, connected: true } : i))
    }
  }, [])

  const handleOpenConfigureModal = (config: IntegrationConfig) => {
    setActiveModal(config)
    setFormWebhookUrl(config.webhookUrl || "")
    setFormApiKey(config.apiKey || "")
    setFormDomainUrl(config.domainUrl || "")
    setFormAutoComment(config.autoCommentPr !== undefined ? config.autoCommentPr : true)
    setFormAutoJiraBug(config.autoCreateJiraBug !== undefined ? config.autoCreateJiraBug : true)
    setFormMinScore(config.minAlertScore || 60)
  }

  const handleSaveIntegration = () => {
    if (!activeModal) return

    const updated = integrations.map(item => {
      if (item.id === activeModal.id) {
        return {
          ...item,
          connected: true,
          webhookUrl: formWebhookUrl,
          apiKey: formApiKey,
          domainUrl: formDomainUrl,
          autoCommentPr: formAutoComment,
          autoCreateJiraBug: formAutoJiraBug,
          minAlertScore: formMinScore
        }
      }
      return item
    })

    setIntegrations(updated)
    localStorage.setItem("impact_iq_integrations", JSON.stringify(updated))
    setActiveModal(null)

    setSaveSuccessMsg(`${activeModal.name} integration configured and connected successfully!`)
    setTimeout(() => setSaveSuccessMsg(null), 4000)
  }

  const handleToggleDisconnect = (id: string) => {
    const updated = integrations.map(item => {
      if (item.id === id) {
        if (id === "github") {
          localStorage.removeItem("github_token")
        }
        return { ...item, connected: false }
      }
      return item
    })

    setIntegrations(updated)
    localStorage.setItem("impact_iq_integrations", JSON.stringify(updated))
  }

  const filteredIntegrations = integrations.filter(item => {
    if (selectedCategory === "all") return true
    return item.category === selectedCategory
  })

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "vcs":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Version Control</span>
      case "collaboration":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">Team Alerts</span>
      case "project_management":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Issue Tracking</span>
      case "container_registry":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">Container Registry</span>
      case "cicd":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">CI/CD Gatekeeper</span>
      default:
        return null
    }
  }

  const renderIcon = (id: string) => {
    switch (id) {
      case "github":
        return <Github className="w-5 h-5 text-slate-800" />
      case "slack":
        return <Slack className="w-5 h-5 text-emerald-600" />
      case "github_bot":
        return <Bot className="w-5 h-5 text-indigo-600" />
      case "jira":
        return <Kanban className="w-5 h-5 text-blue-600" />
      case "linear":
        return <Layers2 className="w-5 h-5 text-purple-600" />
      case "bitbucket":
        return <Workflow className="w-5 h-5 text-sky-600" />
      case "docker_hub":
        return <Container className="w-5 h-5 text-cyan-600" />
      case "ms_teams":
        return <MessageSquare className="w-5 h-5 text-indigo-700" />
      case "discord":
        return <BellRing className="w-5 h-5 text-indigo-500" />
      default:
        return <Layers2 className="w-5 h-5 text-slate-700" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Integrations</h1>
          <p className="text-xs text-slate-500 mt-1">Connect your version control, chat alerts, issue trackers, and container registries.</p>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between text-left animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-emerald-900">{saveSuccessMsg}</p>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/60">
        {[
          { key: "all", label: "All Integrations" },
          { key: "collaboration", label: "Slack & Team Alerts" },
          { key: "project_management", label: "Jira & Linear" },
          { key: "vcs", label: "Git Providers" },
          { key: "cicd", label: "CI/CD & Bots" },
          { key: "container_registry", label: "Docker Registries" },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={cn(
              "px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer",
              selectedCategory === cat.key
                ? "bg-indigo-600 text-white shadow-sm font-bold"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Integrations Grid with Blur for Guest Mode */}
      <div className="relative">
        {!hasToken && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white mx-auto shadow-lg">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white">Integrations Locked in Guest Mode</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Connect your GitHub account to enable real-time PR webhooks, Slack alerts, Jira sync, and CI/CD gatekeeping.
                </p>
              </div>
              <Button
                variant="brand"
                onClick={() => window.location.href = "http://localhost:8000/api/auth/github/login"}
                className="w-full h-11 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Github className="w-4 h-4 fill-white" />
                <span>Connect GitHub to Unlock</span>
              </Button>
            </div>
          </div>
        )}

        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300", !hasToken && "filter blur-md select-none pointer-events-none opacity-50")}>
          {filteredIntegrations.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-100 rounded-xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.02)] flex flex-col justify-between space-y-4 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
                    {renderIcon(item.id)}
                  </div>
                  {getCategoryBadge(item.category)}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.name}</h3>
                    {item.connected && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5 min-h-[36px]">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {item.connected ? (
                  <div className="flex items-center gap-2 w-full justify-between">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenConfigureModal(item)}
                      className="h-8 px-3 text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 rounded-lg"
                    >
                      <Settings2 className="w-3.5 h-3.5 text-slate-500" />
                      Configure
                    </Button>
                    <button
                      onClick={() => handleToggleDisconnect(item.id)}
                      className="text-[11px] font-bold text-rose-500 hover:text-rose-700"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="brand"
                    onClick={() => {
                      if (item.id === "github") {
                        window.location.href = "http://localhost:8000/api/auth/github/login"
                      } else {
                        handleOpenConfigureModal(item)
                      }
                    }}
                    className="w-full h-8 text-xs font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] flex items-center justify-center gap-1.5 rounded-lg shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Connect {item.name}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONFIGURATION MODAL */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-lg overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200 text-left">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
                  {renderIcon(activeModal.id)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Configure {activeModal.name}</h3>
                  <p className="text-[11px] text-slate-500">Set up connection details and event triggers.</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[480px] overflow-y-auto">
              {/* Slack / MS Teams / Discord Webhook URL */}
              {(activeModal.id === "slack" || activeModal.id === "ms_teams" || activeModal.id === "discord") && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Incoming Webhook URL <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="url"
                      value={formWebhookUrl}
                      onChange={(e) => setFormWebhookUrl(e.target.value)}
                      placeholder={`https://hooks.${activeModal.id}.com/services/...`}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-slate-400">Paste the webhook URL from your {activeModal.name} channel setup.</p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Alert Trigger Threshold (Risk Score &gt; {formMinScore}%)
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="90"
                      step="5"
                      value={formMinScore}
                      onChange={(e) => setFormMinScore(Number(e.target.value))}
                      className="w-full cursor-pointer accent-indigo-600"
                    />
                    <p className="text-[10px] text-slate-400">Only send instant chat alerts when PR risk score exceeds {formMinScore}%.</p>
                  </div>
                </>
              )}

              {/* Jira Integration */}
              {activeModal.id === "jira" && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Jira Domain URL <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formDomainUrl}
                      onChange={(e) => setFormDomainUrl(e.target.value)}
                      placeholder="https://your-domain.atlassian.net"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                      Jira API Token / Key <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formApiKey}
                      onChange={(e) => setFormApiKey(e.target.value)}
                      placeholder="Enter Jira API token"
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60 pt-3">
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">Auto-create Jira Bug Tickets</h5>
                      <p className="text-[10px] text-slate-500">Create a Jira bug automatically when a PR contains Critical Security findings.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormAutoJiraBug(!formAutoJiraBug)}
                      className={cn(
                        "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                        formAutoJiraBug ? "bg-indigo-600" : "bg-slate-200"
                      )}
                    >
                      <span className={cn(
                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out",
                        formAutoJiraBug ? "translate-x-4" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                </>
              )}

              {/* Linear / Bitbucket / Docker Registries */}
              {(activeModal.id === "linear" || activeModal.id === "bitbucket" || activeModal.id === "docker_hub") && (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                    API Key / Personal Access Token <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={formApiKey}
                    onChange={(e) => setFormApiKey(e.target.value)}
                    placeholder={`Enter ${activeModal.name} API Key`}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                  <p className="text-[10px] text-slate-400">Used to authenticate and query {activeModal.name} endpoints.</p>
                </div>
              )}

              {/* GitHub PR Bot Toggle */}
              {activeModal.id === "github_bot" && (
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">Auto-Comment AI Report on PRs</h5>
                    <p className="text-[10px] text-slate-500">Automatically post executive summaries & checklists as comments on PRs.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormAutoComment(!formAutoComment)}
                    className={cn(
                      "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                      formAutoComment ? "bg-indigo-600" : "bg-slate-200"
                    )}
                  >
                    <span className={cn(
                      "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 ease-in-out",
                      formAutoComment ? "translate-x-4" : "translate-x-0"
                    )} />
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <Button
                variant="outline"
                onClick={() => setActiveModal(null)}
                className="h-9 px-4 text-xs font-semibold border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                variant="brand"
                onClick={handleSaveIntegration}
                className="h-9 px-5 text-xs font-bold bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg shadow-sm"
              >
                Save &amp; Connect Integration
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

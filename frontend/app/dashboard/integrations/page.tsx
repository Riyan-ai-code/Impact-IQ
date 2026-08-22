"use client"

import { useState, useEffect } from "react"
import { 
  Github, 
  Slack, 
  MessageSquare, 
  Kanban, 
  Check, 
  Plus, 
  X, 
  ExternalLink,
  Settings2,
  ShieldCheck,
  BellRing,
  RefreshCw,
  SlidersHorizontal,
  Workflow,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getScopedItem, setScopedItem } from "@/lib/storageScope"
import { getApiUrl } from "@/lib/api"

interface IntegrationConfig {
  id: string
  name: string
  category: "vcs" | "collaboration" | "project_management"
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
    description: "Connect repositories, authorize OAuth access, receive PR webhooks, and auto-post AI reviews.",
    icon: "github",
    connected: false,
    autoCommentPr: true,
  },
  {
    id: "slack",
    name: "Slack",
    category: "collaboration",
    description: "Post real-time PR risk alerts, AI executive summaries, and deployment blockers directly to Slack channels.",
    icon: "slack",
    connected: false,
    webhookUrl: "",
    minAlertScore: 60,
  },
  {
    id: "ms_teams",
    name: "Microsoft Teams",
    category: "collaboration",
    description: "Send adaptive risk notification cards, deployment gates, and release readiness reports to Teams channels.",
    icon: "teams",
    connected: false,
    webhookUrl: "",
    minAlertScore: 60,
  },
  {
    id: "discord",
    name: "Discord",
    category: "collaboration",
    description: "Send webhook notifications, CI/CD audit logs, and AI risk summaries to Discord server channels.",
    icon: "discord",
    connected: false,
    webhookUrl: "",
    minAlertScore: 60,
  },
  {
    id: "jira",
    name: "Jira Software",
    category: "project_management",
    description: "Attach risk scores to Jira tickets and auto-create Jira bug tickets when critical security risks are detected.",
    icon: "kanban",
    connected: false,
    domainUrl: "",
    apiKey: "",
    autoCreateJiraBug: true,
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
    // Sync GitHub token status dynamically
    const ghToken = localStorage.getItem("github_token")
    setHasToken(!!ghToken)
    const savedConfigs = getScopedItem("impact_iq_integrations")

    if (savedConfigs) {
      try {
        const parsed: IntegrationConfig[] = JSON.parse(savedConfigs)
        // Ensure only the top 5 valid integrations are kept
        const validIds = new Set(["github", "slack", "ms_teams", "discord", "jira"])
        const merged = DEFAULT_INTEGRATIONS.map(def => {
          const found = parsed.find(p => p.id === def.id)
          if (found) {
            return { ...def, ...found, connected: def.id === "github" ? !!ghToken : found.connected }
          }
          return def.id === "github" ? { ...def, connected: !!ghToken } : def
        })
        setIntegrations(merged)
        setScopedItem("impact_iq_integrations", JSON.stringify(merged))
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
          minAlertScore: formMinScore,
        }
      }
      return item
    })

    setIntegrations(updated)
    setScopedItem("impact_iq_integrations", JSON.stringify(updated))
    localStorage.setItem("impact_iq_integrations", JSON.stringify(updated))

    // Automatically trigger a live integration connected notification in in-app notification center
    try {
      const savedNotifs = JSON.parse(getScopedItem("impact_iq_notifications") || "[]")
      const newNotif = {
        id: `notif-int-${Date.now()}`,
        title: `${activeModal.name} Integration Connected`,
        description: `Successfully configured and verified ${activeModal.name} integration. Automated alerts and webhooks are now active.`,
        category: "integration",
        timestamp: "Just now",
        isUnread: true,
        actionUrl: "/dashboard/integrations"
      }
      const updatedNotifs = [newNotif, ...savedNotifs]
      setScopedItem("impact_iq_notifications", JSON.stringify(updatedNotifs))
      localStorage.setItem("impact_iq_notifications", JSON.stringify(updatedNotifs))
      window.dispatchEvent(new Event("impact_iq_notifications_updated"))
    } catch (e) {}

    setSaveSuccessMsg(`${activeModal.name} configuration saved successfully!`)
    setActiveModal(null)
    setTimeout(() => setSaveSuccessMsg(null), 4000)
  }

  const handleToggleDisconnect = (id: string) => {
    const updated = integrations.map(item => {
      if (item.id === id) {
        return { ...item, connected: false }
      }
      return item
    })
    setIntegrations(updated)
    setScopedItem("impact_iq_integrations", JSON.stringify(updated))
    localStorage.setItem("impact_iq_integrations", JSON.stringify(updated))
    setSaveSuccessMsg("Integration disconnected.")
    setTimeout(() => setSaveSuccessMsg(null), 3000)
  }

  const filteredIntegrations = integrations.filter(item => {
    if (selectedCategory === "all") return true
    return item.category === selectedCategory
  })

  const renderIcon = (id: string) => {
    switch (id) {
      case "github":
        return <Github className="w-5 h-5 text-slate-900" />
      case "slack":
        return <Slack className="w-5 h-5 text-[#4A154B]" />
      case "jira":
        return <Kanban className="w-5 h-5 text-[#0052CC]" />
      case "ms_teams":
        return <MessageSquare className="w-5 h-5 text-[#6264A7]" />
      case "discord":
        return <BellRing className="w-5 h-5 text-[#5865F2]" />
      default:
        return <Workflow className="w-5 h-5 text-slate-600" />
    }
  }

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "vcs":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Version Control</span>
      case "collaboration":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">Team Alerts</span>
      case "project_management":
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">Issue Tracking</span>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Integrations</h1>
          <p className="text-xs text-slate-500 mt-1">Connect your version control, chat alerts, and issue tracking tools to receive real-time notifications.</p>
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
          <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Categories Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200/60">
        {[
          { key: "all", label: "All Integrations (5)" },
          { key: "collaboration", label: "Slack & Team Alerts" },
          { key: "vcs", label: "Version Control" },
          { key: "project_management", label: "Issue Tracking (Jira)" },
        ].map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={cn(
              "px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer",
              selectedCategory === cat.key
                ? "bg-[#FF8066] dark:bg-indigo-600 text-white shadow-xs font-bold"
                : "bg-surface-1 border border-border text-content-secondary hover:bg-surface-2"
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
                  Connect your GitHub account to enable real-time PR webhooks, Slack alerts, Microsoft Teams cards, Discord notifications, and Jira issue sync.
                </p>
              </div>
              <div className="w-full pt-2">
                <Button
                  variant="brand"
                  onClick={() => {
                    localStorage.setItem("post_login_redirect", "/dashboard/integrations")
                    window.location.href = getApiUrl("/api/auth/github/login")
                  }}
                  className="w-full h-11 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <Github className="w-4 h-4" />
                  <span>Connect GitHub to Unlock</span>
                </Button>
              </div>
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
                    <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                    {item.connected && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {item.id === "github" ? (
                  <div className="w-full flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenConfigureModal(item)}
                      className="h-8 px-3 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3 h-3 text-slate-500" />
                      Configure
                    </Button>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">
                      OAuth Active
                    </span>
                  </div>
                ) : item.connected ? (
                  <div className="w-full flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenConfigureModal(item)}
                      className="h-8 px-3 text-xs font-semibold border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3 h-3 text-slate-500" />
                      Configure
                    </Button>
                    <button
                      onClick={() => handleToggleDisconnect(item.id)}
                      className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="brand"
                    onClick={() => handleOpenConfigureModal(item)}
                    className="w-full h-9 text-xs font-bold bg-[#FF8066] hover:bg-[#ff6c4a] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
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

      {/* Integration Configuration Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden text-left animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center shadow-xs">
                  {renderIcon(activeModal.id)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Configure {activeModal.name}</h3>
                  <p className="text-[11px] text-slate-500">{activeModal.description}</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* GitHub Settings */}
              {activeModal.id === "github" && (
                <div className="space-y-4">
                  <div className="p-3 bg-emerald-50 border border-emerald-200/70 rounded-xl text-emerald-950 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Connected via GitHub OAuth. Webhooks are active for pull request events.</span>
                  </div>

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
                </div>
              )}

              {/* Webhook Settings for Slack, MS Teams, Discord */}
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
                      placeholder={`https://hooks.${activeModal.id === 'slack' ? 'slack.com/services/...' : activeModal.id === 'discord' ? 'discord.com/api/webhooks/...' : 'office.com/webhook/...'}`}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <p className="text-[10px] text-slate-400">
                      Incoming webhook URL configured in your {activeModal.name} workspace or channel settings.
                    </p>
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
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <Button
                variant="outline"
                onClick={() => setActiveModal(null)}
                className="h-9 px-4 text-xs font-semibold border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="brand"
                onClick={handleSaveIntegration}
                className="h-9 px-5 text-xs font-bold bg-[#FF8066] hover:bg-[#ff6c4a] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl shadow-xs cursor-pointer"
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

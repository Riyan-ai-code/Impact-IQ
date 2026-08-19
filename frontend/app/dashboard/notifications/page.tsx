"use client"

import { useState, useEffect } from "react"
import { 
  Bell, 
  ShieldAlert, 
  UserPlus, 
  Webhook, 
  Check, 
  Trash2, 
  Filter, 
  CheckCircle2, 
  Mail, 
  MessageSquare, 
  SlidersHorizontal, 
  Zap, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  X 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { getScopedItem, setScopedItem, isGuestMode } from "@/lib/storageScope"

interface NotificationItem {
  id: string
  title: string
  description: string
  category: "risk" | "team" | "system" | "integration"
  riskScore?: number
  timestamp: string
  isUnread: boolean
  actionUrl?: string
}

const DEFAULT_GUEST_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-guest-1",
    title: "Guest Workspace Initialized",
    description: "Welcome to ImpactIQ Sandbox. Explore demo microservice risk assessments and PR simulation.",
    category: "system",
    timestamp: "Just now",
    isUnread: true,
    actionUrl: "/dashboard/analysis"
  }
]

const DEFAULT_AUTH_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Critical Risk Detected in PR #42 (payment-service)",
    description: "Automated AI scan flagged a breaking REST API schema change in /api/v1/charge and missing Stripe HMAC signature verification.",
    category: "risk",
    riskScore: 82,
    timestamp: "10 minutes ago",
    isUnread: true,
    actionUrl: "/dashboard/analysis"
  },
  {
    id: "notif-2",
    title: "New Team Member Joined",
    description: "Sarah Jenkins accepted your Nodemailer invitation and joined Platform Engineering as Developer.",
    category: "team",
    timestamp: "1 hour ago",
    isUnread: true,
    actionUrl: "/dashboard/team"
  },
  {
    id: "notif-3",
    title: "Slack Webhook Connection Verified",
    description: "Slack integration for #dev-deployments was successfully tested and is active.",
    category: "integration",
    timestamp: "3 hours ago",
    isUnread: false,
    actionUrl: "/dashboard/integrations"
  }
]

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread" | "risk" | "team">("all")
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [slackAlerts, setSlackAlerts] = useState(true)
  const [githubBotComments, setGithubBotComments] = useState(true)
  const [minRiskThreshold, setMinRiskThreshold] = useState<number>(60)

  // Initial notifications list from scoped storage
  const [notifications, setNotifications] = useState<NotificationItem[]>([])

  const loadNotifications = () => {
    const isGuest = isGuestMode()
    const saved = getScopedItem("impact_iq_notifications") || localStorage.getItem("impact_iq_notifications")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setNotifications(parsed)
          return
        }
      } catch (e) {}
    }

    const initial = isGuest ? DEFAULT_GUEST_NOTIFICATIONS : DEFAULT_AUTH_NOTIFICATIONS
    setNotifications(initial)
    setScopedItem("impact_iq_notifications", JSON.stringify(initial))
    localStorage.setItem("impact_iq_notifications", JSON.stringify(initial))
  }

  useEffect(() => {
    loadNotifications()

    window.addEventListener("impact_iq_notifications_updated", loadNotifications)
    window.addEventListener("storage", loadNotifications)
    return () => {
      window.removeEventListener("impact_iq_notifications_updated", loadNotifications)
      window.removeEventListener("storage", loadNotifications)
    }
  }, [])

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, isUnread: false }))
    setNotifications(updated)
    setScopedItem("impact_iq_notifications", JSON.stringify(updated))
    setSuccessMsg("All notifications marked as read.")
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, isUnread: false } : n)
    setNotifications(updated)
    setScopedItem("impact_iq_notifications", JSON.stringify(updated))
  }

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(n => n.id !== id)
    setNotifications(updated)
    setScopedItem("impact_iq_notifications", JSON.stringify(updated))
  }

  const savePreferences = () => {
    setSuccessMsg("Notification alert preferences updated successfully!")
    setTimeout(() => setSuccessMsg(null), 4000)
  }

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return n.isUnread
    if (filter === "risk") return n.category === "risk"
    if (filter === "team") return n.category === "team"
    return true
  })

  const unreadCount = notifications.filter(n => n.isUnread).length

  return (
    <div className="space-y-8 text-left max-w-6xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-slate-900 leading-tight">Notification &amp; Alert Center</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-bold text-[10px] shadow-xs">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">Manage real-time risk alerts, team invitation updates, and webhook channel notification preferences.</p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              className="h-9 px-3.5 text-xs font-bold border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 text-indigo-600" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xs font-semibold text-emerald-900">{successMsg}</p>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-500 hover:text-emerald-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Left Notifications Feed */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filter Tabs */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl p-1.5">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilter("all")}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer",
                  filter === "all" ? "bg-white text-slate-900 shadow-xs border border-slate-200/60" : "text-slate-500 hover:text-slate-900"
                )}
              >
                All ({notifications.length})
              </button>

              <button
                onClick={() => setFilter("unread")}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer",
                  filter === "unread" ? "bg-white text-slate-900 shadow-xs border border-slate-200/60" : "text-slate-500 hover:text-slate-900"
                )}
              >
                Unread ({unreadCount})
              </button>

              <button
                onClick={() => setFilter("risk")}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer",
                  filter === "risk" ? "bg-white text-slate-900 shadow-xs border border-slate-200/60" : "text-slate-500 hover:text-slate-900"
                )}
              >
                Risk Alerts
              </button>

              <button
                onClick={() => setFilter("team")}
                className={cn(
                  "px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer",
                  filter === "team" ? "bg-white text-slate-900 shadow-xs border border-slate-200/60" : "text-slate-500 hover:text-slate-900"
                )}
              >
                Team
              </button>
            </div>
          </div>

          {/* Notifications Feed Items */}
          {filteredNotifications.length === 0 ? (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">No Notifications Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">You are all caught up! High risk deployment alerts and team updates will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map(item => (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={cn(
                    "p-5 rounded-2xl border transition-all duration-150 relative space-y-2 cursor-pointer group",
                    item.isUnread 
                      ? "bg-indigo-50/30 border-indigo-200/80 shadow-xs" 
                      : "bg-white border-slate-200/80 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      
                      {/* Icon per Category */}
                      {item.category === "risk" && (
                        <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                      )}
                      {item.category === "team" && (
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0">
                          <UserPlus className="w-5 h-5" />
                        </div>
                      )}
                      {item.category === "integration" && (
                        <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                          <Webhook className="w-5 h-5" />
                        </div>
                      )}
                      {item.category === "system" && (
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0">
                          <Zap className="w-5 h-5" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            {item.title}
                          </h4>
                          {item.riskScore && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px]">
                              {item.riskScore}% Risk
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                        <div className="flex items-center gap-2 pt-1 text-[10px] font-semibold text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>{item.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.isUnread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" title="Unread" />
                      )}
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteNotification(item.id); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Settings Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
            
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Alert Preferences</h3>
            </div>

            {/* Threshold Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 block">
                Minimum Risk Alert Threshold
              </label>
              <p className="text-[11px] text-slate-500">Only send instant alerts when PR Risk Score exceeds:</p>
              
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[40, 60, 80].map(threshold => (
                  <button
                    key={threshold}
                    type="button"
                    onClick={() => setMinRiskThreshold(threshold)}
                    className={cn(
                      "py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer",
                      minRiskThreshold === threshold
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    )}
                  >
                    &gt; {threshold}%
                  </button>
                ))}
              </div>
            </div>

            {/* Channel Toggles */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">NOTIFICATION CHANNELS</span>

              {/* Email Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-indigo-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Email Notifications</h4>
                    <p className="text-[10px] text-slate-500">Send Nodemailer HTML summaries</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* Slack Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-sky-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Slack #dev-deployments</h4>
                    <p className="text-[10px] text-slate-500">Instant webhook channel messages</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={slackAlerts}
                  onChange={(e) => setSlackAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>

              {/* GitHub Bot Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-purple-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">GitHub PR Comments</h4>
                    <p className="text-[10px] text-slate-500">Auto-post AI risk reports on PRs</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={githubBotComments}
                  onChange={(e) => setGithubBotComments(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            <Button
              variant="brand"
              onClick={savePreferences}
              className="w-full h-10 text-xs font-bold bg-[#FF8066] hover:bg-[#ff6c4a] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Save Alert Preferences
            </Button>

          </div>
        </div>

      </div>
    </div>
  )
}

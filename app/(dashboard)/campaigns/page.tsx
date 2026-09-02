"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Inbox, LayoutList, MessageSquarePlus, Settings2, Sparkles } from "lucide-react"

import { CampaignBuilder } from "@/components/campaigns/CampaignBuilder"
import { CampaignsTable } from "@/components/campaigns/CampaignsTable"
import { TemplateManager } from "@/components/campaigns/TemplateManager"
import { WhatsAppSettings } from "@/components/campaigns/WhatsAppSettings"
import { useCampaigns } from "@/hooks/use-campaigns"
import { useTemplates } from "@/hooks/use-templates"
import { getInboundMessages, getWhatsAppIntegration } from "@/lib/api/whatsapp"
import { useAuthStore } from "@/lib/store/auth"

type Tab = "campaigns" | "create" | "templates" | "inbox" | "settings"

const tabs: { key: Tab; label: string; icon: typeof LayoutList }[] = [
  { key: "campaigns", label: "Campaigns", icon: LayoutList },
  { key: "create", label: "Create", icon: MessageSquarePlus },
  { key: "templates", label: "Templates", icon: Sparkles },
  { key: "inbox", label: "Inbound", icon: Inbox },
  { key: "settings", label: "Integration", icon: Settings2 },
]

export default function CampaignsPage() {
  const [tab, setTab] = useState<Tab>("campaigns")
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === "admin" || user?.role === "superadmin"
  const campaigns = useCampaigns()
  const templates = useTemplates()
  const integration = useQuery({ queryKey: ["whatsapp-integration"], queryFn: getWhatsAppIntegration, enabled: isAdmin, refetchInterval: 30_000 })
  const inbound = useQuery({ queryKey: ["whatsapp-inbound"], queryFn: getInboundMessages, enabled: isAdmin && tab === "inbox", refetchInterval: 30_000 })

  if (!isAdmin) {
    return <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">WhatsApp campaigns are restricted to administrators.</div>
  }

  return (
    <div className="space-y-6">
      <header className="overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-950 to-indigo-950 p-6 text-white shadow-xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">WhatsApp Cloud API</p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">Messaging workspace</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">Create Meta templates, select opted-in audiences, schedule campaigns, track delivery, and control the integration without Django admin.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${tab === key ? "bg-white text-slate-950 shadow" : "bg-white/10 text-slate-200 hover:bg-white/20"}`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>
      </header>

      {tab === "campaigns" && (campaigns.isLoading ? <Loading /> : <CampaignsTable campaigns={campaigns.data?.results ?? []} />)}
      {tab === "create" && <CampaignBuilder templates={templates.data ?? []} />}
      {tab === "templates" && <TemplateManager templates={templates.data ?? []} loading={templates.isLoading} />}
      {tab === "settings" && (integration.data ? <WhatsAppSettings key={integration.data.updated_at} integration={integration.data} /> : <Loading />)}
      {tab === "inbox" && (
        <div className="space-y-3">
          {inbound.isLoading && <Loading />}
          {!inbound.isLoading && (inbound.data?.length ?? 0) === 0 && <div className="rounded-3xl border border-dashed bg-white p-12 text-center text-sm text-slate-500">No inbound WhatsApp messages have been recorded.</div>}
          {inbound.data?.map((message) => (
            <article key={message.id} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-bold">{message.contact_name || message.phone}</p><time className="text-xs text-slate-400">{new Date(message.received_at).toLocaleString("en-IN")}</time></div>
              <p className="mt-1 text-xs text-slate-500">{message.phone} · {message.message_type}</p>
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{message.text || "Non-text message received"}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

function Loading() { return <div className="rounded-3xl border bg-white p-8 text-sm text-slate-500">Loading WhatsApp workspace...</div> }

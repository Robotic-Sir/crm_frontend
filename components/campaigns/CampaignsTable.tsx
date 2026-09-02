"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CheckCheck, Clock3, Eye, MessageSquareText, Send, Users } from "lucide-react"
import toast from "react-hot-toast"

import { Campaign } from "@/lib/types/campaigns"
import { dispatchCampaign } from "@/lib/api/campaigns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function CampaignsTable({ campaigns }: { campaigns: Campaign[] }) {
  const queryClient = useQueryClient()
  const dispatchMutation = useMutation({
    mutationFn: dispatchCampaign,
    onSuccess: (data) => {
      toast.success(data.detail)
      queryClient.invalidateQueries({ queryKey: ["campaigns"] })
      queryClient.invalidateQueries({ queryKey: ["whatsapp-integration"] })
    },
    onError: (error) => toast.error(apiError(error)),
  })

  if (campaigns.length === 0) {
    return <div className="rounded-3xl border border-dashed bg-white p-12 text-center text-sm text-slate-500">No campaigns yet. Use “Create campaign” to build the first draft.</div>
  }

  return (
    <div className="grid gap-4">
      {campaigns.map((campaign) => {
        const stats = campaign.delivery_stats
        return (
          <article key={campaign.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-bold text-slate-900">{campaign.name}</h3><StatusBadge status={campaign.status} /></div>
                <p className="mt-1 text-sm text-slate-500">{campaign.template_name} · {campaign.campaign_type} · created {new Date(campaign.created_at).toLocaleDateString("en-IN")}</p>
              </div>
              {campaign.status === "draft" && (
                <Button onClick={() => dispatchMutation.mutate(campaign.id)} disabled={dispatchMutation.isPending}>
                  <Send className="h-4 w-4" />{campaign.scheduled_at ? "Confirm schedule" : "Send campaign"}
                </Button>
              )}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
              <Stat icon={Users} label="Audience" value={campaign.lead_count} />
              <Stat icon={Clock3} label="Queued" value={stats?.queued ?? 0} />
              <Stat icon={Send} label="Sent" value={stats?.sent ?? 0} />
              <Stat icon={CheckCheck} label="Delivered" value={stats?.delivered ?? 0} />
              <Stat icon={Eye} label="Read" value={stats?.read ?? 0} />
              <Stat icon={MessageSquareText} label="Failed" value={stats?.failed ?? 0} danger={(stats?.failed ?? 0) > 0} />
            </div>
          </article>
        )
      })}
    </div>
  )
}

function Stat({ icon: Icon, label, value, danger = false }: { icon: typeof Users; label: string; value: number; danger?: boolean }) { return <div className={`rounded-2xl p-3 ${danger ? "bg-red-50 text-red-700" : "bg-slate-50 text-slate-700"}`}><Icon className="h-4 w-4 opacity-60" /><p className="mt-2 text-xl font-black">{value}</p><p className="text-[11px] font-semibold uppercase tracking-wide opacity-60">{label}</p></div> }
function StatusBadge({ status }: { status: Campaign["status"] }) { const classes = status === "done" ? "bg-emerald-100 text-emerald-700" : status === "running" ? "bg-blue-100 text-blue-700" : status === "failed" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"; return <Badge className={classes}>{status}</Badge> }
function apiError(error: unknown) { const candidate = error as { response?: { data?: { detail?: string } } }; return candidate.response?.data?.detail || "Campaign dispatch failed" }

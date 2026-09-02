"use client"

import { FormEvent, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Activity, KeyRound, Link2, MessageSquareText, ShieldCheck } from "lucide-react"
import toast from "react-hot-toast"

import { runWhatsAppConnection, updateWhatsAppIntegration } from "@/lib/api/whatsapp"
import { WhatsAppIntegration } from "@/lib/types/template"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function WhatsAppSettings({ integration }: { integration: WhatsAppIntegration }) {
  const queryClient = useQueryClient()
  const [settings, setSettings] = useState({
    is_enabled: integration.is_enabled,
    daily_limit: integration.daily_limit,
    messages_per_second: integration.messages_per_second,
  })
  const saveMutation = useMutation({
    mutationFn: updateWhatsAppIntegration,
    onSuccess: () => {
      toast.success("WhatsApp settings saved")
      queryClient.invalidateQueries({ queryKey: ["whatsapp-integration"] })
    },
    onError: () => toast.error("Could not save settings"),
  })
  const connectionMutation = useMutation({
    mutationFn: runWhatsAppConnection,
    onSuccess: (data) => toast.success(data.operation === "subscribe" ? "App subscribed to WABA" : "Meta connection is working"),
    onError: (error) => toast.error(apiError(error)),
  })
  const submit = (event: FormEvent) => { event.preventDefault(); saveMutation.mutate(settings) }
  const ready = integration.provider.status === "ready"

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Activity} label="Service" value={ready ? "Ready" : "Unavailable"} tone={ready ? "emerald" : "red"} />
        <Metric icon={MessageSquareText} label="Sent/queued today" value={`${integration.used_today} / ${integration.daily_limit}`} tone="indigo" />
        <Metric icon={ShieldCheck} label="Remaining today" value={String(integration.remaining_today)} tone="emerald" />
        <Metric icon={MessageSquareText} label="Inbound today" value={String(integration.inbound_today)} tone="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={submit} className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Sending controls</h2>
          <p className="mt-1 text-sm text-slate-500">These controls are editable in CRM. Provider secrets remain on the server.</p>
          <label className="mt-6 flex items-center justify-between rounded-2xl border p-4">
            <span><span className="block font-semibold">Enable WhatsApp sending</span><span className="text-sm text-slate-500">Disable immediately to stop new campaign dispatches.</span></span>
            <input type="checkbox" checked={settings.is_enabled} onChange={(event) => setSettings({ ...settings, is_enabled: event.target.checked })} className="h-5 w-5 accent-emerald-600" />
          </label>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Daily safety limit</Label><Input type="number" min={1} max={1000} value={settings.daily_limit} onChange={(event) => setSettings({ ...settings, daily_limit: Number(event.target.value) })} /><p className="text-xs text-slate-400">Maximum 1,000</p></div>
            <div className="space-y-2"><Label>Messages per second</Label><Input type="number" min={1} max={20} value={settings.messages_per_second} onChange={(event) => setSettings({ ...settings, messages_per_second: Number(event.target.value) })} /><p className="text-xs text-slate-400">Maximum 20</p></div>
          </div>
          <Button type="submit" className="mt-6" disabled={saveMutation.isPending}>{saveMutation.isPending ? "Saving..." : "Save sending controls"}</Button>
        </form>

        <section className="rounded-3xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Meta connection</h2>
          <div className="mt-5 space-y-3 text-sm">
            <ConfigRow label="Graph API" value={integration.provider.graph_api_version || "Missing"} />
            <ConfigRow label="Phone Number ID" value={integration.provider.phone_number_id_suffix ? `••••${integration.provider.phone_number_id_suffix}` : "Missing"} />
            <ConfigRow label="WABA ID" value={integration.provider.waba_id_suffix ? `••••${integration.provider.waba_id_suffix}` : "Missing"} />
            <ConfigRow label="Access token" value={integration.provider.access_token_configured ? "Configured" : "Missing"} />
            <ConfigRow label="App secret" value={integration.provider.app_secret_configured ? "Configured" : "Missing"} />
          </div>
          <div className="mt-5 rounded-2xl bg-slate-950 p-4 text-sm text-slate-200">
            <p className="flex items-center gap-2 font-semibold text-white"><Link2 className="h-4 w-4 text-emerald-400" />Webhook callback URL</p>
            <p className="mt-2 break-all font-mono text-xs text-emerald-300">{integration.provider.webhook_url || "Configure PUBLIC_WEBHOOK_URL"}</p>
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" onClick={() => connectionMutation.mutate("test")} disabled={connectionMutation.isPending}><Activity className="h-4 w-4" /> Test connection</Button>
            <Button type="button" variant="outline" onClick={() => connectionMutation.mutate("subscribe")} disabled={connectionMutation.isPending}><Link2 className="h-4 w-4" /> Subscribe app to WABA</Button>
          </div>
        </section>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <p className="flex items-center gap-2 font-bold"><KeyRound className="h-4 w-4" />Secrets are intentionally excluded from this page</p>
        <p className="mt-1">Set the rotated System User token, Meta App Secret, WABA ID, Phone Number ID, API version, and webhook verify token in the server&apos;s <code>automation/.env</code>. They are never returned to the browser.</p>
      </div>
    </div>
  )
}

function ConfigRow({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"><span className="text-slate-500">{label}</span><span className="font-semibold text-slate-800">{value}</span></div> }
function Metric({ icon: Icon, label, value, tone }: { icon: typeof Activity; label: string; value: string; tone: string }) { const colors: Record<string, string> = { emerald: "bg-emerald-50 text-emerald-700", indigo: "bg-indigo-50 text-indigo-700", violet: "bg-violet-50 text-violet-700", red: "bg-red-50 text-red-700" }; return <div className="rounded-2xl border bg-white p-5 shadow-sm"><div className={`inline-flex rounded-xl p-2 ${colors[tone]}`}><Icon className="h-5 w-5" /></div><p className="mt-4 text-2xl font-black text-slate-900">{value}</p><p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p></div> }
function apiError(error: unknown) { const candidate = error as { response?: { data?: { detail?: string } } }; return candidate.response?.data?.detail || "Meta connection request failed" }

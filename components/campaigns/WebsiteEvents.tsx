import Link from "next/link"
import { ExternalLink, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WebsiteLeadEvent } from "@/lib/types/template"

export function WebsiteEvents({ events }: { events: WebsiteLeadEvent[] }) {
  if (events.length === 0) {
    return <div className="rounded-3xl border border-dashed bg-white p-12 text-center text-sm text-slate-500">No website events received yet.</div>
  }
  return (
    <div className="space-y-3">
      {events.map((event) => {
        const fields = safeEventFields(event.payload)
        const sourceUrl = validRoboticSirUrl(event.payload.source_url)
        return (
        <article key={event.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-bold text-slate-900">{event.name || event.email || "Website visitor"}</p>
              <p className="mt-1 break-all text-xs text-slate-500">{event.phone || "No phone"}{event.email ? ` · ${event.email}` : ""}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{event.event_type_display || event.event_type.replaceAll("_", " ")}</Badge>
              <Badge className={actionClass(event.action_status)}>Action: {event.action_status.replaceAll("_", " ")}</Badge>
              <Badge className={statusClass(event.notification_status)}>Alert: {event.notification_status}</Badge>
            </div>
          </div>
          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm font-medium text-amber-900">
            Required action: {event.required_action}
          </p>
          <div className="mt-4 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
            <span>Event ID: <span className="font-mono">{event.event_id}</span></span>
            <time className="sm:text-right">{new Date(event.received_at).toLocaleString("en-IN")}</time>
          </div>
          {event.notification_error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{event.notification_error}</p>}
          <div className="mt-4 flex flex-wrap gap-2">
            {event.lead !== null && (
              <Button asChild size="sm">
                <Link href={`/leads/${event.lead}`}><UserRound className="h-4 w-4" /> Open lead</Link>
              </Button>
            )}
            {sourceUrl && (
              <Button asChild size="sm" variant="outline">
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /> Open source</a>
              </Button>
            )}
          </div>
          </div>
          <details className="group border-t bg-slate-50/70">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-700 marker:hidden sm:px-5">
              <span className="inline-flex items-center gap-2"><span className="text-slate-400 transition group-open:rotate-90">›</span> View captured details ({fields.length})</span>
            </summary>
            <div className="grid gap-x-8 gap-y-3 border-t px-4 py-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-3">
              {fields.map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-700">{value}</p>
                </div>
              ))}
              {fields.length === 0 && <p className="text-sm text-slate-500">No additional safe details were provided.</p>}
            </div>
          </details>
        </article>
      )})}
    </div>
  )
}

const forbiddenMarkers = ["password", "secret", "token", "otp", "cvv", "cvc", "cardnumber"]

function safeEventFields(payload: Record<string, unknown>): Array<[string, string]> {
  const output: Array<[string, string]> = []
  const add = (path: string[], value: unknown) => {
    if (path.some(isForbiddenKey)) return
    if (Array.isArray(value)) {
      const scalars = value.filter((item) => ["string", "number", "boolean"].includes(typeof item) && String(item).trim())
      if (scalars.length) output.push([labelFor(path), scalars.map(String).join(", ").slice(0, 2000)])
      value.forEach((item, index) => {
        if (item && typeof item === "object") add([...path, String(index + 1)], item)
      })
      return
    }
    if (value && typeof value === "object") {
      Object.entries(value as Record<string, unknown>)
        .sort(([left], [right]) => left.localeCompare(right))
        .forEach(([key, item]) => add([...path, key], item))
      return
    }
    if (value !== null && value !== undefined && value !== "") {
      output.push([labelFor(path), String(value).slice(0, 2000)])
    }
  }

  for (const key of ["schema_version", "source", "reference_id", "occurred_at", "contact", "details"] as const) {
    if (key in payload) add([key], payload[key])
  }
  return output
}

function isForbiddenKey(value: string) {
  const normalized = value.toLowerCase().replace(/[^a-z0-9]/g, "")
  return forbiddenMarkers.some((marker) => normalized.includes(marker))
}

function labelFor(path: string[]) {
  return path.map((item) => item.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())).join(" · ")
}

function validRoboticSirUrl(value: unknown) {
  if (typeof value !== "string") return null
  try {
    const url = new URL(value)
    const host = url.hostname.toLowerCase()
    return url.protocol === "https:" && (host === "roboticsir.com" || host.endsWith(".roboticsir.com")) ? url.toString() : null
  } catch {
    return null
  }
}

function statusClass(status: WebsiteLeadEvent["notification_status"]) {
  if (["sent", "delivered", "read"].includes(status)) return "bg-emerald-100 text-emerald-700"
  if (status === "failed") return "bg-red-100 text-red-700"
  return "bg-amber-100 text-amber-700"
}

function actionClass(status: WebsiteLeadEvent["action_status"]) {
  if (status === "completed") return "bg-emerald-100 text-emerald-700"
  if (status === "dismissed") return "bg-slate-100 text-slate-600"
  if (status === "in_progress") return "bg-blue-100 text-blue-700"
  return "bg-amber-100 text-amber-700"
}

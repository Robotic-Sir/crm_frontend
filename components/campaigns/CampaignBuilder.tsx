"use client"

import { FormEvent, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Send, Users } from "lucide-react"
import toast from "react-hot-toast"

import { createCampaign, previewAudience } from "@/lib/api/campaigns"
import { CampaignInput } from "@/lib/types/campaigns"
import { WATemplate } from "@/lib/types/template"
import { useLeadFilterOptions } from "@/hooks/use-leads"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const leadStatuses = ["new", "contacted", "interested", "qualified", "converted", "lost"]

export function CampaignBuilder({ templates }: { templates: WATemplate[] }) {
  const queryClient = useQueryClient()
  const { data: filterOptions } = useLeadFilterOptions()
  const approvedTemplates = templates.filter(
    (template) => template.status === "APPROVED" && template.is_active
  )
  const [form, setForm] = useState<CampaignInput>({
    name: "",
    campaign_type: "custom",
    template: approvedTemplates[0]?.id ?? 0,
    audience_filters: {},
    scheduled_at: null,
  })
  const [audienceCount, setAudienceCount] = useState<number | null>(null)

  const previewMutation = useMutation({
    mutationFn: () => previewAudience(form.audience_filters),
    onSuccess: setAudienceCount,
    onError: () => toast.error("Could not calculate the audience"),
  })
  const createMutation = useMutation({
    mutationFn: createCampaign,
    onSuccess: () => {
      toast.success("Campaign draft created")
      queryClient.invalidateQueries({ queryKey: ["campaigns"] })
      setForm((current) => ({ ...current, name: "", scheduled_at: null }))
      setAudienceCount(null)
    },
    onError: (error) => toast.error(apiError(error)),
  })

  const setFilter = (key: string, value: string) => {
    setAudienceCount(null)
    setForm((current) => ({
      ...current,
      audience_filters: {
        ...current.audience_filters,
        [key]: value === "all" ? "" : value,
      },
    }))
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.template) return toast.error("Create or sync an approved template first")
    createMutation.mutate(form)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-900">Create campaign</h2>
          <p className="mt-1 text-sm text-slate-500">Build a draft using only leads with recorded WhatsApp consent.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Campaign name">
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="September admission follow-up" required />
          </Field>
          <Field label="Campaign type">
            <Select value={form.campaign_type} onValueChange={(value) => setForm({ ...form, campaign_type: value as CampaignInput["campaign_type"] })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="admission">Admission</SelectItem>
                <SelectItem value="demo">Demo</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Approved Meta template">
              <Select value={form.template ? String(form.template) : undefined} onValueChange={(value) => setForm({ ...form, template: Number(value) })}>
                <SelectTrigger><SelectValue placeholder="Select approved template" /></SelectTrigger>
                <SelectContent>
                  {approvedTemplates.map((template) => (
                    <SelectItem key={template.id} value={String(template.id)}>{template.display_name} · {template.language}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
          <Field label="Lead status">
            <FilterSelect value={form.audience_filters.status || "all"} values={leadStatuses} onChange={(value) => setFilter("status", value)} />
          </Field>
          <Field label="Location">
            <FilterSelect value={form.audience_filters.city || "all"} values={filterOptions?.cities ?? []} onChange={(value) => setFilter("city", value)} />
          </Field>
          <Field label="Course">
            <FilterSelect value={form.audience_filters.course || "all"} values={filterOptions?.courses ?? []} onChange={(value) => setFilter("course", value)} />
          </Field>
          <Field label="Schedule (optional)">
            <Input type="datetime-local" value={form.scheduled_at ? toLocalInput(form.scheduled_at) : ""} onChange={(event) => setForm({ ...form, scheduled_at: event.target.value ? new Date(event.target.value).toISOString() : null })} />
          </Field>
        </div>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => previewMutation.mutate()} disabled={previewMutation.isPending}>
            <Users className="h-4 w-4" /> {previewMutation.isPending ? "Calculating..." : "Preview audience"}
          </Button>
          <Button type="submit" disabled={createMutation.isPending || approvedTemplates.length === 0}>
            <Send className="h-4 w-4" /> {createMutation.isPending ? "Creating..." : "Create draft"}
          </Button>
        </div>
      </div>

      <aside className="rounded-3xl bg-gradient-to-br from-emerald-950 to-slate-950 p-6 text-white shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Audience safety</p>
        <p className="mt-5 text-5xl font-black">{audienceCount ?? "—"}</p>
        <p className="mt-2 text-sm text-emerald-100/70">eligible opted-in leads</p>
        <div className="mt-8 space-y-3 text-sm text-slate-300">
          <p>✓ Consent is enforced by the backend.</p>
          <p>✓ Only Meta-approved templates can be sent.</p>
          <p>✓ The 1,000-message daily limit is checked again during dispatch.</p>
        </div>
      </aside>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label>{label}</Label>{children}</div>
}

function FilterSelect({ value, values, onChange }: { value: string; values: string[]; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All opted-in leads</SelectItem>
        {values.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

function toLocalInput(value: string) {
  const date = new Date(value)
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 16)
}

function apiError(error: unknown) {
  const candidate = error as { response?: { data?: { detail?: string | Record<string, string[]> } } }
  const detail = candidate.response?.data?.detail
  if (typeof detail === "string") return detail
  return "Could not create the campaign"
}

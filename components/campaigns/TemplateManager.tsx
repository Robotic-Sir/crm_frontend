"use client"

import { FormEvent, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CheckCircle2, CloudDownload, FilePlus2, PencilLine } from "lucide-react"
import toast from "react-hot-toast"

import { createTemplate, syncTemplates, updateTemplate } from "@/lib/api/templates"
import { WATemplate, WATemplateInput } from "@/lib/types/template"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const leadFields = ["name", "phone", "email", "course", "city", "status", "source"]
const initialTemplate: WATemplateInput = {
  name: "",
  display_name: "",
  category: "MARKETING",
  language: "en_US",
  body_text: "Hello {{1}},\n\nWe have an update for you from Robotic Sir.",
  footer_text: "Reply STOP to opt out",
  variables: ["name"],
  variable_examples: ["Adarsh"],
  is_active: true,
}

export function TemplateManager({ templates, loading }: { templates: WATemplate[]; loading: boolean }) {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<WATemplateInput>(initialTemplate)
  const createMutation = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      toast.success("Template submitted to Meta")
      queryClient.invalidateQueries({ queryKey: ["templates"] })
      setForm(initialTemplate)
    },
    onError: (error) => toast.error(apiError(error)),
  })
  const syncMutation = useMutation({
    mutationFn: syncTemplates,
    onSuccess: (data) => {
      toast.success(data.detail)
      queryClient.invalidateQueries({ queryKey: ["templates"] })
    },
    onError: (error) => toast.error(apiError(error)),
  })

  const changeBody = (body_text: string) => {
    const count = placeholderCount(body_text)
    setForm((current) => ({
      ...current,
      body_text,
      variables: Array.from({ length: count }, (_, index) => current.variables[index] || "name"),
      variable_examples: Array.from({ length: count }, (_, index) => current.variable_examples[index] || "Example"),
    }))
  }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    createMutation.mutate(form)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">WhatsApp templates</h2>
          <p className="text-sm text-slate-500">Create templates here and sync their approval state from Meta.</p>
        </div>
        <Button variant="outline" onClick={() => syncMutation.mutate()} disabled={syncMutation.isPending}>
          <CloudDownload className="h-4 w-4" /> {syncMutation.isPending ? "Syncing..." : "Sync from Meta"}
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form onSubmit={submit} className="space-y-4 rounded-3xl border bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3"><FilePlus2 className="h-5 w-5 text-indigo-600" /><h3 className="font-bold">Submit a new template</h3></div>
          <Field label="Internal display name"><Input value={form.display_name} onChange={(event) => setForm({ ...form, display_name: event.target.value })} placeholder="Admission follow-up" required /></Field>
          <Field label="Meta template name"><Input value={form.name} onChange={(event) => setForm({ ...form, name: normalizeName(event.target.value) })} placeholder="admission_follow_up" required /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <Select value={form.category} onValueChange={(value) => setForm({ ...form, category: value as WATemplateInput["category"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="MARKETING">Marketing</SelectItem><SelectItem value="UTILITY">Utility</SelectItem></SelectContent>
              </Select>
            </Field>
            <Field label="Language"><Input value={form.language} onChange={(event) => setForm({ ...form, language: event.target.value })} /></Field>
          </div>
          <Field label="Message content">
            <Textarea value={form.body_text} onChange={(event) => changeBody(event.target.value)} className="min-h-36" maxLength={1024} />
            <p className="text-xs text-slate-400">Use sequential placeholders: {"{{1}}"}, {"{{2}}"}, etc.</p>
          </Field>
          {form.variables.map((variable, index) => (
            <div key={index} className="grid grid-cols-[1fr_1fr] gap-3 rounded-xl bg-slate-50 p-3">
              <Field label={`{{${index + 1}}} lead field`}>
                <Select value={variable} onValueChange={(value) => setForm({ ...form, variables: replaceAt(form.variables, index, value) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{leadFields.map((field) => <SelectItem key={field} value={field}>{field}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Meta example"><Input value={form.variable_examples[index]} onChange={(event) => setForm({ ...form, variable_examples: replaceAt(form.variable_examples, index, event.target.value) })} required /></Field>
            </div>
          ))}
          <Field label="Footer"><Input value={form.footer_text} onChange={(event) => setForm({ ...form, footer_text: event.target.value })} maxLength={60} /></Field>
          <Button type="submit" className="w-full" disabled={createMutation.isPending}>{createMutation.isPending ? "Submitting..." : "Submit to Meta"}</Button>
        </form>

        <div className="space-y-3">
          {loading && <div className="rounded-2xl border bg-white p-8 text-sm text-slate-500">Loading templates...</div>}
          {!loading && templates.length === 0 && <div className="rounded-2xl border border-dashed bg-white p-10 text-center text-sm text-slate-500">No templates yet. Create one or sync from Meta.</div>}
          {templates.map((template) => <TemplateCard key={template.id} template={template} />)}
        </div>
      </div>
    </div>
  )
}

function TemplateCard({ template }: { template: WATemplate }) {
  const queryClient = useQueryClient()
  const [variables, setVariables] = useState(template.variables)
  const [examples, setExamples] = useState(template.variable_examples)
  const count = placeholderCount(template.body_text)
  const updateMutation = useMutation({
    mutationFn: () => updateTemplate(template.id, {
      variables: Array.from({ length: count }, (_, index) => variables[index] || "name"),
      variable_examples: Array.from({ length: count }, (_, index) => examples[index] || "Example"),
    }),
    onSuccess: () => {
      toast.success("Variable mapping saved")
      queryClient.invalidateQueries({ queryKey: ["templates"] })
    },
    onError: (error) => toast.error(apiError(error)),
  })
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h3 className="font-bold text-slate-900">{template.display_name}</h3><p className="mt-1 font-mono text-xs text-slate-400">{template.name} · {template.language}</p></div>
        <div className="flex items-center gap-2"><Badge variant="secondary">{template.category}</Badge><StatusBadge status={template.status} /></div>
      </div>
      <div className="mt-4 whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{template.body_text}</div>
      {template.rejection_reason && <p className="mt-3 text-sm text-red-600">{template.rejection_reason}</p>}
      <div className="mt-4 flex justify-end">
        <Dialog>
          <DialogTrigger asChild><Button variant="outline" size="sm"><PencilLine className="h-4 w-4" /> Variable mapping</Button></DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Map template variables</DialogTitle><DialogDescription>Choose which lead value replaces each positional Meta placeholder.</DialogDescription></DialogHeader>
            <div className="space-y-3">
              {Array.from({ length: count }, (_, index) => (
                <div key={index} className="grid grid-cols-2 gap-3">
                  <Field label={`{{${index + 1}}} field`}><Select value={variables[index] || "name"} onValueChange={(value) => setVariables(replaceAt(variables, index, value))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{leadFields.map((field) => <SelectItem key={field} value={field}>{field}</SelectItem>)}</SelectContent></Select></Field>
                  <Field label="Example"><Input value={examples[index] || ""} onChange={(event) => setExamples(replaceAt(examples, index, event.target.value))} /></Field>
                </div>
              ))}
              {count === 0 && <p className="text-sm text-slate-500">This template has no variables.</p>}
            </div>
            <DialogFooter><Button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}>{updateMutation.isPending ? "Saving..." : "Save mapping"}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </article>
  )
}

function StatusBadge({ status }: { status: WATemplate["status"] }) {
  const approved = status === "APPROVED"
  return <Badge className={approved ? "bg-emerald-100 text-emerald-700" : status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}>{approved && <CheckCircle2 className="mr-1 h-3 w-3" />}{status}</Badge>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><Label>{label}</Label>{children}</div> }
function normalizeName(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "") }
function placeholderCount(value: string) { return Math.max(0, ...Array.from(value.matchAll(/{{\s*(\d+)\s*}}/g), (match) => Number(match[1]))) }
function replaceAt(values: string[], index: number, value: string) { const next = [...values]; next[index] = value; return next }
function apiError(error: unknown) { const candidate = error as { response?: { data?: { detail?: string | { message?: string } } } }; const detail = candidate.response?.data?.detail; return typeof detail === "string" ? detail : detail?.message || "WhatsApp template request failed" }

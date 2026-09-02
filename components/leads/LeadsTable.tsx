"use client"

import { useState } from "react"
import Link from "next/link"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import {
  CalendarDays,
  GraduationCap,
  Inbox,
  MapPin,
  MessageCircle,
  PencilLine,
  Phone,
  UserRound,
} from "lucide-react"

import { Lead } from "@/lib/types/lead"
import { User } from "@/lib/types/user"
import { CONTACT_STATUSES, LEAD_STATUSES } from "@/lib/constants/leads"
import { getCounsellors, updateLead } from "@/lib/api/leads"
import { useAuthStore } from "@/lib/store/auth"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

interface LeadsTableProps {
  leads: Lead[]
}

export default function LeadsTable({ leads }: LeadsTableProps) {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === "admin" || user?.role === "superadmin"
  const { data: counsellors = [] } = useQuery({
    queryKey: ["counsellors"],
    queryFn: getCounsellors,
    enabled: isAdmin,
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Lead> }) =>
      updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] })
      queryClient.invalidateQueries({ queryKey: ["reminder-summary"] })
      toast.success("Lead updated")
    },
    onError: () => toast.error("Could not update this lead"),
  })

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed bg-white px-6 py-20 text-center shadow-sm">
        <div className="rounded-2xl bg-indigo-50 p-4"><Inbox size={28} className="text-indigo-600" /></div>
        <h3 className="mt-4 text-lg font-semibold">No leads match this view</h3>
        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Try clearing a filter or add a new lead to start your follow-up queue.
        </p>
      </div>
    )
  }

  const update = (id: number, data: Partial<Lead>) => updateMutation.mutate({ id, data })
  const updateRemark = (id: number, notes: string, onSaved: () => void) => {
    updateMutation.mutate(
      { id, data: { notes } },
      { onSuccess: onSaved }
    )
  }

  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/90">
              <TableRow>
                <TableHead className="min-w-56">Lead</TableHead>
                <TableHead className="min-w-44">Course & location</TableHead>
                <TableHead className="min-w-64">Remark</TableHead>
                <TableHead className="min-w-44">Contacted</TableHead>
                <TableHead className="min-w-44">Lead stage</TableHead>
                <TableHead className="min-w-40">WhatsApp consent</TableHead>
                <TableHead className="min-w-44">Owner</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Quick actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="group hover:bg-indigo-50/30">
                  <TableCell>
                    <LeadIdentity lead={lead} />
                  </TableCell>
                  <TableCell>
                    <CourseLocation lead={lead} />
                  </TableCell>
                  <TableCell>
                    <RemarkEditor
                      lead={lead}
                      canEdit={isAdmin}
                      isSaving={updateMutation.isPending}
                      onSave={updateRemark}
                    />
                  </TableCell>
                  <TableCell>
                    <ContactSelect lead={lead} onUpdate={update} />
                  </TableCell>
                  <TableCell>
                    <StatusSelect lead={lead} onUpdate={update} />
                  </TableCell>
                  <TableCell>
                    <ConsentSelect lead={lead} canEdit={isAdmin} onUpdate={update} />
                  </TableCell>
                  <TableCell>
                    {isAdmin ? (
                      <AssigneeSelect lead={lead} counsellors={counsellors} onUpdate={update} />
                    ) : (
                      <span className="text-sm text-slate-600">{lead.assigned_to_name || "Unassigned"}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {formatDate(lead.created_at)}
                  </TableCell>
                  <TableCell>
                    <QuickActions lead={lead} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="grid gap-3 md:hidden">
        {leads.map((lead) => (
          <article key={lead.id} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <LeadIdentity lead={lead} />
              <QuickActions lead={lead} compact />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-y border-slate-100 py-3">
              <CourseLocation lead={lead} />
              <div className="space-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1"><UserRound className="h-3.5 w-3.5" /> Owner</span>
                <p className="truncate text-sm font-medium text-slate-700">{lead.assigned_to_name || "Unassigned"}</p>
              </div>
            </div>
            <div className="border-b border-slate-100 py-3">
              <p className="mb-1 text-xs font-medium text-slate-500">Remark</p>
              <RemarkEditor
                lead={lead}
                canEdit={isAdmin}
                isSaving={updateMutation.isPending}
                onSave={updateRemark}
              />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-medium text-slate-500">Contact status</p>
                <ContactSelect lead={lead} onUpdate={update} />
              </div>
              <div>
                <p className="mb-1 text-xs font-medium text-slate-500">Lead stage</p>
                <StatusSelect lead={lead} onUpdate={update} />
              </div>
              <div className="sm:col-span-2">
                <p className="mb-1 text-xs font-medium text-slate-500">WhatsApp consent</p>
                <ConsentSelect lead={lead} canEdit={isAdmin} onUpdate={update} />
              </div>
              {isAdmin && (
                <div className="sm:col-span-2">
                  <p className="mb-1 text-xs font-medium text-slate-500">Assign to</p>
                  <AssigneeSelect lead={lead} counsellors={counsellors} onUpdate={update} />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function LeadIdentity({ lead }: { lead: Lead }) {
  return (
    <div className="min-w-0">
      <Link href={`/leads/${lead.id}`} className="font-semibold text-slate-900 hover:text-indigo-700 hover:underline">
        {lead.name}
      </Link>
      <a href={`tel:${lead.phone}`} className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-700">
        <Phone className="h-3.5 w-3.5" /> {lead.phone}
      </a>
    </div>
  )
}

function CourseLocation({ lead }: { lead: Lead }) {
  return (
    <div className="space-y-1 text-sm">
      <p className="flex items-center gap-1.5 font-medium text-slate-700"><GraduationCap className="h-3.5 w-3.5 text-slate-400" />{lead.course || "No course"}</p>
      <p className="flex items-center gap-1.5 text-slate-500"><MapPin className="h-3.5 w-3.5" />{lead.city || "No location"}</p>
    </div>
  )
}

function RemarkEditor({
  lead,
  canEdit,
  isSaving,
  onSave,
}: {
  lead: Lead
  canEdit: boolean
  isSaving: boolean
  onSave: (id: number, notes: string, onSaved: () => void) => void
}) {
  const [open, setOpen] = useState(false)
  const [remark, setRemark] = useState(lead.notes || "")

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen)
    if (nextOpen) setRemark(lead.notes || "")
  }

  const content = lead.notes ? (
    <p className="line-clamp-3 whitespace-pre-wrap text-sm leading-5 text-slate-600">
      {lead.notes}
    </p>
  ) : (
    <p className="text-sm italic text-slate-400">No remark added</p>
  )

  if (!canEdit) return content

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group/remark flex w-full items-start justify-between gap-2 rounded-xl border border-transparent p-2 text-left transition hover:border-indigo-100 hover:bg-indigo-50/60"
          aria-label={`${lead.notes ? "Edit" : "Add"} remark for ${lead.name}`}
        >
          <div className="min-w-0 flex-1">{content}</div>
          <PencilLine className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 group-hover/remark:text-indigo-600" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{lead.notes ? "Edit remark" : "Add remark"}</DialogTitle>
          <DialogDescription>
            Update the lead-level remark for {lead.name}. It will be visible directly in the leads list.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={remark}
          onChange={(event) => setRemark(event.target.value)}
          placeholder="Enter follow-up context or a lead remark..."
          className="min-h-32 resize-y"
          maxLength={5000}
          autoFocus
        />
        <div className="text-right text-xs text-slate-400">{remark.length}/5000</div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(lead.id, remark.trim(), () => setOpen(false))}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save remark"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ContactSelect({ lead, onUpdate }: { lead: Lead; onUpdate: (id: number, data: Partial<Lead>) => void }) {
  return (
    <div>
      <Select value={lead.contact_status} onValueChange={(value) => onUpdate(lead.id, { contact_status: value as Lead["contact_status"] })}>
        <SelectTrigger className="h-9 w-full rounded-xl bg-white"><SelectValue /></SelectTrigger>
        <SelectContent>
          {CONTACT_STATUSES.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}
        </SelectContent>
      </Select>
      <p className="mt-1 text-xs text-slate-400">
        {lead.last_contacted_at ? formatDate(lead.last_contacted_at) : "No contact logged"}
      </p>
    </div>
  )
}

function ConsentSelect({ lead, canEdit, onUpdate }: { lead: Lead; canEdit: boolean; onUpdate: (id: number, data: Partial<Lead>) => void }) {
  if (!canEdit) {
    return <span className={`text-sm font-medium ${lead.whatsapp_opt_in ? "text-emerald-700" : "text-slate-400"}`}>{lead.whatsapp_opt_in ? "Opted in" : "No consent"}</span>
  }
  return (
    <Select
      value={lead.whatsapp_opt_in ? "yes" : "no"}
      onValueChange={(value) => onUpdate(lead.id, {
        whatsapp_opt_in: value === "yes",
        whatsapp_opt_in_source: value === "yes" ? "CRM admin confirmation" : "",
      })}
    >
      <SelectTrigger className="h-9 w-full rounded-xl bg-white"><SelectValue /></SelectTrigger>
      <SelectContent><SelectItem value="yes">Opted in</SelectItem><SelectItem value="no">No consent</SelectItem></SelectContent>
    </Select>
  )
}

function StatusSelect({ lead, onUpdate }: { lead: Lead; onUpdate: (id: number, data: Partial<Lead>) => void }) {
  return (
    <Select value={lead.status} onValueChange={(status) => onUpdate(lead.id, { status })}>
      <SelectTrigger className="h-9 w-full rounded-xl bg-white"><SelectValue /></SelectTrigger>
      <SelectContent>
        {LEAD_STATUSES.map((status) => <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

function AssigneeSelect({ lead, counsellors, onUpdate }: { lead: Lead; counsellors: User[]; onUpdate: (id: number, data: Partial<Lead>) => void }) {
  return (
    <Select value={lead.assigned_to ? String(lead.assigned_to) : "unassigned"} onValueChange={(value) => onUpdate(lead.id, { assigned_to: value === "unassigned" ? null : Number(value) })}>
      <SelectTrigger className="h-9 w-full rounded-xl bg-white"><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">Unassigned</SelectItem>
        {counsellors.map((counsellor) => (
          <SelectItem key={counsellor.id} value={String(counsellor.id)}>
            {[counsellor.first_name, counsellor.last_name].filter(Boolean).join(" ") || counsellor.email}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function QuickActions({ lead, compact = false }: { lead: Lead; compact?: boolean }) {
  const whatsappPhone = lead.phone.replace(/\D/g, "")
  return (
    <div className={`flex justify-end ${compact ? "gap-1" : "gap-2"}`}>
      <Button asChild variant="outline" size="icon-sm" className="rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
        <a href={`tel:${lead.phone}`} aria-label={`Call ${lead.name}`}><Phone className="h-4 w-4" /></a>
      </Button>
      <Button asChild variant="outline" size="icon-sm" className="rounded-full border-green-200 text-green-700 hover:bg-green-50">
        <a href={`https://wa.me/${whatsappPhone}`} target="_blank" rel="noreferrer" aria-label={`WhatsApp ${lead.name}`}><MessageCircle className="h-4 w-4" /></a>
      </Button>
      {!compact && (
        <Button asChild variant="ghost" size="icon-sm" className="rounded-full text-slate-500">
          <Link href={`/leads/${lead.id}`} aria-label={`Open ${lead.name}`}><CalendarDays className="h-4 w-4" /></Link>
        </Button>
      )}
    </div>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value))
}

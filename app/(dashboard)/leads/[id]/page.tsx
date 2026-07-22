"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  StickyNote,
  Bell,
  Activity as ActivityIcon,
} from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  useLeadDetail,
  useUpdateLead,
  useAddNote,
  useDeleteNote,
  useAddReminder,
  useUpdateReminder,
} from "@/hooks/use-lead-detail"

import {
  LEAD_STATUSES,
  LEAD_SOURCES,
  STATUS_COLORS,
  getStatusLabel,
} from "@/lib/constants/leads"

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = Number(params.id)

  const { data: lead, isLoading } = useLeadDetail(leadId)
  const updateLead = useUpdateLead(leadId)
  const addNote = useAddNote(leadId)
  const deleteNoteMutation = useDeleteNote(leadId)
  const addReminder = useAddReminder(leadId)
  const updateReminderMutation = useUpdateReminder(leadId)

  const [activeTab, setActiveTab] = useState<
    "details" | "notes" | "reminders" | "activity"
  >("details")

  const [editForm, setEditForm] = useState<Record<string, string>>({})
  const [noteText, setNoteText] = useState("")
  const [reminderNote, setReminderNote] = useState("")
  const [reminderDate, setReminderDate] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <h2 className="text-xl font-semibold">Lead not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => router.push("/leads")}>
          Back to Leads
        </Button>
      </div>
    )
  }

  const statusColors = STATUS_COLORS[lead.status] ?? {
    bg: "bg-slate-100",
    text: "text-slate-700",
  }

  function startEditing() {
    setEditForm({
      name: lead!.name,
      phone: lead!.phone,
      email: lead!.email || "",
      course: lead!.course || "",
      city: lead!.city || "",
      status: lead!.status,
      source: lead!.source,
      notes: lead!.notes || "",
    })
    setIsEditing(true)
  }

  function saveChanges() {
    updateLead.mutate(editForm, { onSuccess: () => setIsEditing(false) })
  }

  function handleStatusChange(newStatus: string) {
    updateLead.mutate({ status: newStatus })
  }

  function handleAddNote() {
    if (!noteText.trim()) return
    addNote.mutate(noteText, { onSuccess: () => setNoteText("") })
  }

  function handleAddReminder() {
    if (!reminderNote.trim() || !reminderDate) return
    addReminder.mutate(
      { note: reminderNote, reminder_at: reminderDate },
      {
        onSuccess: () => {
          setReminderNote("")
          setReminderDate("")
        },
      }
    )
  }

  function handleCompleteReminder(reminderId: number) {
    updateReminderMutation.mutate({
      reminderId,
      data: { status: "completed" },
    })
  }

  const tabs = [
    { key: "details" as const, label: "Details", icon: Save },
    { key: "notes" as const, label: `Notes (${lead.lead_notes?.length ?? 0})`, icon: StickyNote },
    { key: "reminders" as const, label: `Reminders (${lead.reminders?.length ?? 0})`, icon: Bell },
    { key: "activity" as const, label: "Activity", icon: ActivityIcon },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon-sm" onClick={() => router.push("/leads")}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{lead.name}</h1>
            <p className="text-sm text-slate-500">{lead.phone} &middot; {lead.email || "No email"}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={lead.status} onValueChange={handleStatusChange}>
            <SelectTrigger className={`${statusColors.bg} ${statusColors.text} border-0 font-medium`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAD_STATUSES.map((s) => {
                const c = STATUS_COLORS[s.value] ?? { bg: "", text: "" }
                return (
                  <SelectItem key={s.value} value={s.value}>
                    <span className={`inline-block h-2 w-2 rounded-full ${c.bg.replace("100", "500")} mr-2`} />
                    {s.label}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border bg-white p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition sm:px-4 ${
                activeTab === tab.key
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Details Tab */}
      {activeTab === "details" && (
        <Card className="rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Lead Information</h2>
            {!isEditing ? (
              <Button variant="outline" size="sm" onClick={startEditing}>
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={saveChanges} disabled={updateLead.isPending}>
                  {updateLead.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </div>
              <div>
                <Label>Course</Label>
                <Input
                  value={editForm.course}
                  onChange={(e) => setEditForm({ ...editForm, course: e.target.value })}
                />
              </div>
              <div>
                <Label>City</Label>
                <Input
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                />
              </div>
              <div>
                <Label>Source</Label>
                <Select
                  value={editForm.source}
                  onValueChange={(v) => setEditForm({ ...editForm, source: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEAD_SOURCES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label>Notes</Label>
                <Textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Name" value={lead.name} />
              <InfoRow label="Phone" value={lead.phone} />
              <InfoRow label="Email" value={lead.email || "-"} />
              <InfoRow label="Course" value={lead.course || "-"} />
              <InfoRow label="City" value={lead.city || "-"} />
              <InfoRow label="Source" value={lead.source} />
              <InfoRow label="Assigned To" value={lead.assigned_to_name || "Unassigned"} />
              <InfoRow
                label="Status"
                value={
                  <Badge variant="secondary" className={`${statusColors.bg} ${statusColors.text} border-0`}>
                    {getStatusLabel(lead.status)}
                  </Badge>
                }
              />
              <InfoRow
                label="Created"
                value={new Date(lead.created_at).toLocaleString()}
              />
              <InfoRow
                label="Updated"
                value={new Date(lead.updated_at).toLocaleString()}
              />
              {lead.notes && (
                <div className="sm:col-span-2">
                  <InfoRow label="Notes" value={lead.notes} />
                </div>
              )}
            </div>
          )}

          {/* Custom Field Values */}
          {lead.custom_values && lead.custom_values.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <h3 className="mb-3 text-sm font-semibold text-slate-500">Custom Fields</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {lead.custom_values.map((cv) => (
                  <InfoRow key={cv.id} label={cv.field_label} value={cv.value || "-"} />
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Notes Tab */}
      {activeTab === "notes" && (
        <Card className="rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Notes</h2>

          <div className="mb-6 flex gap-2">
            <Textarea
              placeholder="Add a note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={2}
              className="flex-1"
            />
            <Button onClick={handleAddNote} disabled={addNote.isPending || !noteText.trim()}>
              <Plus size={16} className="mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-3">
            {lead.lead_notes?.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">No notes yet</p>
            )}
            {lead.lead_notes?.map((note) => (
              <div key={note.id} className="flex items-start justify-between rounded-lg border p-4">
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {note.created_by_name} &middot;{" "}
                    {new Date(note.created_at).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => deleteNoteMutation.mutate(note.id)}
                >
                  <Trash2 size={14} className="text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Reminders Tab */}
      {activeTab === "reminders" && (
        <Card className="rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Reminders</h2>

          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <Input
                placeholder="Reminder note..."
                value={reminderNote}
                onChange={(e) => setReminderNote(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="datetime-local"
                value={reminderDate}
                onChange={(e) => setReminderDate(e.target.value)}
              />
              <Button
                onClick={handleAddReminder}
                disabled={addReminder.isPending || !reminderNote.trim() || !reminderDate}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {lead.reminders?.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">No reminders yet</p>
            )}
            {lead.reminders?.map((reminder) => {
              const isPending = reminder.status === "pending"
              const isOverdue =
                isPending && new Date(reminder.reminder_at) < new Date()
              return (
                <div
                  key={reminder.id}
                  className={`flex items-start justify-between rounded-lg border p-4 ${
                    isOverdue ? "border-red-200 bg-red-50" : ""
                  } ${reminder.status === "completed" ? "opacity-60" : ""}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {reminder.status === "completed" ? (
                        <CheckCircle2 size={16} className="text-green-500" />
                      ) : (
                        <Clock size={16} className={isOverdue ? "text-red-500" : "text-yellow-500"} />
                      )}
                      <p className="text-sm font-medium">{reminder.note}</p>
                      {isOverdue && (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      Due: {new Date(reminder.reminder_at).toLocaleString()} &middot;{" "}
                      {reminder.created_by_name}
                    </p>
                  </div>
                  {isPending && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCompleteReminder(reminder.id)}
                    >
                      <CheckCircle2 size={14} className="mr-1" />
                      Done
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Activity Tab */}
      {activeTab === "activity" && (
        <Card className="rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Activity Timeline</h2>
          <div className="space-y-1">
            {lead.activities?.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">No activity yet</p>
            )}
            {lead.activities?.map((activity, i) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-slate-300 mt-2" />
                  {i < (lead.activities?.length ?? 0) - 1 && (
                    <div className="w-px flex-1 bg-slate-200" />
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-slate-400">
                    {activity.user_name} &middot;{" "}
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}

function InfoRow({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  )
}

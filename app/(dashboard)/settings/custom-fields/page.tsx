"use client"

import { useState } from "react"
import { Plus, Trash2, GripVertical } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  getCustomFields,
  createCustomField,
  updateCustomField,
  deleteCustomField,
} from "@/lib/api/leads"
import { CustomField } from "@/lib/types/lead"

const FIELD_TYPES = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Select / Dropdown", value: "select" },
  { label: "Textarea", value: "textarea" },
  { label: "Checkbox", value: "checkbox" },
]

export default function CustomFieldsPage() {
  const queryClient = useQueryClient()
  const { data: fields, isLoading } = useQuery({
    queryKey: ["custom-fields"],
    queryFn: getCustomFields,
  })

  const [showDialog, setShowDialog] = useState(false)
  const [editField, setEditField] = useState<CustomField | null>(null)

  const [form, setForm] = useState({
    label: "",
    field_type: "text",
    placeholder: "",
    required: false,
    options: "",
    default_value: "",
  })

  const createMutation = useMutation({
    mutationFn: createCustomField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-fields"] })
      toast.success("Field created — it will now appear on all lead forms")
      closeDialog()
    },
    onError: () => toast.error("Failed to create field"),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CustomField> }) =>
      updateCustomField(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-fields"] })
      toast.success("Field updated")
      closeDialog()
    },
    onError: () => toast.error("Failed to update field"),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCustomField,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-fields"] })
      toast.success("Field deleted")
    },
    onError: () => toast.error("Failed to delete field"),
  })

  function openCreate() {
    setEditField(null)
    setForm({
      label: "",
      field_type: "text",
      placeholder: "",
      required: false,
      options: "",
      default_value: "",
    })
    setShowDialog(true)
  }

  function openEdit(field: CustomField) {
    setEditField(field)
    setForm({
      label: field.label,
      field_type: field.field_type,
      placeholder: field.placeholder || "",
      required: field.required,
      options: field.options?.join(", ") || "",
      default_value: field.default_value || "",
    })
    setShowDialog(true)
  }

  function closeDialog() {
    setShowDialog(false)
    setEditField(null)
  }

  function handleSubmit() {
    const payload: Record<string, unknown> = {
      label: form.label,
      field_type: form.field_type,
      placeholder: form.placeholder,
      required: form.required,
      default_value: form.default_value,
      options:
        form.field_type === "select"
          ? form.options
              .split(",")
              .map((o) => o.trim())
              .filter(Boolean)
          : [],
    }

    if (editField) {
      updateMutation.mutate({ id: editField.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  function toggleActive(field: CustomField) {
    updateMutation.mutate({
      id: field.id,
      data: { is_active: !field.is_active },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Custom Fields</h1>
          <p className="mt-1 text-sm text-slate-500">
            Add dynamic fields that appear on every lead form
          </p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} className="mr-2" />
          Add Field
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-2xl" />
      ) : !fields || fields.length === 0 ? (
        <Card className="flex flex-col items-center rounded-2xl px-6 py-20 text-center">
          <GripVertical size={32} className="text-slate-400" />
          <h3 className="mt-4 text-lg font-semibold">No custom fields yet</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Custom fields you add here will automatically appear on all lead detail pages.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {fields.map((field) => (
            <Card
              key={field.id}
              className={`flex items-center justify-between rounded-2xl p-4 ${
                !field.is_active ? "opacity-50" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{field.label}</p>
                    <Badge variant="secondary" className="text-xs capitalize">
                      {field.field_type}
                    </Badge>
                    {field.required && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                    {!field.is_active && (
                      <Badge variant="outline" className="text-xs">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  {field.placeholder && (
                    <p className="mt-0.5 text-xs text-slate-400">
                      Placeholder: {field.placeholder}
                    </p>
                  )}
                  {field.field_type === "select" && field.options?.length > 0 && (
                    <p className="mt-0.5 text-xs text-slate-400">
                      Options: {field.options.join(", ")}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleActive(field)}>
                  {field.is_active ? "Disable" : "Enable"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => openEdit(field)}>
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => deleteMutation.mutate(field.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editField ? "Edit Field" : "Add Custom Field"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div>
              <Label>Field Label</Label>
              <Input
                placeholder="e.g. Parent Name"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
              />
            </div>
            <div>
              <Label>Field Type</Label>
              <Select
                value={form.field_type}
                onValueChange={(v) => setForm({ ...form, field_type: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Placeholder</Label>
              <Input
                placeholder="Optional placeholder text"
                value={form.placeholder}
                onChange={(e) => setForm({ ...form, placeholder: e.target.value })}
              />
            </div>
            {form.field_type === "select" && (
              <div>
                <Label>Options (comma separated)</Label>
                <Input
                  placeholder="Option 1, Option 2, Option 3"
                  value={form.options}
                  onChange={(e) => setForm({ ...form, options: e.target.value })}
                />
              </div>
            )}
            <div>
              <Label>Default Value</Label>
              <Input
                placeholder="Optional default value"
                value={form.default_value}
                onChange={(e) => setForm({ ...form, default_value: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="required"
                checked={form.required}
                onChange={(e) => setForm({ ...form, required: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="required">Required field</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={
                createMutation.isPending ||
                updateMutation.isPending ||
                !form.label.trim()
              }
            >
              {editField ? "Save Changes" : "Create Field"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

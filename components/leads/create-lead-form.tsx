"use client"

import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import toast from "react-hot-toast"
import { GraduationCap, Loader2, Sparkles, UserRound } from "lucide-react"

import { createLeadSchema, CreateLeadInput } from "@/lib/schemas/lead"
import { useCreateLead } from "@/hooks/use-create-lead"
import { getActiveCustomFields, getCounsellors } from "@/lib/api/leads"
import { LEAD_SOURCES } from "@/lib/constants/leads"
import { useAuthStore } from "@/lib/store/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function CreateLeadForm() {
  const mutation = useCreateLead()
  const user = useAuthStore((state) => state.user)
  const isAdmin = user?.role === "admin" || user?.role === "superadmin"
  const [customValues, setCustomValues] = useState<Record<string, string>>({})
  const [assignedTo, setAssignedTo] = useState("unassigned")

  const {
    data: customFields = [],
    isLoading: fieldsLoading,
    isError: fieldsError,
  } = useQuery({
    queryKey: ["custom-fields", "active"],
    queryFn: getActiveCustomFields,
  })
  const { data: counsellors = [] } = useQuery({
    queryKey: ["counsellors"],
    queryFn: getCounsellors,
    enabled: isAdmin,
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLeadInput>({
    resolver: zodResolver(createLeadSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      course: "",
      city: "",
      source: "manual",
      notes: "",
    },
  })

  const onSubmit = (values: CreateLeadInput) => {
    if (fieldsError) {
      toast.error("Custom fields could not be loaded. Refresh before creating the lead.")
      return
    }

    const resolvedCustomValues = Object.fromEntries(
      customFields.map((field) => [
        String(field.id),
        customValues[String(field.id)] ?? field.default_value ?? "",
      ])
    )
    const missingRequired = customFields.find(
      (field) =>
        field.required &&
        (field.field_type === "checkbox"
          ? resolvedCustomValues[String(field.id)] !== "true"
          : !resolvedCustomValues[String(field.id)]?.trim())
    )
    if (missingRequired) {
      toast.error(`${missingRequired.label} is required`)
      return
    }

    mutation.mutate({
      ...values,
      assigned_to: assignedTo === "unassigned" ? null : Number(assignedTo),
      custom_fields: resolvedCustomValues,
    })
  }

  function setCustomValue(fieldId: number, value: string) {
    setCustomValues((current) => ({ ...current, [String(fieldId)]: value }))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <FormSection
        icon={UserRound}
        title="Lead profile"
        description="Basic contact information for quick calling and follow-up."
      >
        <Field label="Name" error={errors.name?.message} required>
          <Input {...register("name")} placeholder="Student or parent name" />
        </Field>
        <Field label="Phone" error={errors.phone?.message} required>
          <Input
            {...register("phone")}
            inputMode="tel"
            placeholder="98765 43210"
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <Input {...register("email")} type="email" placeholder="name@example.com" />
        </Field>
        <Field label="Location">
          <Input {...register("city")} placeholder="Delhi" />
        </Field>
      </FormSection>

      <FormSection
        icon={GraduationCap}
        title="Qualification & ownership"
        description="Route the lead correctly from the moment it enters the CRM."
      >
        <Field label="Course">
          <Input {...register("course")} placeholder="AI Mastery" />
        </Field>
        <Field label="Lead source">
          <Controller
            control={control}
            name="source"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="h-10 w-full bg-white">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_SOURCES.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        {isAdmin && (
          <Field label="Assign counsellor">
            <Select value={assignedTo} onValueChange={setAssignedTo}>
              <SelectTrigger className="h-10 w-full bg-white">
                <SelectValue placeholder="Choose counsellor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {counsellors.map((counsellor) => (
                  <SelectItem key={counsellor.id} value={String(counsellor.id)}>
                    {[counsellor.first_name, counsellor.last_name]
                      .filter(Boolean)
                      .join(" ") || counsellor.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        )}
        <div className="md:col-span-2">
          <Field label="Remark">
            <Textarea
              {...register("notes")}
              placeholder="Add a remark visible from the leads page..."
              className="min-h-24 bg-white"
            />
          </Field>
        </div>
      </FormSection>

      {(fieldsLoading || fieldsError || customFields.length > 0) && (
        <FormSection
          icon={Sparkles}
          title="Custom information"
          description="Fields configured by your administrator."
        >
          {fieldsLoading && (
            <p className="flex items-center gap-2 text-sm text-slate-500 md:col-span-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading custom fields...
            </p>
          )}
          {fieldsError && (
            <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700 md:col-span-2">
              Custom fields failed to load. Refresh this page before submitting.
            </p>
          )}
          {customFields.map((field) => {
            const value = customValues[String(field.id)] ?? field.default_value ?? ""
            return (
              <div key={field.id} className={field.field_type === "textarea" ? "md:col-span-2" : ""}>
                <Field label={field.label} required={field.required}>
                  {["dropdown", "radio"].includes(field.field_type) ? (
                    <Select value={value} onValueChange={(next) => setCustomValue(field.id, next)}>
                      <SelectTrigger className="h-10 w-full bg-white">
                        <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.field_type === "textarea" ? (
                    <Textarea value={value} placeholder={field.placeholder} onChange={(event) => setCustomValue(field.id, event.target.value)} />
                  ) : field.field_type === "checkbox" ? (
                    <label className="flex h-10 items-center gap-3 rounded-xl border bg-white px-3 text-sm">
                      <input type="checkbox" checked={value === "true"} onChange={(event) => setCustomValue(field.id, String(event.target.checked))} className="h-4 w-4" />
                      {field.placeholder || `Yes, ${field.label.toLowerCase()}`}
                    </label>
                  ) : (
                    <Input
                      type={field.field_type === "number" ? "number" : field.field_type === "date" ? "date" : field.field_type === "email" ? "email" : "text"}
                      value={value}
                      placeholder={field.placeholder}
                      onChange={(event) => setCustomValue(field.id, event.target.value)}
                    />
                  )}
                </Field>
              </div>
            )
          })}
        </FormSection>
      )}

      <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
        <Button type="submit" className="h-11 px-8" disabled={mutation.isPending || fieldsLoading}>
          {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mutation.isPending ? "Creating lead..." : "Create lead"}
        </Button>
      </div>
    </form>
  )
}

function FormSection({ icon: Icon, title, description, children }: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-xl bg-indigo-100 p-2 text-indigo-700"><Icon className="h-5 w-5" /></div>
        <div>
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">{children}</div>
    </section>
  )
}

function Field({ label, error, required, children }: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-slate-700">
        {label}{required && <span className="text-red-500"> *</span>}
      </span>
      {children}
      {error && <span className="block text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}

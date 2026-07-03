"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"

import { zodResolver } from "@hookform/resolvers/zod"

import {
  createLeadSchema,
  CreateLeadInput,
} from "@/lib/schemas/lead"

import { useCreateLead } from "@/hooks/use-create-lead"

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

import { getActiveCustomFields } from "@/lib/api/leads"

export function CreateLeadForm() {
  const mutation =
    useCreateLead()
  const { data: customFields = [] } = useQuery({
    queryKey: ["custom-fields", "active"],
    queryFn: getActiveCustomFields,
  })
  const [customValues, setCustomValues] = useState<Record<string, string>>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLeadInput>({
    resolver: zodResolver(
      createLeadSchema
    ),

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

  const onSubmit = (
    values: CreateLeadInput
  ) => {
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
    mutation.mutate({ ...values, custom_fields: resolvedCustomValues })
  }

  function setCustomValue(fieldId: number, value: string) {
    setCustomValues((current) => ({ ...current, [String(fieldId)]: value }))
  }

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit
      )}
      className="space-y-6"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Name
          </label>

          <Input
            {...register("name")}
            placeholder="John Doe"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-500">
              {
                errors.name
                  .message
              }
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Phone
          </label>

          <Input
            {...register("phone")}
            placeholder="+91 9876543210"
          />

          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">
              {
                errors.phone
                  .message
              }
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Email
          </label>

          <Input
            {...register("email")}
            placeholder="john@example.com"
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {
                errors.email
                  .message
              }
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Course
          </label>

          <Input
            {...register("course")}
            placeholder="AI Mastery"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            City
          </label>

          <Input
            {...register("city")}
            placeholder="Delhi"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Source
          </label>

          <Input
            {...register("source")}
            placeholder="Instagram Ads"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Notes
        </label>

        <Textarea
          {...register("notes")}
          placeholder="Additional lead notes..."
          className="min-h-[120px]"
        />
      </div>

      {customFields.length > 0 && (
        <div className="space-y-4 border-t pt-6">
          <div>
            <h2 className="font-semibold">Additional Information</h2>
            <p className="text-sm text-slate-500">Fields configured by your administrator</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {customFields.map((field) => {
              const value = customValues[String(field.id)] ?? field.default_value ?? ""
              return (
                <div key={field.id} className={field.field_type === "textarea" ? "md:col-span-2" : ""}>
                  <label className="mb-2 block text-sm font-medium">
                    {field.label}{field.required ? " *" : ""}
                  </label>
                  {["dropdown", "radio"].includes(field.field_type) ? (
                    <Select value={value} onValueChange={(next) => setCustomValue(field.id, next)}>
                      <SelectTrigger>
                        <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.field_type === "textarea" ? (
                    <Textarea
                      value={value}
                      placeholder={field.placeholder}
                      onChange={(event) => setCustomValue(field.id, event.target.value)}
                    />
                  ) : field.field_type === "checkbox" ? (
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={value === "true"}
                        onChange={(event) => setCustomValue(field.id, String(event.target.checked))}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      {field.placeholder || field.label}
                    </label>
                  ) : (
                    <Input
                      type={field.field_type === "number" ? "number" : field.field_type === "date" ? "date" : field.field_type === "email" ? "email" : "text"}
                      value={value}
                      placeholder={field.placeholder}
                      onChange={(event) => setCustomValue(field.id, event.target.value)}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={
            mutation.isPending
          }
        >
          {mutation.isPending
            ? "Creating..."
            : "Create Lead"}
        </Button>
      </div>
    </form>
  )
}

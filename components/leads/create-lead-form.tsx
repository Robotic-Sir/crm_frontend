"use client"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import {
  createLeadSchema,
  CreateLeadInput,
} from "@/lib/schemas/lead"

import { useCreateLead } from "@/hooks/use-create-lead"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Textarea } from "@/components/ui/textarea"

export function CreateLeadForm() {
  const mutation =
    useCreateLead()

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
    mutation.mutate(values)
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
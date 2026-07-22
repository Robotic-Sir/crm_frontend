"use client"

import { UploadDropzone } from "@/components/imports/upload-dropzone"

import { ImportsTable } from "@/components/imports/imports-table"

import { useImports } from "@/hooks/use-imports"

export default function ImportsPage() {
  const {
    data,
    isLoading,
    isError,
  } = useImports()

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <p className="text-sm text-slate-500">
          Loading imports...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-600">
          Failed to load imports
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          Imports
        </h1>

        <p className="mt-2 text-slate-500">
          Upload and process leads
          files
        </p>
      </div>

      <UploadDropzone />

      <ImportsTable
        imports={
          data?.results || []
        }
      />
    </div>
  )
}

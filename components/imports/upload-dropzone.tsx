"use client"

import { useRef } from "react"

import { Upload } from "lucide-react"

import { useUploadImport } from "@/hooks/use-upload-import"

export function UploadDropzone() {
  const inputRef =
    useRef<HTMLInputElement>(null)

  const mutation =
    useUploadImport()

  const handleFile = (
    file: File
  ) => {
    mutation.mutate(file)
  }

  return (
    <div className="rounded-2xl border border-dashed bg-white p-10">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-slate-100 p-4">
          <Upload className="h-8 w-8 text-slate-600" />
        </div>

        <div>
          <h3 className="text-lg font-semibold">
            Upload Leads File
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            CSV, XLSX, XLS supported
          </p>
          <p className="mt-2 max-w-lg text-xs leading-5 text-slate-400">
            Include a <span className="font-medium text-slate-600">Remark</span>,{" "}
            <span className="font-medium text-slate-600">Remarks</span>, or{" "}
            <span className="font-medium text-slate-600">Notes</span> column to import lead remarks.
            Re-importing the same phone number updates its remark.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            inputRef.current?.click()
          }
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          Select File
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          hidden
          onChange={(e) => {
            const file =
              e.target.files?.[0]

            if (file) {
              handleFile(file)
            }
          }}
        />

        {mutation.isPending && (
          <p className="text-sm text-slate-500">
            Uploading...
          </p>
        )}
      </div>
    </div>
  )
}

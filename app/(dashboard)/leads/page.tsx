"use client"

import Link from "next/link"

import { useState } from "react"

import { useDebounce } from "use-debounce"

import {
  Plus,
  Search,
} from "lucide-react"

import { useLeads } from "@/hooks/use-leads"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import LeadsTable from "@/components/leads/LeadsTable"

export default function LeadsPage() {
  const [searchInput, setSearchInput] =
    useState("")

  const [debouncedSearch] =
    useDebounce(
      searchInput,
      500
    )

  const {
    data,
    isLoading,
    isError,
  } = useLeads({
    search:
      debouncedSearch,
  })

  const leads =
    data?.results || []

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm text-red-600">
          Failed to load leads
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Leads
          </h1>

          <p className="mt-2 text-slate-500">
            Manage CRM leads
          </p>
        </div>

        <div className="flex gap-3">
          <Link href="/imports">
            <Button
              variant="outline"
            >
              Bulk Upload
            </Button>
          </Link>

          <Link href="/leads/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />

              Add Lead
            </Button>
          </Link>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />

        <Input
          placeholder="Search by name, phone, course..."
          value={searchInput}
          onChange={(e) =>
            setSearchInput(
              e.target.value
            )
          }
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <div className="rounded-2xl border bg-white p-6">
          <p className="text-sm text-slate-500">
            Loading leads...
          </p>
        </div>
      ) : (
        <LeadsTable
          leads={leads}
        />
      )}
    </div>
  )
}
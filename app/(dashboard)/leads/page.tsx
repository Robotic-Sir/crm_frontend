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
  const [page, setPage] = useState(1)

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
    page,
  })

  const leads =
    data?.results || []
  const totalPages = Math.max(1, Math.ceil((data?.count || 0) / 50))
  const visiblePages = Array.from(
    new Set([1, totalPages, page - 2, page - 1, page, page + 1, page + 2])
  )
    .filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages)
    .sort((a, b) => a - b)

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
            {
              setSearchInput(e.target.value)
              setPage(1)
            }
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

      {!isLoading && data && data.count > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Showing {(page - 1) * 50 + 1}–{Math.min(page * 50, data.count)} of {data.count} leads
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={!data.previous}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            {visiblePages.map((pageNumber, index) => (
              <div key={pageNumber} className="flex items-center gap-1">
                {index > 0 && pageNumber - visiblePages[index - 1] > 1 && (
                  <span className="px-1 text-slate-400">…</span>
                )}
                <Button
                  variant={pageNumber === page ? "default" : "outline"}
                  size="sm"
                  className="min-w-9"
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={!data.next}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

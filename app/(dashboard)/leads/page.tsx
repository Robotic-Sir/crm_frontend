"use client"

import Link from "next/link"
import { useState } from "react"
import { useDebounce } from "use-debounce"
import {
  AlarmClock,
  BellRing,
  CalendarCheck2,
  Filter,
  Plus,
  Search,
  Upload,
  UsersRound,
  X,
} from "lucide-react"

import {
  useLeadFilterOptions,
  useLeads,
  useReminderSummary,
} from "@/hooks/use-leads"
import { CONTACT_STATUSES, LEAD_SOURCES, LEAD_STATUSES } from "@/lib/constants/leads"
import { LeadFilters } from "@/lib/types/lead"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import LeadsTable from "@/components/leads/LeadsTable"

const EMPTY_FILTERS: LeadFilters = {
  status: "",
  city: "",
  course: "",
  contact_status: "",
  source: "",
}

export default function LeadsPage() {
  const [searchInput, setSearchInput] = useState("")
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState<LeadFilters>(EMPTY_FILTERS)
  const [debouncedSearch] = useDebounce(searchInput, 400)
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([, value]) => Boolean(value))
  ) as LeadFilters

  const { data, isLoading, isError } = useLeads({
    search: debouncedSearch,
    page,
    filters: activeFilters,
  })
  const { data: filterOptions } = useLeadFilterOptions()
  const { data: reminders } = useReminderSummary()

  const leads = data?.results || []
  const totalPages = Math.max(1, Math.ceil((data?.count || 0) / 50))
  const visiblePages = Array.from(
    new Set([1, totalPages, page - 2, page - 1, page, page + 1, page + 2])
  ).filter((pageNumber) => pageNumber >= 1 && pageNumber <= totalPages).sort((a, b) => a - b)
  const filterCount = Object.keys(activeFilters).length

  function setFilter(key: keyof LeadFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value === "all" ? "" : value }))
    setPage(1)
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS)
    setSearchInput("")
    setPage(1)
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-600 p-5 text-white shadow-xl shadow-indigo-200/60 sm:p-7">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-100">
              <UsersRound className="h-4 w-4" /> Lead workspace
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Turn follow-ups into admissions</h1>
            <p className="mt-2 max-w-2xl text-sm text-indigo-100 sm:text-base">
              Search, call, update and assign every lead without leaving this page.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="secondary" className="flex-1 bg-white/10 text-white hover:bg-white/20 sm:flex-none">
              <Link href="/imports"><Upload className="mr-2 h-4 w-4" />Bulk upload</Link>
            </Button>
            <Button asChild className="flex-1 bg-white text-indigo-700 hover:bg-indigo-50 sm:flex-none">
              <Link href="/leads/new"><Plus className="mr-2 h-4 w-4" />Add lead</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <SummaryCard icon={BellRing} label="Pending follow-ups" value={reminders?.pending ?? 0} tone="indigo" />
        <SummaryCard icon={AlarmClock} label="Overdue" value={reminders?.overdue ?? 0} tone="rose" />
        <SummaryCard icon={CalendarCheck2} label="Due today" value={reminders?.today ?? 0} tone="amber" />
        <SummaryCard icon={CalendarCheck2} label="Next 7 days" value={reminders?.upcoming ?? 0} tone="emerald" />
      </section>

      <section className="rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search name, phone, course or location..."
              value={searchInput}
              onChange={(event) => { setSearchInput(event.target.value); setPage(1) }}
              className="h-11 rounded-xl bg-slate-50 pl-10"
            />
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <Filter className="h-4 w-4" /> Filters {filterCount > 0 && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">{filterCount}</span>}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5 xl:grid-cols-6">
          <FilterSelect label="Source" value={filters.source || "all"} onChange={(value) => setFilter("source", value)} options={LEAD_SOURCES} />
          <FilterSelect label="Lead status" value={filters.status || "all"} onChange={(value) => setFilter("status", value)} options={LEAD_STATUSES} />
          <FilterSelect label="Contacted" value={filters.contact_status || "all"} onChange={(value) => setFilter("contact_status", value)} options={CONTACT_STATUSES} />
          <FilterSelect label="Location" value={filters.city || "all"} onChange={(value) => setFilter("city", value)} options={(filterOptions?.cities || []).map((value) => ({ label: value, value }))} />
          <FilterSelect label="Course" value={filters.course || "all"} onChange={(value) => setFilter("course", value)} options={(filterOptions?.courses || []).map((value) => ({ label: value, value }))} />
          {(filterCount > 0 || searchInput) && (
            <Button variant="ghost" onClick={clearFilters} className="col-span-2 h-10 justify-center text-slate-500 sm:col-span-5 xl:col-span-1">
              <X className="mr-2 h-4 w-4" />Clear view
            </Button>
          )}
        </div>
      </section>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">All leads</h2>
          <p className="text-sm text-slate-500">{data?.count ?? 0} leads in this view</p>
        </div>
      </div>

      {isError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">Failed to load leads. Refresh and try again.</div>
      ) : isLoading ? (
        <div className="grid gap-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-24 animate-pulse rounded-2xl bg-slate-200/70" />)}
        </div>
      ) : (
        <LeadsTable leads={leads} />
      )}

      {!isLoading && data && data.count > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-center text-sm text-slate-500 sm:text-left">
            Showing {(page - 1) * 50 + 1}-{Math.min(page * 50, data.count)} of {data.count}
          </p>
          <div className="flex items-center justify-center gap-1">
            <Button variant="outline" size="sm" disabled={!data.previous} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</Button>
            {visiblePages.map((pageNumber, index) => (
              <div key={pageNumber} className="flex items-center gap-1">
                {index > 0 && pageNumber - visiblePages[index - 1] > 1 && <span className="px-1 text-slate-400">...</span>}
                <Button variant={pageNumber === page ? "default" : "outline"} size="sm" className="min-w-9" onClick={() => setPage(pageNumber)}>{pageNumber}</Button>
              </div>
            ))}
            <Button variant="outline" size="sm" disabled={!data.next} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { label: string; value: string }[] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-10 w-full rounded-xl bg-slate-50"><SelectValue placeholder={label} /></SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All {label.toLowerCase()}</SelectItem>
        {options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
      </SelectContent>
    </Select>
  )
}

const TONES = {
  indigo: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  rose: "bg-rose-50 text-rose-700 ring-rose-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
}

function SummaryCard({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; tone: keyof typeof TONES }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-3 shadow-sm sm:p-4">
      <div className={`mb-3 inline-flex rounded-xl p-2 ring-1 ${TONES[tone]}`}><Icon className="h-4 w-4 sm:h-5 sm:w-5" /></div>
      <p className="text-2xl font-bold text-slate-900 sm:text-3xl">{value}</p>
      <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">{label}</p>
    </div>
  )
}

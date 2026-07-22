import { useQuery } from "@tanstack/react-query"

import {
  getLeadFilterOptions,
  getLeads,
  getReminderSummary,
} from "@/lib/api/leads"

import { LeadFilters, LeadsResponse } from "@/lib/types/lead"

interface UseLeadsProps {
  search?: string
  page?: number
  filters?: LeadFilters
}

export function useLeads({
  search = "",
  page = 1,
  filters = {},
}: UseLeadsProps) {
  return useQuery<LeadsResponse>({
    queryKey: ["leads", search, page, filters],

    queryFn: () =>
      getLeads(search, page, filters),

    staleTime: 1000 * 30,
  })
}

export function useLeadFilterOptions() {
  return useQuery({
    queryKey: ["lead-filter-options"],
    queryFn: getLeadFilterOptions,
    staleTime: 1000 * 60 * 5,
  })
}

export function useReminderSummary() {
  return useQuery({
    queryKey: ["reminder-summary"],
    queryFn: getReminderSummary,
    refetchInterval: 1000 * 60,
  })
}

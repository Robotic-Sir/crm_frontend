import { useQuery } from "@tanstack/react-query"

import { getLeads } from "@/lib/api/leads"

import { LeadsResponse } from "@/lib/types/lead"

interface UseLeadsProps {
  search?: string
  page?: number
}

export function useLeads({
  search = "",
  page = 1,
}: UseLeadsProps) {
  return useQuery<LeadsResponse>({
    queryKey: ["leads", search, page],

    queryFn: () =>
      getLeads(search, page),

    staleTime: 1000 * 30,
  })
}

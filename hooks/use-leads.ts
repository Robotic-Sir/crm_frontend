import { useQuery } from "@tanstack/react-query"

import { getLeads } from "@/lib/api/leads"

import {
  Lead,
  LeadsResponse,
} from "@/lib/types/lead"

interface UseLeadsProps {
  search?: string
}

export function useLeads({
  search = "",
}: UseLeadsProps) {
  return useQuery<LeadsResponse>({
    queryKey: ["leads", search],

    queryFn: () =>
      getLeads(search),

    staleTime: 1000 * 30,
  })
}
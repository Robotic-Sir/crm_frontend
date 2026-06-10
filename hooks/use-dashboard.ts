"use client"

import { useQuery } from "@tanstack/react-query"
import { getDashboard } from "@/lib/api/leads"

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 1000 * 60,
  })
}

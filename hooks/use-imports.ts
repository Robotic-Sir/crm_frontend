import { useQuery } from "@tanstack/react-query"

import { getImports } from "@/lib/api/imports"

import { ImportsResponse } from "@/lib/types/imports"

export function useImports() {
  return useQuery<ImportsResponse>({
    queryKey: ["imports"],

    queryFn: getImports,

    refetchInterval: 3000,
  })
}
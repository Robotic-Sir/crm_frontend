import { useQuery } from "@tanstack/react-query"

import { getTemplates } from "@/lib/api/templates"

export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],

    queryFn: getTemplates,
  })
}
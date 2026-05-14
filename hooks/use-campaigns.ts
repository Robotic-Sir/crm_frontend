import { useQuery } from "@tanstack/react-query"

import { getCampaigns } from "@/lib/api/campaigns"

import { CampaignsResponse } from "@/lib/types/campaigns"

export function useCampaigns() {
  return useQuery<CampaignsResponse>({
    queryKey: ["campaigns"],

    queryFn: getCampaigns,
  })
}
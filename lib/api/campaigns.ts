import api from "@/lib/api/client"

import { CampaignsResponse } from "@/lib/types/campaigns"

export async function getCampaigns() {
  const response =
    await api.get<CampaignsResponse>(
      "/campaigns/"
    )

  return response.data
}
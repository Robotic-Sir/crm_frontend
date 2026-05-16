import api from "@/lib/api/client"

import { CampaignsResponse } from "@/lib/types/campaigns"

export async function getCampaigns() {
  const response =
    await api.get<CampaignsResponse>(
      "/campaigns/"
    )

  return response.data
}

export async function dispatchCampaign(
  campaignId: number
) {
  const response = await api.post(
    `/campaigns/${campaignId}/dispatch/`
  )

  return response.data
}
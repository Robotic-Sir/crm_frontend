import api from "@/lib/api/client"
import { Campaign, CampaignInput, CampaignsResponse } from "@/lib/types/campaigns"

export async function getCampaigns(): Promise<CampaignsResponse> {
  const response = await api.get<CampaignsResponse>("/campaigns/")
  return response.data
}

export async function createCampaign(data: CampaignInput): Promise<Campaign> {
  const response = await api.post<Campaign>("/campaigns/", data)
  return response.data
}

export async function previewAudience(filters: Record<string, string>): Promise<number> {
  const response = await api.post("/campaigns/audience-preview/", { filters })
  return response.data.eligible_leads
}

export async function dispatchCampaign(campaignId: number) {
  const response = await api.post(`/campaigns/${campaignId}/dispatch/`)
  return response.data
}

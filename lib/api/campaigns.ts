import api from "@/lib/api/client"
import { Campaign, CampaignInput, CampaignsResponse } from "@/lib/types/campaigns"

export async function getCampaigns(): Promise<CampaignsResponse> {
  const response = await api.get<CampaignsResponse>("/campaigns/")
  return response.data
}

export async function createCampaign(data: CampaignInput): Promise<Campaign> {
  if (!data.media_file) {
    const response = await api.post<Campaign>("/campaigns/", data)
    return response.data
  }
  const body = new FormData()
  body.append("name", data.name)
  body.append("campaign_type", data.campaign_type)
  body.append("template", String(data.template))
  body.append("audience_filters", JSON.stringify(data.audience_filters))
  if (data.scheduled_at) body.append("scheduled_at", data.scheduled_at)
  body.append("media_file", data.media_file)
  const response = await api.post<Campaign>("/campaigns/", body)
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

export interface DeliveryStats {
  queued: number
  sent: number
  delivered: number
  read: number
  failed: number
  total: number
}

export interface Campaign {
  id: number
  name: string
  campaign_type: "admission" | "demo" | "feedback" | "custom"
  template: number
  template_name: string
  template_status: string
  leads: number[]
  audience_filters: Record<string, string>
  lead_count: number
  delivery_stats: DeliveryStats
  status: "draft" | "preparing" | "running" | "done" | "failed"
  media_type: "" | "IMAGE" | "VIDEO" | "DOCUMENT"
  media_original_name: string
  scheduled_at: string | null
  created_at: string
}

export interface CampaignsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Campaign[]
}

export interface CampaignInput {
  name: string
  campaign_type: Campaign["campaign_type"]
  template: number
  audience_filters: Record<string, string>
  scheduled_at?: string | null
  media_file?: File | null
}

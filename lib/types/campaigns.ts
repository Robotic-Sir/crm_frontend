export interface Campaign {
  id: number
  name: string

  campaign_type: string

  status: string

  scheduled_at: string | null

  created_at: string
}

export interface CampaignsResponse {
  count: number

  next: string | null

  previous: string | null

  results: Campaign[]
}
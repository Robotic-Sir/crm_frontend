"use client"

import { useCampaigns } from "@/hooks/use-campaigns"

import { CampaignsTable } from "@/components/campaigns/CampaignsTable"

export default function CampaignsPage() {
  const {
    data,
    isLoading,
    isError,
  } = useCampaigns()

  if (isLoading) {
    return (
      <div>
        Loading campaigns...
      </div>
    )
  }

  if (isError) {
    return (
      <div>
        Failed to load campaigns
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">
          Campaigns
        </h1>

        <p className="mt-2 text-slate-500">
          Manage WhatsApp campaigns
        </p>
      </div>

      <CampaignsTable
        campaigns={
          data?.results || []
        }
      />
    </div>
  )
}
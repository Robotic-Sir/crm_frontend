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
        <h1 className="text-3xl font-bold sm:text-4xl">
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

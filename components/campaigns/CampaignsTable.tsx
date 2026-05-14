import {
  Campaign,
} from "@/lib/types/campaigns"

interface CampaignsTableProps {
  campaigns: Campaign[]
}

export function CampaignsTable({
  campaigns,
}: CampaignsTableProps) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center text-slate-500">
        No campaigns found
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <table className="w-full">
        <thead className="border-b bg-slate-50">
          <tr>
            <th className="px-6 py-4 text-left">
              Name
            </th>

            <th className="px-6 py-4 text-left">
              Type
            </th>

            <th className="px-6 py-4 text-left">
              Status
            </th>

            <th className="px-6 py-4 text-left">
              Leads
            </th>

            <th className="px-6 py-4 text-left">
              Created
            </th>
          </tr>
        </thead>

        <tbody>
          {campaigns.map(
            (campaign) => (
              <tr
                key={campaign.id}
                className="border-b"
              >
                <td className="px-6 py-4">
                  {campaign.name}
                </td>

                <td className="px-6 py-4 capitalize">
                  {
                    campaign.campaign_type
                  }
                </td>

                <td className="px-6 py-4 capitalize">
                  {campaign.status}
                </td>

                <td className="px-6 py-4">
                  {Array.isArray((campaign as any).leads) ? (campaign as any).leads.length : 0}
                </td>

                <td className="px-6 py-4">
                  {new Date(
                    campaign.created_at
                  ).toLocaleDateString()}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  )
}
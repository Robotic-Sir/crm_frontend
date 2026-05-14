import { Card } from "@/components/ui/card"

import { PageHeader } from "@/components/shared/page-header"

import { CreateLeadForm } from "@/components/leads/create-lead-form"

export default function NewLeadPage() {
  return (
    <div>
      <PageHeader
        title="Create Lead"
        description="Add a new lead to the CRM"
      />

      <Card className="rounded-2xl p-6">
        <CreateLeadForm />
      </Card>
    </div>
  )
}
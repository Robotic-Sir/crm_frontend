import { Card } from "@/components/ui/card"

import { PageHeader } from "@/components/shared/page-header"

import { CreateLeadForm } from "@/components/leads/create-lead-form"

export default function NewLeadPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Create Lead"
        description="Add a new lead to the CRM"
      />

      <Card className="rounded-3xl border-slate-200/80 p-4 shadow-sm sm:p-7">
        <CreateLeadForm />
      </Card>
    </div>
  )
}

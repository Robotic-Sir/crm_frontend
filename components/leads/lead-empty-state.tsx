import { Inbox } from "lucide-react"

export function LeadEmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border bg-white">
      <div className="mb-4 rounded-full bg-slate-100 p-4">
        <Inbox className="h-10 w-10 text-slate-500" />
      </div>

      <h2 className="text-2xl font-semibold">
        No leads found
      </h2>

      <p className="mt-2 max-w-md text-center text-slate-500">
        Leads will appear here once they are added
        or imported into the CRM.
      </p>
    </div>
  )
}
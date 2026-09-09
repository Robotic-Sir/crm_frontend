export const LEAD_SOURCES = [
  { label: "Manual add", value: "manual" },
  { label: "Website", value: "website" },
  { label: "Bulk Excel", value: "import" },
  { label: "Referral", value: "referral" },
  { label: "Other", value: "other" },
]

export const SOURCE_COLORS: Record<string, string> = {
  manual: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  website: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  import: "bg-amber-50 text-amber-700 ring-amber-200",
  referral: "bg-violet-50 text-violet-700 ring-violet-200",
  other: "bg-slate-50 text-slate-700 ring-slate-200",
}

export function getSourceLabel(value: string): string {
  return LEAD_SOURCES.find((source) => source.value === value)?.label ?? value
}

export const LEAD_STATUSES = [
  { label: "New", value: "new" },
  { label: "Attempted", value: "attempted" },
  { label: "Connected", value: "connected" },
  { label: "Hot", value: "hot" },
  { label: "Warm", value: "warm" },
  { label: "Demo Scheduled", value: "demo_scheduled" },
  { label: "Demo Done", value: "demo_done" },
  { label: "Admitted", value: "admitted" },
  { label: "Not Interested", value: "not_interested" },
  { label: "Lost", value: "lost" },
]

export const CONTACT_STATUSES = [
  { label: "Not Contacted", value: "not_contacted" },
  { label: "Attempted", value: "attempted" },
  { label: "Contacted", value: "contacted" },
]

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  new: { bg: "bg-blue-100", text: "text-blue-700" },
  attempted: { bg: "bg-yellow-100", text: "text-yellow-700" },
  connected: { bg: "bg-cyan-100", text: "text-cyan-700" },
  hot: { bg: "bg-red-100", text: "text-red-700" },
  warm: { bg: "bg-orange-100", text: "text-orange-700" },
  demo_scheduled: { bg: "bg-purple-100", text: "text-purple-700" },
  demo_done: { bg: "bg-indigo-100", text: "text-indigo-700" },
  admitted: { bg: "bg-green-100", text: "text-green-700" },
  not_interested: { bg: "bg-slate-100", text: "text-slate-700" },
  lost: { bg: "bg-gray-100", text: "text-gray-500" },
}

export function getStatusLabel(value: string): string {
  return LEAD_STATUSES.find((s) => s.value === value)?.label ?? value
}

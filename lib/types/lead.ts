export interface Lead {
  id: number
  name: string
  phone: string
  email: string
  course: string
  city: string
  status: string
  source: string
  notes: string
  contact_status: "not_contacted" | "attempted" | "contacted"
  contacted_at: string | null
  assigned_to: number | null
  assigned_to_name: string | null
  last_contacted_at: string | null
  created_by: number | null
  created_at: string
  updated_at: string
}

export interface LeadFilters {
  status?: string
  city?: string
  course?: string
  contact_status?: string
}

export interface LeadFilterOptions {
  cities: string[]
  courses: string[]
}

export interface LeadsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Lead[]
}

export interface Note {
  id: number
  lead: number
  text: string
  created_by: number | null
  created_by_name: string | null
  created_at: string
}

export interface Reminder {
  id: number
  lead: number
  assigned_to: number | null
  assigned_to_name: string | null
  note: string
  reminder_at: string
  status: "pending" | "completed" | "cancelled" | "overdue"
  notified: boolean
  created_by: number | null
  created_by_name: string | null
  completed_at: string | null
  created_at: string
}

export interface ReminderSummary {
  pending: number
  overdue: number
  today: number
  upcoming: number
  next_reminders: Reminder[]
}

export interface Activity {
  id: number
  lead: number
  user: number | null
  user_name: string | null
  action_type: string
  description: string
  metadata: Record<string, unknown>
  created_at: string
}

export interface CustomField {
  id: number
  label: string
  field_type:
    | "text"
    | "textarea"
    | "dropdown"
    | "checkbox"
    | "radio"
    | "number"
    | "date"
    | "email"
  placeholder: string
  required: boolean
  options: string[]
  default_value: string
  order: number
  is_active: boolean
  created_by: number | null
  created_at: string
}

export interface CustomFieldValue {
  id: number
  lead: number
  field: number
  field_label: string
  field_type: string
  value: string
}

export interface LeadDetail extends Lead {
  messages: MessageLog[]
  lead_notes: Note[]
  reminders: Reminder[]
  activities: Activity[]
  custom_values: CustomFieldValue[]
}

export interface MessageLog {
  id: number
  campaign: number
  wa_message_id: string
  status: string
  error_reason: string
  sent_at: string | null
  delivered_at: string | null
  read_at: string | null
}

export interface DashboardData {
  total_leads: number
  today_new_leads: number
  conversion_rate: number
  status_breakdown: Record<string, number>
  source_breakdown: Record<string, number>
  reminders: {
    pending: number
    overdue: number
    today: number
  }
  recent_activities: Activity[]
}

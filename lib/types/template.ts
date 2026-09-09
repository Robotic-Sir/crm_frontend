export interface WATemplate {
  id: number
  name: string
  display_name: string
  meta_template_id: string
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION"
  language: string
  status: "LOCAL" | "PENDING" | "APPROVED" | "REJECTED" | "PAUSED" | "DISABLED"
  body_text: string
  header_type: "NONE" | "IMAGE" | "VIDEO" | "DOCUMENT"
  footer_text: string
  variables: string[]
  variable_examples: string[]
  rejection_reason: string
  is_active: boolean
  created_at: string
  synced_at: string | null
}

export interface WATemplateInput {
  name: string
  display_name: string
  category: WATemplate["category"]
  language: string
  body_text: string
  header_type: WATemplate["header_type"]
  header_sample?: File | null
  footer_text: string
  variables: string[]
  variable_examples: string[]
  is_active: boolean
}

export interface WhatsAppProviderReadiness {
  status: string
  phone_number_id_configured?: boolean
  waba_id_configured?: boolean
  app_secret_configured?: boolean
  app_id_configured?: boolean
  access_token_configured?: boolean
  graph_api_version?: string
  webhook_url?: string
  phone_number_id_suffix?: string
  waba_id_suffix?: string
}

export interface WhatsAppIntegration {
  is_enabled: boolean
  website_alerts_enabled: boolean
  daily_limit: number
  messages_per_second: number
  updated_at: string
  used_today: number
  remaining_today: number
  inbound_today: number
  provider: WhatsAppProviderReadiness
}

export interface WhatsAppInboundMessage {
  id: number
  wa_message_id: string
  phone: string
  contact_name: string
  message_type: string
  text: string
  received_at: string
}

export interface WebsiteLeadEvent {
  id: number
  event_id: string
  event_type: string
  event_type_display: string
  lead: number | null
  name: string
  phone: string
  email: string
  payload: Record<string, unknown>
  required_action: string
  action_status: "pending" | "in_progress" | "completed" | "dismissed"
  actioned_by: number | null
  actioned_at: string | null
  received_at: string
  notification_status: "pending" | "queued" | "sent" | "delivered" | "read" | "failed"
  notification_error: string
}

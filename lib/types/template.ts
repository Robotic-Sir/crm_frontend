export interface WATemplate {
  id: number
  name: string
  display_name: string
  meta_template_id: string
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION"
  language: string
  status: "LOCAL" | "PENDING" | "APPROVED" | "REJECTED" | "PAUSED" | "DISABLED"
  body_text: string
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
  access_token_configured?: boolean
  graph_api_version?: string
  webhook_url?: string
  phone_number_id_suffix?: string
  waba_id_suffix?: string
}

export interface WhatsAppIntegration {
  is_enabled: boolean
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

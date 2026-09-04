import api from "@/lib/api/client"
import { WebsiteLeadEvent, WhatsAppInboundMessage, WhatsAppIntegration } from "@/lib/types/template"

export async function getWhatsAppIntegration(): Promise<WhatsAppIntegration> {
  const response = await api.get("/whatsapp/config/")
  return response.data
}

export async function updateWhatsAppIntegration(
  data: Pick<WhatsAppIntegration, "is_enabled" | "website_alerts_enabled" | "daily_limit" | "messages_per_second">
): Promise<WhatsAppIntegration> {
  const response = await api.patch("/whatsapp/config/", data)
  return response.data
}

export async function runWhatsAppConnection(operation: "test" | "subscribe") {
  const response = await api.post("/whatsapp/connection/", { operation })
  return response.data
}

export async function getInboundMessages(): Promise<WhatsAppInboundMessage[]> {
  const response = await api.get("/whatsapp/inbound/")
  return response.data.results ?? response.data
}

export async function getWebsiteEvents(): Promise<WebsiteLeadEvent[]> {
  const response = await api.get("/website-events/")
  return response.data.results ?? response.data
}

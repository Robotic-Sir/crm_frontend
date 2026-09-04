import api from "@/lib/api/client"
import { WATemplate, WATemplateInput } from "@/lib/types/template"

export async function getTemplates(): Promise<WATemplate[]> {
  const response = await api.get<WATemplate[] | { results: WATemplate[] }>("/templates/")
  return Array.isArray(response.data) ? response.data : response.data.results
}

export async function createTemplate(data: WATemplateInput): Promise<WATemplate> {
  if (data.header_type === "NONE") {
    const response = await api.post<WATemplate>("/templates/", data)
    return response.data
  }
  const body = new FormData()
  body.append("name", data.name)
  body.append("display_name", data.display_name)
  body.append("category", data.category)
  body.append("language", data.language)
  body.append("body_text", data.body_text)
  body.append("footer_text", data.footer_text)
  body.append("variables", JSON.stringify(data.variables))
  body.append("variable_examples", JSON.stringify(data.variable_examples))
  body.append("is_active", String(data.is_active))
  body.append("header_type", data.header_type)
  if (data.header_sample) body.append("header_sample", data.header_sample)
  const response = await api.post<WATemplate>("/templates/", body)
  return response.data
}

export async function updateTemplate(id: number, data: Partial<WATemplateInput>): Promise<WATemplate> {
  const response = await api.patch<WATemplate>(`/templates/${id}/`, data)
  return response.data
}

export async function syncTemplates(): Promise<{ detail: string; synced: number }> {
  const response = await api.post("/templates/sync/")
  return response.data
}

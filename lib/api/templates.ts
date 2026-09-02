import api from "@/lib/api/client"
import { WATemplate, WATemplateInput } from "@/lib/types/template"

export async function getTemplates(): Promise<WATemplate[]> {
  const response = await api.get<WATemplate[] | { results: WATemplate[] }>("/templates/")
  return Array.isArray(response.data) ? response.data : response.data.results
}

export async function createTemplate(data: WATemplateInput): Promise<WATemplate> {
  const response = await api.post<WATemplate>("/templates/", data)
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

import apiClient from "@/lib/api/client"

import { CreateLeadInput } from "@/lib/schemas/lead"

import {
  Lead,
  LeadsResponse,
  LeadDetail,
  Note,
  Reminder,
  CustomField,
  CustomFieldValue,
  DashboardData,
} from "@/lib/types/lead"

export async function getLeads(search = ""): Promise<LeadsResponse> {
  const response = await apiClient.get("/leads/", { params: { search } })
  return response.data
}

export async function createLead(data: CreateLeadInput): Promise<Lead> {
  const response = await apiClient.post("/leads/", data)
  return response.data
}

export async function getLeadDetail(id: number): Promise<LeadDetail> {
  const response = await apiClient.get(`/leads/${id}/`)
  return response.data
}

export async function updateLead(
  id: number,
  data: Partial<Lead>
): Promise<Lead> {
  const response = await apiClient.patch(`/leads/${id}/`, data)
  return response.data
}

// Notes
export async function getNotes(leadId: number): Promise<Note[]> {
  const response = await apiClient.get(`/leads/${leadId}/notes/`)
  return response.data
}

export async function addNote(
  leadId: number,
  text: string
): Promise<Note> {
  const response = await apiClient.post(`/leads/${leadId}/notes/`, { text })
  return response.data
}

export async function deleteNote(
  leadId: number,
  noteId: number
): Promise<void> {
  await apiClient.delete(`/leads/${leadId}/notes/${noteId}/`)
}

// Reminders
export async function getReminders(leadId: number): Promise<Reminder[]> {
  const response = await apiClient.get(`/leads/${leadId}/reminders/`)
  return response.data
}

export async function addReminder(
  leadId: number,
  data: { note: string; reminder_at: string; assigned_to?: number }
): Promise<Reminder> {
  const response = await apiClient.post(`/leads/${leadId}/reminders/`, data)
  return response.data
}

export async function updateReminder(
  leadId: number,
  reminderId: number,
  data: Partial<Reminder>
): Promise<Reminder> {
  const response = await apiClient.patch(
    `/leads/${leadId}/reminders/${reminderId}/`,
    data
  )
  return response.data
}

// Custom Fields
export async function getCustomFields(): Promise<CustomField[]> {
  const response = await apiClient.get("/leads/custom-fields/")
  return response.data
}

export async function getActiveCustomFields(): Promise<CustomField[]> {
  const response = await apiClient.get("/leads/custom-fields/active/")
  return response.data
}

export async function createCustomField(
  data: Partial<CustomField>
): Promise<CustomField> {
  const response = await apiClient.post("/leads/custom-fields/", data)
  return response.data
}

export async function updateCustomField(
  id: number,
  data: Partial<CustomField>
): Promise<CustomField> {
  const response = await apiClient.patch(`/leads/custom-fields/${id}/`, data)
  return response.data
}

export async function deleteCustomField(id: number): Promise<void> {
  await apiClient.delete(`/leads/custom-fields/${id}/`)
}

// Custom field values for a lead
export async function getLeadCustomFieldValues(
  leadId: number
): Promise<CustomFieldValue[]> {
  const response = await apiClient.get(`/leads/${leadId}/custom-fields/`)
  return response.data
}

export async function updateLeadCustomFieldValues(
  leadId: number,
  values: Record<string, string>
): Promise<CustomFieldValue[]> {
  const response = await apiClient.patch(`/leads/${leadId}/custom-fields/`, {
    values,
  })
  return response.data
}

// Dashboard
export async function getDashboard(): Promise<DashboardData> {
  const response = await apiClient.get("/leads/dashboard/")
  return response.data
}

// My reminders
export async function getMyReminders(
  status?: string
): Promise<Reminder[]> {
  const response = await apiClient.get("/leads/my-reminders/", {
    params: status ? { status } : {},
  })
  return response.data
}

// Counsellors list (for assignment dropdowns)
export async function getCounsellors() {
  const response = await apiClient.get("/users/counsellors/")
  return response.data
}

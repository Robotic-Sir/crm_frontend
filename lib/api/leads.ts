import apiClient from "@/lib/api/client"

import {
  CreateLeadInput,
} from "@/lib/schemas/lead"

import {
  Lead,
  LeadsResponse,
} from "@/lib/types/lead"

export async function getLeads(
  search = ""
): Promise<LeadsResponse> {
  const response =
    await apiClient.get(
      "/leads/",
      {
        params: {
          search,
        },
      }
    )

  return response.data
}

export async function createLead(
  data: CreateLeadInput
): Promise<Lead> {
  const response =
    await apiClient.post(
      "/leads/",
      data
    )

  return response.data
}
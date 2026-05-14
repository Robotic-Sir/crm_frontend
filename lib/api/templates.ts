import api from "./client"

import { WATemplate } from "../types/template"

export async function getTemplates() {
  const response =
    await api.get<WATemplate[]>(
      "/templates/"
    )

  return response.data
}

export async function createTemplate(
  data: Partial<WATemplate>
) {
  const response =
    await api.post(
      "/templates/",
      data
    )

  return response.data
}
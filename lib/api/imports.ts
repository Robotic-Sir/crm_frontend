import apiClient from "@/lib/api/client"

import {
  DataImport,
  ImportsResponse,
} from "@/lib/types/imports"

export async function uploadImport(
  file: File
): Promise<DataImport> {
  const formData = new FormData()

  formData.append("file", file)

  const response =
    await apiClient.post(
      "/leads/import/",
      formData,
      {
        headers: {
          "Content-Type":
            "multipart/form-data",
        },
      }
    )

  return response.data
}

export async function getImports(): Promise<
  ImportsResponse
> {
  const response =
    await apiClient.get(
      "/leads/import/"
    )

  return response.data
}
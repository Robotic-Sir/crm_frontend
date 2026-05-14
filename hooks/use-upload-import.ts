import { useMutation } from "@tanstack/react-query"

import { useQueryClient } from "@tanstack/react-query"

import toast from "react-hot-toast"

import { uploadImport } from "@/lib/api/imports"

export function useUploadImport() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: uploadImport,

    onSuccess: () => {
      toast.success(
        "Import started"
      )

      queryClient.invalidateQueries({
        queryKey: ["imports"],
      })
    },

    onError: () => {
      toast.error(
        "Upload failed"
      )
    },
  })
}
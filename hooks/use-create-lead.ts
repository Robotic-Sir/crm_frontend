"use client"

import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"

import { useQueryClient } from "@tanstack/react-query"

import toast from "react-hot-toast"
import { AxiosError } from "axios"

import { createLead } from "@/lib/api/leads"

export function useCreateLead() {
  const router = useRouter()

  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: createLead,

    onSuccess: () => {
      /*
      |--------------------------------------------------------------------------
      | INVALIDATE LEADS CACHE
      |--------------------------------------------------------------------------
      */

      queryClient.invalidateQueries({
        queryKey: ["leads"],
      })

      toast.success(
        "Lead created successfully"
      )

      /*
      |--------------------------------------------------------------------------
      | REDIRECT
      |--------------------------------------------------------------------------
      */

      router.push("/leads")
    },

    onError: (error: AxiosError<Record<string, string[] | string>>) => {
      console.error(error)
      const responseData = error.response?.data
      const firstError = responseData
        ? Object.values(responseData).flat()[0]
        : null
      toast.error(
        typeof firstError === "string"
          ? firstError
          : "Failed to create lead. Please check the form and try again."
      )
    },
  })
}

"use client"

import { useRouter } from "next/navigation"

import { useMutation } from "@tanstack/react-query"

import { useQueryClient } from "@tanstack/react-query"

import toast from "react-hot-toast"

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

    onError: (error) => {
      console.error(error)

      toast.error(
        "Failed to create lead"
      )
    },
  })
}
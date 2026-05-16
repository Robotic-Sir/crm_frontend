import { useMutation, useQueryClient } from "@tanstack/react-query"

import {
  dispatchCampaign,
} from "@/lib/api/campaigns"

export function useDispatchCampaign() {
  const queryClient =
    useQueryClient()

  return useMutation({
    mutationFn: dispatchCampaign,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["campaigns"],
      })
    },
  })
}
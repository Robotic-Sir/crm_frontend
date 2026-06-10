"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  CreateUserInput,
  UsersResponse,
} from "@/lib/api/users"

export function useUsers(search = "") {
  return useQuery<UsersResponse>({
    queryKey: ["users", search],
    queryFn: () => getUsers(search),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserInput) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User created successfully")
    },
    onError: () => toast.error("Failed to create user"),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User updated")
    },
    onError: () => toast.error("Failed to update user"),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User deactivated")
    },
    onError: () => toast.error("Failed to deactivate user"),
  })
}

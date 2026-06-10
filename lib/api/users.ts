import apiClient from "@/lib/api/client"
import { User } from "@/lib/types/user"

export interface CreateUserInput {
  email: string
  first_name: string
  last_name: string
  role: "admin" | "counsellor"
  password: string
}

export interface UsersResponse {
  count: number
  next: string | null
  previous: string | null
  results: User[]
}

export async function getUsers(search = ""): Promise<UsersResponse> {
  const response = await apiClient.get("/users/", { params: { search } })
  return response.data
}

export async function getUserDetail(id: number): Promise<User> {
  const response = await apiClient.get(`/users/${id}/`)
  return response.data
}

export async function createUser(data: CreateUserInput): Promise<User> {
  const response = await apiClient.post("/users/", {
    ...data,
    username: data.email,
  })
  return response.data
}

export async function updateUser(
  id: number,
  data: Partial<User & { password?: string }>
): Promise<User> {
  const response = await apiClient.patch(`/users/${id}/`, data)
  return response.data
}

export async function deleteUser(id: number): Promise<void> {
  await apiClient.delete(`/users/${id}/`)
}

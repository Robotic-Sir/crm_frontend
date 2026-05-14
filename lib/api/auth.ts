import api from "./client"

import {
  LoginPayload,
  TokenResponse,
  User,
} from "@/lib/types/auth"

export async function login(
  payload: LoginPayload
): Promise<TokenResponse> {
  const { data } = await api.post(
    "/token/",
    payload
  )

  return data
}

export async function getMe(): Promise<User> {
  const { data } = await api.get("/users/me/")

  return data
}
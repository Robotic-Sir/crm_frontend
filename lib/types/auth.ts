export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: "admin" | "superadmin"
}

export interface LoginPayload {
  email: string
  password: string
}

export interface TokenResponse {
  access: string
  refresh: string
}
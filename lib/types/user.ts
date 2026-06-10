export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: "admin" | "superadmin" | "counsellor"
  is_active?: boolean
  date_joined?: string
  username?: string
}

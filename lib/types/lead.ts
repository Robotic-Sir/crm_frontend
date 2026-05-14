export interface Lead {
  id: number

  name: string

  phone: string

  email: string

  course: string

  city: string

  status: string

  source: string

  notes: string

  created_at: string

  updated_at: string
}

export interface LeadsResponse {
  count: number

  next: string | null

  previous: string | null

  results: Lead[]
}